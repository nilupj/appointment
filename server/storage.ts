import { db } from "@db";
import * as schema from "@shared/schema";
import { eq, and, desc, asc, gte, lte, between, or, like, sql } from "drizzle-orm";

// Type definitions for frontend data
type Specialist = {
  id: number;
  name: string;
  imageSrc: string;
  alt: string;
};

type ClinicSpecialty = {
  id: number;
  name: string;
  description: string;
  imageSrc: string;
  alt: string;
};

type ArticlePreview = {
  id: number;
  title: string;
  author: string;
  imageSrc: string;
  alt: string;
};

type ArticleDetail = {
  id: number;
  title: string;
  content: string;
  author: {
    name: string;
    title: string;
    imageSrc: string;
  };
  publishedDate: string;
  imageSrc: string;
  category: string;
  tags: string[];
};

type RelatedArticle = {
  id: number;
  title: string;
  excerpt: string;
  imageSrc: string;
  publishedDate: string;
};

type Testimonial = {
  id: number;
  text: string;
  name: string;
  title: string;
  initials: string;
};

type DoctorFilters = {
  specialty?: string;
  location?: string;
  experience?: { min: number; max: number };
  availability?: string;
  gender?: string;
  fee?: { min: number; max: number };
};

type Doctor = {
  id: number;
  name: string;
  specialty: string;
  location: string;
  rating: number;
  experience: number;
  imageSrc: string;
  consultationFee: number;
  availability: string;
  gender?: string;
};

type VideoConsultDoctor = {
  id: number;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  consultationFee: number;
  imageSrc: string;
  availableSlots: string[];
  languages: string[];
};

type Surgery = {
  id: number;
  name: string;
  description: string;
  benefits: string[];
  imageSrc: string;
  cost: {
    min: number;
    max: number;
  };
  duration: string;
  recovery: string;
};

type SearchSuggestion = {
  id: number;
  name: string;
  type: 'doctor' | 'specialty' | 'clinic';
};

// Storage implementation
class Storage {

  // Specialists
  async getSpecialists(): Promise<Specialist[]> {
    try {
      const specialties = await db.query.specialties.findMany({
        limit: 6,
      });

      return specialties.map(s => ({
        id: s.id,
        name: s.name,
        imageSrc: s.imageSrc || '',
        alt: s.alt || s.name
      }));
    } catch (error) {
      console.error("Error in getSpecialists:", error);
      throw error;
    }
  }

  // Clinic specialties
  async getClinicSpecialties(): Promise<ClinicSpecialty[]> {
    try {
      const specialties = await db.query.specialties.findMany({
        limit: 4,
      });

      return specialties.map(s => ({
        id: s.id,
        name: s.name,
        description: s.description || '',
        imageSrc: s.imageSrc || '',
        alt: s.alt || s.name
      }));
    } catch (error) {
      console.error("Error in getClinicSpecialties:", error);
      throw error;
    }
  }

  // Articles
  async getArticles(): Promise<ArticlePreview[]> {
    try {
      const articles = await db.query.articles.findMany({
        with: {
          author: true
        },
        orderBy: [desc(schema.articles.publishedDate)],
        limit: 10,
      });

      return articles.map(a => ({
        id: a.id,
        title: a.title,
        author: a.author ? `${a.author.firstName || ''} ${a.author.lastName || ''}`.trim() : 'MediConnect Team',
        imageSrc: a.imageSrc || '',
        alt: a.alt || a.title
      }));
    } catch (error) {
      console.error("Error in getArticles:", error);
      throw error;
    }
  }

