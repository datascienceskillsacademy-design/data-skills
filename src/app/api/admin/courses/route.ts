import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  slug: z.string().min(3),
  title: z.string().min(3),
  subtitle: z.string().optional(),
  description: z.string().min(10),
  thumbnail: z.string().url().optional(),
  price: z.number().int().min(0),
  originalPrice: z.number().int().optional(),
  durationLabel: z.string(),
  classCount: z.number().int().min(1),
  classHours: z.number().int().min(1),
  batchSize: z.string(),
  level: z.string(),
  category: z.string(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const data = schema.parse(body);

    const course = await prisma.course.create({ data });
    revalidatePath("/courses");
    revalidatePath("/");
    return NextResponse.json(course, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
