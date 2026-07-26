import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { canManageCourse } from "@/lib/courseAccess";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { assignmentId } = await params;

  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    include: {
      submissions: {
        include: { user: { select: { id: true, name: true, email: true } } },
      },
      course: {
        select: {
          title: true,
          enrollments: {
            where: { status: { in: ["APPROVED", "COMPLETED"] } },
            include: { user: { select: { id: true, name: true, email: true } } },
          },
        },
      },
    },
  });

  if (!assignment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!(await canManageCourse(session.user.role, session.user.id, assignment.courseId))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const submissionByUserId = new Map(assignment.submissions.map((s) => [s.userId, s]));

  const students = assignment.course.enrollments.map((e) => {
    const submission = submissionByUserId.get(e.user.id);
    return {
      userId: e.user.id,
      name: e.user.name,
      email: e.user.email,
      link: submission?.link ?? null,
      submittedAt: submission?.submittedAt ?? null,
    };
  });

  students.sort((a, b) => {
    if (!!a.link === !!b.link) return (a.name ?? a.email).localeCompare(b.name ?? b.email);
    return a.link ? -1 : 1;
  });

  return NextResponse.json({
    assignmentTitle: assignment.title,
    courseTitle: assignment.course.title,
    students,
  });
}
