import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { isAdmin } from "@/lib/roles";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  title: z.string().trim().min(2),
  docLink: z.string().trim().min(1),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || !isAdmin(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: courseId } = await params;

  try {
    const body = await request.json();
    const { title, docLink } = schema.parse(body);

    const last = await prisma.assignment.findFirst({
      where: { courseId },
      orderBy: { order: "desc" },
    });

    const assignment = await prisma.assignment.create({
      data: { courseId, title, docLink, order: (last?.order ?? 0) + 1 },
    });

    return NextResponse.json(assignment, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
