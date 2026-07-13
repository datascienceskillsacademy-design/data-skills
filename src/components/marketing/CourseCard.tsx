import Image from "next/image";
import Link from "next/link";
import { Calendar, MonitorPlay, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { EnrollButton } from "@/components/marketing/EnrollButton";
import type { Course } from "@/generated/prisma/client";

export function CourseCard({ course }: { course: Course }) {
  const placeholder =
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200&auto=format&fit=crop";

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-900/10">
      <Link href={`/courses/${course.slug}`} className="flex flex-1 flex-col">
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={course.thumbnail ?? placeholder}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-primary-700">
            {course.level}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5 pb-0">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary-600">
            {course.category}
          </span>

          <h3 className="font-display text-base font-semibold leading-snug text-neutral-900">
            {course.title}
          </h3>
          {course.subtitle && (
            <p className="text-xs font-medium text-neutral-400">{course.subtitle}</p>
          )}

          <p className="line-clamp-2 text-sm text-neutral-500">{course.description}</p>

          <div className="mt-auto flex flex-wrap gap-3 pt-3 text-xs text-neutral-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {course.durationLabel}
            </span>
            <span className="flex items-center gap-1">
              <MonitorPlay className="h-3.5 w-3.5" />
              {course.classCount} Live Classes
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {course.batchSize} Students
            </span>
          </div>
        </div>
      </Link>

      {/* Kept outside the Link — a button can't be validly nested inside an anchor */}
      <div className="flex items-center justify-between border-t border-neutral-100 p-5 pt-4">
        <span className="font-display text-lg font-bold text-primary-700">
          BDT {course.price.toLocaleString("en-BD")}
        </span>
        <EnrollButton courseId={course.id} size="sm">
          Enroll Now
        </EnrollButton>
      </div>
    </Card>
  );
}
