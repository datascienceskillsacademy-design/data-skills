import { FadeIn } from "@/components/motion/FadeIn";

const stats = [
  { value: "85,000+", label: "Students taught" },
  { value: "6", label: "Career-track courses" },
  { value: "4.8/5", label: "Average rating" },
  { value: "92%", label: "Job-ready in 6 months" },
];

export function StatsStrip() {
  return (
    <div className="rounded-3xl bg-gradient-to-r from-primary-700 via-primary-600 to-primary-700 px-6 py-10 shadow-xl shadow-primary-900/20 sm:px-12">
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
        {stats.map((stat, i) => (
          <FadeIn key={stat.label} delay={i * 0.08} className="text-center">
            <p className="font-display text-3xl font-bold text-white sm:text-4xl">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-primary-100">{stat.label}</p>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
