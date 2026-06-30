"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Smartphone,
  Building2,
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/Card";

interface Course {
  id: string;
  title: string;
  price: number;
}

interface CheckoutClientProps {
  course: Course;
  existingEnrollment: { status: string } | null;
}

const offlineMethods = [
  {
    key: "bkash",
    label: "bKash",
    icon: Smartphone,
    color: "bg-pink-50 border-pink-200",
    account: "01711-000000",
    type: "Personal",
  },
  {
    key: "nagad",
    label: "Nagad",
    icon: Smartphone,
    color: "bg-orange-50 border-orange-200",
    account: "01711-111111",
    type: "Personal",
  },
  {
    key: "bank",
    label: "Bank Transfer",
    icon: Building2,
    color: "bg-blue-50 border-blue-200",
    account: "Bank Asia — AC: 1234567890",
    type: "Branch: Dhanmondi",
  },
] as const;

type OfflineKey = (typeof offlineMethods)[number]["key"];

export function CheckoutClient({ course, existingEnrollment }: CheckoutClientProps) {
  const router = useRouter();
  const [paymentMode, setPaymentMode] = useState<"online" | "offline">("offline");
  const [offlineMethod, setOfflineMethod] = useState<OfflineKey>("bkash");
  const [reference, setReference] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const body =
        paymentMode === "online"
          ? {
              courseId: course.id,
              paymentMethod: "ONLINE",
              transactionId: `SSL_DUMMY_${Date.now()}`,
            }
          : {
              courseId: course.id,
              paymentMethod: "OFFLINE",
              offlinePaymentMethod: offlineMethod,
              offlineReference: reference,
            };

      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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
          <span className="font-display text-xl font-bold text-primary-700">
            BDT {course.price.toLocaleString("en-BD")}
          </span>
        </div>
      </Card>

      {/* Payment method selection */}
      <Card className="p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-neutral-400">
          Payment Method
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setPaymentMode("online")}
            className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
              paymentMode === "online"
                ? "border-primary-500 bg-primary-50"
                : "border-neutral-200 hover:border-neutral-300"
            }`}
          >
            <CreditCard
              className={`h-5 w-5 ${paymentMode === "online" ? "text-primary-600" : "text-neutral-400"}`}
            />
            <div>
              <p className="text-sm font-semibold text-neutral-900">Online</p>
              <p className="text-xs text-neutral-400">SSLCommerz</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMode("offline")}
            className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
              paymentMode === "offline"
                ? "border-primary-500 bg-primary-50"
                : "border-neutral-200 hover:border-neutral-300"
            }`}
          >
            <Smartphone
              className={`h-5 w-5 ${paymentMode === "offline" ? "text-primary-600" : "text-neutral-400"}`}
            />
            <div>
              <p className="text-sm font-semibold text-neutral-900">Offline</p>
              <p className="text-xs text-neutral-400">bKash / Nagad / Bank</p>
            </div>
          </button>
        </div>

        {/* Online: dummy SSLCommerz */}
        {paymentMode === "online" && (
          <div className="mt-5 rounded-xl border border-dashed border-primary-200 bg-primary-50 p-5 text-center">
            <CreditCard className="mx-auto h-8 w-8 text-primary-400" />
            <p className="mt-2 text-sm font-medium text-primary-700">
              SSLCommerz Payment Gateway
            </p>
            <p className="mt-1 text-xs text-primary-500">
              (Demo mode — no real charge will be made)
            </p>
            <div className="mt-3 flex items-center justify-center gap-1 text-xs text-neutral-500">
              <Clock className="h-3.5 w-3.5" />
              Admin approval required after payment
            </div>
          </div>
        )}

        {/* Offline: bKash / Nagad / Bank */}
        {paymentMode === "offline" && (
          <div className="mt-5 space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {offlineMethods.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setOfflineMethod(m.key)}
                  className={`rounded-xl border p-3 text-center transition ${
                    offlineMethod === m.key
                      ? "border-primary-500 bg-primary-50"
                      : "border-neutral-200 hover:border-neutral-300 " + m.color
                  }`}
                >
                  <p className="text-xs font-semibold text-neutral-800">{m.label}</p>
                </button>
              ))}
            </div>

            {offlineMethods
              .filter((m) => m.key === offlineMethod)
              .map((m) => (
                <div
                  key={m.key}
                  className={`rounded-xl border p-4 ${m.color}`}
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                    Send BDT {course.price.toLocaleString("en-BD")} to
                  </p>
                  <p className="mt-1 text-base font-bold text-neutral-900">
                    {m.account}
                  </p>
                  <p className="text-sm text-neutral-500">{m.type}</p>
                </div>
              ))}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                Transaction ID / Reference Number
              </label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                required={paymentMode === "offline"}
                placeholder="e.g. BKash TrxID 8XF9JK..."
                className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
              <p className="mt-1 text-xs text-neutral-400">
                After sending, enter your transaction/reference number here.
              </p>
            </div>

            <div className="flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 p-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <p className="text-xs text-amber-700">
                Admin will verify your payment and approve enrollment within 24 hours.
              </p>
            </div>
          </div>
        )}
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
        {submitting
          ? "Submitting…"
          : paymentMode === "online"
          ? "Pay with SSLCommerz"
          : "Submit Enrollment"}
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}
