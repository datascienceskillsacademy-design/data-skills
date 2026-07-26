"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Role } from "@/generated/prisma/client";

interface UserRoleSelectProps {
  userId: string;
  currentRole: Role;
  isSelf: boolean;
  /** Whether the viewer is a SUPER_ADMIN (may grant/revoke SUPER_ADMIN). */
  canManageSuperAdmin: boolean;
}

const roleStyles: Record<Role, string> = {
  STUDENT: "border-blue-200 bg-blue-50 text-blue-700",
  STUDENT_SUPPORT: "border-teal-200 bg-teal-50 text-teal-700",
  INSTRUCTOR: "border-indigo-200 bg-indigo-50 text-indigo-700",
  ADMIN: "border-purple-200 bg-purple-50 text-purple-700",
  SUPER_ADMIN: "border-amber-200 bg-amber-50 text-amber-700",
};

export function UserRoleSelect({
  userId,
  currentRole,
  isSelf,
  canManageSuperAdmin,
}: UserRoleSelectProps) {
  const router = useRouter();
  const [role, setRole] = useState(currentRole);
  const [saving, setSaving] = useState(false);
  const [pendingRole, setPendingRole] = useState<Role | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setPendingRole(e.target.value as Role);
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

  // Only a super admin can touch another super admin's role
  if (role === "SUPER_ADMIN" && !canManageSuperAdmin) {
    return (
      <span
        className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium ${roleStyles.SUPER_ADMIN}`}
      >
        SUPER_ADMIN
      </span>
    );
  }

  return (
    <>
      <select
        value={role}
        onChange={handleChange}
        disabled={saving}
        className={`rounded-lg border px-3 py-1.5 text-xs font-medium outline-none focus:border-primary-400 disabled:opacity-60 ${roleStyles[role]}`}
      >
        <option value="STUDENT">STUDENT</option>
        <option value="STUDENT_SUPPORT">STUDENT_SUPPORT</option>
        <option value="INSTRUCTOR">INSTRUCTOR</option>
        <option value="ADMIN">ADMIN</option>
        {canManageSuperAdmin && (
          <option value="SUPER_ADMIN">SUPER_ADMIN</option>
        )}
      </select>

      {pendingRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
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
