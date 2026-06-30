"use client";

import type { ElementType } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  GraduationCap,
  MonitorPlay,
  Tag,
} from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { instructors } from "@/lib/data/instructors";

const instructorMeta: Record<
  string,
  { badge: string; StatIcon: ElementType; stat: string; credential: string }
> = {
  "instr-gias": {
    badge: "Chief Trainer",
    StatIcon: GraduationCap,
    stat: "30+ Years Experience",
    credential:
      "Former Pro Vice Chancellor, NSU · WHO South-East Asia Technical Advisor · Research partnerships with Johns Hopkins, Oxford & Cambridge",
  },
  "instr-ahmed": {
    badge: "Co-Instructor",
    StatIcon: BookOpen,
    stat: "118+ Publications",
    credential:
      "Professor of Healthcare Management, University of Sharjah · PhD, University of Toronto · Published in The Lancet & JAMA",
  },
};

export function Hero() {
  return (
    <section className="overflow-hidden bg-white">
      {/* ── Top: centered copy ── */}
      <div className="relative bg-linear-to-b from-primary-50 via-primary-50/40 to-white px-6 pb-16 pt-20 text-center lg:pt-28">
        <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-primary-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-accent-200/25 blur-3xl" />

        <div className="relative mx-auto max-w-3xl">
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
            className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-neutral-500"
          >
            An 8-week live online programme for doctors, nurses &amp; healthcare
            managers — no prior coding or data experience needed.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.28 }}
            className="mt-7 flex flex-wrap justify-center gap-x-7 gap-y-2.5 text-sm text-neutral-500"
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
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            <LinkButton href="/course#enroll" size="lg">
              Enroll Now — BDT 8,000
              <ArrowRight className="h-4 w-4" />
            </LinkButton>
            <LinkButton href="/course" variant="outline" size="lg">
              View Full Course
            </LinkButton>
          </motion.div>
        </div>
      </div>

      {/* ── Bottom: two equal instructor panels ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="grid grid-cols-1 border-t border-neutral-100 sm:grid-cols-2"
      >
        {instructors.map((instructor, i) => {
          const meta = instructorMeta[instructor.id];
          return (
            <div
              key={instructor.id}
              className="relative flex flex-col items-center bg-white px-8 py-14 text-center sm:px-10"
            >
              {/* Divider between panels */}
              {i === 0 && (
                <div className="absolute inset-y-0 right-0 hidden w-px bg-neutral-100 sm:block" />
              )}

              {/* Photo */}
              <div className="h-36 w-36 overflow-hidden rounded-full ring-4 ring-primary-100 ring-offset-4 ring-offset-white">
                <Image
                  src={instructor.avatar}
                  alt={instructor.name}
                  width={144}
                  height={144}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Badge + stat */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                <span className="rounded-full bg-primary-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white">
                  {meta.badge}
                </span>
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-primary-600">
                  <meta.StatIcon className="h-3.5 w-3.5" />
                  {meta.stat}
                </span>
              </div>

              {/* Name & role */}
              <h2 className="mt-4 font-display text-2xl font-bold leading-snug text-neutral-900">
                {instructor.name}
              </h2>
              <p className="mt-1 text-sm font-medium text-neutral-400">
                {instructor.role}
              </p>

              {/* Credential */}
              <p className="mt-5 max-w-xs text-sm leading-relaxed text-neutral-500">
                {meta.credential}
              </p>
            </div>
          );
        })}
      </motion.div>
    </section>
  );
}
