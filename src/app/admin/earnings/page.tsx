export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import {
  Wallet,
  AlertCircle,
  TrendingUp,
  CheckCircle2,
  TicketPercent,
} from "lucide-react";

const taka = (n: number) => `৳${n.toLocaleString("en-US")}`;

export default async function AdminEarningsPage() {
  // Only verified (approved/completed) enrollments count toward earnings
  const enrollments = await prisma.enrollment.findMany({
    where: { status: { in: ["APPROVED", "COMPLETED"] } },
    orderBy: { enrolledAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      course: { select: { id: true, title: true, price: true } },
    },
  });

  const rows = enrollments.map((e) => {
    const payable = e.payableAmount ?? e.course.price;
    const paid = e.amountPaid ?? 0;
    return { ...e, payable, paid, due: Math.max(payable - paid, 0) };
  });

  const collected = rows.reduce((sum, r) => sum + r.paid, 0);
  const due = rows.reduce((sum, r) => sum + r.due, 0);
  const expected = rows.reduce((sum, r) => sum + r.payable, 0);
  const fullyPaid = rows.filter((r) => r.due === 0).length;
  const withDue = rows.length - fullyPaid;

  // Per-course breakdown
  const byCourse = new Map<
    string,
    { title: string; count: number; collected: number; due: number }
  >();
  for (const r of rows) {
    const entry = byCourse.get(r.course.id) ?? {
      title: r.course.title,
      count: 0,
      collected: 0,
      due: 0,
    };
    entry.count += 1;
    entry.collected += r.paid;
    entry.due += r.due;
    byCourse.set(r.course.id, entry);
  }

  const tiles = [
    {
      label: "Total collected",
      value: taka(collected),
      sub: `across ${rows.length} verified enrollments`,
      icon: Wallet,
      chip: "bg-green-50 text-green-600",
    },
    {
      label: "Total due",
      value: taka(due),
      sub: `${withDue} enrollment${withDue === 1 ? "" : "s"} with balance`,
      icon: AlertCircle,
      chip: "bg-amber-50 text-amber-600",
    },
    {
      label: "Expected revenue",
      value: taka(expected),
      sub: "collected + outstanding dues",
      icon: TrendingUp,
      chip: "bg-primary-50 text-primary-600",
    },
    {
      label: "Fully paid",
      value: `${fullyPaid} / ${rows.length}`,
      sub: "enrollments cleared in full",
      icon: CheckCircle2,
      chip: "bg-blue-50 text-blue-600",
    },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-neutral-900">Earnings</h1>
      <p className="mt-1 text-neutral-500">
        Money collected and outstanding dues from verified enrollments.
      </p>

      {/* Summary */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map(({ label, value, sub, icon: Icon, chip }) => (
          <Card key={label} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-neutral-500">{label}</p>
                <p className="mt-1.5 font-display text-2xl font-bold text-neutral-900">
                  {value}
                </p>
              </div>
              <span
                className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${chip}`}
              >
                <Icon className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-2 text-xs text-neutral-400">{sub}</p>
          </Card>
        ))}
      </div>

      {/* Per-course breakdown */}
      <h2 className="mt-10 font-display text-lg font-bold text-neutral-900">
        By Course
      </h2>
      <Card className="mt-4 overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50">
              <th className="px-5 py-3 text-left font-medium text-neutral-500">Course</th>
              <th className="px-5 py-3 text-right font-medium text-neutral-500">Enrollments</th>
              <th className="px-5 py-3 text-right font-medium text-neutral-500">Collected</th>
              <th className="px-5 py-3 text-right font-medium text-neutral-500">Due</th>
            </tr>
          </thead>
          <tbody>
            {[...byCourse.values()].map((c) => (
              <tr key={c.title} className="border-b border-neutral-50">
                <td className="px-5 py-3 font-medium text-neutral-900">{c.title}</td>
                <td className="px-5 py-3 text-right tabular-nums text-neutral-700">
                  {c.count}
                </td>
                <td className="px-5 py-3 text-right font-semibold tabular-nums text-green-700">
                  {taka(c.collected)}
                </td>
                <td
                  className={`px-5 py-3 text-right font-semibold tabular-nums ${
                    c.due > 0 ? "text-amber-600" : "text-neutral-400"
                  }`}
                >
                  {taka(c.due)}
                </td>
              </tr>
            ))}
            {byCourse.size === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-neutral-400">
                  No verified enrollments yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </Card>

      {/* Detailed */}
      <h2 className="mt-10 font-display text-lg font-bold text-neutral-900">
        Detailed
      </h2>
      <Card className="mt-4 overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50">
              <th className="px-5 py-3 text-left font-medium text-neutral-500">Student</th>
              <th className="px-5 py-3 text-left font-medium text-neutral-500">Course</th>
              <th className="px-5 py-3 text-left font-medium text-neutral-500">Coupon</th>
              <th className="px-5 py-3 text-right font-medium text-neutral-500">Payable</th>
              <th className="px-5 py-3 text-right font-medium text-neutral-500">Paid</th>
              <th className="px-5 py-3 text-right font-medium text-neutral-500">Due</th>
              <th className="px-5 py-3 text-left font-medium text-neutral-500">Payment</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-neutral-50 hover:bg-neutral-50">
                <td className="px-5 py-3">
                  <div className="font-medium text-neutral-900">
                    {r.user.name ?? "—"}
                  </div>
                  <div className="text-xs text-neutral-400">{r.user.email}</div>
                </td>
                <td className="px-5 py-3 text-neutral-700">{r.course.title}</td>
                <td className="px-5 py-3">
                  {r.couponCode ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-700">
                      <TicketPercent className="h-3 w-3" />
                      {r.couponCode} (−{r.discountPercent}%)
                    </span>
                  ) : (
                    <span className="text-xs text-neutral-300">—</span>
                  )}
                </td>
                <td className="px-5 py-3 text-right tabular-nums text-neutral-700">
                  {taka(r.payable)}
                </td>
                <td className="px-5 py-3 text-right font-semibold tabular-nums text-green-700">
                  {taka(r.paid)}
                </td>
                <td
                  className={`px-5 py-3 text-right font-semibold tabular-nums ${
                    r.due > 0 ? "text-amber-600" : "text-neutral-400"
                  }`}
                >
                  {taka(r.due)}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      r.due === 0
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {r.due === 0 ? "PAID IN FULL" : "PARTIAL"}
                  </span>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-neutral-400">
                  No verified enrollments yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </Card>
    </div>
  );
}
