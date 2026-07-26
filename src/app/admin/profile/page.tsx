export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { ProfileSettingsForm } from "./ProfileSettingsForm";

export default async function AdminProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, designation: true },
  });
  if (!user) redirect("/");

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-neutral-900">My Profile</h1>
      <p className="mt-1 text-neutral-500">Update your account details.</p>

      <div className="mt-8 max-w-lg">
        <Card className="p-6">
          <ProfileSettingsForm
            initial={{
              name: user.name ?? "",
              email: user.email,
              designation: user.designation ?? "",
            }}
          />
        </Card>
      </div>
    </div>
  );
}
