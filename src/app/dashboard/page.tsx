import type { Metadata } from "next";
import Image from "next/image";
import { Award, BookOpenCheck, Clock, Flame } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { CourseProgressCard } from "@/components/dashboard/CourseProgressCard";
import { CourseCard } from "@/components/marketing/CourseCard";
import { Card } from "@/components/ui/Card";
import { FadeIn } from "@/components/motion/FadeIn";
import { courses } from "@/lib/data/courses";
import { instructors } from "@/lib/data/instructors";
import { demoUser } from "@/lib/data/user";

export const metadata: Metadata = {
  title: "Dashboard — DataSkills",
};

export default function DashboardPage() {
  const enrolledCourses = demoUser.enrolled
    .map((e) => ({ course: courses.find((c) => c.id === e.courseId), progress: e.progress }))
    .filter((e): e is { course: NonNullable<typeof e.course>; progress: number } => !!e.course);

  const completedCount = enrolledCourses.filter((e) => e.progress >= 100).length;
  const inProgressCount = enrolledCourses.filter((e) => e.progress > 0 && e.progress < 100).length;
  const hoursLearned = enrolledCourses.reduce(
    (sum, e) => sum + (e.course.durationHours * e.progress) / 100,
    0
  );

  const recommended = courses
    .filter((c) => !demoUser.enrolled.some((e) => e.courseId === c.id))
    .slice(0, 3);

  return (
    <div className="space-y-8">
      <FadeIn>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard icon={BookOpenCheck} label="In progress" value={String(inProgressCount)} />
          <StatCard icon={Award} label="Completed" value={String(completedCount)} tone="accent" />
          <StatCard
            icon={Flame}
            label="Certificates earned"
            value={String(demoUser.certificatesEarned)}
          />
          <StatCard
            icon={Clock}
            label="Hours learned"
            value={hoursLearned.toFixed(0)}
            tone="accent"
          />
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <FadeIn>
            <h2 className="font-display text-lg font-semibold text-neutral-900">
              Continue learning
            </h2>
          </FadeIn>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {enrolledCourses.map(({ course, progress }, i) => (
              <FadeIn key={course.id} delay={i * 0.05}>
                <CourseProgressCard course={course} progress={progress} />
              </FadeIn>
            ))}
          </div>
        </div>

        <FadeIn delay={0.1}>
          <Card className="p-6">
            <div className="flex flex-col items-center text-center">
              <Image
                src={demoUser.avatar}
                alt={demoUser.name}
                width={72}
                height={72}
                className="rounded-full object-cover ring-4 ring-primary-50"
              />
              <h3 className="mt-4 font-display text-base font-semibold text-neutral-900">
                {demoUser.name}
              </h3>
              <p className="text-sm text-neutral-500">{demoUser.title}</p>
            </div>

            <div className="mt-6 space-y-3 border-t border-neutral-100 pt-6 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Email</span>
                <span className="font-medium text-neutral-800">{demoUser.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Member since</span>
                <span className="font-medium text-neutral-800">
                  {new Date(demoUser.joinedDate).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Courses enrolled</span>
                <span className="font-medium text-neutral-800">{enrolledCourses.length}</span>
              </div>
            </div>

            <button className="mt-6 w-full rounded-xl border border-neutral-200 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50">
              Edit profile
            </button>
          </Card>
        </FadeIn>
      </div>

      <div>
        <FadeIn>
          <h2 className="font-display text-lg font-semibold text-neutral-900">
            Recommended for you
          </h2>
        </FadeIn>
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recommended.map((course, i) => (
            <FadeIn key={course.id} delay={i * 0.06}>
              <CourseCard
                course={course}
                instructor={instructors.find((ins) => ins.id === course.instructorId)}
              />
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
