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
  const [pendingRole, setPendingRole] = useState<"STUDENT" | "ADMIN" | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setPendingRole(e.target.value as "STUDENT" | "ADMIN");
  }

  async function confirmChange() {
    if (!pendingRole) return;
    const newRole = pendingRole;
    setPendingRole(null);
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

  function cancelChange() {
    setPendingRole(null);
  }

  if (isSelf) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-primary-200 bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-700">
        <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
        You
      </span>
    );
  }

  return (
    <>
      <select
        value={role}
        onChange={handleChange}
        disabled={saving}
        className={`rounded-lg border px-3 py-1.5 text-xs font-medium outline-none focus:border-primary-400 disabled:opacity-60 ${
          role === "ADMIN"
            ? "border-purple-200 bg-purple-50 text-purple-700"
            : "border-blue-200 bg-blue-50 text-blue-700"
        }`}
      >
        <option value="STUDENT">STUDENT</option>
        <option value="ADMIN">ADMIN</option>
      </select>

      {pendingRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
            <h2 className="text-sm font-semibold text-neutral-900">Change role</h2>
            <p className="mt-2 text-sm text-neutral-600">
              Are you sure you want to change this user&apos;s role to{" "}
              <span className="font-medium text-neutral-900">{pendingRole}</span>?
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={cancelChange}
                className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmChange}
                className="rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
