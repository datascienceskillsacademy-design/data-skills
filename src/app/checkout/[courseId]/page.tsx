import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CheckoutClient } from "./CheckoutClient";

type Props = { params: Promise<{ courseId: string }> };

export default async function CheckoutPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { courseId } = await params;
  const course = await prisma.course.findUnique({
    where: { id: courseId, isPublished: true },
  });

  if (!course) notFound();

  // Check if already enrolled
  const existing = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: { userId: session.user.id, courseId: course.id },
    },
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-neutral-900">
          Enrollment Checkout
        </h1>
        <p className="mt-2 text-neutral-500">
          You&rsquo;re enrolling in{" "}
          <span className="font-semibold text-neutral-800">{course.title}</span>
        </p>

        <CheckoutClient
          course={{ id: course.id, title: course.title, price: course.price }}
          existingEnrollment={existing ? { status: existing.status } : null}
        />
      </div>
    </div>
  );
}
