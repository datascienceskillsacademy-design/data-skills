"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { User, Mail, BriefcaseBusiness } from "lucide-react";

interface Values {
  name: string;
  email: string;
  designation: string;
}

const fieldClass =
  "w-full rounded-xl border border-neutral-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100";

export function ProfileSettingsForm({ initial }: { initial: Values }) {
  const router = useRouter();
  const { update } = useSession();
  const [values, setValues] = useState<Values>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function set(field: keyof Values) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((v) => ({ ...v, [field]: e.target.value }));
      setSuccess(false);
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const res = await fetch("/api/admin/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Could not save your profile.");
      setSaving(false);
      return;
    }

    await update();
    router.refresh();
    setSuccess(true);
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
      )}
      {success && (
        <p className="rounded-xl bg-green-50 px-4 py-2.5 text-sm text-green-700">
          Profile updated.
        </p>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-neutral-700">Full Name</label>
        <div className="relative">
          <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={values.name}
            onChange={set("name")}
            required
            minLength={2}
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-neutral-700">Email</label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="email"
            value={values.email}
            onChange={set("email")}
            required
            className={fieldClass}
          />
        </div>
        <p className="mt-1.5 text-xs text-neutral-400">
          This is also the email you sign in with.
        </p>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-neutral-700">Designation</label>
        <div className="relative">
          <BriefcaseBusiness className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={values.designation}
            onChange={set("designation")}
            required
            minLength={2}
            placeholder="e.g. Senior Instructor"
            className={fieldClass}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-xl bg-primary-700 py-3 text-sm font-semibold text-white transition hover:bg-primary-800 disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}
