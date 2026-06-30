import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CourseEditForm } from "./CourseEditForm";

type Props = { params: Promise<{ id: string }> };

export default async function AdminCourseEditPage({ params }: Props) {
  const { id } = await params;

  const isNew = id === "new";
  const course = isNew
    ? null
    : await prisma.course.findUnique({ where: { id } });

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
        <CourseEditForm course={course} />
      </div>
    </div>
  );
}
