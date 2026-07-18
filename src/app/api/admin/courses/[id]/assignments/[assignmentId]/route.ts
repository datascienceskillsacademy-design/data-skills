import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { isAdmin } from "@/lib/roles";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  title: z.string().trim().min(2).optional(),
  docLink: z.string().trim().min(1).optional(),
  order: z.number().int().optional(),
});

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || !isAdmin(session.user.role)) return null;
  return session;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { assignmentId } = await params;

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
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { assignmentId } = await params;

  try {
    await prisma.assignment.delete({ where: { id: assignmentId } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
