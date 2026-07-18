"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock, ExternalLink, FileText, Pencil, Loader2 } from "lucide-react";

interface AssignmentSubmissionFormProps {
  assignmentId: string;
  title: string;
  docLink: string;
  submission: { link: string; submittedAt: Date } | null;
}

export function AssignmentSubmissionForm({
  assignmentId,
  title,
  docLink,
  submission,
}: AssignmentSubmissionFormProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [link, setLink] = useState(submission?.link ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const res = await fetch(`/api/assignments/${assignmentId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ link: link.trim() }),
    });

    if (res.ok) {
      setEditing(false);
      router.refresh();
    } else {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Could not save your submission.");
    }
    setSaving(false);
  }

  const showForm = editing || !submission;

  return (
    <div
      className={`rounded-2xl border p-4 ${
        submission ? "border-green-200 bg-green-50/40" : "border-neutral-200"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
              submission ? "bg-green-100 text-green-600" : "bg-neutral-100 text-neutral-400"
            }`}
          >
            <FileText className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-neutral-900">{title}</p>
            {submission ? (
              <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-700">
                <CheckCircle2 className="h-3 w-3" />
                Submitted {submission.submittedAt.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            ) : (
              <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                <Clock className="h-3 w-3" />
                Not submitted
              </span>
            )}
          </div>
        </div>

        <a
          href={docLink}
          target="_blank"
          rel="noreferrer"
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          View Brief
        </a>
      </div>

      {!showForm && submission && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-green-100 pt-3">
          <a
            href={submission.link}
            target="_blank"
            rel="noreferrer"
            className="flex min-w-0 items-center gap-1.5 truncate text-xs font-medium text-primary-700 hover:text-primary-900"
          >
            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{submission.link}</span>
          </a>
          <button
            type="button"
            onClick={() => {
              setLink(submission.link);
              setEditing(true);
            }}
            className="flex shrink-0 items-center gap-1 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-50"
          >
            <Pencil className="h-3 w-3" />
            Edit
          </button>
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className={`mt-3 flex flex-col gap-2 sm:flex-row ${
            submission ? "border-t border-green-100 pt-3" : ""
          }`}
        >
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
            placeholder="Paste your submission link"
            className="flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
          <div className="flex shrink-0 gap-2">
            <button
              type="submit"
              disabled={saving || !link.trim()}
              className="flex items-center gap-1.5 rounded-lg bg-primary-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-primary-800 disabled:opacity-60"
            >
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Submit
            </button>
            {submission && (
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setError("");
                  setLink(submission.link);
                }}
                disabled={saving}
                className="rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
