"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface UserRoleSelectProps {
  userId: string;
  currentRole: "STUDENT" | "ADMIN";
  isSelf: boolean;
}

export function UserRoleSelect({ userId, currentRole, isSelf }: UserRoleSelectProps) {
  const router = useRouter();
  const [role, setRole] = useState(currentRole);
  const [saving, setSaving] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newRole = e.target.value as "STUDENT" | "ADMIN";
    setSaving(true);

    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });

    if (res.ok) {
      setRole(newRole);
      router.refresh();
    }

    setSaving(false);
  }

  if (isSelf) {
    return (
      <span className="text-xs text-neutral-400">(you)</span>
    );
  }

  return (
    <select
      value={role}
      onChange={handleChange}
      disabled={saving}
      className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 outline-none focus:border-primary-400 disabled:opacity-60"
    >
      <option value="STUDENT">STUDENT</option>
      <option value="ADMIN">ADMIN</option>
    </select>
  );
}
