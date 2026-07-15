"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Smartphone,
  CheckCircle2,
  Clock,
  ArrowRight,
  TicketPercent,
  X,
  Info,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { BKASH_MERCHANT_NUMBER } from "@/lib/payment";

interface Course {
  id: string;
  title: string;
  price: number;
}

interface CheckoutClientProps {
  course: Course;
  existingEnrollment: { status: string } | null;
}

interface AppliedCoupon {
  code: string;
  discountPercent: number;
  payable: number;
}

const taka = (n: number) => `BDT ${n.toLocaleString("en-BD")}`;

export function CheckoutClient({ course, existingEnrollment }: CheckoutClientProps) {
  const router = useRouter();
  const [reference, setReference] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponChecking, setCouponChecking] = useState(false);
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);

  const payable = coupon?.payable ?? course.price;
  const minimum = Math.ceil(payable / 2);
  const [amountInput, setAmountInput] = useState("");
  const amount = Number(amountInput);

  if (existingEnrollment) {
    const statusLabel: Record<string, string> = {
      PENDING: "pending review",
      APPROVED: "approved",
      REJECTED: "rejected",
      COMPLETED: "completed",
    };
    return (
      <Card className="mt-8 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-primary-600" />
        <h2 className="mt-4 font-display text-xl font-bold text-neutral-900">
          Already enrolled
        </h2>
        <p className="mt-2 text-neutral-500">
          Your enrollment is{" "}
          <span className="font-semibold text-primary-700">
            {statusLabel[existingEnrollment.status] ?? existingEnrollment.status}
          </span>
          .
        </p>
        <button
          onClick={() => router.push("/profile")}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary-700 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-800"
        >
          Go to My Profile
          <ArrowRight className="h-4 w-4" />
        </button>
      </Card>
    );
  }

  if (done) {
    return (
      <Card className="mt-8 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
        <h2 className="mt-4 font-display text-xl font-bold text-neutral-900">
          Enrollment submitted!
        </h2>
        <p className="mt-2 text-neutral-500">
          Your enrollment is pending admin approval. You&rsquo;ll get access once
          approved.
        </p>
        <button
          onClick={() => router.push("/profile")}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary-700 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-800"
        >
          Go to My Profile
          <ArrowRight className="h-4 w-4" />
        </button>
      </Card>
    );
  }

  async function applyCoupon() {
    if (!couponInput.trim()) return;
    setCouponError("");
    setCouponChecking(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput, courseId: course.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.error ?? "Could not apply this coupon.");
        return;
      }
      setCoupon({
        code: data.code,
        discountPercent: data.discountPercent,
        payable: data.payable,
      });
      setCouponInput("");
      setAmountInput("");
    } finally {
      setCouponChecking(false);
    }
  }

  function removeCoupon() {
    setCoupon(null);
    setCouponError("");
    setAmountInput("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!Number.isInteger(amount) || amount < minimum) {
      setError(
        `Minimum first payment is 50% of the payable amount — at least ${taka(minimum)}.`
      );
      return;
    }
    if (amount > payable) {
      setError(`Amount can't exceed the payable total of ${taka(payable)}.`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: course.id,
          paymentMethod: "OFFLINE",
          offlinePaymentMethod: "bkash",
          offlineReference: reference,
          amountPaid: amount,
          couponCode: coupon?.code,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Submission failed. Please try again.");
        return;
      }

      setDone(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {/* Order summary */}
      <Card className="p-6">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-400">
          Order Summary
        </h2>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-neutral-700">{course.title}</span>
          <span
            className={
              coupon
                ? "text-sm text-neutral-400 line-through"
                : "font-display text-xl font-bold text-primary-700"
            }
          >
            {taka(course.price)}
          </span>
        </div>

        {coupon && (
          <>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 text-green-700">
                <TicketPercent className="h-4 w-4" />
                Coupon {coupon.code} (−{coupon.discountPercent}%)
                <button
                  type="button"
                  onClick={removeCoupon}
                  aria-label="Remove coupon"
                  className="ml-1 rounded-full p-0.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
              <span className="font-semibold text-green-700">
                −{taka(course.price - coupon.payable)}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-3">
              <span className="font-semibold text-neutral-900">Payable Total</span>
              <span className="font-display text-xl font-bold text-primary-700">
                {taka(payable)}
              </span>
            </div>
          </>
        )}

        {/* Coupon input */}
        {!coupon && (
          <div className="mt-5 border-t border-neutral-100 pt-4">
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-neutral-700">
              <TicketPercent className="h-4 w-4 text-neutral-400" />
              Have a coupon code?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                placeholder="e.g. WELCOME20"
                className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm uppercase outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
              <button
                type="button"
                onClick={applyCoupon}
                disabled={couponChecking || !couponInput.trim()}
                className="shrink-0 rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-700 disabled:opacity-50"
              >
                {couponChecking ? "Checking…" : "Apply"}
              </button>
            </div>
            {couponError && (
              <p className="mt-1.5 text-xs text-red-600">{couponError}</p>
            )}
          </div>
        )}
      </Card>

      {/* Payment: bKash only */}
      <Card className="p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-neutral-400">
          Payment Method
        </h2>

        <div className="space-y-4">
          <div className="rounded-xl border border-pink-200 bg-pink-50 p-4">
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-pink-600" />
              <p className="text-sm font-semibold text-neutral-900">bKash</p>
              <span className="ml-auto rounded-full bg-pink-100 px-2.5 py-0.5 text-[11px] font-semibold text-pink-700">
                Merchant
              </span>
            </div>
            <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-neutral-400">
              Send {taka(payable)} to
            </p>
            <p className="mt-1 text-2xl font-bold tracking-wide text-neutral-900">
              {BKASH_MERCHANT_NUMBER}
            </p>
            <p className="text-sm text-neutral-500">
              Use the &ldquo;Payment&rdquo; option in the bKash app for merchant numbers.
            </p>
          </div>

          {/* Partial payment policy */}
          <div className="flex items-start gap-2.5 rounded-xl border border-primary-100 bg-primary-50/60 p-3.5">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" />
            <p className="text-xs leading-relaxed text-primary-900">
              <span className="font-semibold">
                Yes, you can pay in installments!
              </span>{" "}
              Pay at least <span className="font-semibold">50% now</span>
              {" — "}that&rsquo;s {taka(minimum)}{" — "}and the rest before the
              course ends. Payments below 50% are not accepted.
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Amount You Sent (BDT)
            </label>
            <input
              type="number"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              required
              min={minimum}
              max={payable}
              step={1}
              placeholder={`Minimum ${minimum.toLocaleString("en-BD")}`}
              className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setAmountInput(String(minimum))}
                className="rounded-full border border-neutral-200 px-3.5 py-1.5 text-xs font-semibold text-neutral-700 transition hover:border-primary-300 hover:text-primary-700"
              >
                Pay 50% · {taka(minimum)}
              </button>
              <button
                type="button"
                onClick={() => setAmountInput(String(payable))}
                className="rounded-full border border-neutral-200 px-3.5 py-1.5 text-xs font-semibold text-neutral-700 transition hover:border-primary-300 hover:text-primary-700"
              >
                Pay Full · {taka(payable)}
              </button>
            </div>
            {amount >= minimum && amount < payable && (
              <p className="mt-2 text-xs text-amber-700">
                Remaining due after this payment: {taka(payable - amount)}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Transaction ID / Reference Number
            </label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              required
              placeholder="e.g. BKash TrxID 8XF9JK..."
              className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
            <p className="mt-1 text-xs text-neutral-400">
              After sending, enter your transaction/reference number here.
            </p>
          </div>

          <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <p className="text-xs text-amber-700">
              Admin will verify your payment and approve enrollment within 24
              hours.
            </p>
          </div>
        </div>
      </Card>

      {error && (
        <p className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-700 py-4 text-base font-semibold text-white transition hover:bg-primary-800 disabled:opacity-60"
      >
        {submitting ? "Submitting…" : "Submit Enrollment"}
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}
