"use client";

import { useState } from "react";
import { GraduationCap, Users, Phone, Award } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { CourseListPanel } from "../_components/CourseListPanel";

interface StudentRow {
  id: string;
  status: "APPROVED" | "COMPLETED" | "PENDING" | "REJECTED";
  enrolledAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
  };
}

interface CourseWithStudents {
  id: string;
  title: string;
  enrollments: StudentRow[];
}

const statusBadge: Record<string, string> = {
  APPROVED: "bg-green-100 text-green-700",
  COMPLETED: "bg-blue-100 text-blue-700",
};

export function StudentsBoard({ courses }: { courses: CourseWithStudents[] }) {
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id ?? null);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) ?? null;
  const students = selectedCourse?.enrollments ?? [];
  const totalStudents = courses.reduce((sum, c) => sum + c.enrollments.length, 0);

  if (courses.length === 0) {
    return (
      <Card className="p-12 text-center">
        <GraduationCap className="mx-auto h-8 w-8 text-neutral-300" />
        <p className="mt-3 text-sm text-neutral-400">
          You&rsquo;re not assigned to any course yet.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
      <CourseListPanel
        courses={courses.map((c) => ({ id: c.id, title: c.title, badge: c.enrollments.length }))}
        selectedId={selectedCourseId}
        onSelect={setSelectedCourseId}
        totalBadge={totalStudents}
      />

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 px-6 py-5">
          <div className="min-w-0">
            <h2 className="truncate font-display text-base font-bold text-neutral-900">
              {selectedCourse?.title ?? "Select a course"}
            </h2>
            <p className="mt-0.5 text-xs text-neutral-500">
              {students.length} active student{students.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        {students.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <Users className="mx-auto h-8 w-8 text-neutral-300" />
            <p className="mt-3 text-sm text-neutral-400">
              No approved students enrolled in this course yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50">
                  <th className="px-5 py-3 text-left font-medium text-neutral-500">Student</th>
                  <th className="px-5 py-3 text-left font-medium text-neutral-500">Phone</th>
                  <th className="px-5 py-3 text-left font-medium text-neutral-500">Status</th>
                  <th className="px-5 py-3 text-left font-medium text-neutral-500">Enrolled</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="border-b border-neutral-50 hover:bg-neutral-50">
                    <td className="px-5 py-3">
                      <div className="font-medium text-neutral-900">{s.user.name ?? "—"}</div>
                      <div className="text-xs text-neutral-400">{s.user.email}</div>
                    </td>
                    <td className="px-5 py-3">
                      {s.user.phone ? (
                        <span className="flex items-center gap-1.5 text-neutral-600">
                          <Phone className="h-3.5 w-3.5 text-neutral-400" />
                          {s.user.phone}
                        </span>
                      ) : (
                        <span className="text-xs text-neutral-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          statusBadge[s.status] ?? "bg-neutral-100 text-neutral-600"
                        }`}
                      >
                        {s.status === "COMPLETED" && <Award className="h-3 w-3" />}
                        {s.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-neutral-400">
                      {s.enrolledAt.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
