export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { BookOpen, Users, ClipboardList, Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";

export default async function AdminOverviewPage() {
  const [totalCourses, totalUsers, pendingEnrollments, totalEnrollments] =
    await Promise.all([
      prisma.course.count(),
      prisma.user.count(),
      prisma.enrollment.count({ where: { status: "PENDING" } }),
      prisma.enrollment.count(),
    ]);

  const stats = [
    { label: "Total Courses", value: totalCourses, icon: BookOpen, color: "bg-blue-50 text-blue-600" },
    { label: "Total Users", value: totalUsers, icon: Users, color: "bg-purple-50 text-purple-600" },
    { label: "Total Enrollments", value: totalEnrollments, icon: ClipboardList, color: "bg-green-50 text-green-600" },
    { label: "Pending Review", value: pendingEnrollments, icon: Clock, color: "bg-amber-50 text-amber-600" },
  ];

  const recentEnrollments = await prisma.enrollment.findMany({
    take: 8,
    orderBy: { enrolledAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      course: { select: { title: true } },
    },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-neutral-900">Overview</h1>
      <p className="mt-1 text-neutral-500">Welcome to the admin dashboard.</p>

      <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="p-6">
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="mt-4 font-display text-3xl font-bold text-neutral-900">{value}</p>
            <p className="mt-1 text-sm text-neutral-500">{label}</p>
          </Card>
        ))}
      </div>

      <h2 className="mt-12 font-display text-lg font-bold text-neutral-900">
        Recent Enrollments
      </h2>
      <Card className="mt-4 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50">
              <th className="px-5 py-3 text-left font-medium text-neutral-500">Student</th>
              <th className="px-5 py-3 text-left font-medium text-neutral-500">Course</th>
              <th className="px-5 py-3 text-left font-medium text-neutral-500">Status</th>
              <th className="px-5 py-3 text-left font-medium text-neutral-500">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentEnrollments.map((e) => (
              <tr key={e.id} className="border-b border-neutral-50 hover:bg-neutral-50">
                <td className="px-5 py-3">
                  <div className="font-medium text-neutral-900">{e.user.name}</div>
                  <div className="text-xs text-neutral-400">{e.user.email}</div>
                </td>
                <td className="px-5 py-3 text-neutral-700">{e.course.title}</td>
                <td className="px-5 py-3">
                  <StatusBadge status={e.status} />
                </td>
                <td className="px-5 py-3 text-neutral-400">
                  {new Date(e.enrolledAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {recentEnrollments.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-neutral-400">
                  No enrollments yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-700",
    APPROVED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
    COMPLETED: "bg-blue-100 text-blue-700",
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${map[status] ?? "bg-neutral-100 text-neutral-700"}`}>
      {status}
    </span>
  );
}
