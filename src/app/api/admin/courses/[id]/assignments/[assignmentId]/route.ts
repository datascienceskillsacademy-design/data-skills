import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { canManageCourse } from "@/lib/courseAccess";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  title: z.string().trim().min(2).optional(),
  docLink: z.string().trim().min(1).optional(),
  moduleId: z.string().nullable().optional(),
  order: z.number().int().optional(),
});

async function requireAssignmentAccess(assignmentId: string) {
  const session = await auth();
  if (!session?.user) return null;

  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    select: { courseId: true },
  });
  if (!assignment) return null;

  const allowed = await canManageCourse(
    session.user.role,
    session.user.id,
    assignment.courseId
  );
  return allowed ? session : null;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  const { assignmentId } = await params;

  if (!(await requireAssignmentAccess(assignmentId))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const data = schema.parse(body);

    const assignment = await prisma.assignment.update({
      where: { id: assignmentId },
      data,
    });

    return NextResponse.json(assignment);
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
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  const { assignmentId } = await params;

  if (!(await requireAssignmentAccess(assignmentId))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await prisma.assignment.delete({ where: { id: assignmentId } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
