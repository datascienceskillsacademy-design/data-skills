import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { canManageCourse } from "@/lib/courseAccess";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  courseId: z.string().min(1).optional(),
  title: z.string().min(2).optional(),
  startsAt: z.coerce.date().optional(),
  endsAt: z.coerce.date().optional(),
  meetLink: z.string().optional(),
  notes: z.string().optional(),
});

async function requireScheduleAccess(id: string) {
  const session = await auth();
  if (!session?.user) return null;

  const existing = await prisma.classSchedule.findUnique({
    where: { id },
    select: { courseId: true },
  });
  if (!existing) return null;

  const allowed = await canManageCourse(session.user.role, session.user.id, existing.courseId);
  return allowed ? session : null;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!(await requireScheduleAccess(id))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const data = schema.parse(body);

    if (data.startsAt && data.endsAt && data.endsAt <= data.startsAt) {
      return NextResponse.json(
        { error: "End time must be after the start time." },
        { status: 400 }
      );
    }

    const classSchedule = await prisma.classSchedule.update({
      where: { id },
      data,
      include: { course: { select: { id: true, title: true, slug: true } } },
    });

    revalidatePath("/profile");

    return NextResponse.json(classSchedule);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!(await requireScheduleAccess(id))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await prisma.classSchedule.delete({ where: { id } });
    revalidatePath("/profile");
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
