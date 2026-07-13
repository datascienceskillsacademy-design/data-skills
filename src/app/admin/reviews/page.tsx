export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Plus, Star, User } from "lucide-react";
import { ReviewRowActions } from "./ReviewRowActions";

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900">Reviews</h1>
          <p className="mt-1 text-neutral-500">Manage student reviews and testimonials.</p>
        </div>
        <Link
          href="/admin/reviews/new"
          className="flex items-center gap-2 rounded-full bg-primary-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-800"
        >
          <Plus className="h-4 w-4" />
          New Review
        </Link>
      </div>

      <Card className="mt-8 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50">
              <th className="px-5 py-3 text-left font-medium text-neutral-500">Author</th>
              <th className="px-5 py-3 text-left font-medium text-neutral-500">Quote</th>
              <th className="px-5 py-3 text-left font-medium text-neutral-500">Rating</th>
              <th className="px-5 py-3 text-left font-medium text-neutral-500">Status</th>
              <th className="px-5 py-3 text-left font-medium text-neutral-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id} className="border-b border-neutral-50 hover:bg-neutral-50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-neutral-100">
                      {review.avatar ? (
                        <Image
                          src={review.avatar}
                          alt={review.authorName}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-neutral-300">
                          <User className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-neutral-900">{review.authorName}</div>
                      <div className="text-xs text-neutral-400">{review.authorRole}</div>
                    </div>
                  </div>
                </td>
                <td className="max-w-xs px-5 py-3">
                  <p className="line-clamp-2 text-neutral-600">{review.quote}</p>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-accent-400 text-accent-400" />
                    ))}
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        review.isPublished
                          ? "bg-green-100 text-green-700"
                          : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {review.isPublished ? "Visible" : "Hidden"}
                    </span>
                    {review.isFeatured && (
                      <span className="inline-flex rounded-full bg-accent-100 px-2.5 py-0.5 text-xs font-semibold text-accent-700">
                        Featured
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3">
                  <ReviewRowActions review={review} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {reviews.length === 0 && (
          <p className="px-5 py-8 text-center text-sm text-neutral-400">
            No reviews yet.
          </p>
        )}
      </Card>
    </div>
  );
}