  async getArticleById(id: number): Promise<ArticleDetail | null> {
    try {
      const article = await db.query.articles.findFirst({
        where: eq(schema.articles.id, id),
        with: {
          author: true
        }
      });

      if (!article) {
        return null;
      }

      const authorName = article.author 
        ? `${article.author.firstName || ''} ${article.author.lastName || ''}`.trim()
        : 'MediConnect Team';

      const publishedDate = article.publishedDate 
        ? new Date(article.publishedDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        : 'Unknown date';

      return {
        id: article.id,
        title: article.title,
        content: article.content,
        author: {
          name: authorName,
          title: article.author?.role === 'doctor' ? 'Medical Expert' : 'Health Writer',
          imageSrc: article.author?.role === 'doctor' 
            ? 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=150&h=150'
            : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150'
        },
        publishedDate: publishedDate,
        imageSrc: article.imageSrc || '',
        category: article.category || 'Health',
        tags: article.tags || []
      };
    } catch (error) {
      console.error(`Error in getArticleById for id ${id}:`, error);
      throw error;
    }
  }

  async getRelatedArticles(articleId: number): Promise<RelatedArticle[]> {
    try {
      // In a real implementation, this would fetch articles related to the current one
      // based on tags, category, etc.
      const articles = await db.query.articles.findMany({
        where: (articles) => {
          return and(
            articles.id !== articleId,
            articles.publishedDate !== null
          );
        },
        orderBy: [desc(schema.articles.publishedDate)],
        limit: 2,
      });

      return articles.map(a => ({
        id: a.id,
        title: a.title,
        excerpt: a.excerpt || a.title,
        imageSrc: a.imageSrc || '',
        publishedDate: a.publishedDate 
          ? new Date(a.publishedDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          : 'Unknown date'
      }));
    } catch (error) {
      console.error(`Error in getRelatedArticles for id ${articleId}:`, error);
      throw error;
    }
  }

  // Testimonials
  async getTestimonials(): Promise<Testimonial[]> {
    try {
      const testimonials = await db.query.testimonials.findMany();

      return testimonials.map(t => ({
        id: t.id,
        text: t.text,
        name: t.name,
        title: t.title || 'Patient',
        initials: t.initials || t.name.substring(0, 2).toUpperCase()
      }));
    } catch (error) {
      console.error("Error in getTestimonials:", error);
      throw error;
    }
  }

  // Doctors
  async getDoctors(filters: DoctorFilters = {}): Promise<Doctor[]> {
    try {
      // Build the where clause based on filters
      const conditions = [];

      if (filters.specialty) {
        const specialty = await db.query.specialties.findFirst({
          where: eq(schema.specialties.name, filters.specialty)
        });

        if (specialty) {
          conditions.push(eq(schema.doctors.specialtyId, specialty.id));
        }
      }

      if (filters.location) {
        conditions.push(eq(schema.doctors.location, filters.location));
      }

      if (filters.experience) {
        conditions.push(between(
          schema.doctors.experience, 
          filters.experience.min, 
          filters.experience.max
        ));
      }

      if (filters.availability) {
        conditions.push(eq(schema.doctors.availability, filters.availability));
      }

      if (filters.fee) {
        conditions.push(between(
          schema.doctors.consultationFee, 
          filters.fee.min, 
          filters.fee.max
        ));
      }

      // Execute the query
      const doctors = await db.query.doctors.findMany({
        where: conditions.length > 0 ? and(...conditions) : undefined,
        with: {
          specialty: true
        },
        limit: 10
      });

      return doctors.map(d => ({
        id: d.id,
        name: d.name,
        specialty: d.specialty?.name || 'General Physician',
        location: d.location || 'City Center',
        rating: d.rating || 4.5,
        experience: d.experience || 0,
        imageSrc: d.imageSrc || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=150&h=150',
        consultationFee: d.consultationFee || 500,
        availability: d.availability || 'Any Time'
      }));
    } catch (error) {
      console.error("Error in getDoctors:", error);
      throw error;
    }
  }

  // Video consult doctors
  async getVideoConsultDoctors(filters: any = {}): Promise<VideoConsultDoctor[]> {
    try {
      // Build the where clause based on filters
      const conditions = [];

      if (filters.specialty) {
        const specialty = await db.query.specialties.findFirst({
          where: eq(schema.specialties.name, filters.specialty)
        });

        if (specialty) {
          conditions.push(eq(schema.doctors.specialtyId, specialty.id));
        }
      }

      if (filters.minRating) {
        conditions.push(gte(schema.doctors.rating, filters.minRating));
      }

      // Language filter should be implemented with array containment
      // For now, we'll handle it in memory

      const doctors = await db.query.doctors.findMany({
        where: conditions.length > 0 ? and(...conditions) : undefined,
        with: {
          specialty: true
        },
        orderBy: [desc(schema.doctors.rating)],
        limit: 10
      });

      let filteredDoctors = doctors;

      // Apply language filter in memory
      if (filters.language) {
        filteredDoctors = doctors.filter(d => {
          const languages = Array.isArray(d.languages) ? d.languages : [];
          return languages.includes(filters.language);
        });
      }

      return filteredDoctors.map(d => ({
        id: d.id,
        name: d.name,
        specialty: d.specialty?.name || 'General Physician',
        experience: d.experience || 0,
        rating: d.rating || 4.5,
        consultationFee: d.consultationFee || 500,
        imageSrc: d.imageSrc || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=150&h=150',
        availableSlots: ['9:00 AM', '11:30 AM', '4:00 PM', '6:30 PM'],
        languages: Array.isArray(d.languages) ? d.languages : ['English', 'Hindi']
      }));
    } catch (error) {
      console.error("Error in getVideoConsultDoctors:", error);
      throw error;
    }
  }

  // Create a video consultation appointment
  async createVideoConsultation(data: any): Promise<any> {
    try {
      // Verify doctor exists
      const doctor = await db.query.doctors.findFirst({
        where: eq(schema.doctors.id, data.doctorId)
      });

      if (!doctor) {
        throw new Error("Doctor not found");
      }

      // Create consultation with unique room ID
      const roomId = `mc-${Math.random().toString(36).substring(2, 11)}`;

      // Combine date and time slot into a proper timestamp
      const timeSlot = data.slot;
      // Store time slot separately and use full date for appointment
      const appointment = await db.insert(schema.appointments).values({
        doctorId: data.doctorId,
        userId: data.userId,
        appointmentDate: new Date(data.date),
        timeSlot: data.slot,
        patientNotes: data.patientNotes || '',
        status: data.status || 'scheduled',
        roomId: roomId,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();

      return {
        ...appointment,
        roomId
      };
    } catch (error) {
      console.error("Error in createVideoConsultation:", error);
      throw error;
    }
  }

  // Get user's video consultation appointments
  async getUserVideoConsultations(userId: number): Promise<any[]> {
    try {
      const appointments = await db.query.appointments.findMany({
        where: eq(schema.appointments.userId, userId),
        with: {
          doctor: {
            with: {
              specialty: true
            }
          }
        },
        orderBy: [desc(schema.appointments.appointmentDate)]
      });

      return appointments.map(a => ({
        id: a.id,
        doctorId: a.doctorId,
        doctorName: a.doctor?.name || 'Unknown Doctor',
        specialty: a.doctor?.specialty?.name || 'General',
        date: a.appointmentDate ? new Date(a.appointmentDate).toISOString() : null,
        timeSlot: a.timeSlot,
        status: a.status,
        roomId: a.roomId,
        patientNotes: a.patientNotes
      }));
    } catch (error) {
      console.error("Error in getUserVideoConsultations:", error);
      throw error;
    }
  }

  // Get doctor's available slots
  async getDoctorAvailableSlots(doctorId: number, date: string): Promise<string[]> {
    try {
      // Fixed slots based on doctor's schedule
      const allSlots = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
                         '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'];

      // Find booked slots for the given date and doctor
      const bookedAppointments = await db.query.appointments.findMany({
        where: and(
          eq(schema.appointments.doctorId, doctorId),
          // Filter for the given date
          eq(sql`DATE(${schema.appointments.appointmentDate})`, date)
        )
      });

      const bookedSlots = bookedAppointments.map(a => a.timeSlot);

      // Return available slots (exclude booked ones)
      return allSlots.filter(slot => !bookedSlots.includes(slot));
    } catch (error) {
      console.error("Error in getDoctorAvailableSlots:", error);
      throw error;
    }
  }

  // Get user appointments
  async getUserAppointments(userId: number): Promise<any> {
    try {
      const appointments = await db.query.appointments.findMany({
        where: eq(schema.appointments.userId, userId),
        with: {
          doctor: true
        },
        orderBy: [desc(schema.appointments.appointmentDate)]
      });
      return appointments;
    } catch (error) {
      console.error("Error in getUserAppointments:", error);
      throw error;
    }
  }

  // Get all appointments (admin)
  async getAllAppointments(): Promise<any> {
    try {
      const appointments = await db.query.appointments.findMany({
        with: {
          doctor: true,
          user: true
        },
        orderBy: [desc(schema.appointments.appointmentDate)]
      });
      return appointments;
    } catch (error) {
      console.error("Error in getAllAppointments:", error);
      throw error;
    }
  }

  // Create appointment
  async createAppointment(data: any): Promise<any> {
    try {
      const [appointment] = await db.insert(schema.appointments).values({
        userId: data.userId,
        doctorId: data.doctorId,
        appointmentDate: new Date(data.appointmentDate),
        status: data.status || 'pending',
        type: data.type || 'in-person',
        reason: data.reason,
        notes: data.notes,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
      return appointment;
    } catch (error) {
      console.error("Error in createAppointment:", error);
      throw error;
    }
  }

  // Update appointment
  async updateAppointment(id: number, data: any): Promise<any> {
    try {
      const [appointment] = await db.update(schema.appointments)
        .set({
          status: data.status,
          appointmentDate: data.appointmentDate ? new Date(data.appointmentDate) : undefined,
          reason: data.reason,
          notes: data.notes,
          updatedAt: new Date()
        })
        .where(eq(schema.appointments.id, id))
        .returning();
      return appointment;
    } catch (error) {
      console.error("Error in updateAppointment:", error);
      throw error;
    }
  }

  // Delete appointment
  async deleteAppointment(id: number): Promise<void> {
    try {
      await db.delete(schema.appointments)
        .where(eq(schema.appointments.id, id));
    } catch (error) {
      console.error("Error in deleteAppointment:", error);
      throw error;
    }
  }

  // Get user medical records
  async getUserMedicalRecords(userId: number): Promise<any> {
    try {
      return [
        { id: 1, title: "Blood Test Results", date: "April 25, 2025", type: "Laboratory" },
        { id: 2, title: "Chest X-Ray Report", date: "March 15, 2025", type: "Radiology" }
      ];
    } catch (error) {
      console.error("Error in getUserMedicalRecords:", error);
      throw error;
    }
  }

  // Join a video consultation
  async joinVideoConsultation(appointmentId: number, userId: number): Promise<any> {
    try {
      const appointment = await db.query.appointments.findFirst({
        where: eq(schema.appointments.id, appointmentId),
        with: {
          doctor: true,
          user: true
        }
      });

      if (!appointment) {
        throw new Error("Appointment not found");
      }

      // Verify the user is either the doctor or the patient
      if (appointment.userId !== userId && appointment.doctor.id !== userId) {
        throw new Error("Unauthorized to join this consultation");
      }

      // Update appointment status to "in-progress" if it was "scheduled"
      if (appointment.status === "scheduled") {
        await db.update(schema.appointments)
          .set({ 
            status: "in-progress",
            updatedAt: new Date()
          })
          .where(eq(schema.appointments.id, appointmentId));
      }

      return {
        roomId: appointment.roomId || `mc-${Math.random().toString(36).substring(2, 11)}`,
        doctorName: appointment.doctor?.name || 'Doctor',
        patientName: appointment.user?.firstName || appointment.user?.username || 'Patient',
        appointmentTime: appointment.timeSlot,
        appointmentDate: appointment.appointmentDate ? new Date(appointment.appointmentDate).toISOString() : null
      };
    } catch (error) {
      console.error("Error in joinVideoConsultation:", error);
      throw error;
    }
  }

  // Surgeries
  async getSurgeries(): Promise<Surgery[]> {
    try {
      const surgeries = await db.query.surgeries.findMany({
        with: {
          specialty: true
        },
        limit: 6
      });

      return surgeries.map(s => ({
        id: s.id,
        name: s.name,
        description: s.description || '',
        benefits: Array.isArray(s.benefits) ? s.benefits : [],
        imageSrc: s.imageSrc || '',
        cost: {
          min: s.minCost || 10000,
          max: s.maxCost || 50000
        },
        duration: s.duration || '1-2 hours',
        recovery: s.recovery || '1-2 weeks'
      }));
    } catch (error) {
      console.error("Error in getSurgeries:", error);
      throw error;
    }
  }

  // Search suggestions
  // Lab Tests methods
async getLabTests(): Promise<any[]> {
  try {
    const tests = await db.query.labTests.findMany({
      orderBy: [desc(schema.labTests.id)]
    });
    return tests;
  } catch (error) {
    console.error("Error in getLabTests:", error);
    throw error;
  }
}

async createLabTest(data: any): Promise<any> {
  try {
    if (!data.name || !data.price) {
      throw new Error("Name and price are required");
    }
    const [test] = await db.insert(schema.labTests).values({
      name: data.name,
      description: data.description || '',
      price: Number(data.price),
      discountedPrice: data.discountedPrice ? Number(data.discountedPrice) : null,
      popularFor: Array.isArray(data.popularFor) ? data.popularFor : [],
      preparationInfo: data.preparationInfo || '',
      reportTime: data.reportTime || '24-48 hours',
      homeCollection: Boolean(data.homeCollection),
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    return test;
  } catch (error) {
    console.error("Error in createLabTest:", error);
    throw error;
  }
}

async updateLabTest(id: number, data: any): Promise<any> {
  try {
    const [test] = await db.update(schema.labTests)
      .set({
        name: data.name,
        description: data.description,
        price: data.price,
        discountedPrice: data.discountedPrice,
        popularFor: data.popularFor,
        preparationInfo: data.preparationInfo,
        reportTime: data.reportTime,
        homeCollection: data.homeCollection,
        updatedAt: new Date()
      })
      .where(eq(schema.labTests.id, id))
      .returning();
    return test;
  } catch (error) {
    console.error("Error in updateLabTest:", error);
    throw error;
  }
}

async deleteLabTest(id: number): Promise<void> {
  try {
    await db.delete(schema.labTests)
      .where(eq(schema.labTests.id, id));
  } catch (error) {
    console.error("Error in deleteLabTest:", error);
    throw error;
  }
}

async getSearchSuggestions(query: string): Promise<SearchSuggestion[]> {
    try {
      // Search for doctors
      const doctors = await db.query.doctors.findMany({
        where: like(schema.doctors.name, `%${query}%`),
        limit: 3
      });

      // Search for specialties
      const specialties = await db.query.specialties.findMany({
        where: like(schema.specialties.name, `%${query}%`),
        limit: 3
      });

      // Combine results
      const doctorSuggestions: SearchSuggestion[] = doctors.map(d => ({
        id: d.id,
        name: `Dr. ${d.name}`,
        type: 'doctor'
      }));

      const specialtySuggestions: SearchSuggestion[] = specialties.map(s => ({
        id: s.id,
        name: s.name,
        type: 'specialty'
      }));

      return [...doctorSuggestions, ...specialtySuggestions];
    } catch (error) {
      console.error(`Error in getSearchSuggestions for query ${query}:`, error);
      throw error;
    }
  }
}

export const storage = new Storage();