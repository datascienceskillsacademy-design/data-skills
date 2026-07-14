import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/roles";
import { renderCertificatePdf } from "@/lib/certificate";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ enrollmentId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { enrollmentId } = await params;

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      user: { select: { id: true, name: true } },
      course: {
        select: {
          title: true,
          status: true,
          durationLabel: true,
          classCount: true,
          classHours: true,
          updatedAt: true,
        },
      },
    },
  });

  if (!enrollment) {
    return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
  }

  const isOwner = enrollment.user.id === session.user.id;
  if (!isOwner && !isAdmin(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const enrollmentActive =
    enrollment.status === "APPROVED" || enrollment.status === "COMPLETED";
  if (!enrollmentActive || enrollment.course.status !== "COMPLETED") {
    return NextResponse.json(
      { error: "Certificate is not available for this enrollment yet" },
      { status: 403 }
    );
  }

  const founder = await prisma.instructor.findFirst({
    where: { isFounder: true },
    select: { name: true, role: true },
  });

  const completionDate = enrollment.course.updatedAt.toLocaleDateString(
    "en-US",
    { month: "long", day: "numeric", year: "numeric" }
  );

  const pdf = await renderCertificatePdf({
    studentName: enrollment.user.name ?? "Student",
    courseTitle: enrollment.course.title,
    durationLabel: enrollment.course.durationLabel,
    classCount: enrollment.course.classCount,
    classHours: enrollment.course.classHours,
    completionDate,
    certificateId: `DSA-${enrollment.id.slice(-8).toUpperCase()}`,
    signerName: founder?.name ?? null,
    signerRole: founder ? "FOUNDER & CHIEF INSTRUCTOR" : null,
  });

  const safeName = (enrollment.user.name ?? "student")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="DataSkills-Certificate-${safeName}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
