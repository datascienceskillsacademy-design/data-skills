import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { GraduationCap, Star } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Log in — DataSkills",
  description: "Log in to your DataSkills student dashboard.",
};

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-neutral-950">
      <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-primary-600/30 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-accent-500/20 blur-3xl" />

      <div className="relative z-10 flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600">
              <GraduationCap className="h-5 w-5" />
            </span>
            DataSkills
          </Link>

          <div className="mt-10 rounded-3xl bg-white p-8 shadow-2xl">
            <h1 className="font-display text-2xl font-bold text-neutral-900">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Log in to continue your learning journey.
            </p>

            <div className="mt-6">
              <LoginForm />
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-neutral-400">
            New here?{" "}
            <Link href="/courses" className="font-medium text-white hover:underline">
              Browse courses
            </Link>{" "}
            to get started.
          </p>
        </div>
      </div>

      <div className="relative hidden w-1/2 lg:block">
        <Image
          src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop"
          alt="Student studying data science"
          fill
          priority
          className="object-cover"
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />

        <div className="absolute bottom-12 left-12 right-12 rounded-3xl bg-white/10 p-6 backdrop-blur-md">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-accent-400 text-accent-400" />
            ))}
          </div>
          <p className="mt-3 text-lg font-medium text-white">
            &ldquo;DataSkills gave me the structure I needed to actually finish
            what I started — and land a job because of it.&rdquo;
          </p>
          <p className="mt-3 text-sm text-white/70">Sarah Mitchell, Data Analyst</p>
        </div>
      </div>
    </div>
  );
}
