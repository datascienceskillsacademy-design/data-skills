import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CourseEditForm } from "./CourseEditForm";
import { ModulesManager } from "./ModulesManager";

type Props = { params: Promise<{ id: string }> };

export default async function AdminCourseEditPage({ params }: Props) {
  const { id } = await params;

  const isNew = id === "new";
  const [course, availableInstructors] = await Promise.all([
    isNew
      ? Promise.resolve(null)
      : prisma.course.findUnique({
          where: { id },
          include: {
            modules: { orderBy: { order: "asc" } },
            instructorAssignments: { select: { userId: true } },
          },
        }),
    prisma.user.findMany({
      where: { role: "INSTRUCTOR" },
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!isNew && !course) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-neutral-900">
        {isNew ? "New Course" : "Edit Course"}
      </h1>
      <p className="mt-1 text-neutral-500">
        {isNew ? "Create a new course." : `Editing: ${course?.title}`}
      </p>

      <div className="mt-8">
        <CourseEditForm
          course={course}
          availableInstructors={availableInstructors}
          assignedInstructorIds={course?.instructorAssignments.map((a) => a.userId) ?? []}
        />
      </div>

      {course && (
        <div className="mt-8">
          <ModulesManager courseId={course.id} modules={course.modules} />
        </div>
      )}
    </div>
  );
}
