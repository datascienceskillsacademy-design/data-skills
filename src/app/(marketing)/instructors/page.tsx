import type { Metadata } from "next";
import Image from "next/image";
import { Link2, GraduationCap } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { Card } from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Instructors — DataSkills",
  description: "Meet the instructors behind DataSkills' healthcare AI & analytics courses.",
};

export default async function InstructorsPage() {
  const instructors = await prisma.instructor.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="bg-linear-to-b from-primary-50 via-white to-white">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <FadeIn className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-600">
            Meet Your Trainers
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold text-neutral-900 sm:text-5xl">
            All Instructors
          </h1>
          <p className="mt-4 text-lg text-neutral-600">
            World-class expertise in healthcare data, AI, and public health research.
          </p>
        </FadeIn>

        {instructors.length === 0 ? (
          <div className="mt-16 text-center text-neutral-500">
            No instructors available yet. Check back soon.
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {instructors.map((instructor, i) => (
              <FadeIn key={instructor.id} delay={i * 0.05}>
                <Card className="flex flex-col gap-0 overflow-hidden">
                  <div className="h-2 w-full bg-linear-to-r from-primary-600 to-primary-400" />

                  <div className="flex flex-col items-center gap-5 px-8 pb-8 pt-10 text-center sm:flex-row sm:items-start sm:text-left">
                    <div className="relative shrink-0">
                      <div className="h-28 w-28 overflow-hidden rounded-full bg-neutral-100 ring-4 ring-primary-100 ring-offset-2">
                        {instructor.avatar ? (
                          <Image
                            src={instructor.avatar}
                            alt={instructor.name}
                            width={112}
                            height={112}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-neutral-300">
                            <GraduationCap className="h-10 w-10" />
                          </div>
                        )}
                      </div>
                      {instructor.badge && (
                        <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary-700 px-3 py-1 text-xs font-semibold text-white shadow">
                          {instructor.badge}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex-1 sm:mt-0">
                      <h2 className="font-display text-xl font-bold text-neutral-900">
                        {instructor.name}
                      </h2>
                      <p className="mt-1 text-sm font-medium text-primary-600">
                        {instructor.role}
                      </p>

                      {instructor.statLabel && (
                        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
                          <GraduationCap className="h-3.5 w-3.5" />
                          {instructor.statLabel}
                        </div>
                      )}

                      <p className="mt-4 text-sm leading-relaxed text-neutral-500">
                        {instructor.bio}
                      </p>

                      {instructor.linkedinUrl && (
                        <a
                          href={instructor.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-800"
                        >
                          <Link2 className="h-3.5 w-3.5" />
                          LinkedIn Profile
                        </a>
                      )}
                    </div>
                  </div>
                </Card>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
