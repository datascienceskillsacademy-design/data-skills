import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  authorName: z.string().min(2).optional(),
  authorRole: z.string().min(2).optional(),
  avatar: z.string().optional(),
  quote: z.string().min(10).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  isFeatured: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  order: z.number().int().optional(),
});

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") return null;
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

    const review = await prisma.review.update({ where: { id }, data });
    revalidatePath("/reviews");
    revalidatePath("/");
    return NextResponse.json(review);
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
    await prisma.review.delete({ where: { id } });
    revalidatePath("/reviews");
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
