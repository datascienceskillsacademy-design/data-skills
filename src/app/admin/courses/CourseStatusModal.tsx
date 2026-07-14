"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Check, GraduationCap } from "lucide-react";
import type { CourseStatus } from "@/generated/prisma/client";
import { courseStatusConfig } from "./courseStatusConfig";

interface CourseStatusModalProps {
  courseId: string;
  courseTitle: string;
  currentStatus: CourseStatus;
  onClose: () => void;
}

const STATUSES: CourseStatus[] = ["UPCOMING", "RUNNING", "COMPLETED"];

export function CourseStatusModal({
  courseId,
  courseTitle,
  currentStatus,
  onClose,
}: CourseStatusModalProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<CourseStatus>(currentStatus);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    if (selected === currentStatus) {
      onClose();
      return;
    }
    setSaving(true);
    setError(null);
    const res = await fetch(`/api/admin/courses/${courseId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: selected }),
    });
    if (res.ok) {
      router.refresh();
      onClose();
    } else {
      setError("Could not update the status. Please try again.");
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && !saving && onClose()}
    >
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-neutral-100 px-6 py-5">
          <div className="min-w-0">
            <h2 className="font-display text-lg font-bold text-neutral-900">
              Course Status
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

        <div className="space-y-3 px-6 py-5">
          {STATUSES.map((status) => {
            const config = courseStatusConfig[status];
            const Icon = config.icon;
            const active = selected === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setSelected(status)}
                className={`flex w-full items-start gap-3.5 rounded-2xl border p-4 text-left transition ${
                  active
                    ? "border-primary-400 bg-primary-50/60 ring-1 ring-primary-400"
                    : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                }`}
              >
                <span
                  className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${config.ring}`}
                >
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
                    {config.label}
                    {status === currentStatus && (
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-500">
                        Current
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-xs text-neutral-500">
                    {config.description}
                  </span>
                </span>
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                    active
                      ? "border-primary-600 bg-primary-600 text-white"
                      : "border-neutral-300"
                  }`}
                >
                  {active && <Check className="h-3 w-3" />}
                </span>
              </button>
            );
          })}

          {selected === "COMPLETED" && currentStatus !== "COMPLETED" && (
            <div className="flex items-start gap-2.5 rounded-xl bg-primary-50 px-4 py-3">
              <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" />
              <p className="text-xs text-primary-800">
                Marking this course as completed will let enrolled students
                download their certificate of completion from their profile.
              </p>
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 border-t border-neutral-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-full border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded-full bg-primary-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-800 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Update Status"}
          </button>
        </div>
      </div>
    </div>
  );
}
