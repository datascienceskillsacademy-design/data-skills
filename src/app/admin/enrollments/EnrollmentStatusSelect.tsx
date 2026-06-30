"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Status = "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";

const colorMap: Record<Status, string> = {
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
  APPROVED: "bg-green-100 text-green-700 border-green-200",
  REJECTED: "bg-red-100 text-red-700 border-red-200",
  COMPLETED: "bg-blue-100 text-blue-700 border-blue-200",
};

export function EnrollmentStatusSelect({
  enrollmentId,
  currentStatus,
}: {
  enrollmentId: string;
  currentStatus: Status;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as Status;
    setSaving(true);

    const res = await fetch(`/api/admin/enrollments/${enrollmentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      setStatus(newStatus);
      router.refresh();
    }

    setSaving(false);
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={saving}
      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary-100 disabled:opacity-60 ${colorMap[status]}`}
    >
      <option value="PENDING">PENDING</option>
      <option value="APPROVED">APPROVED</option>
      <option value="REJECTED">REJECTED</option>
      <option value="COMPLETED">COMPLETED</option>
    </select>
  );
}
