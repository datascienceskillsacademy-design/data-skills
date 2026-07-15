"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  X,
  TicketPercent,
  Power,
  Trash2,
  Dices,
} from "lucide-react";
import type { Coupon } from "@/generated/prisma/client";

const inputClass =
  "w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100";

export function NewCouponButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("10");
  const [expiresAt, setExpiresAt] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function generateCode() {
    const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
    let random = "";
    for (let i = 0; i < 6; i++) {
      random += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    setCode(`DSA-${random}`);
  }

  function reset() {
    setCode("");
    setDiscount("10");
    setExpiresAt("");
    setMaxUses("");
    setDescription("");
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        discountPercent: Number(discount),
        description: description || undefined,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
        maxUses: maxUses ? Number(maxUses) : null,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Could not create the coupon.");
      setSaving(false);
      return;
    }

    setSaving(false);
    setOpen(false);
    reset();
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-full bg-primary-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-800"
      >
        <Plus className="h-4 w-4" />
        New Coupon
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => e.target === e.currentTarget && !saving && setOpen(false)}
        >
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-3 border-b border-neutral-100 px-6 py-5">
              <div>
                <h2 className="flex items-center gap-2 font-display text-lg font-bold text-neutral-900">
                  <TicketPercent className="h-5 w-5 text-primary-600" />
                  New Coupon
                </h2>
                <p className="mt-0.5 text-sm text-neutral-500">
                  Students can apply it at checkout.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
              {error && (
                <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">
                  {error}
                </p>
              )}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Coupon Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    required
                    minLength={3}
                    maxLength={24}
                    placeholder="e.g. WELCOME20"
                    className={`${inputClass} font-semibold uppercase tracking-wide`}
                  />
                  <button
                    type="button"
                    onClick={generateCode}
                    title="Generate random code"
                    className="flex shrink-0 items-center gap-1.5 rounded-xl border border-neutral-200 px-3.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-50"
                  >
                    <Dices className="h-4 w-4" />
                    Generate
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    required
                    min={1}
                    max={100}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Max Uses{" "}
                    <span className="font-normal text-neutral-400">(optional)</span>
                  </label>
                  <input
                    type="number"
                    value={maxUses}
                    onChange={(e) => setMaxUses(e.target.value)}
                    min={1}
                    placeholder="Unlimited"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Expiry Date{" "}
                  <span className="font-normal text-neutral-400">(optional)</span>
                </label>
                <input
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-neutral-400">
                  Leave empty for a coupon that never expires.
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Description{" "}
                  <span className="font-normal text-neutral-400">(optional)</span>
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={200}
                  placeholder="e.g. Launch campaign for July batch"
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-primary-700 py-3 text-sm font-semibold text-white transition hover:bg-primary-800 disabled:opacity-60"
              >
                {saving ? "Creating…" : "Create Coupon"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export function CouponRowActions({ coupon }: { coupon: Coupon }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function toggleActive() {
    setBusy(true);
    await fetch(`/api/admin/coupons/${coupon.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !coupon.isActive }),
    });
    router.refresh();
    setBusy(false);
  }

  async function remove() {
    setBusy(true);
    await fetch(`/api/admin/coupons/${coupon.id}`, { method: "DELETE" });
    setConfirmDelete(false);
    router.refresh();
    setBusy(false);
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleActive}
          disabled={busy}
          className={`flex items-center gap-1.5 text-xs font-medium disabled:opacity-50 ${
            coupon.isActive
              ? "text-neutral-600 hover:text-neutral-900"
              : "text-green-600 hover:text-green-800"
          }`}
        >
          <Power className="h-3.5 w-3.5" />
          {coupon.isActive ? "Deactivate" : "Activate"}
        </button>
        <button
          type="button"
          onClick={() => setConfirmDelete(true)}
          disabled={busy}
          className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-700 disabled:opacity-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </button>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
            <h2 className="text-sm font-semibold text-neutral-900">Delete coupon</h2>
            <p className="mt-2 text-sm text-neutral-600">
              Delete{" "}
              <span className="font-semibold text-neutral-900">{coupon.code}</span>?
              Past enrollments keep their discount, but no one can use this code
              anymore.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                disabled={busy}
                className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={remove}
                disabled={busy}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-60"
              >
                {busy ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
