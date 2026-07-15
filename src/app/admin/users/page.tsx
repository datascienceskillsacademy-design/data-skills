export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { UserRoleSelect } from "./UserRoleSelect";
import { UserDetailsModal } from "./UserDetailsModal";
import { auth } from "@/auth";
import Image from "next/image";
import { User } from "lucide-react";

export default async function AdminUsersPage() {
  const session = await auth();
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { enrollments: true } },
      enrollments: {
        orderBy: { enrolledAt: "desc" },
        include: { course: { select: { title: true } } },
      },
    },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-neutral-900">Users</h1>
      <p className="mt-1 text-neutral-500">
        Manage all users and their roles.
      </p>

      <Card className="mt-8 overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50">
              <th className="px-5 py-3 text-left font-medium text-neutral-500">User</th>
              <th className="px-5 py-3 text-left font-medium text-neutral-500">Enrollments</th>
              <th className="px-5 py-3 text-left font-medium text-neutral-500">Joined</th>
              <th className="px-5 py-3 text-left font-medium text-neutral-500">Role</th>
              <th className="px-5 py-3 text-left font-medium text-neutral-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-neutral-50 hover:bg-neutral-50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100">
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt={user.name ?? ""}
                          width={32}
                          height={32}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-4 w-4 text-primary-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-neutral-900">{user.name ?? "—"}</div>
                      <div className="text-xs text-neutral-400">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-neutral-700">
                  {user._count.enrollments}
                </td>
                <td className="px-5 py-3 text-neutral-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-5 py-3">
                  <UserRoleSelect
                    userId={user.id}
                    currentRole={user.role}
                    isSelf={user.id === session?.user.id}
                    canManageSuperAdmin={session?.user.role === "SUPER_ADMIN"}
                  />
                </td>
                <td className="px-5 py-3">
                  <UserDetailsModal user={user} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </Card>
    </div>
  );
}
