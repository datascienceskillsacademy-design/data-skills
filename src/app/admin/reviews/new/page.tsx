import { ReviewEditForm } from "../[id]/ReviewEditForm";

export default function NewReviewPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-neutral-900">New Review</h1>
      <p className="mt-1 text-neutral-500">Add a new student review.</p>
      <div className="mt-8">
        <ReviewEditForm review={null} />
      </div>
    </div>
  );
}
