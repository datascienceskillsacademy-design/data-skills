"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, MonitorPlay, Star } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";

const avatars = [
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=100&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=100&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=100&auto=format&fit=crop",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 via-white to-white">
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary-200/40 blur-3xl" />
      <div className="absolute -right-24 top-40 h-80 w-80 rounded-full bg-accent-200/40 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-28">
        {/* ── Left: copy ── */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-4 py-1.5 text-sm font-medium text-primary-700 shadow-sm"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary-500" />
            Now Enrolling · Batch Starting Soon
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-balance font-display text-4xl font-bold leading-[1.1] tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl"
          >
            Healthcare AI &amp; Analytics
            <span className="mt-2 block text-primary-600">
              No Code. Real Impact.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-lg text-balance text-lg text-neutral-600"
          >
            A practical 8-week live online programme for doctors, nurses, and
            healthcare managers — learn to analyse patient data, build dashboards,
            and apply AI tools without writing a single line of code.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <LinkButton href="/course" size="lg">
              View Full Course
              <ArrowRight className="h-4 w-4" />
            </LinkButton>
            <LinkButton href="/course#enroll" variant="outline" size="lg">
              Enroll Now — BDT 8,000
            </LinkButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex items-center gap-4"
          >
            <div className="flex -space-x-3">
              {avatars.map((src) => (
                <div
                  key={src}
                  className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-white"
                >
                  <Image src={src} alt="Healthcare professional" fill className="object-cover" sizes="40px" />
                </div>
              ))}
            </div>
            <div>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent-400 text-accent-400" />
                ))}
              </div>
              <p className="text-sm text-neutral-500">
                Taught by experts with{" "}
                <span className="font-semibold text-neutral-800">30+ years</span>{" "}
                in healthcare academia
              </p>
            </div>
          </motion.div>
        </div>

        {/* ── Right: image ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto aspect-square w-full max-w-md"
        >
          <div className="absolute inset-4 rounded-[2.5rem] bg-gradient-to-br from-primary-600 to-primary-800" />
          <div className="absolute inset-0 overflow-hidden rounded-[3rem] border-8 border-white shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1551190822-a9333d879b1f?q=80&w=900&auto=format&fit=crop"
              alt="Healthcare professional using AI analytics"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 90vw, 480px"
            />
          </div>

          {/* Floating card: No Coding */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="absolute -left-6 top-10 flex items-center gap-2 rounded-2xl bg-white p-4 shadow-xl"
          >
            <CheckCircle className="h-5 w-5 text-primary-600" />
            <div>
              <p className="text-xs text-neutral-400">Requirement</p>
              <p className="text-sm font-bold text-neutral-900">No Coding Needed</p>
            </div>
          </motion.div>

          {/* Floating card: Live Classes */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="absolute -right-4 bottom-10 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-xl"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100">
              <MonitorPlay className="h-4 w-4 text-primary-600" />
            </div>
            <div>
              <p className="text-xs text-neutral-400">Programme</p>
              <p className="text-sm font-semibold text-neutral-800">16 Live Classes</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
