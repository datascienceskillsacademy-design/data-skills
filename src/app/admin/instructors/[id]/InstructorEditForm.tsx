"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ImagePlus, Loader2, User, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { Instructor } from "@/generated/prisma/client";

interface InstructorEditFormProps {
  instructor: Instructor | null;
}

export function InstructorEditForm({ instructor }: InstructorEditFormProps) {
  const router = useRouter();
  const isNew = !instructor;

  const [form, setForm] = useState({
    name: instructor?.name ?? "",
    role: instructor?.role ?? "",
    bio: instructor?.bio ?? "",
    avatar: instructor?.avatar ?? "",
    badge: instructor?.badge ?? "",
    statLabel: instructor?.statLabel ?? "",
    linkedinUrl: instructor?.linkedinUrl ?? "",
    twitterUrl: instructor?.twitterUrl ?? "",
    githubUrl: instructor?.githubUrl ?? "",
    isFounder: instructor?.isFounder ?? false,
    isFeatured: instructor?.isFeatured ?? false,
    isPublished: instructor?.isPublished ?? true,
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
      body.append("folder", "instructors");

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
        badge: form.badge || undefined,
        statLabel: form.statLabel || undefined,
        linkedinUrl: form.linkedinUrl || undefined,
        twitterUrl: form.twitterUrl || undefined,
        githubUrl: form.githubUrl || undefined,
      };

      const url = isNew ? "/api/admin/instructors" : `/api/admin/instructors/${instructor.id}`;
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

      router.push("/admin/instructors");
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
            <label className={labelClass}>Name</label>
            <input name="name" value={form.name} onChange={handleChange} required className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>Role / Title</label>
            <input
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              className={fieldClass}
              placeholder="Chief Trainer · Advisor, Strategy & Innovation"
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Bio</label>
            <textarea name="bio" value={form.bio} onChange={handleChange} required rows={4} className={fieldClass} />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-neutral-400">
          Photo
        </h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="relative flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-full border border-dashed border-neutral-200 bg-neutral-50">
            {form.avatar ? (
              <>
                <Image
                  src={form.avatar}
                  alt="Instructor photo"
                  fill
                  sizes="128px"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, avatar: "" }))}
                  className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                  aria-label="Remove photo"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </>
            ) : (
              <User className="h-8 w-8 text-neutral-300" />
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
          Highlight
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Badge</label>
            <input
              name="badge"
              value={form.badge}
              onChange={handleChange}
              className={fieldClass}
              placeholder="Chief Trainer"
            />
          </div>
          <div>
            <label className={labelClass}>Stat Label</label>
            <input
              name="statLabel"
              value={form.statLabel}
              onChange={handleChange}
              className={fieldClass}
              placeholder="30+ Years Experience"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-neutral-400">
          Social Links
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <label className={labelClass}>LinkedIn</label>
            <input name="linkedinUrl" value={form.linkedinUrl} onChange={handleChange} className={fieldClass} placeholder="https://linkedin.com/in/..." />
          </div>
          <div>
            <label className={labelClass}>Twitter / X</label>
            <input name="twitterUrl" value={form.twitterUrl} onChange={handleChange} className={fieldClass} placeholder="https://x.com/..." />
          </div>
          <div>
            <label className={labelClass}>GitHub</label>
            <input name="githubUrl" value={form.githubUrl} onChange={handleChange} className={fieldClass} placeholder="https://github.com/..." />
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
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="isFounder"
            checked={form.isFounder}
            onChange={handleChange}
            className="h-4 w-4 rounded border-neutral-300 text-primary-600"
          />
          <span className="text-sm font-medium text-neutral-700">
            Founder
          </span>
        </label>
      </Card>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-primary-700 px-8 py-3 text-sm font-semibold text-white transition hover:bg-primary-800 disabled:opacity-60"
        >
          {saving ? "Saving…" : isNew ? "Create Instructor" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/instructors")}
          className="rounded-full border border-neutral-200 px-8 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
