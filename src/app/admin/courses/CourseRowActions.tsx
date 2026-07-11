"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, Pencil, X, Users, Clock, Layers, BarChart3 } from "lucide-react";
import type { Course } from "@/generated/prisma/client";

interface CourseRowActionsProps {
  course: Course & { _count: { enrollments: number } };
}

export function CourseRowActions({ course }: CourseRowActionsProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900"
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </button>
        <Link
          href={`/admin/courses/${course.id}`}
          className="flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-800"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Link>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="relative">
              {course.thumbnail ? (
                <div className="relative h-44 w-full bg-neutral-100">
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    sizes="512px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-32 w-full items-center justify-center bg-neutral-100 text-sm text-neutral-400">
                  No thumbnail
                </div>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-neutral-600 shadow hover:bg-white"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-bold text-neutral-900">
                    {course.title}
                  </h2>
                  {course.subtitle && (
                    <p className="mt-0.5 text-sm text-neutral-500">{course.subtitle}</p>
                  )}
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    course.isPublished
                      ? "bg-green-100 text-green-700"
                      : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  {course.isPublished ? "Published" : "Draft"}
                </span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-neutral-600">
                {course.description}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <Fact label="Price" value={`BDT ${course.price.toLocaleString()}`} />
                {course.originalPrice && (
                  <Fact
                    label="Original Price"
                    value={`BDT ${course.originalPrice.toLocaleString()}`}
                  />
                )}
                <Fact label="Duration" value={course.durationLabel} icon={Clock} />
                <Fact label="Classes" value={`${course.classCount} × ${course.classHours}h`} icon={Layers} />
                <Fact label="Batch Size" value={course.batchSize} icon={Users} />
                <Fact label="Level" value={course.level} icon={BarChart3} />
                <Fact label="Category" value={course.category} />
                <Fact label="Enrollments" value={String(course._count.enrollments)} />
              </div>

              {(course.whatsappLink || course.meetLink) && (
                <div className="mt-5 space-y-1.5 border-t border-neutral-100 pt-4 text-sm">
                  {course.whatsappLink && (
                    <div className="truncate">
                      <span className="font-medium text-neutral-700">WhatsApp: </span>
                      <a
                        href={course.whatsappLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary-600 hover:underline"
                      >
                        {course.whatsappLink}
                      </a>
                    </div>
                  )}
                  {course.meetLink && (
                    <div className="truncate">
                      <span className="font-medium text-neutral-700">Meet: </span>
                      <a
                        href={course.meetLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary-600 hover:underline"
                      >
                        {course.meetLink}
                      </a>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <Link
                  href={`/admin/courses/${course.id}`}
                  className="flex items-center gap-2 rounded-full bg-primary-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-800"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit Course
                </Link>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Fact({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: typeof Clock;
}) {
  return (
    <div className="rounded-xl bg-neutral-50 px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-neutral-400">
        {Icon && <Icon className="h-3 w-3" />}
        {label}
      </div>
      <div className="mt-0.5 truncate text-sm font-semibold text-neutral-800">{value}</div>
    </div>
  );
}
