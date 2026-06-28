import { Briefcase, MessageCircle, ShieldCheck, Trophy, Video, Workflow } from "lucide-react";
import { StaggerItem, StaggerList } from "@/components/motion/StaggerList";

const benefits = [
  {
    icon: Video,
    title: "Project-based learning",
    desc: "Every course ends in a portfolio-ready project, not a quiz.",
  },
  {
    icon: MessageCircle,
    title: "Instructor support",
    desc: "Ask questions and get real answers from working data professionals.",
  },
  {
    icon: Trophy,
    title: "Certificates that matter",
    desc: "Share verifiable certificates directly on LinkedIn.",
  },
  {
    icon: Workflow,
    title: "Structured learning paths",
    desc: "Go from beginner to job-ready with a clear, sequenced curriculum.",
  },
  {
    icon: Briefcase,
    title: "Career-focused curriculum",
    desc: "Built around the skills employers actually ask for.",
  },
  {
    icon: ShieldCheck,
    title: "Lifetime access",
    desc: "Revisit lessons and updates for as long as you need.",
  },
];

export function BenefitsGrid() {
  return (
    <StaggerList className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {benefits.map((b) => {
        const Icon = b.icon;
        return (
          <StaggerItem key={b.title}>
            <div className="flex h-full gap-4 rounded-3xl border border-neutral-200/70 bg-white p-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent-100 text-accent-600">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-semibold text-neutral-900">
                  {b.title}
                </h3>
                <p className="mt-1 text-sm text-neutral-500">{b.desc}</p>
              </div>
            </div>
          </StaggerItem>
        );
      })}
    </StaggerList>
  );
}
