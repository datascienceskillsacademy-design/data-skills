export const revalidate = 60;
import type { Metadata } from "next";
import { FadeIn } from "@/components/motion/FadeIn";
import { prisma } from "@/lib/prisma";
import { CourseCard } from "@/components/marketing/CourseCard";

export const metadata: Metadata = {
  title: "Courses — DataSkills",
  description: "Browse our healthcare data & AI courses.",
};

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="bg-linear-to-b from-primary-50 via-white to-white">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <FadeIn className="max-w-2xl">
          <h1 className="font-display text-4xl font-bold text-neutral-900 sm:text-5xl">
            All Courses
          </h1>
          <p className="mt-4 text-lg text-neutral-600">
            Practical, no-code courses designed for healthcare professionals
            who want to harness AI and data analytics.
          </p>
        </FadeIn>

        {courses.length === 0 ? (
          <div className="mt-16 text-center text-neutral-500">
            No courses available yet. Check back soon.
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, i) => (
              <FadeIn key={course.id} delay={i * 0.05}>
                <CourseCard course={course} />
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
