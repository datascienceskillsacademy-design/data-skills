import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  link: z.string().trim().min(1),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: assignmentId } = await params;

  try {
    const body = await request.json();
    const { link } = schema.parse(body);

    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      select: { courseId: true },
    });
    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId: session.user.id, courseId: assignment.courseId },
      },
      select: { status: true },
    });
    if (!enrollment || !["APPROVED", "COMPLETED"].includes(enrollment.status)) {
      return NextResponse.json(
        { error: "You're not enrolled in this course" },
        { status: 403 }
      );
    }

    const submission = await prisma.assignmentSubmission.upsert({
      where: {
        assignmentId_userId: { assignmentId, userId: session.user.id },
      },
      update: { link, submittedAt: new Date() },
      create: { assignmentId, userId: session.user.id, link },
    });

    return NextResponse.json(submission);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
