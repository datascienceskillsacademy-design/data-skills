import Image from "next/image";
import Link from "next/link";
import {
  User,
  BookOpen,
  MessageCircle,
  Video,
  CheckCircle2,
  Circle,
  Clock,
  XCircle,
  Award,
  Mail,
  CalendarDays,
  Zap,
  TrendingUp,
  Layers,
  BarChart3,
  Users,
  ArrowRight,
  GraduationCap,
  ShieldCheck,
  Rocket,
  PlayCircle,
  Download,
} from "lucide-react";
import type { Prisma } from "@/generated/prisma/client";
import { Card } from "@/components/ui/Card";
import { WhatsAppFloatButton } from "@/components/profile/WhatsAppFloatButton";
import { ClassScheduleSection } from "@/components/profile/ClassScheduleSection";
import { PaymentDueBanner } from "@/components/profile/PaymentDueBanner";
import { ProgressRing } from "@/components/profile/ProgressRing";
import { SUPPORT_WHATSAPP_NUMBER } from "@/lib/payment";
import { formatClassDate, formatClassTimeRange } from "@/lib/scheduleTime";

export type ProfileUser = Prisma.UserGetPayload<{
  include: {
    enrollments: {
      include: {
        course: {
          include: { modules: true; classSchedules: true };
        };
      };
    };
  };
}>;

const statusConfig = {
  PENDING: {
    label: "Pending Review",
    icon: Clock,
    color: "text-amber-700 bg-amber-50 border-amber-200",
  },
  APPROVED: {
    label: "Approved",
    icon: CheckCircle2,
    color: "text-green-700 bg-green-50 border-green-200",
  },
  REJECTED: {
    label: "Rejected",
    icon: XCircle,
    color: "text-red-700 bg-red-50 border-red-200",
  },
  COMPLETED: {
    label: "Completed",
    icon: Award,
    color: "text-primary-700 bg-primary-50 border-primary-200",
  },
} as const;

const courseStatusChips = {
  UPCOMING: {
    label: "Upcoming",
    icon: Rocket,
    chip: "border-blue-200 bg-blue-50 text-blue-700",
  },
  RUNNING: {
    label: "Running",
    icon: PlayCircle,
    chip: "border-green-200 bg-green-50 text-green-700",
  },
  COMPLETED: {
    label: "Course Completed",
    icon: Award,
    chip: "border-primary-200 bg-primary-50 text-primary-700",
  },
} as const;

const roleLabels: Record<string, string> = {
  STUDENT: "Student",
  ADMIN: "Admin",
  SUPER_ADMIN: "Super Admin",
  STUDENT_SUPPORT: "Student Support",
};

