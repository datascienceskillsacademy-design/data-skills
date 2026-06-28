"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 via-white to-white">
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary-200/40 blur-3xl" />
      <div className="absolute -right-24 top-40 h-80 w-80 rounded-full bg-accent-200/40 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-28">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-4 py-1.5 text-sm font-medium text-primary-700 shadow-sm"
          >
            <Sparkles className="h-4 w-4" />
            New cohorts starting every week
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-balance font-display text-4xl font-bold leading-[1.1] tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl"
          >
            Master data science.
            <span className="block text-primary-600">Build a career, not just a portfolio.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-lg text-balance text-lg text-neutral-600"
          >
            Hands-on courses in Python, machine learning, and analytics — taught
            by instructors who&rsquo;ve shipped real products. Learn by doing, get
            hired faster.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <LinkButton href="/courses" size="lg">
              Explore Courses
              <ArrowRight className="h-4 w-4" />
            </LinkButton>
            <LinkButton href="/login" variant="outline" size="lg">
              Student Login
            </LinkButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex items-center gap-4"
          >
            <div className="flex -space-x-3">
              {[
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=100&auto=format&fit=crop",
              ].map((src) => (
                <div
                  key={src}
                  className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-white"
                >
                  <Image src={src} alt="Student" fill className="object-cover" sizes="40px" />
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
                Loved by <span className="font-semibold text-neutral-800">85,000+</span> learners
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto aspect-square w-full max-w-md"
        >
          <div className="absolute inset-4 rounded-[2.5rem] bg-gradient-to-br from-primary-600 to-primary-800" />
          <div className="absolute inset-0 overflow-hidden rounded-[3rem] border-8 border-white shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=900&auto=format&fit=crop"
              alt="Student learning data science"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 90vw, 480px"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="absolute -left-6 top-10 rounded-2xl bg-white p-4 shadow-xl"
          >
            <p className="text-xs text-neutral-400">Course progress</p>
            <p className="font-display text-lg font-bold text-primary-700">78%</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="absolute -right-4 bottom-10 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-xl"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-100 text-accent-600">
              <Star className="h-4 w-4 fill-current" />
            </div>
            <div>
              <p className="text-xs text-neutral-400">Rated</p>
              <p className="text-sm font-semibold text-neutral-800">4.8 / 5.0</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
