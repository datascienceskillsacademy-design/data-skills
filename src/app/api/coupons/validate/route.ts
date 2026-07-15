import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import {
  couponProblem,
  discountedPrice,
  normalizeCouponCode,
} from "@/lib/coupons";

const schema = z.object({
  code: z.string().min(1),
  courseId: z.string(),
});

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { code, courseId } = schema.parse(body);

    const coupon = await prisma.coupon.findUnique({
      where: { code: normalizeCouponCode(code) },
    });
    if (!coupon) {
      return NextResponse.json({ error: "Invalid coupon code." }, { status: 404 });
    }

    const problem = couponProblem(coupon);
    if (problem) {
      return NextResponse.json({ error: problem }, { status: 400 });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { price: true },
    });
    if (!course) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    return NextResponse.json({
      code: coupon.code,
      discountPercent: coupon.discountPercent,
      description: coupon.description,
      payable: discountedPrice(course.price, coupon.discountPercent),
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
