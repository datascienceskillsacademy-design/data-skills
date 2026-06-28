import Image from "next/image";
import Link from "next/link";
import { Star, Users, Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { Course, Instructor } from "@/lib/types";

const levelTone = {
  Beginner: "success",
  Intermediate: "accent",
  Advanced: "primary",
} as const;

export function CourseCard({
  course,
  instructor,
}: {
  course: Course;
  instructor?: Instructor;
}) {
  return (
    <Link href={`/courses#${course.slug}`} className="group block h-full">
      <Card className="flex h-full flex-col overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-primary-900/10">
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute left-3 top-3">
            <Badge tone={levelTone[course.level]}>{course.level}</Badge>
          </div>
          {course.price === 0 && (
            <div className="absolute right-3 top-3">
              <Badge tone="accent">Free</Badge>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <Badge tone="neutral" className="self-start">
            {course.category}
          </Badge>

          <h3 className="font-display text-base font-semibold leading-snug text-neutral-900">
            {course.title}
          </h3>

          <p className="line-clamp-2 text-sm text-neutral-500">{course.description}</p>

          <div className="mt-auto flex items-center justify-between pt-3 text-xs text-neutral-500">
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-accent-400 text-accent-400" />
              {course.rating}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {Intl.NumberFormat("en-US", { notation: "compact" }).format(
                course.studentsCount
              )}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {course.durationHours}h
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
            <div className="flex items-center gap-2">
              {instructor && (
                <Image
                  src={instructor.avatar}
                  alt={instructor.name}
                  width={28}
                  height={28}
                  className="rounded-full object-cover"
                />
              )}
              <span className="text-xs font-medium text-neutral-600">
                {instructor?.name}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              {course.originalPrice && (
                <span className="text-xs text-neutral-400 line-through">
                  ${course.originalPrice}
                </span>
              )}
              <span className="font-display text-lg font-bold text-primary-700">
                {course.price === 0 ? "Free" : `$${course.price}`}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
