"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, BriefcaseBusiness, Building2 } from "lucide-react";

export interface ProfileFormValues {
  name: string;
  phone: string;
  designation: string;
  organization: string;
}

interface ProfileFormProps {
  email: string;
  initial: ProfileFormValues;
  submitLabel: string;
  redirectTo?: string;
  onSuccess?: () => void;
}

const inputClass =
  "w-full rounded-xl border border-neutral-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100";

export function ProfileForm({
  email,
  initial,
  submitLabel,
  redirectTo,
  onSuccess,
}: ProfileFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<ProfileFormValues>(initial);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function set(field: keyof ProfileFormValues) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setValues((v) => ({ ...v, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Could not save your profile. Please try again.");
      setSaving(false);
      return;
    }

    router.refresh();
    if (redirectTo) {
      router.push(redirectTo);
    } else {
      setSaving(false);
    }
    onSuccess?.();
  }

  const fields = [
    {
      label: "Full Name",
      icon: User,
      input: (
        <input
          type="text"
          value={values.name}
          onChange={set("name")}
          required
          minLength={2}
          className={inputClass}
          placeholder="Dr. Jane Smith"
        />
      ),
    },
    {
      label: "Email",
      icon: Mail,
      input: (
        <input
          type="email"
          value={email}
          readOnly
          disabled
          className={`${inputClass} cursor-not-allowed bg-neutral-50 text-neutral-500`}
        />
      ),
    },
    {
      label: "Phone Number",
      icon: Phone,
      input: (
        <input
          type="tel"
          value={values.phone}
          onChange={set("phone")}
          required
          minLength={6}
          className={inputClass}
          placeholder="+880 1XXX-XXXXXX"
        />
      ),
    },
    {
      label: "Designation",
      icon: BriefcaseBusiness,
      input: (
        <input
          type="text"
          value={values.designation}
          onChange={set("designation")}
          required
          minLength={2}
          className={inputClass}
          placeholder="e.g. Medical Officer, Student, Data Analyst"
        />
      ),
    },
    {
      label: "Organization",
      icon: Building2,
      input: (
        <input
          type="text"
          value={values.organization}
          onChange={set("organization")}
          required
          minLength={2}
          className={inputClass}
          placeholder="e.g. Dhaka Medical College, ACME Ltd."
        />
      ),
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {error}
        </p>
      )}

      {fields.map(({ label, icon: Icon, input }) => (
        <div key={label}>
          <label className="mb-1.5 block text-sm font-medium text-neutral-700">
            {label}
          </label>
          <div className="relative">
            <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            {input}
          </div>
        </div>
      ))}

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-xl bg-primary-700 py-3 text-sm font-semibold text-white transition hover:bg-primary-800 disabled:opacity-60"
      >
        {saving ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
