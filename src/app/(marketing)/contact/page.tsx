import type { Metadata } from "next";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { Card } from "@/components/ui/Card";
import { SITE_CONTACT } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us — Data Science Skills Academy",
  description:
    "Get in touch with Data Science Skills Academy — reach us on WhatsApp, phone, or email. We're here to help with courses, enrollment, and support.",
};

const whatsappHref = `https://wa.me/${SITE_CONTACT.whatsappNumber}?text=${encodeURIComponent(
  "Hi! I'd like to know more about Data Science Skills Academy."
)}`;

export default function ContactPage() {
  return (
    <div className="bg-linear-to-b from-primary-50 via-white to-white">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        {/* Hero */}
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-600">
            Get In Touch
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold text-neutral-900 sm:text-5xl">
            Contact Us
          </h1>
          <p className="mt-4 text-lg text-neutral-600">
            Have a question about our courses, enrollment, or corporate
            training? We&apos;d love to hear from you.
          </p>
        </FadeIn>

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.2fr]">
          {/* Contact channels */}
          <div className="flex flex-col gap-5">
            <FadeIn>
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                    <MessageCircle className="h-5 w-5" />
                  </span>
                  <div className="flex-1">
                    <h2 className="font-display text-base font-bold text-neutral-900">
                      WhatsApp
                    </h2>
                    <p className="mt-1 text-sm text-neutral-500">
                      Fastest way to reach us — chat with our support team
                      directly.
                    </p>
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Chat on WhatsApp
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </Card>
            </FadeIn>

            <FadeIn delay={0.05}>
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                    <Phone className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-display text-base font-bold text-neutral-900">
                      Phone
                    </h2>
                    <p className="mt-1 text-sm text-neutral-500">
                      Call us during office hours for admissions and support.
                    </p>
                    <a
                      href={SITE_CONTACT.phoneHref}
                      className="mt-2 inline-block text-sm font-semibold text-primary-700 hover:text-primary-800"
                    >
                      {SITE_CONTACT.phone}
                    </a>
                  </div>
                </div>
              </Card>
            </FadeIn>

            <FadeIn delay={0.1}>
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent-50 text-accent-600">
                    <Mail className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-display text-base font-bold text-neutral-900">
                      Email
                    </h2>
                    <p className="mt-1 text-sm text-neutral-500">
                      Send us your questions — we usually reply within one
                      business day.
                    </p>
                    <a
                      href={`mailto:${SITE_CONTACT.email}`}
                      className="mt-2 inline-block text-sm font-semibold text-primary-700 hover:text-primary-800"
                    >
                      {SITE_CONTACT.email}
                    </a>
                  </div>
                </div>
              </Card>
            </FadeIn>

            <FadeIn delay={0.15}>
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                    <Clock className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-display text-base font-bold text-neutral-900">
                      Office Hours
                    </h2>
                    <p className="mt-1 text-sm text-neutral-500">
                      {SITE_CONTACT.officeHours}
                    </p>
                  </div>
                </div>
              </Card>
            </FadeIn>
          </div>

          {/* Map */}
          <FadeIn delay={0.1}>
            <Card className="flex h-full flex-col overflow-hidden">
              <div className="flex items-center gap-3 border-b border-neutral-100 px-6 py-4">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <MapPin className="h-4 w-4" />
                </span>
                <div>
                  <h2 className="font-display text-sm font-bold text-neutral-900">
                    Our Location
                  </h2>
                  <p className="text-xs text-neutral-500">
                    {SITE_CONTACT.addressLines.join(", ")}
                  </p>
                </div>
              </div>
              <iframe
                title="Data Science Skills Academy location"
                src={SITE_CONTACT.mapEmbedSrc}
                className="min-h-[380px] w-full flex-1 border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Card>
          </FadeIn>
        </div>
      </div>

      {/* Floating WhatsApp button */}
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-2xl shadow-green-900/30 transition-transform hover:scale-105 hover:bg-green-700 active:scale-95"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-green-500 opacity-75" />
        <MessageCircle className="relative h-6 w-6" />
      </a>
    </div>
  );
}
