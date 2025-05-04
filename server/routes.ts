import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
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
      const doctors = await storage.getVideoConsultDoctors();
      res.json(doctors);
    } catch (error) {
      console.error("Error fetching video consult doctors:", error);
      res.status(500).json({ message: "Failed to fetch video consult doctors" });
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

  const httpServer = createServer(app);

  return httpServer;
}
