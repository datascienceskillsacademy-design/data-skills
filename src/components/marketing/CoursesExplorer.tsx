"use client";

import { useMemo, useState } from "react";
import { SearchX } from "lucide-react";
import { cn } from "@/lib/cn";
import { CourseCard } from "@/components/marketing/CourseCard";
import { StaggerItem, StaggerList } from "@/components/motion/StaggerList";
import type { Course, CourseCategory, CourseLevel, Instructor } from "@/lib/types";

const categories: CourseCategory[] = [
  "Python",
  "Machine Learning",
  "Data Visualization",
  "Deep Learning",
  "Statistics",
  "Data Analysis",
];

const levels: CourseLevel[] = ["Beginner", "Intermediate", "Advanced"];

export function CoursesExplorer({
  courses,
  instructors,
}: {
  courses: Course[];
  instructors: Instructor[];
}) {
  const [category, setCategory] = useState<CourseCategory | "All">("All");
  const [level, setLevel] = useState<CourseLevel | "All">("All");

  const filtered = useMemo(() => {
    return courses.filter((course) => {
      const matchesCategory = category === "All" || course.category === category;
      const matchesLevel = level === "All" || course.level === level;
      return matchesCategory && matchesLevel;
    });
  }, [courses, category, level]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <FilterChip active={category === "All"} onClick={() => setCategory("All")}>
            All categories
          </FilterChip>
          {categories.map((c) => (
            <FilterChip key={c} active={category === c} onClick={() => setCategory(c)}>
              {c}
            </FilterChip>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <FilterChip active={level === "All"} onClick={() => setLevel("All")} subtle>
          All levels
        </FilterChip>
        {levels.map((l) => (
          <FilterChip key={l} active={level === l} onClick={() => setLevel(l)} subtle>
            {l}
          </FilterChip>
        ))}
      </div>

      <p className="mt-6 text-sm text-neutral-500">
        Showing <span className="font-semibold text-neutral-800">{filtered.length}</span>{" "}
        course{filtered.length === 1 ? "" : "s"}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-12 flex flex-col items-center gap-3 rounded-3xl border border-dashed border-neutral-300 py-20 text-center">
          <SearchX className="h-10 w-10 text-neutral-300" />
          <p className="font-medium text-neutral-700">No courses match those filters</p>
          <p className="text-sm text-neutral-500">Try a different category or level.</p>
        </div>
      ) : (
        <StaggerList className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => (
            <StaggerItem key={course.id} className="h-full">
              <div id={course.slug} className="h-full scroll-mt-24">
                <CourseCard
                  course={course}
                  instructor={instructors.find((i) => i.id === course.instructorId)}
                />
              </div>
            </StaggerItem>
          ))}
        </StaggerList>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
  subtle,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  subtle?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
        active
          ? subtle
            ? "border-accent-400 bg-accent-50 text-accent-700"
            : "border-primary-600 bg-primary-600 text-white"
          : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50"
      )}
    >
      {children}
    </button>
  );
}
