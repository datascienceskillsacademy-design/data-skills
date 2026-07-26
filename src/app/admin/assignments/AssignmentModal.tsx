"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, X } from "lucide-react";

const fieldClass =
  "w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100";
const labelClass = "mb-1.5 block text-sm font-medium text-neutral-700";

interface ModuleOption {
  id: string;
  title: string;
}

interface AssignmentModalProps {
  courseId: string;
  courseTitle: string;
  modules: ModuleOption[];
  assignment: { id: string; title: string; docLink: string; moduleId: string | null } | null;
  onClose: () => void;
}

export function AssignmentModal({
  courseId,
  courseTitle,
  modules,
  assignment,
  onClose,
}: AssignmentModalProps) {
  const router = useRouter();
  const isEdit = !!assignment;
  const [title, setTitle] = useState(assignment?.title ?? "");
  const [docLink, setDocLink] = useState(assignment?.docLink ?? "");
  const [moduleId, setModuleId] = useState(assignment?.moduleId ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const url = isEdit
      ? `/api/admin/courses/${courseId}/assignments/${assignment.id}`
      : `/api/admin/courses/${courseId}/assignments`;

    const res = await fetch(url, {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(),
        docLink: docLink.trim(),
        moduleId: moduleId || null,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Could not save the assignment.");
      setSaving(false);
      return;
    }

    setSaving(false);
    router.refresh();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && !saving && onClose()}
    >
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-neutral-100 px-6 py-5">
          <div className="min-w-0">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-neutral-900">
              <FileText className="h-5 w-5 text-primary-600" />
              {isEdit ? "Edit Assignment" : "New Assignment"}
            </h2>
            <p className="mt-0.5 truncate text-sm text-neutral-500">{courseTitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
          )}

          <div>
            <label className={labelClass}>Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              minLength={2}
              placeholder="e.g. Week 3: Dashboard Build"
              className={fieldClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Module <span className="font-normal text-neutral-400">(optional)</span>
            </label>
            <select
              value={moduleId}
              onChange={(e) => setModuleId(e.target.value)}
              className={fieldClass}
            >
              <option value="">No specific module</option>
              {modules.map((mod) => (
                <option key={mod.id} value={mod.id}>
                  {mod.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Assignment Link</label>
            <input
              type="text"
              value={docLink}
              onChange={(e) => setDocLink(e.target.value)}
              required
              placeholder="https://..."
              className={fieldClass}
            />
            <p className="mt-1.5 text-xs text-neutral-400">
              Link to the assignment brief — any URL works.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-primary-700 py-3 text-sm font-semibold text-white transition hover:bg-primary-800 disabled:opacity-60"
          >
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Assignment"}
          </button>
        </form>
      </div>
    </div>
  );
}