export function ProfileView({ user }: { user: ProfileUser }) {
  const now = new Date();
  const enrollments = user.enrollments;
  const hasEnrollments = enrollments.length > 0;

  const isActive = (status: string) =>
    status === "APPROVED" || status === "COMPLETED";
  const activeEnrollments = enrollments.filter((e) => isActive(e.status));

  const totalModules = activeEnrollments.reduce(
    (sum, e) => sum + e.course.modules.length,
    0
  );
  const completedModules = activeEnrollments.reduce(
    (sum, e) => sum + e.course.modules.filter((m) => m.isCompleted).length,
    0
  );
  const overallProgress =
    totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  const upcomingClasses = activeEnrollments
    .flatMap((e) =>
      e.course.classSchedules.map((c) => ({ ...c, courseTitle: e.course.title }))
    )
    .filter((c) => new Date(c.endsAt) >= now)
    .sort(
      (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
    );
  const nextClass = upcomingClasses[0];

  const stats = [
    {
      label: "Enrolled courses",
      value: enrollments.length,
      icon: BookOpen,
      chip: "bg-primary-50 text-primary-600",
    },
    {
      label: "Active",
      value: activeEnrollments.length,
      icon: Zap,
      chip: "bg-green-50 text-green-600",
    },
    {
      label: "Overall progress",
      value: `${overallProgress}%`,
      icon: TrendingUp,
      chip: "bg-blue-50 text-blue-600",
    },
    {
      label: "Upcoming classes",
      value: upcomingClasses.length,
      icon: CalendarDays,
      chip: "bg-amber-50 text-amber-600",
    },
  ];

  const supportHref = `https://wa.me/${SUPPORT_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi, I'm ${user.name ?? "a student"} (${user.email}). I need some help with my account.`
  )}`;

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {hasEnrollments && (
        <WhatsAppFloatButton
          name={user.name ?? "Student"}
          email={user.email}
          courseTitles={enrollments.map((e) => e.course.title)}
        />
      )}

      {/* Banner */}
      <div className="relative h-44 overflow-hidden bg-linear-to-br from-primary-700 via-primary-800 to-primary-950">
        <div className="absolute -left-16 -top-24 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -right-10 top-6 h-48 w-48 rounded-full bg-accent-400/20 blur-2xl" />
        <div className="absolute bottom-8 left-1/2 h-40 w-40 rounded-full bg-primary-400/20 blur-2xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        {/* Profile card */}
        <Card className="-mt-16 p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-100 ring-4 ring-white shadow-lg">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name ?? ""}
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-11 w-11 text-primary-600" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="font-display text-2xl font-bold text-neutral-900">
                {user.name ?? "Student"}
              </h1>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-neutral-500">
                <Mail className="h-3.5 w-3.5" />
                {user.email}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {roleLabels[user.role] ?? user.role}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Member since{" "}
                  {user.createdAt.toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            <Link
              href="/courses"
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-primary-200 px-5 py-2.5 text-sm font-semibold text-primary-700 transition hover:bg-primary-50"
            >
              Browse Courses
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Card>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map(({ label, value, icon: Icon, chip }) => (
            <Card key={label} className="flex items-center gap-4 p-5">
              <span
                className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${chip}`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="font-display text-2xl font-bold leading-tight text-neutral-900">
                  {value}
                </p>
                <p className="truncate text-xs text-neutral-500">{label}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Main grid */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
          {/* Courses column */}
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h2 className="font-display text-xl font-bold text-neutral-900">
                My Courses
              </h2>
              {hasEnrollments && (
                <span className="rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-semibold text-primary-700">
                  {enrollments.length}
                </span>
              )}
            </div>

            {!hasEnrollments ? (
              <Card className="mt-4 p-12 text-center">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
                  <GraduationCap className="h-8 w-8 text-primary-600" />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold text-neutral-900">
                  Start your learning journey
                </h3>
                <p className="mx-auto mt-2 max-w-sm text-sm text-neutral-500">
                  You haven&rsquo;t enrolled in any course yet. Explore our
                  programs and take the first step toward a data-driven career.
                </p>
                <Link
                  href="/courses"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-800"
                >
                  Browse Courses
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Card>
            ) : (
              <div className="mt-4 space-y-6">
                {enrollments.map((enrollment) => {
                  const config = statusConfig[enrollment.status];
                  const StatusIcon = config.icon;
                  const course = enrollment.course;
                  const courseTotal = course.modules.length;
                  const courseDone = course.modules.filter(
                    (m) => m.isCompleted
                  ).length;
                  const progress =
                    courseTotal > 0
                      ? Math.round((courseDone / courseTotal) * 100)
                      : 0;
                  const approved = isActive(enrollment.status);

                  return (
                    <Card key={enrollment.id} className="overflow-hidden">
                      {/* Thumbnail banner */}
                      <div className="relative h-36 w-full bg-linear-to-br from-primary-600 to-primary-900">
                        {course.thumbnail ? (
                          <Image
                            src={course.thumbnail}
                            alt={course.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <BookOpen className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 text-white/25" />
                        )}
                        <span
                          className={`absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm ${config.color}`}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          {config.label}
                        </span>
                        {course.category && (
                          <span className="absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                            {course.category}
                          </span>
                        )}
                      </div>

                      <div className="p-6">
                        <div className="flex items-start justify-between gap-5">
                          <div className="min-w-0">
                            <h3 className="font-display text-lg font-bold text-neutral-900">
                              {course.title}
                            </h3>
                            {course.subtitle && (
                              <p className="mt-1 line-clamp-1 text-sm text-neutral-500">
                                {course.subtitle}
                              </p>
                            )}

                            {/* Meta chips */}
                            <div className="mt-3 flex flex-wrap gap-2">
                              {(() => {
                                const sc = courseStatusChips[course.status];
                                const StatusChipIcon = sc.icon;
                                return (
                                  <span
                                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${sc.chip}`}
                                  >
                                    <StatusChipIcon className="h-3 w-3" />
                                    {sc.label}
                                  </span>
                                );
                              })()}
                              {[
                                { icon: Clock, text: course.durationLabel },
                                { icon: Layers, text: `${course.classCount} classes` },
                                { icon: BarChart3, text: course.level },
                                { icon: Users, text: course.batchSize },
                              ].map(({ icon: MetaIcon, text }) => (
                                <span
                                  key={text}
                                  className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-600"
                                >
                                  <MetaIcon className="h-3 w-3 text-neutral-400" />
                                  {text}
                                </span>
                              ))}
                            </div>
                          </div>

                          {approved && (
                            <div className="hidden flex-col items-center gap-1 sm:flex">
                              <ProgressRing value={progress} />
                              <p className="text-xs text-neutral-400">
                                {courseDone}/{courseTotal} modules
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Mobile progress bar */}
                        {approved && (
                          <div className="mt-4 sm:hidden">
                            <div className="flex justify-between text-xs text-neutral-500">
                              <span>Progress</span>
                              <span className="font-semibold">{progress}%</span>
                            </div>
                            <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-primary-100">
                              <div
                                className="h-full rounded-full bg-primary-600"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {approved && enrollment.amountPaid != null && (
                          <PaymentDueBanner
                            name={user.name ?? "Student"}
                            email={user.email}
                            courseTitle={course.title}
                            coursePrice={course.price}
                            amountPaid={enrollment.amountPaid}
                          />
                        )}

                        {approved && (
                          <ClassScheduleSection classes={course.classSchedules} />
                        )}

                        {approved && courseTotal > 0 && (
                          <div className="mt-5 border-t border-neutral-100 pt-4">
                            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                              <Layers className="h-3.5 w-3.5" />
                              Course Modules
                            </p>
                            <ul className="mt-2.5 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                              {course.modules.map((mod) => (
                                <li key={mod.id} className="flex items-center gap-2">
                                  {mod.isCompleted ? (
                                    <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
                                  ) : (
                                    <Circle className="h-4 w-4 shrink-0 text-neutral-300" />
                                  )}
                                  <span
                                    className={`text-sm ${
                                      mod.isCompleted
                                        ? "text-neutral-700"
                                        : "text-neutral-400"
                                    }`}
                                  >
                                    {mod.title}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {enrollment.status === "PENDING" && (
                          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                            <div>
                              <p className="text-sm font-bold text-amber-900">
                                Enrollment under review
                              </p>
                              <p className="mt-0.5 text-xs text-amber-700">
                                You&rsquo;ll get full access once our team
                                approves it — usually within 24 hours.
                              </p>
                            </div>
                          </div>
                        )}

                        {enrollment.status === "REJECTED" && (
                          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
                            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                            <div>
                              <p className="text-sm font-bold text-red-900">
                                Enrollment rejected
                              </p>
                              <p className="mt-0.5 text-xs text-red-700">
                                Please{" "}
                                <Link
                                  href="/contact"
                                  className="font-semibold underline underline-offset-2"
                                >
                                  contact support
                                </Link>{" "}
                                for more information.
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Footer */}
                        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-4">
                          {approved ? (
                            <div className="flex flex-wrap gap-3">
                              {course.status === "COMPLETED" && (
                                <a
                                  href={`/api/certificate/${enrollment.id}`}
                                  className="flex items-center gap-2 rounded-full bg-primary-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-800"
                                >
                                  <Download className="h-4 w-4" />
                                  Download Certificate
                                </a>
                              )}
                              {course.whatsappLink ? (
                                <a
                                  href={course.whatsappLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                                >
                                  <MessageCircle className="h-4 w-4" />
                                  WhatsApp Group
                                </a>
                              ) : (
                                <span className="flex items-center gap-2 rounded-full border border-dashed border-neutral-300 px-4 py-2 text-sm text-neutral-400">
                                  <MessageCircle className="h-4 w-4" />
                                  WhatsApp coming soon
                                </span>
                              )}
                              {course.meetLink ? (
                                <a
                                  href={course.meetLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                                >
                                  <Video className="h-4 w-4" />
                                  Google Meet
                                </a>
                              ) : (
                                <span className="flex items-center gap-2 rounded-full border border-dashed border-neutral-300 px-4 py-2 text-sm text-neutral-400">
                                  <Video className="h-4 w-4" />
                                  Meet coming soon
                                </span>
                              )}
                            </div>
                          ) : (
                            <span />
                          )}
                          <p className="flex items-center gap-1.5 text-xs text-neutral-400">
                            <CalendarDays className="h-3.5 w-3.5" />
                            Enrolled{" "}
                            {enrollment.enrolledAt.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Next class */}
            {nextClass ? (
              <div className="overflow-hidden rounded-3xl bg-linear-to-br from-primary-600 to-primary-900 p-6 text-white shadow-sm">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-primary-200">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Next Live Class
                </p>
                <h3 className="mt-3 font-display text-lg font-bold leading-snug">
                  {nextClass.title}
                </h3>
                <p className="mt-1 truncate text-sm text-primary-200">
                  {nextClass.courseTitle}
                </p>
                <p className="mt-3 flex items-center gap-1.5 text-sm text-primary-100">
                  <Clock className="h-4 w-4" />
                  {formatClassDate(nextClass.startsAt)}
                </p>
                <p className="mt-1 pl-5.5 text-sm text-primary-200">
                  {formatClassTimeRange(nextClass.startsAt, nextClass.endsAt)}
                </p>
                {nextClass.meetLink && (
                  <a
                    href={nextClass.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-primary-800 transition hover:bg-primary-50"
                  >
                    <Video className="h-4 w-4" />
                    Join Google Meet
                  </a>
                )}
              </div>
            ) : (
              hasEnrollments && (
                <Card className="p-6 text-center">
                  <CalendarDays className="mx-auto h-6 w-6 text-neutral-300" />
                  <p className="mt-2 text-sm text-neutral-400">
                    No upcoming classes scheduled yet.
                  </p>
                </Card>
              )
            )}

            {/* Support */}
            <Card className="p-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <MessageCircle className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-base font-bold text-neutral-900">
                Need help?
              </h3>
              <p className="mt-1 text-sm text-neutral-500">
                Our support team is one message away — payments, access, or
                anything else.
              </p>
              <a
                href={supportHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                <MessageCircle className="h-4 w-4" />
                Chat on WhatsApp
              </a>
              <Link
                href="/contact"
                className="mt-3 flex items-center justify-center gap-1.5 text-sm font-medium text-primary-700 hover:text-primary-800"
              >
                Visit contact page
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Card>

            {/* Explore */}
            <Card className="p-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <GraduationCap className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-base font-bold text-neutral-900">
                Keep growing
              </h3>
              <p className="mt-1 text-sm text-neutral-500">
                Explore more programs and add new skills to your portfolio.
              </p>
              <Link
                href="/courses"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-primary-200 px-4 py-2.5 text-sm font-semibold text-primary-700 transition hover:bg-primary-50"
              >
                Browse Courses
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
