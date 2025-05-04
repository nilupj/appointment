import { db } from "./index";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";

async function seed() {
  try {
    console.log("Seeding database...");

    // Create an admin user for articles
    const adminUser = await createUser({
      username: "admin",
      password: "admin123", // In a real application, this would be hashed
      email: "admin@mediconnect.com",
      firstName: "Admin",
      lastName: "User",
      role: "admin"
    });

    // Create author users for articles
    const doctorUser = await createUser({
      username: "dr.smith",
      password: "password123", // In a real application, this would be hashed
      email: "dr.smith@mediconnect.com",
      firstName: "Diana",
      lastName: "Ross",
      role: "doctor"
    });

    const healthWriterUser = await createUser({
      username: "m.chen",
      password: "password123", // In a real application, this would be hashed
      email: "m.chen@mediconnect.com",
      firstName: "Michael",
      lastName: "Chen",
      role: "writer"
    });

    // Seed specialties
    const specialties = [
      {
        name: "Period doubts or Pregnancy",
        description: "Consult gynecologists and obstetricians for concerns related to periods, pregnancy, and women's health",
        imageSrc: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=80&h=80",
        alt: "Period doubts"
      },
      {
        name: "Acne, pimple or skin issues",
        description: "Get advice from dermatologists for all your skin, hair, and nail concerns",
        imageSrc: "https://images.unsplash.com/photo-1579165466741-7f35e4755182?auto=format&fit=crop&w=80&h=80",
        alt: "Acne, pimple or skin issues"
      },
      {
        name: "Performance issues in bed",
        description: "Consult with sexologists and psychologists about sexual health and performance issues",
        imageSrc: "https://images.unsplash.com/photo-1566978862346-3a780d602a28?auto=format&fit=crop&w=80&h=80",
        alt: "Performance issues in bed"
      },
      {
        name: "Cold, cough or fever",
        description: "Connect with general physicians for common illnesses and infections",
        imageSrc: "https://images.unsplash.com/photo-1600443299762-7a743123645d?auto=format&fit=crop&w=80&h=80",
        alt: "Cold, cough or fever"
      },
      {
        name: "Child not feeling well",
        description: "Consult with pediatricians for all health concerns related to children",
        imageSrc: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=80&h=80",
        alt: "Child not feeling well"
      },
      {
        name: "Depression or anxiety",
        description: "Talk to psychiatrists and psychologists about mental health concerns",
        imageSrc: "https://images.unsplash.com/photo-1582560474992-385ebb9b0a7f?auto=format&fit=crop&w=80&h=80",
        alt: "Depression or anxiety"
      },
      {
        name: "Dentist",
        description: "Teething troubles? Schedule a dental checkup",
        imageSrc: "https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?auto=format&fit=crop&w=400&h=250",
        alt: "Dentist Consultation"
      },
      {
        name: "Gynecologist/Obstetrician",
        description: "Explore for women's health, pregnancy and infertility treatments",
        imageSrc: "https://images.unsplash.com/photo-1571772996211-2f02974a9f91?auto=format&fit=crop&w=400&h=250",
        alt: "Gynecologist/Obstetrician"
      },
      {
        name: "Dietitian/Nutrition",
        description: "Get guidance on eating right, weight management and sports nutrition",
        imageSrc: "https://images.unsplash.com/photo-1580281657702-257584239a91?auto=format&fit=crop&w=400&h=250",
        alt: "Dietitian/Nutrition"
      },
      {
        name: "Physiotherapist",
        description: "Pulled a muscle? Get it treated by a trained physiotherapist",
        imageSrc: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=400&h=250",
        alt: "Physiotherapist"
      },
      {
        name: "Orthopedics",
        description: "Problems with bones, joints, ligaments and tendons",
        imageSrc: "https://images.unsplash.com/photo-1603725740016-61f0e6dc767e?auto=format&fit=crop&w=400&h=250",
        alt: "Orthopedics"
      },
      {
        name: "Cardiology",
        description: "Heart health and cardiovascular conditions",
        imageSrc: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&h=250",
        alt: "Cardiology"
      },
      {
        name: "Neurology",
        description: "Brain, spinal cord and nervous system disorders",
        imageSrc: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=400&h=250",
        alt: "Neurology"
      },
      {
        name: "Pediatrics",
        description: "Child healthcare from birth through adolescence",
        imageSrc: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=400&h=250",
        alt: "Pediatrics"
      },
      {
        name: "Dermatology",
        description: "Skin, hair and nail conditions",
        imageSrc: "https://images.unsplash.com/photo-1579165466741-7f35e4755182?auto=format&fit=crop&w=400&h=250",
        alt: "Dermatology"
      }
    ];

    const createdSpecialties = await seedSpecialties(specialties);

    // Seed doctors
    const doctors = [
      {
        name: "John Williams",
        specialtyId: createdSpecialties[0].id,
        imageSrc: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=150&h=150",
        experience: 12,
        rating: 4.8,
        location: "North",
        consultationFee: 800,
        availability: "Today",
        bio: "Dr. Williams is a skilled gynecologist with expertise in women's health and reproductive medicine.",
        languages: ["English", "Hindi", "Spanish"],
        education: {
          degrees: ["MBBS", "MD"],
          universities: ["Harvard Medical School", "Johns Hopkins University"]
        }
      },
      {
        name: "Sarah Johnson",
        specialtyId: createdSpecialties[1].id,
        imageSrc: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=150&h=150",
        experience: 8,
        rating: 4.6,
        location: "South",
        consultationFee: 600,
        availability: "Tomorrow",
        bio: "Dr. Johnson is a dermatologist specializing in acne, eczema, and other skin conditions.",
        languages: ["English", "French"],
        education: {
          degrees: ["MBBS", "MD"],
          universities: ["Stanford University", "University of California"]
        }
      },
      {
        name: "Michael Chen",
        specialtyId: createdSpecialties[2].id,
        imageSrc: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&h=150",
        experience: 15,
        rating: 4.9,
        location: "Central",
        consultationFee: 1200,
        availability: "Any Time",
        bio: "Dr. Chen is a respected sexologist with years of experience treating sexual health issues.",
        languages: ["English", "Mandarin", "Cantonese"],
        education: {
          degrees: ["MBBS", "MD", "PhD"],
          universities: ["Yale University", "Columbia University"]
        }
      },
      {
        name: "David Smith",
        specialtyId: createdSpecialties[3].id,
        imageSrc: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=150&h=150",
        experience: 10,
        rating: 4.7,
        location: "East",
        consultationFee: 500,
        availability: "Today",
        bio: "Dr. Smith is a general physician with extensive experience in treating common illnesses.",
        languages: ["English", "German"],
        education: {
          degrees: ["MBBS"],
          universities: ["University of Michigan"]
        }
      },
      {
        name: "Priya Sharma",
        specialtyId: createdSpecialties[4].id,
        imageSrc: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&h=150",
        experience: 7,
        rating: 4.8,
        location: "West",
        consultationFee: 700,
        availability: "Weekend",
        bio: "Dr. Sharma is a pediatrician who specializes in childhood diseases and preventive care.",
        languages: ["English", "Hindi", "Punjabi"],
        education: {
          degrees: ["MBBS", "MD"],
          universities: ["All India Institute of Medical Sciences", "University of Delhi"]
        }
      },
      {
        name: "Robert Lee",
        specialtyId: createdSpecialties[5].id,
        imageSrc: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=150&h=150",
        experience: 20,
        rating: 4.9,
        location: "North",
        consultationFee: 1500,
        availability: "Any Time",
        bio: "Dr. Lee is a psychiatrist specializing in depression, anxiety, and other mental health conditions.",
        languages: ["English", "Korean"],
        education: {
          degrees: ["MBBS", "MD", "PhD"],
          universities: ["Johns Hopkins University", "University of Pennsylvania"]
        }
      },
      {
        name: "Lisa Wong",
        specialtyId: createdSpecialties[6].id,
        imageSrc: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=150&h=150",
        experience: 9,
        rating: 4.7,
        location: "Central",
        consultationFee: 900,
        availability: "Today",
        bio: "Dr. Wong is a dentist with expertise in cosmetic dentistry and oral health.",
        languages: ["English", "Cantonese", "Mandarin"],
        education: {
          degrees: ["BDS", "MDS"],
          universities: ["University of California", "New York University"]
        }
      },
      {
        name: "James Miller",
        specialtyId: createdSpecialties[7].id,
        imageSrc: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=150&h=150",
        experience: 14,
        rating: 4.8,
        location: "South",
        consultationFee: 1100,
        availability: "Tomorrow",
        bio: "Dr. Miller is an obstetrician with years of experience in pregnancy care and women's health.",
        languages: ["English", "Spanish"],
        education: {
          degrees: ["MBBS", "MD"],
          universities: ["Harvard Medical School", "University of Chicago"]
        }
      },
      {
        name: "Jessica Adams",
        specialtyId: createdSpecialties[8].id,
        imageSrc: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=150&h=150",
        experience: 6,
        rating: 4.6,
        location: "East",
        consultationFee: 600,
        availability: "Weekend",
        bio: "Dr. Adams is a nutritionist who specializes in diet planning and weight management.",
        languages: ["English", "French"],
        education: {
          degrees: ["BSc", "MSc", "PhD"],
          universities: ["Stanford University", "Cornell University"]
        }
      },
      {
        name: "Andrew Wilson",
        specialtyId: createdSpecialties[9].id,
        imageSrc: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=150&h=150",
        experience: 11,
        rating: 4.7,
        location: "West",
        consultationFee: 800,
        availability: "Any Time",
        bio: "Dr. Wilson is a physiotherapist with expertise in sports injuries and rehabilitation.",
        languages: ["English"],
        education: {
          degrees: ["BPT", "MPT"],
          universities: ["University of Toronto", "McGill University"]
        }
      }
    ];

    await seedDoctors(doctors);

    // Seed articles
    const articles = [
      {
        title: "12 Coronavirus Myths and Facts That You Should Be Aware Of",
        content: `<p>With the ongoing pandemic, it's important to separate fact from fiction when it comes to COVID-19. Here are 12 common myths and the facts you should know:</p>
        <h3>Myth 1: COVID-19 only affects older adults</h3>
        <p>Fact: People of all ages can be infected by COVID-19. However, older adults and people with pre-existing medical conditions are more vulnerable to severe illness.</p>
        <h3>Myth 2: COVID-19 can be transmitted through mosquito bites</h3>
        <p>Fact: There is no evidence suggesting that the virus can be transmitted through mosquito bites. It primarily spreads through respiratory droplets.</p>
        <h3>Myth 3: Hand dryers are effective in killing the coronavirus</h3>
        <p>Fact: Hand dryers alone are not effective in killing the virus. Proper handwashing with soap and water for at least 20 seconds is recommended.</p>
        <h3>Myth 4: Antibiotics are effective in preventing and treating COVID-19</h3>
        <p>Fact: Antibiotics work only against bacteria, not viruses. COVID-19 is caused by a virus, so antibiotics are not effective for prevention or treatment.</p>
        <h3>Myth 5: Drinking alcohol protects against COVID-19</h3>
        <p>Fact: Consuming alcohol does not protect against COVID-19 and can be dangerous.</p>
        <h3>Myth 6: Adding pepper to your meals prevents COVID-19</h3>
        <p>Fact: There is no evidence that adding pepper to your meals prevents or cures COVID-19.</p>
        <h3>Myth 7: COVID-19 will disappear in warm weather</h3>
        <p>Fact: The virus can be transmitted in all areas, including areas with hot and humid weather.</p>
        <h3>Myth 8: Taking a hot bath prevents COVID-19</h3>
        <p>Fact: Taking a hot bath will not prevent you from catching COVID-19. Your normal body temperature remains around 36.5°C to 37°C, regardless of the temperature of your bath or shower.</p>
        <h3>Myth 9: Vaccines are available for COVID-19</h3>
        <p>Fact: Several vaccines have been developed and are being administered globally to prevent COVID-19.</p>
        <h3>Myth 10: You can get COVID-19 from your pets</h3>
        <p>Fact: Currently, there is no evidence that pets such as dogs or cats can spread COVID-19 to humans.</p>
        <h3>Myth 11: Face masks don't work</h3>
        <p>Fact: Masks, when worn properly, can help prevent the spread of COVID-19.</p>
        <h3>Myth 12: If you can hold your breath for 10 seconds, you don't have COVID-19</h3>
        <p>Fact: Being able to hold your breath for 10 seconds or more without coughing or feeling discomfort does not mean you are free from COVID-19 or any other respiratory disease.</p>
        <p>It's important to get information from reliable sources and follow guidelines provided by health authorities.</p>`,
        excerpt: "Separating fact from fiction about COVID-19 to stay informed and protected.",
        authorId: doctorUser.id,
        publishedDate: new Date("2023-05-10"),
        imageSrc: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=300&h=200",
        alt: "Coronavirus safety",
        category: "Health",
        tags: ["COVID-19", "Health", "Pandemic", "Medical Advice"]
      },
      {
        title: "Eating Right to Build Immunity Against Cold and Viral Infections",
        content: `<p>Proper nutrition is essential for maintaining a strong immune system that can fight off colds and viral infections. Here's how you can eat right to boost your immunity:</p>
        <h3>Include Plenty of Fruits and Vegetables</h3>
        <p>Fruits and vegetables are rich in vitamins, minerals, and antioxidants that help strengthen your immune system. Aim for at least 5 servings per day, focusing on colorful options like citrus fruits, berries, spinach, and bell peppers.</p>
        <h3>Get Adequate Protein</h3>
        <p>Protein is crucial for immune function. Include lean meats, poultry, fish, eggs, dairy products, legumes, and nuts in your diet to ensure you're getting enough protein.</p>
        <h3>Don't Forget Healthy Fats</h3>
        <p>Healthy fats, such as those found in olive oil, avocados, nuts, and fatty fish, support immune function and help reduce inflammation.</p>
        <h3>Include Fermented Foods</h3>
        <p>Fermented foods like yogurt, kefir, sauerkraut, and kimchi contain beneficial bacteria that support gut health, which is closely linked to immune function.</p>
        <h3>Stay Hydrated</h3>
        <p>Drinking enough water is essential for overall health and immune function. Aim for at least 8 glasses of water per day.</p>
        <h3>Limit Sugar and Processed Foods</h3>
        <p>High sugar intake and processed foods can suppress immune function and increase inflammation. Limit these in your diet and focus on whole, nutrient-dense foods instead.</p>
        <h3>Consider Immune-Boosting Herbs and Spices</h3>
        <p>Certain herbs and spices like garlic, ginger, turmeric, and oregano have immune-boosting and anti-inflammatory properties. Incorporate these into your meals regularly.</p>
        <h3>Don't Forget Vitamin D</h3>
        <p>Vitamin D plays a crucial role in immune function. While sunlight is a good source, you can also get vitamin D from fatty fish, egg yolks, and fortified foods.</p>
        <h3>Sample Immunity-Boosting Meal Plan</h3>
        <p><strong>Breakfast:</strong> Greek yogurt with berries, honey, and a sprinkle of nuts.</p>
        <p><strong>Lunch:</strong> Spinach salad with grilled chicken, bell peppers, avocado, and olive oil dressing.</p>
        <p><strong>Dinner:</strong> Baked salmon with turmeric roasted vegetables and quinoa.</p>
        <p><strong>Snacks:</strong> Citrus fruits, nuts, or hummus with veggie sticks.</p>
        <p>Remember, a balanced diet is just one aspect of maintaining a strong immune system. Regular exercise, adequate sleep, stress management, and good hygiene practices are also important factors in preventing cold and viral infections.</p>`,
        excerpt: "Learn how the right foods can strengthen your immune system to fight off colds and viruses.",
        authorId: healthWriterUser.id,
        publishedDate: new Date("2023-06-15"),
        imageSrc: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&h=200",
        alt: "Healthy food",
        category: "Nutrition",
        tags: ["Nutrition", "Immunity", "Health", "Diet"]
      },
      {
        title: "The Importance of Regular Exercise for Mental Health",
        content: `<p>Regular exercise isn't just beneficial for physical health, it's also crucial for maintaining mental wellbeing. Here's why exercise should be part of your mental health routine:</p>
        <h3>Reduces Stress and Anxiety</h3>
        <p>Exercise reduces levels of the body's stress hormones and stimulates the production of endorphins, which are natural mood elevators.</p>
        <h3>Alleviates Depression</h3>
        <p>Studies have shown that regular physical activity can be as effective as medication for mild to moderate depression in some individuals.</p>
        <h3>Improves Sleep</h3>
        <p>Regular exercise can help regulate your sleep patterns, which is essential for mental health.</p>
        <h3>Boosts Self-Esteem</h3>
        <p>Achieving exercise goals, no matter how small, can boost your confidence and improve your self-image.</p>
        <h3>Enhances Cognitive Function</h3>
        <p>Exercise increases blood flow to the brain, which can help improve memory, concentration, and overall cognitive function.</p>
        <p>Aim for at least 30 minutes of moderate exercise most days of the week. Find activities you enjoy to make it sustainable, whether it's walking, cycling, swimming, dancing, or playing a sport.</p>`,
        excerpt: "Discover how regular physical activity can significantly improve your mental wellbeing.",
        authorId: healthWriterUser.id,
        publishedDate: new Date("2023-07-20"),
        imageSrc: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=300&h=200",
        alt: "Person jogging",
        category: "Mental Health",
        tags: ["Mental Health", "Exercise", "Wellbeing", "Fitness"]
      }
    ];

    await seedArticles(articles);

    // Seed surgeries
    const surgeries = [
      {
        name: "Laser Eye Surgery (LASIK)",
        description: "A quick, painless procedure to correct vision problems by reshaping the cornea using laser technology.",
        benefits: ["Improved vision without glasses", "Quick recovery", "Minimal discomfort", "Long-lasting results"],
        imageSrc: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=400&h=250",
        alt: "Laser eye surgery",
        minCost: 25000,
        maxCost: 50000,
        duration: "15-30 minutes per eye",
        recovery: "24-48 hours",
        specialtyId: createdSpecialties[0].id
      },
      {
        name: "Knee Replacement Surgery",
        description: "A surgical procedure to resurface damaged knee joints with artificial implants, reducing pain and improving function.",
        benefits: ["Pain relief", "Improved mobility", "Correction of deformity", "Better quality of life"],
        imageSrc: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=400&h=250",
        alt: "Knee replacement surgery",
        minCost: 150000,
        maxCost: 350000,
        duration: "1-2 hours",
        recovery: "4-6 weeks",
        specialtyId: createdSpecialties[10].id
      },
      {
        name: "Gallbladder Removal (Laparoscopic Cholecystectomy)",
        description: "A minimally invasive procedure to remove the gallbladder using small incisions and a camera.",
        benefits: ["Relief from gallstones", "Minimal scarring", "Shorter hospital stay", "Quicker recovery"],
        imageSrc: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=400&h=250",
        alt: "Laparoscopic surgery",
        minCost: 60000,
        maxCost: 120000,
        duration: "1-2 hours",
        recovery: "1-2 weeks",
        specialtyId: createdSpecialties[3].id
      },
      {
        name: "Rhinoplasty (Nose Surgery)",
        description: "A surgical procedure to change the shape of the nose for cosmetic or medical reasons.",
        benefits: ["Improved appearance", "Better breathing", "Correction of injuries", "Enhanced self-confidence"],
        imageSrc: "https://images.unsplash.com/photo-1588776813677-77aaf6396the?auto=format&fit=crop&w=400&h=250",
        alt: "Rhinoplasty",
        minCost: 80000,
        maxCost: 200000,
        duration: "1-3 hours",
        recovery: "2-3 weeks",
        specialtyId: createdSpecialties[3].id
      },
      {
        name: "Hysterectomy",
        description: "Surgical removal of the uterus to treat various conditions such as fibroids, endometriosis, or cancer.",
        benefits: ["Relief from symptoms", "Prevention of cancer", "Solution for persistent problems", "Improved quality of life"],
        imageSrc: "https://images.unsplash.com/photo-1631815588090-d4bfec5b7e6a?auto=format&fit=crop&w=400&h=250",
        alt: "Hysterectomy",
        minCost: 90000,
        maxCost: 250000,
        duration: "1-3 hours",
        recovery: "4-6 weeks",
        specialtyId: createdSpecialties[7].id
      },
      {
        name: "Cataract Surgery",
        description: "A procedure to remove the cloudy lens from the eye and replace it with an artificial lens to improve vision.",
        benefits: ["Restored vision", "Improved color perception", "Better night vision", "Enhanced quality of life"],
        imageSrc: "https://images.unsplash.com/photo-1551601651-bc60f254d532?auto=format&fit=crop&w=400&h=250",
        alt: "Cataract surgery",
        minCost: 30000,
        maxCost: 80000,
        duration: "30-60 minutes per eye",
        recovery: "1-2 weeks",
        specialtyId: createdSpecialties[0].id
      }
    ];

    await seedSurgeries(surgeries);

    // Seed testimonials
    const testimonials = [
      {
        text: "Very helpful! For more than a decade your medical experts have been answering my queries. Allows quick and easy search with specific booking. Examination history of doctors visited.",
        name: "John Smith",
        title: "Patient since 2020",
        initials: "JS"
      },
      {
        text: "MediConnect has transformed how I access healthcare. The video consultation feature is especially useful when I'm traveling and can't visit a doctor in person.",
        name: "Emma Johnson",
        title: "Patient since 2021",
        initials: "EJ"
      },
      {
        text: "As someone with chronic health issues, having easy access to specialists has been life-changing. The appointment booking system is seamless and the doctors are top-notch.",
        name: "David Chen",
        title: "Patient since 2019",
        initials: "DC"
      }
    ];

    await seedTestimonials(testimonials);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Helper functions for seeding

async function createUser(user: schema.UserInsert) {
  // Check if user already exists
  const existingUser = await db.query.users.findFirst({
    where: eq(schema.users.username, user.username)
  });

  if (existingUser) {
    console.log(`User ${user.username} already exists, skipping creation.`);
    return existingUser;
  }

  // Import the hashPassword function from auth.ts
  const { hashPassword } = await import('../server/auth');
  
  // Hash the password
  const hashedPassword = await hashPassword(user.password);
  
  // Create the user with the hashed password
  const [newUser] = await db.insert(schema.users).values({
    ...user,
    password: hashedPassword
  }).returning();
  
  console.log(`Created user: ${user.username}`);
  return newUser;
}

async function seedSpecialties(specialtiesData: Omit<schema.SpecialtyInsert, "createdAt" | "updatedAt">[]) {
  const createdSpecialties = [];

  for (const specialty of specialtiesData) {
    // Check if specialty already exists
    const existingSpecialty = await db.query.specialties.findFirst({
      where: eq(schema.specialties.name, specialty.name)
    });

    if (existingSpecialty) {
      console.log(`Specialty ${specialty.name} already exists, skipping creation.`);
      createdSpecialties.push(existingSpecialty);
      continue;
    }

    const [newSpecialty] = await db.insert(schema.specialties).values(specialty).returning();
    console.log(`Created specialty: ${specialty.name}`);
    createdSpecialties.push(newSpecialty);
  }

  return createdSpecialties;
}

async function seedDoctors(doctorsData: Omit<schema.DoctorInsert, "createdAt" | "updatedAt">[]) {
  for (const doctor of doctorsData) {
    // Check if doctor already exists
    const existingDoctor = await db.query.doctors.findFirst({
      where: eq(schema.doctors.name, doctor.name)
    });

    if (existingDoctor) {
      console.log(`Doctor ${doctor.name} already exists, skipping creation.`);
      continue;
    }

    await db.insert(schema.doctors).values(doctor);
    console.log(`Created doctor: ${doctor.name}`);
  }
}

async function seedArticles(articlesData: Omit<schema.ArticleInsert, "createdAt" | "updatedAt">[]) {
  for (const article of articlesData) {
    // Check if article already exists
    const existingArticle = await db.query.articles.findFirst({
      where: eq(schema.articles.title, article.title)
    });

    if (existingArticle) {
      console.log(`Article "${article.title}" already exists, skipping creation.`);
      continue;
    }

    await db.insert(schema.articles).values(article);
    console.log(`Created article: ${article.title}`);
  }
}

async function seedSurgeries(surgeriesData: Omit<schema.SurgeryInsert, "createdAt" | "updatedAt">[]) {
  for (const surgery of surgeriesData) {
    // Check if surgery already exists
    const existingSurgery = await db.query.surgeries.findFirst({
      where: eq(schema.surgeries.name, surgery.name)
    });

    if (existingSurgery) {
      console.log(`Surgery ${surgery.name} already exists, skipping creation.`);
      continue;
    }

    await db.insert(schema.surgeries).values(surgery);
    console.log(`Created surgery: ${surgery.name}`);
  }
}

async function seedTestimonials(testimonialsData: Omit<schema.TestimonialInsert, "createdAt" | "updatedAt">[]) {
  for (const testimonial of testimonialsData) {
    // Check if testimonial already exists
    const existingTestimonial = await db.query.testimonials.findFirst({
      where: eq(schema.testimonials.name, testimonial.name)
    });

    if (existingTestimonial) {
      console.log(`Testimonial from ${testimonial.name} already exists, skipping creation.`);
      continue;
    }

    await db.insert(schema.testimonials).values(testimonial);
    console.log(`Created testimonial from: ${testimonial.name}`);
  }
}

seed();
