import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient({ accelerateUrl: process.env.DATABASE_URL! });

async function main() {
  const course = await prisma.course.upsert({
    where: { slug: "ai-healthcare-professionals" },
    update: { isFeatured: true },
    create: {
      slug: "ai-healthcare-professionals",
      title: "AI & Data Analytics for Healthcare Professionals",
      subtitle: "No Coding Required",
      description:
        "A practical, no-code course designed for healthcare professionals who want to harness the power of AI and data analytics — without writing a single line of code. Learn to use AI tools, build dashboards, and make data-driven decisions in your healthcare role.",
      thumbnail:
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200&auto=format&fit=crop",
      price: 8000,
      durationLabel: "2 Months",
      classCount: 16,
      classHours: 2,
      batchSize: "25–30",
      level: "Beginner",
      category: "Healthcare",
      isPublished: true,
      isFeatured: true,
      modules: {
        create: [
          { title: "Introduction to Healthcare Data & AI", order: 1 },
          { title: "Basics of Healthcare Analytics", order: 2 },
          { title: "Excel / Google Sheets for Healthcare Data", order: 3 },
          { title: "Dashboard & Reporting for Healthcare", order: 4 },
          { title: "Healthcare KPI Analysis", order: 5 },
          { title: "AI Tools for Healthcare Professionals", order: 6 },
          { title: "Patient Data Analysis", order: 7 },
          { title: "Disease Trend Analysis", order: 8 },
          { title: "Predictive Insights Using No-Code Tools", order: 9 },
          { title: "Data Visualization in Healthcare", order: 10 },
          { title: "AI for Decision Making", order: 11 },
          { title: "Healthcare Automation Tools", order: 12 },
          { title: "Case Studies in Healthcare Analytics", order: 13 },
          { title: "Ethical Use of Healthcare Data", order: 14 },
          { title: "Mini Project / Practical Application", order: 15 },
          { title: "Final Assessment & Certificate", order: 16 },
        ],
      },
    },
  });

  console.log("Seeded course:", course.title);

  const instructors = [
    {
      name: "Prof. Dr. Gias U. Ahsan",
      role: "Chief Trainer · Advisor, Strategy & Innovation, DIU",
      bio: "With over 30 years of distinguished academic leadership, Dr. Ahsan served as Pro Vice Chancellor at North South University and founded the NSU Genome Research Institute — the first of its kind in Bangladesh. A WHO South-East Asia Technical Advisor and SEAPHEIN Executive Board Member, he has cultivated global research partnerships with Johns Hopkins, Cambridge, Oxford, and the University of Maryland, securing multi-million-dollar grants in public health and biosciences.",
      avatar: "/instructor-1.png",
      badge: "Chief Trainer",
      statLabel: "30+ Years Experience",
      linkedinUrl: "https://www.linkedin.com/in/professor-dr-gias-u-ahsan-77567468/",
      isFounder: true,
      isFeatured: true,
      order: 1,
    },
    {
      name: "Ahmed Hossain, PhD",
      role: "Co-Instructor · Professor, University of Sharjah, UAE",
      bio: "Dr. Hossain holds a Professor position in Healthcare Management at the University of Sharjah and serves as Director of the Global Health Institute at NSU. He earned his PhD from the University of Toronto's Dalla Lana School of Public Health (2010) and was a Canadian Institute of Health Research Fellow at McMaster University. He has published over 118 articles in journals including The Lancet and JAMA, with research focused on statistical genomics, chronic disease, and infectious disease epidemiology.",
      avatar: "/instructor-2.jpeg",
      badge: "Co-Instructor",
      statLabel: "118+ Publications",
      linkedinUrl: "https://www.linkedin.com/in/ahmed-hossain-phd-00448934/",
      isFeatured: true,
      order: 2,
    },
  ];

  for (const instructor of instructors) {
    const existing = await prisma.instructor.findFirst({ where: { name: instructor.name } });
    if (!existing) await prisma.instructor.create({ data: instructor });
  }

  console.log("Seeded instructors");

  const reviews = [
    {
      authorName: "Dr. Nusrat Jahan",
      authorRole: "Medical Officer, Dhaka Medical College Hospital",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
      quote:
        "I had zero coding background but after finishing this course I built a patient data dashboard in Looker Studio on my own. The No-Code Analytics module is a real game changer for clinicians like me.",
      rating: 5,
      isFeatured: true,
      order: 1,
    },
    {
      authorName: "Md. Rafiqul Islam",
      authorRole: "Hospital Administrator, Square Hospital",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
      quote:
        "After the Healthcare KPI Analysis and Dashboard Reporting modules, I no longer depend on the IT team to prepare our monthly hospital reports. I build them myself now.",
      rating: 5,
      isFeatured: true,
      order: 2,
    },
    {
      authorName: "Taslima Begum",
      authorRole: "Senior Nurse, National Heart Foundation",
      avatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop",
      quote:
        "The AI Tools for Healthcare module taught me how to summarise patient notes safely. For my capstone I built a solution for a real problem in my ward — that is what proper learning looks like.",
      rating: 5,
      isFeatured: false,
      order: 3,
    },
    {
      authorName: "Mahmudul Hasan",
      authorRole: "Public Health Officer, DGHS Bangladesh",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
      quote:
        "The Disease Trend Analysis and Population Dashboards modules apply directly to my field work. The Ethics and Privacy module was equally valuable — these topics matter enormously in public health.",
      rating: 4,
      isFeatured: false,
      order: 4,
    },
  ];

  for (const review of reviews) {
    const existing = await prisma.review.findFirst({ where: { authorName: review.authorName } });
    if (!existing) await prisma.review.create({ data: review });
  }

  console.log("Seeded reviews");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
