"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ImagePlus, Loader2, Star, User, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { Review } from "@/generated/prisma/client";

interface ReviewEditFormProps {
  review: Review | null;
}

export function ReviewEditForm({ review }: ReviewEditFormProps) {
  const router = useRouter();
  const isNew = !review;

  const [form, setForm] = useState({
    authorName: review?.authorName ?? "",
    authorRole: review?.authorRole ?? "",
    avatar: review?.avatar ?? "",
    quote: review?.quote ?? "",
    rating: review?.rating ?? 5,
    isFeatured: review?.isFeatured ?? false,
    isPublished: review?.isPublished ?? true,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleAvatarSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadError("");
    setUploading(true);

    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", "reviews");

      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();

      if (!res.ok) {
        setUploadError(data.error ?? "Upload failed.");
        return;
      }

      setForm((prev) => ({ ...prev, avatar: data.url }));
    } catch {
      setUploadError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const payload = {
        ...form,
        avatar: form.avatar || undefined,
        rating: Number(form.rating),
      };

      const url = isNew ? "/api/admin/reviews" : `/api/admin/reviews/${review.id}`;
      const method = isNew ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Failed to save.");
        return;
      }

      router.push("/admin/reviews");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  const fieldClass =
    "w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100";
  const labelClass = "block mb-1.5 text-sm font-medium text-neutral-700";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <p className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <Card className="p-6">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-neutral-400">
          Author
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Name</label>
            <input name="authorName" value={form.authorName} onChange={handleChange} required className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>Role / Organization</label>
            <input
              name="authorRole"
              value={form.authorRole}
              onChange={handleChange}
              required
              className={fieldClass}
              placeholder="Medical Officer, Dhaka Medical College Hospital"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-neutral-400">
          Photo
        </h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-dashed border-neutral-200 bg-neutral-50">
            {form.avatar ? (
              <>
                <Image
                  src={form.avatar}
                  alt="Reviewer photo"
                  fill
                  sizes="96px"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, avatar: "" }))}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                  aria-label="Remove photo"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </>
            ) : (
              <User className="h-7 w-7 text-neutral-300" />
            )}
          </div>

          <div className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={handleAvatarSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-60"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading…
                </>
              ) : (
                <>
                  <ImagePlus className="h-4 w-4" />
                  {form.avatar ? "Replace photo" : "Upload photo"}
                </>
              )}
            </button>
            <p className="mt-1.5 text-xs text-neutral-400">
              JPEG, PNG, WebP, or AVIF. Max 5MB. Uploaded to Cloudinary.
            </p>
            {uploadError && (
              <p className="mt-1.5 text-xs text-red-600">{uploadError}</p>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-neutral-400">
          Review
        </h2>
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Quote</label>
            <textarea name="quote" value={form.quote} onChange={handleChange} required rows={4} className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>Rating</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, rating: n }))}
                  className="p-0.5"
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                >
                  <Star
                    className={`h-6 w-6 ${
                      n <= form.rating
                        ? "fill-accent-400 text-accent-400"
                        : "text-neutral-200"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card className="space-y-4 p-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="isPublished"
            checked={form.isPublished}
            onChange={handleChange}
            className="h-4 w-4 rounded border-neutral-300 text-primary-600"
          />
          <span className="text-sm font-medium text-neutral-700">
            Visible on the site
          </span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="isFeatured"
            checked={form.isFeatured}
            onChange={handleChange}
            className="h-4 w-4 rounded border-neutral-300 text-primary-600"
          />
          <span className="text-sm font-medium text-neutral-700">
            Feature on the home page
          </span>
        </label>
      </Card>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-primary-700 px-8 py-3 text-sm font-semibold text-white transition hover:bg-primary-800 disabled:opacity-60"
        >
          {saving ? "Saving…" : isNew ? "Create Review" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/reviews")}
          className="rounded-full border border-neutral-200 px-8 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
