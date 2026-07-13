"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Trash2, Eye, EyeOff, Star, StarOff } from "lucide-react";
import type { Review } from "@/generated/prisma/client";

export function ReviewRowActions({ review }: { review: Review }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function toggle(field: "isPublished" | "isFeatured") {
    setBusy(true);
    const res = await fetch(`/api/admin/reviews/${review.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: !review[field] }),
    });
    if (res.ok) router.refresh();
    setBusy(false);
  }

  async function handleDelete() {
    setBusy(true);
    const res = await fetch(`/api/admin/reviews/${review.id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    setBusy(false);
    setConfirmDelete(false);
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => toggle("isFeatured")}
          disabled={busy}
          title={review.isFeatured ? "Unfeature" : "Feature on home page"}
          className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-primary-700 disabled:opacity-50"
        >
          {review.isFeatured ? (
            <Star className="h-3.5 w-3.5 fill-accent-400 text-accent-500" />
          ) : (
            <StarOff className="h-3.5 w-3.5" />
          )}
          {review.isFeatured ? "Featured" : "Feature"}
        </button>
        <button
          type="button"
          onClick={() => toggle("isPublished")}
          disabled={busy}
          title={review.isPublished ? "Hide from site" : "Show on site"}
          className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 disabled:opacity-50"
        >
          {review.isPublished ? (
            <Eye className="h-3.5 w-3.5" />
          ) : (
            <EyeOff className="h-3.5 w-3.5" />
          )}
          {review.isPublished ? "Visible" : "Hidden"}
        </button>
        <Link
          href={`/admin/reviews/${review.id}`}
          className="flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-800"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Link>
        <button
          type="button"
          onClick={() => setConfirmDelete(true)}
          disabled={busy}
          className="flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </button>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
            <h2 className="text-sm font-semibold text-neutral-900">Delete review</h2>
            <p className="mt-2 text-sm text-neutral-600">
              Are you sure you want to delete this review from{" "}
              <span className="font-medium text-neutral-900">{review.authorName}</span>? This
              cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={busy}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-60"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
