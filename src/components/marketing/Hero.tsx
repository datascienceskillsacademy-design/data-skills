"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, MonitorPlay, Tag, User } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { EnrollButton } from "@/components/marketing/EnrollButton";
import type { Instructor } from "@/generated/prisma/client";

interface HeroProps {
  instructors: Instructor[];
  primaryCourse: { id: string; slug: string } | null;
}

export function Hero({ instructors, primaryCourse }: HeroProps) {
  const [first, second] = instructors;

  return (
    <section className="overflow-hidden bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 py-20 lg:grid-cols-2 lg:gap-8 lg:py-28 lg:px-8">
        {/* ── Left: copy ── */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-primary-700 shadow-sm"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary-500" />
            Now Enrolling · Batch Starting Soon
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="mt-5 font-display text-4xl font-bold leading-[1.1] tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl"
          >
            Healthcare AI &amp; Analytics
            <span className="mt-1 block text-primary-600">
              No Code. Real Impact.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 max-w-xl text-lg leading-relaxed text-neutral-500"
          >
            An 8-week live online programme for doctors, nurses &amp; healthcare
            managers — no prior coding or data experience needed.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.28 }}
            className="mt-7 flex flex-wrap gap-x-7 gap-y-2.5 text-sm text-neutral-500"
          >
            {[
              { icon: CalendarDays, label: "2 Months · 16 Live Sessions" },
              { icon: MonitorPlay, label: "2 Hours per Class · Live Online" },
              { icon: Tag, label: "BDT 8,000" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="h-4 w-4 shrink-0 text-primary-500" />
                <span>{label}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.36 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            {primaryCourse ? (
              <EnrollButton courseId={primaryCourse.id} size="lg">
                Enroll Now — BDT 8,000
                <ArrowRight className="h-4 w-4" />
              </EnrollButton>
            ) : (
              <LinkButton href="/courses" size="lg">
                Browse Courses
                <ArrowRight className="h-4 w-4" />
              </LinkButton>
            )}
            <LinkButton
              href={primaryCourse ? `/courses/${primaryCourse.slug}` : "/courses"}
              variant="outline"
              size="lg"
            >
              View Full Course
            </LinkButton>
          </motion.div>
        </div>

        {/* ── Right: featured instructors ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto aspect-square w-full max-w-lg"
        >
          {/* Dotted grid backdrop */}
          <div
            className="absolute inset-0 rounded-4xl bg-neutral-50"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgb(0 0 0 / 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgb(0 0 0 / 0.06) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* Gradient blob */}
          <div className="absolute right-[4%] top-1/2 h-[78%] w-[78%] -translate-y-1/2 rounded-full bg-linear-to-br from-primary-700 via-primary-500 to-accent-400" />

          {/* Instructor photo 1 */}
          {first && (
            <div className="absolute left-[6%] top-[10%] aspect-3/4 w-[55%] overflow-hidden rounded-2xl bg-neutral-100 shadow-2xl shadow-primary-900/20 ring-4 ring-white">
              {first.avatar ? (
                <Image
                  src={first.avatar}
                  alt={first.name}
                  width={320}
                  height={420}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-neutral-300">
                  <User className="h-12 w-12" />
                </div>
              )}
            </div>
          )}

          {/* Instructor photo 2 */}
          {second && (
            <div className="absolute bottom-[8%] right-[4%] aspect-3/4 w-[48%] overflow-hidden rounded-2xl bg-neutral-100 shadow-2xl shadow-primary-900/20 ring-4 ring-white">
              {second.avatar ? (
                <Image
                  src={second.avatar}
                  alt={second.name}
                  width={280}
                  height={370}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-neutral-300">
                  <User className="h-10 w-10" />
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
