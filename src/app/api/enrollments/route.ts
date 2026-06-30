import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  courseId: z.string(),
  paymentMethod: z.enum(["ONLINE", "OFFLINE"]),
  transactionId: z.string().optional(),
  offlinePaymentMethod: z.string().optional(),
  offlineReference: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = schema.parse(body);

    const existing = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId: data.courseId } },
    });
    if (existing) {
      return NextResponse.json({ error: "Already enrolled" }, { status: 409 });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        userId: session.user.id,
        courseId: data.courseId,
        paymentMethod: data.paymentMethod,
        transactionId: data.transactionId,
        offlinePaymentMethod: data.offlinePaymentMethod,
        offlineReference: data.offlineReference,
        status: "PENDING",
      },
    });

    return NextResponse.json(enrollment, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
