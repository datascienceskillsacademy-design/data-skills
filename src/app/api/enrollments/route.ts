import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import {
  couponProblem,
  discountedPrice,
  minimumFirstPayment,
  normalizeCouponCode,
} from "@/lib/coupons";

const schema = z.object({
  courseId: z.string(),
  paymentMethod: z.enum(["ONLINE", "OFFLINE"]),
  transactionId: z.string().optional(),
  offlinePaymentMethod: z.string().optional(),
  offlineReference: z.string().optional(),
  amountPaid: z.number().int().min(1),
  couponCode: z.string().optional(),
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

    const course = await prisma.course.findUnique({
      where: { id: data.courseId, isPublished: true },
      select: { price: true },
    });
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Resolve coupon (if any) and compute the final payable amount
    let coupon = null;
    if (data.couponCode?.trim()) {
      coupon = await prisma.coupon.findUnique({
        where: { code: normalizeCouponCode(data.couponCode) },
      });
      if (!coupon) {
        return NextResponse.json({ error: "Invalid coupon code." }, { status: 400 });
      }
      const problem = couponProblem(coupon);
      if (problem) {
        return NextResponse.json({ error: problem }, { status: 400 });
      }
    }

    const payable = coupon
      ? discountedPrice(course.price, coupon.discountPercent)
      : course.price;

    // Partial payment is allowed, but never less than 50% of the payable amount
    const minimum = minimumFirstPayment(payable);
    if (data.amountPaid < minimum) {
      return NextResponse.json(
        {
          error: `Minimum first payment is 50% — at least BDT ${minimum.toLocaleString(
            "en-BD"
          )}.`,
        },
        { status: 400 }
      );
    }
    if (data.amountPaid > payable) {
      return NextResponse.json(
        {
          error: `Amount can't exceed the payable total of BDT ${payable.toLocaleString(
            "en-BD"
          )}.`,
        },
        { status: 400 }
      );
    }

    const enrollment = await prisma.$transaction(async (tx) => {
      if (coupon) {
        await tx.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } },
        });
      }
      return tx.enrollment.create({
        data: {
          userId: session.user.id,
          courseId: data.courseId,
          paymentMethod: data.paymentMethod,
          transactionId: data.transactionId,
          offlinePaymentMethod: data.offlinePaymentMethod,
          offlineReference: data.offlineReference,
          amountPaid: data.amountPaid,
          payableAmount: payable,
          couponId: coupon?.id,
          couponCode: coupon?.code,
          discountPercent: coupon?.discountPercent,
          status: "PENDING",
        },
      });
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
