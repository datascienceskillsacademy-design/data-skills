import { prisma } from "@/lib/prisma";
import { isAdmin, isInstructor } from "@/lib/roles";
import type { Role } from "@/generated/prisma/client";

/** Whether `role`/`userId` may manage course content (assignments, schedule) for `courseId`. */
export async function canManageCourse(
  role: Role | null | undefined,
  userId: string,
  courseId: string
): Promise<boolean> {
  if (isAdmin(role)) return true;
  if (!isInstructor(role)) return false;

  const link = await prisma.courseInstructor.findUnique({
    where: { courseId_userId: { courseId, userId } },
  });
  return !!link;
}

/** Course ids `userId` (an INSTRUCTOR) is assigned to teach. */
export async function instructorCourseIds(userId: string): Promise<string[]> {
  const links = await prisma.courseInstructor.findMany({
    where: { userId },
    select: { courseId: true },
  });
  return links.map((l) => l.courseId);
}
