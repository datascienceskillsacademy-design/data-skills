"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Pencil,
  Trash2,
  Plus,
  Users,
  GraduationCap,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { CourseListPanel } from "../_components/CourseListPanel";
import { AssignmentModal } from "./AssignmentModal";
import { AssignmentSubmissionsModal } from "./AssignmentSubmissionsModal";

interface AssignmentRow {
  id: string;
  title: string;
  docLink: string;
  order: number;
  courseId: string;
  moduleId: string | null;
  _count: { submissions: number };
}

interface ModuleOption {
  id: string;
  title: string;
}

interface CourseWithAssignments {
  id: string;
  title: string;
  _count: { enrollments: number };
  modules: ModuleOption[];
  assignments: AssignmentRow[];
}

export function AssignmentsBoard({ courses }: { courses: CourseWithAssignments[] }) {
  const router = useRouter();
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id ?? null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [modalState, setModalState] = useState<"new" | AssignmentRow | null>(null);
  const [submissionsFor, setSubmissionsFor] = useState<AssignmentRow | null>(null);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) ?? null;
  const assignments = selectedCourse
    ? [...selectedCourse.assignments].sort((a, b) => a.order - b.order)
    : [];
  const totalAssignments = courses.reduce((sum, c) => sum + c.assignments.length, 0);

  async function deleteAssignment(assignment: AssignmentRow) {
    if (
      !confirm(`Delete assignment "${assignment.title}"? Student submissions will be lost.`)
    )
      return;
    setBusyId(assignment.id);
    const res = await fetch(
      `/api/admin/courses/${assignment.courseId}/assignments/${assignment.id}`,
      { method: "DELETE" }
    );
    if (res.ok) router.refresh();
    setBusyId(null);
  }

  async function move(assignment: AssignmentRow, direction: "up" | "down") {
    const index = assignments.findIndex((a) => a.id === assignment.id);
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= assignments.length) return;
    const swapWith = assignments[swapIndex];

    setBusyId(assignment.id);
    await Promise.all([
      fetch(`/api/admin/courses/${assignment.courseId}/assignments/${assignment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: swapWith.order }),
      }),
      fetch(`/api/admin/courses/${assignment.courseId}/assignments/${swapWith.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: assignment.order }),
      }),
    ]);
    router.refresh();
    setBusyId(null);
  }

  if (courses.length === 0) {
    return (
      <Card className="p-12 text-center">
        <GraduationCap className="mx-auto h-8 w-8 text-neutral-300" />
        <p className="mt-3 text-sm text-neutral-400">
          Create a course first before adding assignments.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
      <CourseListPanel
        courses={courses.map((c) => ({ id: c.id, title: c.title, badge: c.assignments.length }))}
        selectedId={selectedCourseId}
        onSelect={setSelectedCourseId}
        totalBadge={totalAssignments}
      />

      {/* Assignments for selected course */}
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 px-6 py-5">
          <div className="min-w-0">
            <h2 className="truncate font-display text-base font-bold text-neutral-900">
              {selectedCourse?.title ?? "Select a course"}
            </h2>
            <p className="mt-0.5 text-xs text-neutral-500">
              {selectedCourse?._count.enrollments ?? 0} active student
              {selectedCourse?._count.enrollments === 1 ? "" : "s"}
            </p>
          </div>
          {selectedCourse && (
            <button
              type="button"
              onClick={() => setModalState("new")}
              className="flex items-center gap-1.5 rounded-full bg-primary-700 px-4 py-2 text-xs font-semibold text-white hover:bg-primary-800"
            >
              <Plus className="h-3.5 w-3.5" />
              New Assignment
            </button>
          )}
        </div>

        {assignments.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <FileText className="mx-auto h-8 w-8 text-neutral-300" />
            <p className="mt-3 text-sm text-neutral-400">
              No assignments yet for this course.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50">
                  <th className="w-10 px-5 py-3 text-left font-medium text-neutral-500">#</th>
                  <th className="px-5 py-3 text-left font-medium text-neutral-500">
                    Assignment
                  </th>
                  <th className="px-5 py-3 text-left font-medium text-neutral-500">Module</th>
                  <th className="px-5 py-3 text-left font-medium text-neutral-500">Link</th>
                  <th className="px-5 py-3 text-left font-medium text-neutral-500">
                    Submissions
                  </th>
                  <th className="px-5 py-3 text-left font-medium text-neutral-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((assignment, i) => {
                  const busy = busyId === assignment.id;
                  const total = selectedCourse?._count.enrollments ?? 0;
                  const submitted = assignment._count.submissions;
                  const pct = total > 0 ? Math.round((submitted / total) * 100) : 0;
                  const moduleTitle = selectedCourse?.modules.find(
                    (m) => m.id === assignment.moduleId
                  )?.title;
                  return (
                    <tr
                      key={assignment.id}
                      className="border-b border-neutral-50 hover:bg-neutral-50"
                    >
                      <td className="px-5 py-3 tabular-nums text-neutral-400">{i + 1}</td>
                      <td className="px-5 py-3 font-medium text-neutral-900">
                        {assignment.title}
                      </td>
                      <td className="px-5 py-3">
                        {moduleTitle ? (
                          <span className="inline-flex rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
                            {moduleTitle}
                          </span>
                        ) : (
                          <span className="text-xs text-neutral-300">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <a
                          href={assignment.docLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-800"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Open Link
                        </a>
                      </td>
                      <td className="px-5 py-3">
                        <button
                          type="button"
                          onClick={() => setSubmissionsFor(assignment)}
                          className="group flex w-32 flex-col gap-1 text-left"
                        >
                          <span className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 group-hover:text-primary-700">
                            <Users className="h-3.5 w-3.5" />
                            {submitted}/{total}
                          </span>
                          <span className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
                            <span
                              className="block h-full rounded-full bg-primary-600"
                              style={{ width: `${pct}%` }}
                            />
                          </span>
                        </button>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-0.5">
                          <button
                            type="button"
                            onClick={() => move(assignment, "up")}
                            disabled={busy || i === 0}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-30"
                            aria-label="Move up"
                          >
                            <ChevronUp className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => move(assignment, "down")}
                            disabled={busy || i === assignments.length - 1}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-30"
                            aria-label="Move down"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setModalState(assignment)}
                            disabled={busy}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-primary-700 disabled:opacity-30"
                            aria-label="Edit assignment"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteAssignment(assignment)}
                            disabled={busy}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
                            aria-label="Delete assignment"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {modalState && selectedCourse && (
        <AssignmentModal
          courseId={selectedCourse.id}
          courseTitle={selectedCourse.title}
          modules={selectedCourse.modules}
          assignment={modalState === "new" ? null : modalState}
          onClose={() => setModalState(null)}
        />
      )}

      {submissionsFor && (
        <AssignmentSubmissionsModal
          assignmentId={submissionsFor.id}
          onClose={() => setSubmissionsFor(null)}
        />
      )}
    </div>
  );
}
