export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  User,
  BookOpen,
  MessageCircle,
  Video,
  CheckCircle,
  Circle,
  Clock,
  XCircle,
  Award,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { WhatsAppFloatButton } from "@/components/profile/WhatsAppFloatButton";
import { ClassScheduleSection } from "@/components/profile/ClassScheduleSection";
import { PaymentDueBanner } from "@/components/profile/PaymentDueBanner";

const statusConfig = {
  PENDING: { label: "Pending Review", icon: Clock, color: "text-amber-600 bg-amber-50 border-amber-200" },
  APPROVED: { label: "Approved", icon: CheckCircle, color: "text-green-600 bg-green-50 border-green-200" },
  REJECTED: { label: "Rejected", icon: XCircle, color: "text-red-600 bg-red-50 border-red-200" },
  COMPLETED: { label: "Completed", icon: Award, color: "text-primary-600 bg-primary-50 border-primary-200" },
} as const;

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

  const hasEnrollments = user.enrollments.length > 0;
  const enrolledCourseTitles = user.enrollments.map((e) => e.course.title);

  return (
    <div className="min-h-screen bg-neutral-50">
      {hasEnrollments && (
        <WhatsAppFloatButton
          name={user.name ?? "Student"}
          email={user.email}
          courseTitles={enrolledCourseTitles}
        />
      )}

      <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
        {/* Profile header */}
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary-100 ring-4 ring-primary-200">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name ?? ""}
                width={80}
                height={80}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <User className="h-10 w-10 text-primary-600" />
            )}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-neutral-900">
              {user.name ?? "Student"}
            </h1>
            <p className="text-neutral-500">{user.email}</p>
            <span className="mt-1 inline-flex items-center rounded-full bg-primary-100 px-3 py-0.5 text-xs font-semibold text-primary-700">
              {user.role}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Enrolled", value: user.enrollments.length },
            {
              label: "Active",
              value: user.enrollments.filter((e) => e.status === "APPROVED").length,
            },
            {
              label: "Completed",
              value: user.enrollments.filter((e) => e.status === "COMPLETED").length,
            },
            {
              label: "Pending",
              value: user.enrollments.filter((e) => e.status === "PENDING").length,
            },
          ].map(({ label, value }) => (
            <Card key={label} className="p-5 text-center">
              <p className="font-display text-3xl font-bold text-primary-700">
                {value}
              </p>
              <p className="mt-1 text-sm text-neutral-500">{label}</p>
            </Card>
          ))}
        </div>

        {/* Enrollments */}
        <h2 className="mt-12 font-display text-xl font-bold text-neutral-900">
          My Courses
        </h2>

        {user.enrollments.length === 0 ? (
          <Card className="mt-4 p-10 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-neutral-300" />
            <p className="mt-3 text-neutral-500">
              You haven&rsquo;t enrolled in any course yet.
            </p>
            <Link
              href="/courses"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary-700 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-800"
            >
              Browse Courses
            </Link>
          </Card>
        ) : (
          <div className="mt-4 space-y-6">
            {user.enrollments.map((enrollment) => {
              const config = statusConfig[enrollment.status];
              const StatusIcon = config.icon;
              const totalModules = enrollment.course.modules.length;
              const completedModules = enrollment.course.modules.filter(
                (m) => m.isCompleted
              ).length;
              const progress =
                totalModules > 0
                  ? Math.round((completedModules / totalModules) * 100)
                  : 0;
              const isApproved = enrollment.status === "APPROVED" || enrollment.status === "COMPLETED";

              return (
                <Card key={enrollment.id} className="overflow-hidden">
                  <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start">
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-display text-lg font-bold text-neutral-900">
                          {enrollment.course.title}
                        </h3>
                        <span
                          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${config.color}`}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          {config.label}
                        </span>
                      </div>

                      {/* Payment due — only when admin recorded a partial payment */}
                      {isApproved && enrollment.amountPaid != null && (
                        <PaymentDueBanner
                          name={user.name ?? "Student"}
                          email={user.email}
                          courseTitle={enrollment.course.title}
                          coursePrice={enrollment.course.price}
                          amountPaid={enrollment.amountPaid}
                        />
                      )}

                      {/* Progress bar */}
                      {isApproved && (
                        <div className="mt-4">
                          <div className="flex justify-between text-xs text-neutral-500">
                            <span>Progress</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                            <div
                              className="h-full rounded-full bg-primary-600 transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <p className="mt-1 text-xs text-neutral-400">
                            {completedModules} / {totalModules} modules completed
                          </p>
                        </div>
                      )}

                      {/* Class schedule — upcoming & past live classes */}
                      {isApproved && (
                        <ClassScheduleSection classes={enrollment.course.classSchedules} />
                      )}

                      {/* Module checklist — which modules are done vs not */}
                      {isApproved && totalModules > 0 && (
                        <div className="mt-5 border-t border-neutral-100 pt-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                            Course Modules
                          </p>
                          <ul className="mt-2.5 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                            {enrollment.course.modules.map((mod) => (
                              <li key={mod.id} className="flex items-center gap-2">
                                {mod.isCompleted ? (
                                  <CheckCircle className="h-4 w-4 shrink-0 text-green-600" />
                                ) : (
                                  <Circle className="h-4 w-4 shrink-0 text-neutral-300" />
                                )}
                                <span
                                  className={`text-sm ${
                                    mod.isCompleted ? "text-neutral-700" : "text-neutral-400"
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
                        <p className="mt-3 text-sm text-amber-700">
                          Your enrollment is under review. You&rsquo;ll get access
                          once the admin approves it (usually within 24 hours).
                        </p>
                      )}

                      {enrollment.status === "REJECTED" && (
                        <p className="mt-3 text-sm text-red-600">
                          Your enrollment was rejected. Please contact support for
                          more information.
                        </p>
                      )}

                      {/* WhatsApp & Meet links — only when approved */}
                      {isApproved && (
                        <div className="mt-4 flex flex-wrap gap-3">
                          {enrollment.course.whatsappLink ? (
                            <a
                              href={enrollment.course.whatsappLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                            >
                              <MessageCircle className="h-4 w-4" />
                              Join WhatsApp Group
                            </a>
                          ) : (
                            <span className="flex items-center gap-2 rounded-full border border-dashed border-neutral-300 px-4 py-2 text-sm text-neutral-400">
                              <MessageCircle className="h-4 w-4" />
                              WhatsApp link coming soon
                            </span>
                          )}

                          {enrollment.course.meetLink ? (
                            <a
                              href={enrollment.course.meetLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                              <Video className="h-4 w-4" />
                              Join Google Meet
                            </a>
                          ) : (
                            <span className="flex items-center gap-2 rounded-full border border-dashed border-neutral-300 px-4 py-2 text-sm text-neutral-400">
                              <Video className="h-4 w-4" />
                              Meet link coming soon
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
