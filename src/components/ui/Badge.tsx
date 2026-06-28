import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "primary" | "accent" | "neutral" | "success";

const toneClasses: Record<Tone, string> = {
  primary: "bg-primary-50 text-primary-700",
  accent: "bg-accent-100 text-accent-700",
  neutral: "bg-neutral-100 text-neutral-600",
  success: "bg-emerald-50 text-emerald-700",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
