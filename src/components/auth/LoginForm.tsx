"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("jordan@example.com");
  const [password, setPassword] = useState("demo1234");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Email address
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm text-neutral-900 outline-none transition-colors focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
          />
        </div>
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Password
          </label>
          <span className="cursor-pointer text-xs font-medium text-primary-600 hover:text-primary-700">
            Forgot password?
          </span>
        </div>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-10 pr-10 text-sm text-neutral-900 outline-none transition-colors focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
            aria-label="Toggle password visibility"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/40"
        >
          {error}
        </motion.p>
      )}

      <Button type="submit" disabled={loading} className="w-full" size="lg">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            Log in
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>

      <p className="text-center text-xs text-neutral-400">
        Demo mode — any email & password will sign you in.
      </p>
    </motion.form>
  );
}
