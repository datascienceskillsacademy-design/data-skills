"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface SignInFormProps {
  onSuccess?: () => void;
}

export function SignInForm({ onSuccess }: SignInFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.refresh();
    onSuccess?.();
  }

  async function handleGoogle() {
    await signIn("google", { callbackUrl: "/" });
  }

  return (
    <div className="space-y-5">
      <button
        onClick={handleGoogle}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-neutral-200 bg-white py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
      >
        <GoogleIcon />
        Continue with Google
      </button>

      <div className="flex items-center gap-3">
        <div className="flex-1 border-t border-neutral-200 dark:border-neutral-700" />
        <span className="text-xs text-neutral-400">or</span>
        <div className="flex-1 border-t border-neutral-200 dark:border-neutral-700" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600 dark:bg-red-950/40">
            {error}
          </p>
        )}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:ring-primary-900"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:ring-primary-900"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-primary-700 py-3 text-sm font-semibold text-white transition hover:bg-primary-800 disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
