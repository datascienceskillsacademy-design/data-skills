import type { Metadata } from "next";
import { CoursesExplorer } from "@/components/marketing/CoursesExplorer";
import { FadeIn } from "@/components/motion/FadeIn";
import { courses } from "@/lib/data/courses";
import { instructors } from "@/lib/data/instructors";

export const metadata: Metadata = {
  title: "Courses — DataSkills",
  description: "Browse career-track data science, Python, and machine learning courses.",
};

export default function CoursesPage() {
  return (
    <div className="bg-gradient-to-b from-primary-50 via-white to-white">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <FadeIn className="max-w-2xl">
          <h1 className="font-display text-4xl font-bold text-neutral-900 sm:text-5xl">
            All courses
          </h1>
          <p className="mt-4 text-lg text-neutral-600">
            Six career-track courses covering the full data science stack —
            from Python fundamentals to deep learning. Pick a starting point
            and build from there.
          </p>
        </FadeIn>

        <div className="mt-12">
          <CoursesExplorer courses={courses} instructors={instructors} />
        </div>
      </div>
    </div>
  );
}
