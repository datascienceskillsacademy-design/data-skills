import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { InstructorEditForm } from "./InstructorEditForm";

type Props = { params: Promise<{ id: string }> };

export default async function AdminInstructorEditPage({ params }: Props) {
  const { id } = await params;

  const isNew = id === "new";
  const instructor = isNew
    ? null
    : await prisma.instructor.findUnique({ where: { id } });

  if (!isNew && !instructor) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-neutral-900">
        {isNew ? "New Instructor" : "Edit Instructor"}
      </h1>
      <p className="mt-1 text-neutral-500">
        {isNew ? "Add a new instructor profile." : `Editing: ${instructor?.name}`}
      </p>

      <div className="mt-8">
        <InstructorEditForm instructor={instructor} />
      </div>
    </div>
  );
}
