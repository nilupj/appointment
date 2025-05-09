import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { db } from "@db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import type { User as UserType } from "@shared/schema";
import connectPg from "connect-pg-simple";
import { pool } from "@db";

const PostgresSessionStore = connectPg(session);

declare global {
  namespace Express {
    interface User extends UserType {}
  }
}

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || 'mediconnect_secret_key',
    resave: false,
    saveUninitialized: false,
    store: new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true,
      tableName: 'user_sessions',
      pruneSessionInterval: 60 // Cleanup expired sessions every minute
    }),
    name: 'sessionId', // Change cookie name from default 'connect.sid'
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? '.yourdomain.repl.co' : undefined
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await db.query.users.findFirst({
          where: eq(users.username, username)
        });

        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.id, id)
      });
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Authentication routes
  app.post("/api/register", async (req, res) => {
    try {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.username, req.body.username)
      });
      
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Check if email is already registered
      const emailExists = await db.query.users.findFirst({
        where: eq(users.email, req.body.email)
      });

      if (emailExists) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const hashedPassword = await hashPassword(req.body.password);
      
      const [user] = await db.insert(users).values({
        ...req.body,
        password: hashedPassword,
      }).returning();

      req.login(user, (err) => {
        if (err) return res.status(500).json({ message: "Login failed after registration" });
        return res.status(201).json(user);
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: Error, user: Express.User) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.status(200).json(user);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.json(req.user);
  });
  
  // Profile update endpoint
  app.put("/api/user/profile", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const { firstName, lastName, phone, email } = req.body;
      
      // Check if email is already used by another user
      if (email) {
        const existingUser = await db.query.users.findFirst({
          where: eq(users.email, email)
        });
        
        if (existingUser && existingUser.id !== req.user.id) {
          return res.status(400).json({ message: "Email already in use" });
        }
      }
      
      const [updatedUser] = await db
        .update(users)
        .set({
          firstName,
          lastName,
          phone,
          email,
          updatedAt: new Date()
        })
        .where(eq(users.id, req.user.id))
        .returning();
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Change password endpoint
  app.put("/api/user/password", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current and new password are required" });
      }
      
      const user = await db.query.users.findFirst({
        where: eq(users.id, req.user.id)
      });
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const isPasswordValid = await comparePasswords(currentPassword, user.password);
      
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      
      const hashedPassword = await hashPassword(newPassword);
      
      await db
        .update(users)
        .set({
          password: hashedPassword,
          updatedAt: new Date()
        })
        .where(eq(users.id, user.id));
      
      res.json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Password change error:", error);
      res.status(500).json({ message: "Failed to update password" });
    }
  });
}