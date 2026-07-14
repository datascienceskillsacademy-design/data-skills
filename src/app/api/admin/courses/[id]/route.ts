import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { isAdmin } from "@/lib/roles";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(3).optional(),
  subtitle: z.string().optional(),
  description: z.string().min(10).optional(),
  thumbnail: z.string().optional(),
  price: z.number().int().min(0).optional(),
  originalPrice: z.number().int().optional(),
  durationLabel: z.string().optional(),
  classCount: z.number().int().optional(),
  classHours: z.number().int().optional(),
  batchSize: z.string().optional(),
  level: z.string().optional(),
  category: z.string().optional(),
  whatsappLink: z.string().optional(),
  meetLink: z.string().optional(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  status: z.enum(["UPCOMING", "RUNNING", "COMPLETED"]).optional(),
});

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || !isAdmin(session.user.role)) return null;
  return session;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const data = schema.parse(body);

    const course = await prisma.course.update({ where: { id }, data });
    revalidatePath("/courses");
    revalidatePath(`/courses/${course.slug}`);
    revalidatePath("/");
    return NextResponse.json(course);
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
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const course = await prisma.course.delete({ where: { id } });
    revalidatePath("/courses");
    revalidatePath(`/courses/${course.slug}`);
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
