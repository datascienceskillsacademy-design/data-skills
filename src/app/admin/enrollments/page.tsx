export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { EnrollmentAdminControls } from "./EnrollmentAdminControls";

export default async function AdminEnrollmentsPage() {
  const enrollments = await prisma.enrollment.findMany({
    orderBy: { enrolledAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      course: { select: { title: true, price: true } },
    },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-neutral-900">
        Enrollments
      </h1>
      <p className="mt-1 text-neutral-500">
        Review and approve student enrollments.
      </p>

      <Card className="mt-8 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50">
              <th className="px-5 py-3 text-left font-medium text-neutral-500">Student</th>
              <th className="px-5 py-3 text-left font-medium text-neutral-500">Course</th>
              <th className="px-5 py-3 text-left font-medium text-neutral-500">Payment</th>
              <th className="px-5 py-3 text-left font-medium text-neutral-500">Reference</th>
              <th className="px-5 py-3 text-left font-medium text-neutral-500">Date</th>
              <th className="px-5 py-3 text-left font-medium text-neutral-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((e) => (
              <tr key={e.id} className="border-b border-neutral-50 hover:bg-neutral-50">
                <td className="px-5 py-3">
                  <div className="font-medium text-neutral-900">{e.user.name}</div>
                  <div className="text-xs text-neutral-400">{e.user.email}</div>
                </td>
                <td className="px-5 py-3 text-neutral-700 max-w-48">
                  <p className="truncate">{e.course.title}</p>
                </td>
                <td className="px-5 py-3">
                  <div className="text-xs font-medium text-neutral-700">
                    {e.paymentMethod}
                  </div>
                  {e.offlinePaymentMethod && (
                    <div className="text-xs text-neutral-400 capitalize">
                      {e.offlinePaymentMethod}
                    </div>
                  )}
                </td>
                <td className="px-5 py-3 text-xs text-neutral-500">
                  {e.transactionId ?? e.offlineReference ?? "—"}
                </td>
                <td className="px-5 py-3 text-xs text-neutral-400">
                  {new Date(e.enrolledAt).toLocaleDateString()}
                </td>
                <td className="px-5 py-3">
                  <EnrollmentAdminControls
                    enrollmentId={e.id}
                    currentStatus={e.status}
                    coursePrice={e.course.price}
                    initialAmountPaid={e.amountPaid}
                  />
                </td>
              </tr>
            ))}
            {enrollments.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-neutral-400">
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
