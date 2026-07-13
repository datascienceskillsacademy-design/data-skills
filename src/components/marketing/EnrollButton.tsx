"use client";

import type { ReactNode } from "react";
import { useEnroll } from "@/components/auth/EnrollModalProvider";
import { Button, type Variant, type Size } from "@/components/ui/Button";

interface EnrollButtonProps {
  courseId: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

/**
 * Drop-in replacement for LinkButton on any "Enroll" CTA. Goes straight to
 * checkout when signed in; otherwise opens the sign-in modal and continues
 * to checkout automatically once authenticated — no intermediate pages.
 */
export function EnrollButton({ courseId, variant, size, className, children }: EnrollButtonProps) {
  const { goToCheckout } = useEnroll();

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      onClick={(e) => {
        // Safe even when not nested in a Link — prevents any ancestor
        // anchor/card click handlers from also firing.
        e.preventDefault();
        e.stopPropagation();
        goToCheckout(courseId);
      }}
    >
      {children}
    </Button>
  );
}
