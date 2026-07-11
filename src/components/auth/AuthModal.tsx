"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  defaultTab?: "signin" | "signup";
}

export function AuthModal({ open, onClose, defaultTab = "signin" }: AuthModalProps) {
  const [tab, setTab] = useState<"signin" | "signup">(defaultTab);

  useEffect(() => {
    setTab(defaultTab);
  }, [defaultTab]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl dark:bg-neutral-900">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-8">
          <div className="mb-6 flex rounded-xl bg-neutral-100 p-1 dark:bg-neutral-800">
            {(["signin", "signup"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
                  tab === t
                    ? "bg-white text-primary-700 shadow-sm dark:bg-neutral-700"
                    : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                }`}
              >
                {t === "signin" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          {tab === "signin" ? (
            <SignInForm onSuccess={onClose} />
          ) : (
            <SignUpForm onSuccess={() => setTab("signin")} />
          )}
        </div>
      </div>
    </div>
  );
}
