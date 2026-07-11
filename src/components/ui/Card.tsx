import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-neutral-200/70 bg-white shadow-sm shadow-neutral-900/5 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/20",
        className
      )}
      {...props}
    />
  );
}
