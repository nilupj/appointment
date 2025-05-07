import { pgTable, text, serial, integer, boolean, timestamp, jsonb, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone"),
  role: text("role").default("patient").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Specialties table
export const specialties = pgTable("specialties", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  imageSrc: text("image_src"),
  alt: text("alt"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Doctors table
export const doctors = pgTable("doctors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  specialtyId: integer("specialty_id").references(() => specialties.id),
  imageSrc: text("image_src"),
  experience: integer("experience").default(0),
  rating: doublePrecision("rating").default(0),
  location: text("location"),
  consultationFee: integer("consultation_fee").default(0),
  availability: text("availability").default("Any Time"),
  bio: text("bio"),
  languages: text("languages").array(),
  education: jsonb("education"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Articles table
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  authorId: integer("author_id").references(() => users.id),
  publishedDate: timestamp("published_date").defaultNow().notNull(),
  imageSrc: text("image_src"),
  alt: text("alt"),
  category: text("category"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Surgeries table
export const surgeries = pgTable("surgeries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  benefits: text("benefits").array(),
  imageSrc: text("image_src"),
  alt: text("alt"),
  minCost: integer("min_cost").default(0),
  maxCost: integer("max_cost").default(0),
  duration: text("duration"),
  recovery: text("recovery"),
  specialtyId: integer("specialty_id").references(() => specialties.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Testimonials table
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  name: text("name").notNull(),
  title: text("title"),
  initials: text("initials"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Appointments table
// Lab Tests table
export const labTests = pgTable("lab_tests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").default(0),
  discountedPrice: integer("discounted_price").default(0),
  popularFor: text("popular_for").array(),
  preparationInfo: text("preparation_info"),
  reportTime: text("report_time"),
  homeCollection: boolean("home_collection").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  doctorId: integer("doctor_id").references(() => doctors.id),
  appointmentDate: timestamp("appointment_date").notNull(),
  status: text("status").default("pending").notNull(),
  type: text("type").default("in-person").notNull(), // in-person or video
  reason: text("reason"),
  notes: text("notes"),
  roomId: text("room_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const doctorsRelations = relations(doctors, ({ one }) => ({
  specialty: one(specialties, { fields: [doctors.specialtyId], references: [specialties.id] }),
}));

export const articlesRelations = relations(articles, ({ one }) => ({
  author: one(users, { fields: [articles.authorId], references: [users.id] }),
}));

export const surgeriesRelations = relations(surgeries, ({ one }) => ({
  specialty: one(specialties, { fields: [surgeries.specialtyId], references: [specialties.id] }),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  user: one(users, { fields: [appointments.userId], references: [users.id] }),
  doctor: one(doctors, { fields: [appointments.doctorId], references: [doctors.id] }),
}));

// Schemas for validation
export const insertUserSchema = createInsertSchema(users);
export type UserInsert = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const insertSpecialtySchema = createInsertSchema(specialties);
export type SpecialtyInsert = z.infer<typeof insertSpecialtySchema>;
export type Specialty = typeof specialties.$inferSelect;

export const insertDoctorSchema = createInsertSchema(doctors);
export type DoctorInsert = z.infer<typeof insertDoctorSchema>;
export type Doctor = typeof doctors.$inferSelect;

export const insertArticleSchema = createInsertSchema(articles);
export type ArticleInsert = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;

export const insertSurgerySchema = createInsertSchema(surgeries);
export type SurgeryInsert = z.infer<typeof insertSurgerySchema>;
export type Surgery = typeof surgeries.$inferSelect;

export const insertTestimonialSchema = createInsertSchema(testimonials);
export type TestimonialInsert = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;

export const insertAppointmentSchema = createInsertSchema(appointments);
export type AppointmentInsert = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;
