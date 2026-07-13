"use client";

import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AuthModal } from "./AuthModal";

interface EnrollContextValue {
  /** Navigate to checkout for this course — prompts login first if needed. */
  goToCheckout: (courseId: string) => void;
}

const EnrollContext = createContext<EnrollContextValue | null>(null);

export function EnrollModalProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { status } = useSession();
  const [authOpen, setAuthOpen] = useState(false);
  const [pendingCourseId, setPendingCourseId] = useState<string | null>(null);

  function goToCheckout(courseId: string) {
    if (status === "authenticated") {
      router.push(`/checkout/${courseId}`);
    } else {
      setPendingCourseId(courseId);
      setAuthOpen(true);
    }
  }

  function handleAuthSuccess() {
    setAuthOpen(false);
    if (pendingCourseId) {
      router.push(`/checkout/${pendingCourseId}`);
      setPendingCourseId(null);
    }
  }

  return (
    <EnrollContext.Provider value={{ goToCheckout }}>
      {children}
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </EnrollContext.Provider>
  );
}

export function useEnroll() {
  const ctx = useContext(EnrollContext);
  if (!ctx) {
    throw new Error("useEnroll must be used within an EnrollModalProvider");
  }
  return ctx;
}
