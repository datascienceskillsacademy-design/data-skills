import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { isAdmin, isSuperAdmin } from "@/lib/roles";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  role: z.enum(["STUDENT", "STUDENT_SUPPORT", "INSTRUCTOR", "ADMIN", "SUPER_ADMIN"]),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || !isAdmin(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { role } = schema.parse(body);

    const target = await prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });
    if (!target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Only a super admin can grant SUPER_ADMIN or change a super admin's role
    if (
      (role === "SUPER_ADMIN" || target.role === "SUPER_ADMIN") &&
      !isSuperAdmin(session.user.role)
    ) {
      return NextResponse.json(
        { error: "Only a super admin can manage the SUPER_ADMIN role" },
        { status: 403 }
      );
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json(user);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
