import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const featuredOnly = request.nextUrl.searchParams.get("featured") === "true";

  const reviews = await prisma.review.findMany({
    where: {
      isPublished: true,
      ...(featuredOnly ? { isFeatured: true } : {}),
    },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(reviews);
}
