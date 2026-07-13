export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { ScheduleCalendar } from "./ScheduleCalendar";

export default async function AdminSchedulePage() {
  const [courses, classSchedules] = await Promise.all([
    prisma.course.findMany({
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    }),
    prisma.classSchedule.findMany({
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
