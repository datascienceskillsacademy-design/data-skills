"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, CheckCircle2, Circle, Layers, RotateCcw, Pencil } from "lucide-react";
import Link from "next/link";
import type { CourseModule } from "@/generated/prisma/client";

interface ManageModulesModalProps {
  courseId: string;
  courseTitle: string;
  modules: CourseModule[];
  onClose: () => void;
}

export function ManageModulesModal({
  courseId,
  courseTitle,
  modules: initialModules,
  onClose,
}: ManageModulesModalProps) {
  const router = useRouter();
  const [modules, setModules] = useState(initialModules);
  const [savingId, setSavingId] = useState<string | null>(null);

  const completed = modules.filter((m) => m.isCompleted).length;
  const progress =
    modules.length > 0 ? Math.round((completed / modules.length) * 100) : 0;

  async function toggle(mod: CourseModule) {
    setSavingId(mod.id);
    const res = await fetch(`/api/admin/courses/${courseId}/modules/${mod.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isCompleted: !mod.isCompleted }),
    });
    if (res.ok) {
      setModules((prev) =>
        prev.map((m) =>
          m.id === mod.id ? { ...m, isCompleted: !mod.isCompleted } : m
        )
      );
      router.refresh();
    }
    setSavingId(null);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="border-b border-neutral-100 px-6 py-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-neutral-900">
                <Layers className="h-4 w-4 text-primary-600" />
                Course Modules
              </h2>
              <p className="mt-0.5 truncate text-sm text-neutral-500">{courseTitle}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {modules.length > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-neutral-500">
                <span>
                  {completed} of {modules.length} modules completed
                </span>
                <span className="font-semibold text-neutral-700">{progress}%</span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-primary-100">
                <div
                  className="h-full rounded-full bg-primary-600 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Module list */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {modules.length === 0 ? (
            <div className="py-10 text-center">
              <Layers className="mx-auto h-8 w-8 text-neutral-300" />
              <p className="mt-3 text-sm text-neutral-400">
                No modules yet for this course.
              </p>
              <Link
                href={`/admin/courses/${courseId}`}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-800"
              >
                <Pencil className="h-3.5 w-3.5" />
                Add modules in Edit Course
              </Link>
            </div>
          ) : (
            <ul className="space-y-2">
              {modules.map((mod) => (
                <li
                  key={mod.id}
                  className="flex items-center gap-3 rounded-2xl border border-neutral-100 px-4 py-3"
                >
                  {mod.isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
                  ) : (
                    <Circle className="h-5 w-5 shrink-0 text-neutral-300" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-sm font-medium ${
                        mod.isCompleted ? "text-neutral-500" : "text-neutral-900"
                      }`}
                    >
                      {mod.title}
                    </p>
                    <p className="text-xs text-neutral-400">Module {mod.order}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggle(mod)}
                    disabled={savingId === mod.id}
                    className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
                      mod.isCompleted
                        ? "border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    {savingId === mod.id ? (
                      "Saving…"
                    ) : mod.isCompleted ? (
                      <span className="flex items-center gap-1.5">
                        <RotateCcw className="h-3 w-3" />
                        Undo
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3 w-3" />
                        Mark Complete
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-neutral-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full border border-neutral-200 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
