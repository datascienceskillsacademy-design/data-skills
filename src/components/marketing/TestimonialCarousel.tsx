"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, Quote, User } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import type { Review } from "@/generated/prisma/client";

export function TestimonialCarousel({ testimonials }: { testimonials: Review[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync initial slide index from the embla instance on mount
    onSelect();
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {testimonials.map((t) => (
            <div key={t.id} className="min-w-0 shrink-0 grow-0 basis-full px-2 md:basis-1/2">
              <Card className="flex h-full flex-col gap-4 p-8">
                <Quote className="h-8 w-8 text-primary-200" />
                <p className="flex-1 text-base text-neutral-700">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3 border-t border-neutral-100 pt-4">
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-neutral-100">
                    {t.avatar ? (
                      <Image
                        src={t.avatar}
                        alt={t.authorName}
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-neutral-300">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">{t.authorName}</p>
                    <p className="text-xs text-neutral-500">{t.authorRole}</p>
                  </div>
                  <div className="ml-auto flex">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-accent-400 text-accent-400" />
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={() => emblaApi?.scrollPrev()}
          aria-label="Previous testimonial"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-100"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex gap-1.5">
          {testimonials.map((t, i) => (
            <span
              key={t.id}
              className={cn(
                "h-1.5 w-6 rounded-full transition-colors",
                i === selected ? "bg-primary-600" : "bg-neutral-200"
              )}
            />
          ))}
        </div>
        <button
          onClick={() => emblaApi?.scrollNext()}
          aria-label="Next testimonial"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-100"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
