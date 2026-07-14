export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Users,
  ClipboardList,
  Clock,
  Wallet,
  CheckCircle2,
  XCircle,
  CalendarDays,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Video,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { EnrollmentTrendChart, Sparkline, type TrendPoint } from "./OverviewCharts";

const DAY = 24 * 60 * 60 * 1000;

function countBetween(dates: Date[], from: Date, to: Date) {
  return dates.filter((d) => d >= from && d < to).length;
}

/** Chronological counts for the trailing `weeks` 7-day windows ending now. */
function weeklyBuckets(dates: Date[], now: Date, weeks = 12) {
  const buckets = Array(weeks).fill(0);
  for (const d of dates) {
    const idx = weeks - 1 - Math.floor((now.getTime() - d.getTime()) / (7 * DAY));
    if (idx >= 0 && idx < weeks) buckets[idx] += 1;
  }
  return buckets;
}

function formatTaka(n: number) {
  return `৳${n.toLocaleString("en-US")}`;
}

export default async function AdminOverviewPage() {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [
    totalStudents,
    totalEnrollments,
    statusCounts,
    revenueAgg,
    recentEnrollmentRows,
    recentStudentRows,
    upcomingClasses,
    recentEnrollments,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.enrollment.count(),
    prisma.enrollment.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.enrollment.aggregate({
      _sum: { amountPaid: true },
      where: { status: "APPROVED" },
    }),
    prisma.enrollment.findMany({
      where: { enrolledAt: { gte: sixMonthsAgo } },
      select: { enrolledAt: true, status: true, amountPaid: true },
    }),
    prisma.user.findMany({
      where: { role: "STUDENT", createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true },
    }),
    prisma.classSchedule.findMany({
      where: { startsAt: { gte: now } },
      orderBy: { startsAt: "asc" },
      take: 4,
      include: { course: { select: { title: true } } },
    }),
    prisma.enrollment.findMany({
      take: 6,
      orderBy: { enrolledAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true } },
      },
    }),
  ]);

  const byStatus = Object.fromEntries(
    statusCounts.map((s) => [s.status, s._count._all])
  );
  const approved = byStatus.APPROVED ?? 0;
  const pending = byStatus.PENDING ?? 0;
  const rejected = byStatus.REJECTED ?? 0;
  const revenue = revenueAgg._sum.amountPaid ?? 0;

  // ── Trend: monthly buckets, last 6 months ─────────────────────────────────
  const enrollmentDates = recentEnrollmentRows.map((r) => r.enrolledAt);
  const studentDates = recentStudentRows.map((r) => r.createdAt);

  const trend: TrendPoint[] = Array.from({ length: 6 }, (_, i) => {
    const from = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const to = new Date(now.getFullYear(), now.getMonth() - 4 + i, 1);
    return {
      month: from.toLocaleString("en-US", { month: "short" }),
      enrollments: countBetween(enrollmentDates, from, to),
      students: countBetween(studentDates, from, to),
    };
  });

  // ── Deltas: last 30 days vs the 30 before ─────────────────────────────────
  const d30 = new Date(now.getTime() - 30 * DAY);
  const d60 = new Date(now.getTime() - 60 * DAY);
  const enrollDelta =
    countBetween(enrollmentDates, d30, now) -
    countBetween(enrollmentDates, d60, d30);
  const studentDelta =
    countBetween(studentDates, d30, now) - countBetween(studentDates, d60, d30);

  const approvedRows = recentEnrollmentRows.filter((r) => r.status === "APPROVED");
  const revenueIn = (from: Date, to: Date) =>
    approvedRows
      .filter((r) => r.enrolledAt >= from && r.enrolledAt < to)
      .reduce((sum, r) => sum + (r.amountPaid ?? 0), 0);
  const revenueDelta = revenueIn(d30, now) - revenueIn(d60, d30);

  const stats = [
    {
      label: "Total students",
      value: totalStudents.toLocaleString("en-US"),
      delta: studentDelta,
      deltaLabel: `${studentDelta >= 0 ? "+" : ""}${studentDelta}`,
      icon: Users,
      chip: "bg-primary-50 text-primary-600",
      spark: weeklyBuckets(studentDates, now),
    },
    {
      label: "Total enrollments",
      value: totalEnrollments.toLocaleString("en-US"),
      delta: enrollDelta,
      deltaLabel: `${enrollDelta >= 0 ? "+" : ""}${enrollDelta}`,
      icon: ClipboardList,
      chip: "bg-blue-50 text-blue-600",
      spark: weeklyBuckets(enrollmentDates, now),
    },
    {
      label: "Revenue (approved)",
      value: formatTaka(revenue),
      delta: revenueDelta,
      deltaLabel: `${revenueDelta >= 0 ? "+" : "−"}${formatTaka(Math.abs(revenueDelta))}`,
      icon: Wallet,
      chip: "bg-green-50 text-green-600",
      spark: weeklyBuckets(
        approvedRows.map((r) => r.enrolledAt),
        now
      ),
    },
  ];

  const statusRows = [
    {
      label: "Approved",
      value: approved,
      icon: CheckCircle2,
      fill: "bg-green-600",
      track: "bg-green-100",
      ink: "text-green-600",
    },
    {
      label: "Pending",
      value: pending,
      icon: Clock,
      fill: "bg-amber-500",
      track: "bg-amber-100",
      ink: "text-amber-600",
    },
    {
      label: "Rejected",
      value: rejected,
      icon: XCircle,
      fill: "bg-red-500",
      track: "bg-red-100",
      ink: "text-red-500",
    },
  ];
  const statusTotal = Math.max(approved + pending + rejected, 1);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900">
            Overview
          </h1>
          <p className="mt-1 text-neutral-500">
            How the academy is performing at a glance.
          </p>
        </div>
        <p className="text-sm text-neutral-400">
          {now.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      {/* KPI row */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, delta, deltaLabel, icon: Icon, chip, spark }) => (
          <Card key={label} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-neutral-500">{label}</p>
                <p className="mt-1.5 font-display text-3xl font-bold text-neutral-900">
                  {value}
                </p>
              </div>
              <span
                className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${chip}`}
              >
                <Icon className="h-5 w-5" />
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs">
              {delta > 0 ? (
                <ArrowUpRight className="h-3.5 w-3.5 text-green-600" />
              ) : delta < 0 ? (
                <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />
              ) : null}
              <span
                className={
                  delta > 0
                    ? "font-semibold text-green-600"
                    : delta < 0
                      ? "font-semibold text-red-500"
                      : "font-medium text-neutral-400"
                }
              >
                {delta === 0 ? "No change" : deltaLabel}
              </span>
              <span className="text-neutral-400">vs prior 30 days</span>
            </div>
            <div className="mt-3">
              <Sparkline points={spark} />
            </div>
          </Card>
        ))}

        {/* Pending review — action tile */}
        <Card className="flex flex-col p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-neutral-500">Pending review</p>
              <p className="mt-1.5 font-display text-3xl font-bold text-neutral-900">
                {pending}
              </p>
            </div>
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock className="h-5 w-5" />
            </span>
          </div>
          <p className="mt-2 text-xs text-neutral-400">
            {pending === 0
              ? "All enrollments reviewed."
              : "Enrollments awaiting a decision."}
          </p>
          <Link
            href="/admin/enrollments"
            className="mt-auto inline-flex items-center gap-1.5 pt-3 text-sm font-semibold text-primary-700 hover:text-primary-800"
          >
            Review enrollments
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>
      </div>

      {/* Charts row */}
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="mb-5">
            <h2 className="font-display text-base font-bold text-neutral-900">
              Enrollment trend
            </h2>
            <p className="mt-0.5 text-sm text-neutral-500">
              Enrollments and new student signups, last 6 months
            </p>
          </div>
          <EnrollmentTrendChart data={trend} />
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-base font-bold text-neutral-900">
            Enrollment status
          </h2>
          <p className="mt-0.5 text-sm text-neutral-500">
            Share of all {approved + pending + rejected} enrollments
          </p>
          <div className="mt-6 space-y-6">
            {statusRows.map(({ label, value, icon: Icon, fill, track, ink }) => (
              <div key={label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium text-neutral-700">
                    <Icon className={`h-4 w-4 ${ink}`} />
                    {label}
                  </span>
                  <span className="font-semibold tabular-nums text-neutral-900">
                    {value}
                    <span className="ml-1.5 font-normal text-neutral-400">
                      {Math.round((value / statusTotal) * 100)}%
                    </span>
                  </span>
                </div>
                <div className={`mt-2 h-2.5 overflow-hidden rounded-full ${track}`}>
                  <div
                    className={`h-full rounded-full ${fill}`}
                    style={{ width: `${(value / statusTotal) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-neutral-900">
              Upcoming classes
            </h2>
            <Link
              href="/admin/schedule"
              className="text-sm font-medium text-primary-700 hover:text-primary-800"
            >
              Schedule
            </Link>
          </div>
          <div className="mt-5 space-y-4">
            {upcomingClasses.map((cls) => (
              <div key={cls.id} className="flex items-start gap-3.5">
                <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                  <span className="font-display text-base font-bold leading-none">
                    {cls.startsAt.getDate()}
                  </span>
                  <span className="mt-0.5 text-[10px] font-semibold uppercase">
                    {cls.startsAt.toLocaleString("en-US", { month: "short" })}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-neutral-900">
                    {cls.title}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-neutral-500">
                    {cls.course.title}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-neutral-400">
                    <Video className="h-3 w-3" />
                    {cls.startsAt.toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                    {" – "}
                    {cls.endsAt.toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            {upcomingClasses.length === 0 && (
              <div className="rounded-xl border border-dashed border-neutral-200 px-4 py-8 text-center">
                <CalendarDays className="mx-auto h-6 w-6 text-neutral-300" />
                <p className="mt-2 text-sm text-neutral-400">
                  No upcoming classes scheduled.
                </p>
              </div>
            )}
          </div>
        </Card>

        <Card className="overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between px-6 pt-6">
            <h2 className="font-display text-base font-bold text-neutral-900">
              Recent enrollments
            </h2>
            <Link
              href="/admin/enrollments"
              className="text-sm font-medium text-primary-700 hover:text-primary-800"
            >
              View all
            </Link>
          </div>
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                <th className="px-6 py-3 text-left font-medium text-neutral-500">Student</th>
                <th className="px-6 py-3 text-left font-medium text-neutral-500">Course</th>
                <th className="px-6 py-3 text-left font-medium text-neutral-500">Status</th>
                <th className="px-6 py-3 text-left font-medium text-neutral-500">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentEnrollments.map((e) => (
                <tr key={e.id} className="border-b border-neutral-50 hover:bg-neutral-50">
                  <td className="px-6 py-3">
                    <div className="font-medium text-neutral-900">{e.user.name}</div>
                    <div className="text-xs text-neutral-400">{e.user.email}</div>
                  </td>
                  <td className="px-6 py-3 text-neutral-700">{e.course.title}</td>
                  <td className="px-6 py-3">
                    <StatusBadge status={e.status} />
                  </td>
                  <td className="px-6 py-3 tabular-nums text-neutral-400">
                    {e.enrolledAt.toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {recentEnrollments.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-neutral-400">
                    No enrollments yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>
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
