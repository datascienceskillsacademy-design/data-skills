import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { isAdmin } from "@/lib/roles";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(2).optional(),
  order: z.number().int().optional(),
  isCompleted: z.boolean().optional(),
});

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || !isAdmin(session.user.role)) return null;
  return session;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { moduleId } = await params;

  try {
    const body = await request.json();
    const data = schema.parse(body);

    const module_ = await prisma.courseModule.update({
      where: { id: moduleId },
      data,
      include: { course: { select: { slug: true } } },
    });

    revalidatePath("/courses");
    revalidatePath(`/courses/${module_.course.slug}`);
    revalidatePath("/");

    return NextResponse.json(module_);
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
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { moduleId } = await params;

  try {
    const module_ = await prisma.courseModule.delete({
      where: { id: moduleId },
      include: { course: { select: { slug: true } } },
    });

    revalidatePath("/courses");
    revalidatePath(`/courses/${module_.course.slug}`);
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
