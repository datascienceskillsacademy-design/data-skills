import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient({ accelerateUrl: process.env.DATABASE_URL! });

async function main() {
  const course = await prisma.course.upsert({
    where: { slug: "ai-healthcare-professionals" },
    update: {},
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
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
