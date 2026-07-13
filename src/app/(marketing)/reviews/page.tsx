import type { Metadata } from "next";
import Image from "next/image";
import { Quote, Star, User } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { Card } from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Reviews — DataSkills",
  description: "Real stories from learners who changed their careers with DataSkills.",
};

export default async function ReviewsPage() {
  const reviews = await prisma.review.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="bg-linear-to-b from-primary-50 via-white to-white">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <FadeIn className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-600">
            Reviews
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold text-neutral-900 sm:text-5xl">
            Loved by learners worldwide
          </h1>
          <p className="mt-4 text-lg text-neutral-600">
            Real stories from people who changed their careers with us.
          </p>
        </FadeIn>

        {reviews.length === 0 ? (
          <div className="mt-16 text-center text-neutral-500">
            No reviews available yet. Check back soon.
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, i) => (
              <FadeIn key={review.id} delay={i * 0.04}>
                <Card className="flex h-full flex-col gap-4 p-8">
                  <Quote className="h-8 w-8 text-primary-200" />
                  <p className="flex-1 text-base text-neutral-700">
                    &ldquo;{review.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 border-t border-neutral-100 pt-4">
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-neutral-100">
                      {review.avatar ? (
                        <Image
                          src={review.avatar}
                          alt={review.authorName}
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
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-neutral-900">
                        {review.authorName}
                      </p>
                      <p className="truncate text-xs text-neutral-500">{review.authorRole}</p>
                    </div>
                    <div className="ml-auto flex shrink-0">
                      {Array.from({ length: review.rating }).map((_, j) => (
                        <Star key={j} className="h-3.5 w-3.5 fill-accent-400 text-accent-400" />
                      ))}
                    </div>
                  </div>
                </Card>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
