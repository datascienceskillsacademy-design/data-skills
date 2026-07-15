export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { UserRoundCheck } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { ProfileForm } from "@/components/profile/ProfileForm";

export const metadata: Metadata = {
  title: "Complete Your Profile — Data Science Skills Academy",
};

export default async function CompleteProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/complete-profile");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      phone: true,
      designation: true,
      organization: true,
      role: true,
    },
  });
  if (!user) redirect("/login");

  const { next } = await searchParams;
  // Only allow internal redirect targets
  const nextPath = next?.startsWith("/") && !next.startsWith("//") ? next : "/profile";

  const complete =
    user.role !== "STUDENT" ||
    !!(user.name && user.phone && user.designation && user.organization);
  if (complete) redirect(nextPath);

  return (
    <div className="bg-linear-to-b from-primary-50 via-white to-white">
      <div className="mx-auto max-w-lg px-6 py-16 lg:px-8">
        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
            <UserRoundCheck className="h-7 w-7" />
          </span>
          <h1 className="mt-5 font-display text-3xl font-bold text-neutral-900">
            Complete Your Profile
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-neutral-500">
            Tell us a little about yourself so we can personalize your learning
            experience and issue your certificates correctly.
          </p>
        </div>

        <Card className="mt-8 p-6 sm:p-8">
          <ProfileForm
            email={user.email}
            initial={{
              name: user.name ?? "",
              phone: user.phone ?? "",
              designation: user.designation ?? "",
              organization: user.organization ?? "",
            }}
            submitLabel="Save & Continue"
            redirectTo={nextPath}
          />
        </Card>

        <p className="mt-4 text-center text-xs text-neutral-400">
          Your information is only used for course communication and
          certificates — it is never shared.
        </p>
      </div>
    </div>
  );
}
