export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isInstructor } from "@/lib/roles";
import { instructorCourseIds } from "@/lib/courseAccess";
import { ScheduleCalendar } from "./ScheduleCalendar";

export default async function AdminSchedulePage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  const courseFilter = isInstructor(session.user.role)
    ? { id: { in: await instructorCourseIds(session.user.id) } }
    : {};

  const [courses, classSchedules] = await Promise.all([
    prisma.course.findMany({
      where: courseFilter,
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    }),
    prisma.classSchedule.findMany({
      where: { course: courseFilter },
      include: { course: { select: { id: true, title: true, slug: true } } },
      orderBy: { startsAt: "asc" },
    }),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-neutral-900">Class Schedule</h1>
      <p className="mt-1 text-neutral-500">
        Schedule live classes for any course. Enrolled students see these on their profile.
      </p>

      <div className="mt-8">
        <ScheduleCalendar courses={courses} initialClasses={classSchedules} />
      </div>
    </div>
  );
}
