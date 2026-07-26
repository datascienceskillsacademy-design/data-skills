import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { isStaff } from "@/lib/roles";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your full name"),
  email: z.string().trim().toLowerCase().email("Please enter a valid email"),
  designation: z.string().trim().min(2, "Please enter your designation"),
});

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user || !isStaff(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = schema.parse(body);

    const existing = await prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true },
    });
    if (existing && existing.id !== session.user.id) {
      return NextResponse.json({ error: "That email is already in use." }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data,
      select: { id: true, name: true, email: true, designation: true },
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
