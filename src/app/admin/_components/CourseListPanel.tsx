"use client";

import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

interface CourseListPanelProps {
  courses: { id: string; title: string; badge: number }[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  totalBadge?: number;
}

/** Shared course picker used by course-scoped admin/instructor boards (Assignments, Students). */
export function CourseListPanel({
  courses,
  selectedId,
  onSelect,
  totalBadge,
}: CourseListPanelProps) {
  return (
    <Card className="h-fit overflow-hidden lg:sticky lg:top-6">
      <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
          Courses
        </p>
        {totalBadge !== undefined && (
          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-semibold text-neutral-500">
            {totalBadge}
          </span>
        )}
      </div>
      <ul className="max-h-128 overflow-y-auto p-2 lg:max-h-[70vh]">
        {courses.map((course) => {
          const active = course.id === selectedId;
          return (
            <li key={course.id}>
              <button
                type="button"
                onClick={() => onSelect(course.id)}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-xl px-3.5 py-3 text-left text-sm transition",
                  active
                    ? "bg-primary-50 font-semibold text-primary-700"
                    : "text-neutral-600 hover:bg-neutral-50"
                )}
              >
                <span className="min-w-0 truncate">{course.title}</span>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold",
                    active
                      ? "bg-primary-100 text-primary-700"
                      : "bg-neutral-100 text-neutral-500"
                  )}
                >
                  {course.badge}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
