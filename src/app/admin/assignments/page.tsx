export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { AssignmentsBoard } from "./AssignmentsBoard";

export default async function AdminAssignmentsPage() {
  const courses = await prisma.course.findMany({
    orderBy: { title: "asc" },
    select: {
      id: true,
      title: true,
      _count: {
        select: { enrollments: { where: { status: { in: ["APPROVED", "COMPLETED"] } } } },
      },
      assignments: {
        orderBy: { order: "asc" },
        include: { _count: { select: { submissions: true } } },
      },
    },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-neutral-900">Assignments</h1>
      <p className="mt-1 text-neutral-500">
        Manage assignment briefs and review student submissions, course by course.
      </p>

      <div className="mt-8">
        <AssignmentsBoard courses={courses} />
      </div>
    </div>
  );
}
