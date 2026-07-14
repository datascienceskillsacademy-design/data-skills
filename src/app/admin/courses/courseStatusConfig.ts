import { Rocket, PlayCircle, Award } from "lucide-react";
import type { CourseStatus } from "@/generated/prisma/client";

export const courseStatusConfig: Record<
  CourseStatus,
  {
    label: string;
    description: string;
    icon: typeof Rocket;
    badge: string;
    ring: string;
  }
> = {
  UPCOMING: {
    label: "Upcoming",
    description: "Enrollment is open but classes haven't started yet.",
    icon: Rocket,
    badge: "bg-blue-100 text-blue-700",
    ring: "border-blue-200 bg-blue-50 text-blue-700",
  },
  RUNNING: {
    label: "Running",
    description: "Classes are currently in progress.",
    icon: PlayCircle,
    badge: "bg-green-100 text-green-700",
    ring: "border-green-200 bg-green-50 text-green-700",
  },
  COMPLETED: {
    label: "Completed",
    description:
      "The batch has finished — students can download their certificates.",
    icon: Award,
    badge: "bg-primary-100 text-primary-700",
    ring: "border-primary-200 bg-primary-50 text-primary-700",
  },
};
