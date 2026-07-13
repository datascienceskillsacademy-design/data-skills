import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ReviewEditForm } from "./ReviewEditForm";

type Props = { params: Promise<{ id: string }> };

export default async function AdminReviewEditPage({ params }: Props) {
  const { id } = await params;

  const isNew = id === "new";
  const review = isNew ? null : await prisma.review.findUnique({ where: { id } });

  if (!isNew && !review) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-neutral-900">
        {isNew ? "New Review" : "Edit Review"}
      </h1>
      <p className="mt-1 text-neutral-500">
        {isNew ? "Add a new student review." : `Editing review from: ${review?.authorName}`}
      </p>

      <div className="mt-8">
        <ReviewEditForm review={review} />
      </div>
    </div>
  );
}
