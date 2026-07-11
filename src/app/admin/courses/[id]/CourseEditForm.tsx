"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { Course } from "@/generated/prisma/client";

interface CourseEditFormProps {
  course: Course | null;
}

export function CourseEditForm({ course }: CourseEditFormProps) {
  const router = useRouter();
  const isNew = !course;

  const [form, setForm] = useState({
    slug: course?.slug ?? "",
    title: course?.title ?? "",
    subtitle: course?.subtitle ?? "",
    description: course?.description ?? "",
    thumbnail: course?.thumbnail ?? "",
    price: course?.price ?? 8000,
    originalPrice: course?.originalPrice ?? "",
    durationLabel: course?.durationLabel ?? "2 Months",
    classCount: course?.classCount ?? 16,
    classHours: course?.classHours ?? 2,
    batchSize: course?.batchSize ?? "25–30",
    level: course?.level ?? "Beginner",
    category: course?.category ?? "Healthcare",
    whatsappLink: course?.whatsappLink ?? "",
    meetLink: course?.meetLink ?? "",
    isPublished: course?.isPublished ?? false,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleThumbnailSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadError("");
    setUploading(true);

    try {
      const body = new FormData();
      body.append("file", file);

      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();

      if (!res.ok) {
        setUploadError(data.error ?? "Upload failed.");
        return;
      }

      setForm((prev) => ({ ...prev, thumbnail: data.url }));
    } catch {
      setUploadError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
        thumbnail: form.thumbnail || undefined,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        classCount: Number(form.classCount),
        classHours: Number(form.classHours),
      };

      const url = isNew ? "/api/admin/courses" : `/api/admin/courses/${course.id}`;
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

      router.push("/admin/courses");
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
          Basic Info
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Title</label>
            <input name="title" value={form.title} onChange={handleChange} required className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>Slug</label>
            <input name="slug" value={form.slug} onChange={handleChange} required className={fieldClass} placeholder="ai-healthcare-professionals" />
          </div>
          <div>
            <label className={labelClass}>Subtitle</label>
            <input name="subtitle" value={form.subtitle} onChange={handleChange} className={fieldClass} placeholder="No Coding Required" />
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <input name="category" value={form.category} onChange={handleChange} required className={fieldClass} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} required rows={4} className={fieldClass} />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-neutral-400">
          Thumbnail
        </h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="relative flex h-32 w-52 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-neutral-200 bg-neutral-50">
            {form.thumbnail ? (
              <>
                <Image
                  src={form.thumbnail}
                  alt="Course thumbnail"
                  fill
                  sizes="208px"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, thumbnail: "" }))}
                  className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                  aria-label="Remove thumbnail"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </>
            ) : (
              <ImagePlus className="h-6 w-6 text-neutral-300" />
            )}
          </div>

          <div className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={handleThumbnailSelect}
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
                  {form.thumbnail ? "Replace image" : "Upload image"}
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
          Pricing & Schedule
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <label className={labelClass}>Price (BDT)</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} required className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>Original Price (BDT)</label>
            <input type="number" name="originalPrice" value={form.originalPrice} onChange={handleChange} className={fieldClass} placeholder="Optional" />
          </div>
          <div>
            <label className={labelClass}>Duration Label</label>
            <input name="durationLabel" value={form.durationLabel} onChange={handleChange} required className={fieldClass} placeholder="2 Months" />
          </div>
          <div>
            <label className={labelClass}>Class Count</label>
            <input type="number" name="classCount" value={form.classCount} onChange={handleChange} required className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>Hours per Class</label>
            <input type="number" name="classHours" value={form.classHours} onChange={handleChange} required className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>Batch Size</label>
            <input name="batchSize" value={form.batchSize} onChange={handleChange} required className={fieldClass} placeholder="25–30" />
          </div>
          <div>
            <label className={labelClass}>Level</label>
            <select name="level" value={form.level} onChange={handleChange} className={fieldClass}>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-neutral-400">
          Live Links
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>WhatsApp Group Link</label>
            <input
              name="whatsappLink"
              value={form.whatsappLink}
              onChange={handleChange}
              className={fieldClass}
              placeholder="https://chat.whatsapp.com/..."
            />
          </div>
          <div>
            <label className={labelClass}>Google Meet Link</label>
            <input
              name="meetLink"
              value={form.meetLink}
              onChange={handleChange}
              className={fieldClass}
              placeholder="https://meet.google.com/..."
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="isPublished"
            checked={form.isPublished}
            onChange={handleChange}
            className="h-4 w-4 rounded border-neutral-300 text-primary-600"
          />
          <span className="text-sm font-medium text-neutral-700">
            Publish this course (visible to students)
          </span>
        </label>
      </Card>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-primary-700 px-8 py-3 text-sm font-semibold text-white transition hover:bg-primary-800 disabled:opacity-60"
        >
          {saving ? "Saving…" : isNew ? "Create Course" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/courses")}
          className="rounded-full border border-neutral-200 px-8 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
