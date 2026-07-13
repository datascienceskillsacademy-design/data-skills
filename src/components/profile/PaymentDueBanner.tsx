import { AlertCircle, MessageCircle } from "lucide-react";
import { BKASH_MERCHANT_NUMBER, SUPPORT_WHATSAPP_NUMBER } from "@/lib/payment";

interface PaymentDueBannerProps {
  name: string;
  email: string;
  courseTitle: string;
  coursePrice: number;
  amountPaid: number;
}

export function PaymentDueBanner({
  name,
  email,
  courseTitle,
  coursePrice,
  amountPaid,
}: PaymentDueBannerProps) {
  const due = Math.max(coursePrice - amountPaid, 0);
  if (due <= 0) return null;

  const message = `Hi, I'm ${name} (${email}). I have a due payment of BDT ${due.toLocaleString(
    "en-BD"
  )} for ${courseTitle} (paid BDT ${amountPaid.toLocaleString(
    "en-BD"
  )} of BDT ${coursePrice.toLocaleString("en-BD")}). I've sent this via bKash — please confirm once verified.`;
  const whatsappHref = `https://wa.me/${SUPPORT_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  return (
    <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-amber-900">
            Payment Due: BDT {due.toLocaleString("en-BD")}
          </p>
          <p className="mt-0.5 text-xs text-amber-700">
            You&rsquo;ve paid BDT {amountPaid.toLocaleString("en-BD")} of BDT{" "}
            {coursePrice.toLocaleString("en-BD")}. Send the rest via bKash to complete your
            payment.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <div className="rounded-lg border border-amber-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-900">
              bKash (Merchant): {BKASH_MERCHANT_NUMBER}
            </div>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full bg-amber-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-amber-700"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Notify Us After Paying
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
