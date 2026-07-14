import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { isStaff } from "@/lib/roles";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "COMPLETED"]).optional(),
  amountPaid: z.number().int().min(0).optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || !isStaff(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { status, amountPaid } = schema.parse(body);

    const enrollment = await prisma.enrollment.update({
      where: { id },
      data: {
        status,
        amountPaid,
        approvedAt: status === "APPROVED" ? new Date() : undefined,
      },
    });

    return NextResponse.json(enrollment);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
