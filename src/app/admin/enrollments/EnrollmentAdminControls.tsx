"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

type Status = "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";

const colorMap: Record<Status, string> = {
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
  APPROVED: "bg-green-100 text-green-700 border-green-200",
  REJECTED: "bg-red-100 text-red-700 border-red-200",
  COMPLETED: "bg-blue-100 text-blue-700 border-blue-200",
};

interface EnrollmentAdminControlsProps {
  enrollmentId: string;
  currentStatus: Status;
  coursePrice: number;
  initialAmountPaid: number | null;
}

export function EnrollmentAdminControls({
  enrollmentId,
  currentStatus,
  coursePrice,
  initialAmountPaid,
}: EnrollmentAdminControlsProps) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>(currentStatus);
  const [amountPaid, setAmountPaid] = useState<number | null>(initialAmountPaid);
  const [saving, setSaving] = useState(false);

  // Modal state — non-null pendingStatus means "apply this status once confirmed";
  // null means "just editing the amount paid, leave status as-is".
  const [modal, setModal] = useState<{ pendingStatus: Status | null } | null>(null);
  const [paymentType, setPaymentType] = useState<"full" | "partial">("full");
  const [amountInput, setAmountInput] = useState("");
  const [modalError, setModalError] = useState("");
  const [modalSaving, setModalSaving] = useState(false);

  const isPaidVisible = status === "APPROVED" || status === "COMPLETED";
  const due = amountPaid != null ? Math.max(coursePrice - amountPaid, 0) : 0;

  async function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as Status;
    if (newStatus === status) return;

    if (newStatus === "APPROVED") {
      openPaymentModal(newStatus);
      return;
    }

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

  function openPaymentModal(pendingStatus: Status | null) {
    setModalError("");
    const existingPartial = amountPaid != null && amountPaid < coursePrice;
    setPaymentType(existingPartial ? "partial" : "full");
    setAmountInput(String(amountPaid ?? coursePrice));
    setModal({ pendingStatus });
  }

  async function confirmPaymentModal() {
    if (!modal) return;
    setModalError("");

    const finalAmount = paymentType === "full" ? coursePrice : Number(amountInput);

    if (paymentType === "partial") {
      if (!amountInput || Number.isNaN(finalAmount) || finalAmount <= 0) {
        setModalError("Enter a valid amount received.");
        return;
      }
      if (finalAmount > coursePrice) {
        setModalError("Amount can't exceed the course price.");
        return;
      }
    }

    setModalSaving(true);
    try {
      const res = await fetch(`/api/admin/enrollments/${enrollmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: modal.pendingStatus ?? undefined,
          amountPaid: finalAmount,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setModalError(data.error ?? "Failed to save.");
        return;
      }

      if (modal.pendingStatus) setStatus(modal.pendingStatus);
      setAmountPaid(finalAmount);
      setModal(null);
      router.refresh();
    } finally {
      setModalSaving(false);
    }
  }

  return (
    <>
      <select
        value={status}
        onChange={handleStatusChange}
        disabled={saving}
        className={`rounded-lg border px-3 py-1.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary-100 disabled:opacity-60 ${colorMap[status]}`}
      >
        <option value="PENDING">PENDING</option>
        <option value="APPROVED">APPROVED</option>
        <option value="REJECTED">REJECTED</option>
        <option value="COMPLETED">COMPLETED</option>
      </select>

      {isPaidVisible && (
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs">
          {amountPaid != null ? (
            <span className="text-neutral-500">
              Paid BDT {amountPaid.toLocaleString("en-BD")}
            </span>
          ) : (
            <span className="text-neutral-400">Full payment assumed</span>
          )}
          {due > 0 && (
            <span className="inline-flex rounded-full bg-amber-100 px-2 py-0.5 font-semibold text-amber-700">
              Due BDT {due.toLocaleString("en-BD")}
            </span>
          )}
          <button
            type="button"
            onClick={() => openPaymentModal(null)}
            className="flex items-center gap-1 text-primary-600 hover:text-primary-800"
          >
            <Pencil className="h-3 w-3" />
            Edit
          </button>
        </div>
      )}

      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={(e) => e.target === e.currentTarget && setModal(null)}
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-sm font-semibold text-neutral-900">
              {modal.pendingStatus === "APPROVED" ? "Approve enrollment" : "Update payment"}
            </h2>
            <p className="mt-1 text-xs text-neutral-500">
              Course price: BDT {coursePrice.toLocaleString("en-BD")}
            </p>

            <div className="mt-4 space-y-2.5">
              <label className="flex items-center gap-2 text-sm text-neutral-700">
                <input
                  type="radio"
                  name="paymentType"
                  checked={paymentType === "full"}
                  onChange={() => setPaymentType("full")}
                  className="text-primary-600"
                />
                Full payment (BDT {coursePrice.toLocaleString("en-BD")})
              </label>
              <label className="flex items-center gap-2 text-sm text-neutral-700">
                <input
                  type="radio"
                  name="paymentType"
                  checked={paymentType === "partial"}
                  onChange={() => setPaymentType("partial")}
                  className="text-primary-600"
                />
                Partial payment
              </label>

              {paymentType === "partial" && (
                <div className="pl-6">
                  <label className="mb-1 block text-xs font-medium text-neutral-500">
                    Amount received (BDT)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={coursePrice}
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  />
                  {amountInput && !Number.isNaN(Number(amountInput)) && (
                    <p className="mt-1 text-xs text-neutral-400">
                      Due: BDT{" "}
                      {Math.max(coursePrice - Number(amountInput), 0).toLocaleString("en-BD")}
                    </p>
                  )}
                </div>
              )}
            </div>

            {modalError && (
              <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
                {modalError}
              </p>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setModal(null)}
                className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmPaymentModal}
                disabled={modalSaving}
                className="rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-700 disabled:opacity-60"
              >
                {modalSaving ? "Saving…" : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
