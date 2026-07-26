export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isInstructor } from "@/lib/roles";
import { instructorCourseIds } from "@/lib/courseAccess";
import { StudentsBoard } from "./StudentsBoard";

export default async function AdminStudentsPage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  const courseFilter = isInstructor(session.user.role)
    ? { id: { in: await instructorCourseIds(session.user.id) } }
    : {};

  const courses = await prisma.course.findMany({
    where: courseFilter,
    orderBy: { title: "asc" },
    select: {
      id: true,
      title: true,
      enrollments: {
        where: { status: { in: ["APPROVED", "COMPLETED"] } },
        orderBy: { enrolledAt: "desc" },
        select: {
          id: true,
          status: true,
          enrolledAt: true,
          user: { select: { id: true, name: true, email: true, phone: true } },
        },
      },
    },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-neutral-900">Students</h1>
      <p className="mt-1 text-neutral-500">
        See who&rsquo;s enrolled in each of your courses.
      </p>

      <div className="mt-8">
        <StudentsBoard courses={courses} />
      </div>
    </div>
  );
}
