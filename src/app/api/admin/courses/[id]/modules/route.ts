import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { isAdmin } from "@/lib/roles";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(2),
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
    const { title } = schema.parse(body);

    const last = await prisma.courseModule.findFirst({
      where: { courseId },
      orderBy: { order: "desc" },
    });

    const module_ = await prisma.courseModule.create({
      data: { courseId, title, order: (last?.order ?? 0) + 1 },
    });

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (course) {
      revalidatePath("/courses");
      revalidatePath(`/courses/${course.slug}`);
      revalidatePath("/");
    }

    return NextResponse.json(module_, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
