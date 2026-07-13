import { InstructorEditForm } from "../[id]/InstructorEditForm";

export default function NewInstructorPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-neutral-900">New Instructor</h1>
      <p className="mt-1 text-neutral-500">Add a new instructor profile.</p>
      <div className="mt-8">
        <InstructorEditForm instructor={null} />
      </div>
    </div>
  );
}
