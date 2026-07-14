export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProfileView } from "@/components/profile/ProfileView";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      enrollments: {
        include: {
          course: {
            include: {
              modules: { orderBy: { order: "asc" } },
              classSchedules: { orderBy: { startsAt: "asc" } },
            },
          },
        },
        orderBy: { enrolledAt: "desc" },
      },
    },
  });

  if (!user) redirect("/login");

  return <ProfileView user={user} />;
}
