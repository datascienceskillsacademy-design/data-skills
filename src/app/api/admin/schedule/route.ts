import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { isStaff, isInstructor } from "@/lib/roles";
import { canManageCourse, instructorCourseIds } from "@/lib/courseAccess";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  courseId: z.string().min(1),
  title: z.string().min(2),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
  meetLink: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user || !isStaff(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const courseFilter = isInstructor(session.user.role)
    ? { id: { in: await instructorCourseIds(session.user.id) } }
    : {};

  const classes = await prisma.classSchedule.findMany({
    where: { course: courseFilter },
    include: { course: { select: { id: true, title: true, slug: true } } },
    orderBy: { startsAt: "asc" },
  });

  return NextResponse.json(classes);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const data = schema.parse(body);

    if (!(await canManageCourse(session.user.role, session.user.id, data.courseId))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (data.endsAt <= data.startsAt) {
      return NextResponse.json(
        { error: "End time must be after the start time." },
        { status: 400 }
      );
    }

    const classSchedule = await prisma.classSchedule.create({
      data,
      include: { course: { select: { id: true, title: true, slug: true } } },
    });

    revalidatePath("/profile");

    return NextResponse.json(classSchedule, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
