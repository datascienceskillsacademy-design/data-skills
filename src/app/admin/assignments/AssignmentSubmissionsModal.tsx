"use client";

import { useEffect, useState } from "react";
import { X, Users, ExternalLink, CheckCircle2, Circle } from "lucide-react";

interface SubmissionRow {
  userId: string;
  name: string | null;
  email: string;
  link: string | null;
  submittedAt: string | null;
}

interface SubmissionsData {
  assignmentTitle: string;
  courseTitle: string;
  students: SubmissionRow[];
}

export function AssignmentSubmissionsModal({
  assignmentId,
  onClose,
}: {
  assignmentId: string;
  onClose: () => void;
}) {
  const [data, setData] = useState<SubmissionsData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/assignments/${assignmentId}/submissions`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load submissions.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [assignmentId]);

  const submittedCount = data?.students.filter((s) => s.link).length ?? 0;
  const total = data?.students.length ?? 0;
  const pct = total > 0 ? Math.round((submittedCount / total) * 100) : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="border-b border-neutral-100 px-6 py-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-neutral-900">
                <Users className="h-4 w-4 text-primary-600" />
                Submissions
              </h2>
              <p className="mt-0.5 truncate text-sm text-neutral-500">
                {data ? `${data.assignmentTitle} · ${data.courseTitle}` : "Loading…"}
              </p>
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

          {data && total > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-neutral-500">
                <span>
                  {submittedCount} of {total} students submitted
                </span>
                <span className="font-semibold text-neutral-700">{pct}%</span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-primary-100">
                <div
                  className="h-full rounded-full bg-primary-600 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading && <p className="py-10 text-center text-sm text-neutral-400">Loading…</p>}
          {error && <p className="py-10 text-center text-sm text-red-600">{error}</p>}

          {data && data.students.length === 0 && (
            <p className="py-10 text-center text-sm text-neutral-400">
              No approved students are enrolled in this course yet.
            </p>
          )}

          {data && data.students.length > 0 && (
            <ul className="space-y-2">
              {data.students.map((s) => (
                <li
                  key={s.userId}
                  className="flex items-center gap-3 rounded-2xl border border-neutral-100 px-4 py-3"
                >
                  {s.link ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
                  ) : (
                    <Circle className="h-5 w-5 shrink-0 text-neutral-300" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-neutral-900">
                      {s.name ?? "—"}
                    </p>
                    <p className="truncate text-xs text-neutral-400">{s.email}</p>
                  </div>
                  {s.link ? (
                    <a
                      href={s.link}
                      target="_blank"
                      rel="noreferrer"
                      className="flex shrink-0 items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-800"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      View
                    </a>
                  ) : (
                    <span className="shrink-0 text-xs text-neutral-400">Not submitted</span>
                  )}
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
