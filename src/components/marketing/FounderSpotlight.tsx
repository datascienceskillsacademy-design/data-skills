import Image from "next/image";
import { Link2, Quote, Globe } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import type { Instructor } from "@/lib/types";

export function FounderSpotlight({ founder }: { founder: Instructor }) {
  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
      <FadeIn>
        <div className="relative mx-auto aspect-4/5 w-full max-w-sm">
          <div className="absolute -inset-3 rounded-[2.5rem] bg-linear-to-br from-accent-200 to-primary-200" />
          <div className="absolute inset-0 overflow-hidden rounded-4xl border-4 border-white shadow-2xl">
            <Image
              src={founder.avatar}
              alt={founder.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 80vw, 400px"
            />
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <Quote className="h-10 w-10 text-primary-200" />
        <p className="mt-4 text-balance font-display text-2xl font-semibold leading-snug text-neutral-900 sm:text-3xl">
          &ldquo;Healthcare professionals who understand data are not just better
          clinicians &mdash; they become architects of healthier systems, smarter
          policies, and more equitable care.&rdquo;
        </p>
        <div className="mt-6 flex items-center gap-3">
          <div>
            <p className="font-semibold text-neutral-900">{founder.name}</p>
            <p className="text-sm text-primary-600">{founder.role}</p>
          </div>
          <div className="ml-auto flex gap-3">
            <Link2 className="h-4 w-4 text-neutral-400 transition-colors hover:text-primary-600" />
            <Globe className="h-4 w-4 text-neutral-400 transition-colors hover:text-primary-600" />
          </div>
        </div>
        <p className="mt-6 text-sm text-neutral-500">{founder.bio}</p>
      </FadeIn>
    </div>
  );
}
