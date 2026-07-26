import { prisma } from "@/lib/prisma";
import { CourseEditForm } from "../[id]/CourseEditForm";

export default async function NewCoursePage() {
  const availableInstructors = await prisma.user.findMany({
    where: { role: "INSTRUCTOR" },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-neutral-900">New Course</h1>
      <p className="mt-1 text-neutral-500">Create a new course.</p>
      <div className="mt-8">
        <CourseEditForm course={null} availableInstructors={availableInstructors} />
      </div>
    </div>
  );
}
