import Image from "next/image";
import { Link2, Mail, Globe } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { Instructor } from "@/lib/types";

export function InstructorCard({ instructor }: { instructor: Instructor }) {
  return (
    <Card className="flex flex-col items-center gap-4 p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-900/10">
      <div className="relative h-24 w-24 overflow-hidden rounded-full ring-4 ring-primary-50">
        <Image
          src={instructor.avatar}
          alt={instructor.name}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>
      <div>
        <h3 className="font-display text-base font-semibold text-neutral-900">
          {instructor.name}
        </h3>
        <p className="text-sm text-primary-600">{instructor.role}</p>
      </div>
      <p className="text-sm text-neutral-500">{instructor.bio}</p>
      <div className="flex gap-3 pt-1">
        {instructor.socials.linkedin && (
          <Link2 className="h-4 w-4 text-neutral-400 transition-colors hover:text-primary-600" />
        )}
        {instructor.socials.twitter && (
          <Globe className="h-4 w-4 text-neutral-400 transition-colors hover:text-primary-600" />
        )}
        {instructor.socials.github && (
          <Mail className="h-4 w-4 text-neutral-400 transition-colors hover:text-primary-600" />
        )}
      </div>
    </Card>
  );
}
