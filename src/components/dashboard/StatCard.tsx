import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function StatCard({
  icon: Icon,
  label,
  value,
  tone = "primary",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone?: "primary" | "accent";
}) {
  return (
    <Card className="flex items-center gap-4 p-5">
      <div
        className={
          tone === "primary"
            ? "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600"
            : "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent-100 text-accent-600"
        }
      >
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="font-display text-2xl font-bold text-neutral-900">{value}</p>
        <p className="text-xs text-neutral-500">{label}</p>
      </div>
    </Card>
  );
}
