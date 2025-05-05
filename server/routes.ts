import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { createPaypalOrder, capturePaypalOrder, loadPaypalDefault } from "./paypal";

export async function registerRoutes(app: Express): Promise<Server> {
  // sets up /api/register, /api/login, /api/logout, /api/user
  setupAuth(app);
  const apiPrefix = "/api";

  // Specialists routes
  app.get(`${apiPrefix}/specialists`, async (req, res) => {
    try {
      const specialists = await storage.getSpecialists();
      res.json(specialists);
    } catch (error) {
      console.error("Error fetching specialists:", error);
      res.status(500).json({ message: "Failed to fetch specialists" });
    }
  });

  // Clinic specialties routes
  app.get(`${apiPrefix}/clinic-specialties`, async (req, res) => {
    try {
      const clinicSpecialties = await storage.getClinicSpecialties();
      res.json(clinicSpecialties);
    } catch (error) {
      console.error("Error fetching clinic specialties:", error);
      res.status(500).json({ message: "Failed to fetch clinic specialties" });
    }
  });

  // Articles routes
  app.get(`${apiPrefix}/articles`, async (req, res) => {
    try {
      const articles = await storage.getArticles();
      res.json(articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  app.get(`${apiPrefix}/articles/:id`, async (req, res) => {
    try {
      const article = await storage.getArticleById(parseInt(req.params.id));
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      console.error(`Error fetching article ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  app.get(`${apiPrefix}/articles/related/:id`, async (req, res) => {
    try {
      const relatedArticles = await storage.getRelatedArticles(parseInt(req.params.id));
      res.json(relatedArticles);
    } catch (error) {
      console.error(`Error fetching related articles for ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch related articles" });
    }
  });

  // Testimonials routes
  app.get(`${apiPrefix}/testimonials`, async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  // Doctors routes
  app.get(`${apiPrefix}/doctors`, async (req, res) => {
    try {
      const { specialty, location, experience, availability, gender, fee } = req.query;
      const filters: any = {};
      
      if (specialty && specialty !== 'all') filters.specialty = specialty as string;
      if (location && location !== 'all') filters.location = location as string;
      if (availability && availability !== 'all') filters.availability = availability as string;
      if (gender && gender !== 'all') filters.gender = gender as string;
      
      if (experience) {
        const [min, max] = (experience as string).split(',').map(Number);
        filters.experience = { min, max };
      }
      
      if (fee) {
        const [min, max] = (fee as string).split(',').map(Number);
        filters.fee = { min, max };
      }
      
      const doctors = await storage.getDoctors(filters);
      res.json(doctors);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      res.status(500).json({ message: "Failed to fetch doctors" });
    }
  });

  // Video consultation doctors
  app.get(`${apiPrefix}/video-consult-doctors`, async (req, res) => {
    try {
      const { specialty, language, rating, availability } = req.query;
      const filters: any = {};
      
      if (specialty && specialty !== 'all') filters.specialty = specialty as string;
      if (language && language !== 'all') filters.language = language as string;
      if (availability && availability !== 'all') filters.availability = availability as string;
      
      if (rating) {
        filters.minRating = parseFloat(rating as string);
      }
      
      const doctors = await storage.getVideoConsultDoctors(filters);
      res.json(doctors);
    } catch (error) {
      console.error("Error fetching video consult doctors:", error);
      res.status(500).json({ message: "Failed to fetch video consult doctors" });
    }
  });
  
  // Video consultation appointment booking
  app.post(`${apiPrefix}/video-consult/book`, async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const { doctorId, slot, date, patientNotes } = req.body;
      
      if (!doctorId || !slot || !date) {
        return res.status(400).json({ message: "Doctor ID, slot time, and date are required" });
      }
      
      // Create new appointment
      const appointment = await storage.createVideoConsultation({
        doctorId,
        userId: req.user.id,
        slot,
        date,
        patientNotes: patientNotes || "",
        status: "scheduled"
      });
      
      res.status(201).json(appointment);
    } catch (error) {
      console.error("Error booking video consultation:", error);
      res.status(500).json({ message: "Failed to book consultation" });
    }
  });
  
  // Get user's video consultation appointments
  app.get(`${apiPrefix}/video-consult/appointments`, async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const appointments = await storage.getUserVideoConsultations(req.user.id);
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching user's video consultations:", error);
      res.status(500).json({ message: "Failed to fetch consultations" });
    }
  });
  
  // Get doctor's available slots
  app.get(`${apiPrefix}/video-consult/doctor/:id/slots`, async (req, res) => {
    try {
      const doctorId = parseInt(req.params.id);
      const date = req.query.date as string;
      
      if (!date) {
        return res.status(400).json({ message: "Date parameter is required" });
      }
      
      const availableSlots = await storage.getDoctorAvailableSlots(doctorId, date);
      res.json(availableSlots);
    } catch (error) {
      console.error("Error fetching doctor's available slots:", error);
      res.status(500).json({ message: "Failed to fetch available slots" });
    }
  });

  // Get user appointments
  app.get(`${apiPrefix}/appointments`, async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const appointments = await storage.getUserAppointments(req.user.id);
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  // Get user medical records
  app.get(`${apiPrefix}/medical-records`, async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const records = await storage.getUserMedicalRecords(req.user.id);
      res.json(records);
    } catch (error) {
      console.error("Error fetching medical records:", error);
      res.status(500).json({ message: "Failed to fetch medical records" });
    }
  });
  
  // Join video consultation room
  app.post(`${apiPrefix}/video-consult/join`, async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const { appointmentId } = req.body;
      
      if (!appointmentId) {
        return res.status(400).json({ message: "Appointment ID is required" });
      }

      // Log the join attempt
      console.log(`User ${req.user.id} attempting to join consultation ${appointmentId}`);
      
      const roomDetails = await storage.joinVideoConsultation(appointmentId, req.user.id);
      res.json(roomDetails);
    } catch (error) {
      console.error("Error joining video consultation:", error);
      res.status(500).json({ message: "Failed to join consultation" });
    }
  });

  // Surgeries routes
  app.get(`${apiPrefix}/surgeries`, async (req, res) => {
    try {
      const surgeries = await storage.getSurgeries();
      res.json(surgeries);
    } catch (error) {
      console.error("Error fetching surgeries:", error);
      res.status(500).json({ message: "Failed to fetch surgeries" });
    }
  });

  // Search suggestions
  app.get(`${apiPrefix}/search/suggestions`, async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string' || q.length < 3) {
        return res.json([]);
      }
      
      const suggestions = await storage.getSearchSuggestions(q);
      res.json(suggestions);
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
      res.status(500).json({ message: "Failed to fetch search suggestions" });
    }
  });

  // Send app link
  app.post(`${apiPrefix}/send-app-link`, async (req, res) => {
    try {
      const { phoneNumber } = req.body;
      
      if (!phoneNumber || typeof phoneNumber !== 'string' || phoneNumber.length < 10) {
        return res.status(400).json({ message: "Invalid phone number" });
      }
      
      // In a real implementation, this would send an SMS with a link to download the app
      // For now, we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      res.json({ success: true, message: "App link sent successfully" });
    } catch (error) {
      console.error("Error sending app link:", error);
      res.status(500).json({ message: "Failed to send app link" });
    }
  });

  // PayPal routes
  app.get("/paypal/setup", async (req, res) => {
    await loadPaypalDefault(req, res);
  });

  app.post("/paypal/order", async (req, res) => {
    // Request body should contain: { intent, amount, currency }
    await createPaypalOrder(req, res);
  });

  app.post("/paypal/order/:orderID/capture", async (req, res) => {
    await capturePaypalOrder(req, res);
  });

  const httpServer = createServer(app);

  return httpServer;
}
