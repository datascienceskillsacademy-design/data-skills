import Image from "next/image";
import Link from "next/link";
import { PlayCircle, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { Course } from "@/lib/types";

export function CourseProgressCard({
  course,
  progress,
}: {
  course: Course;
  progress: number;
}) {
  const complete = progress >= 100;

  return (
    <Card className="overflow-hidden p-4 transition-shadow hover:shadow-lg">
      <div className="flex gap-4">
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl">
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover"
            sizes="112px"
          />
        </div>

        <div className="flex flex-1 flex-col">
          <h3 className="line-clamp-1 font-display text-sm font-semibold text-neutral-900">
            {course.title}
          </h3>
          <p className="mt-0.5 text-xs text-neutral-500">{course.category}</p>

          <div className="mt-auto flex items-center gap-2">
            <ProgressBar value={progress} className="flex-1" />
            <span className="text-xs font-semibold text-neutral-500">{progress}%</span>
          </div>
        </div>
      </div>

      <Link
        href={`/courses#${course.slug}`}
        className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-neutral-50 py-2 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-50"
      >
        {complete ? (
          <>
            <CheckCircle2 className="h-4 w-4" />
            Review course
          </>
        ) : (
          <>
            <PlayCircle className="h-4 w-4" />
            Continue learning
          </>
        )}
      </Link>
    </Card>
  );
}
