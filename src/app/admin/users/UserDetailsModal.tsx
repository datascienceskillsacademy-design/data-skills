"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Eye,
  X,
  User as UserIcon,
  Phone,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import type { Prisma } from "@/generated/prisma/client";

export type AdminUserRow = Prisma.UserGetPayload<{
  include: {
    _count: { select: { enrollments: true } };
    enrollments: {
      include: { course: { select: { title: true } } };
    };
  };
}>;

const roleBadges: Record<string, string> = {
  STUDENT: "bg-blue-100 text-blue-700",
  STUDENT_SUPPORT: "bg-teal-100 text-teal-700",
  ADMIN: "bg-purple-100 text-purple-700",
  SUPER_ADMIN: "bg-amber-100 text-amber-700",
  INSTRUCTOR: "bg-indigo-100 text-indigo-700",
};

const enrollmentBadges: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  COMPLETED: "bg-blue-100 text-blue-700",
};

export function UserDetailsModal({ user }: { user: AdminUserRow }) {
  const [open, setOpen] = useState(false);

  const profileComplete = !!(
    user.name &&
    user.phone &&
    user.designation &&
    user.organization
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="View details"
        aria-label={`View details of ${user.name ?? user.email}`}
        className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900"
      >
        <Eye className="h-3.5 w-3.5" />
        View
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-2xl">
            {/* Header */}
            <div className="relative border-b border-neutral-100 px-6 py-6">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-100">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name ?? ""}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-7 w-7 text-primary-600" />
                  )}
                </div>
                <div className="min-w-0">
                  <h2 className="truncate font-display text-lg font-bold text-neutral-900">
                    {user.name ?? "—"}
                  </h2>
                  <p className="truncate text-sm text-neutral-500">{user.email}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        roleBadges[user.role] ?? "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {user.role}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        profileComplete
                          ? "bg-green-100 text-green-700"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {profileComplete ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <AlertCircle className="h-3 w-3" />
                      )}
                      {profileComplete ? "Profile complete" : "Profile incomplete"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="px-6 py-5">
              <div className="grid grid-cols-2 gap-3">
                <Fact icon={Phone} label="Phone" value={user.phone ?? "—"} />
                <Fact
                  icon={BriefcaseBusiness}
                  label="Designation"
                  value={user.designation ?? "—"}
                />
                <Fact
                  icon={Building2}
                  label="Organization"
                  value={user.organization ?? "—"}
                />
                <Fact
                  icon={CalendarDays}
                  label="Joined"
                  value={new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                />
              </div>

              {/* Enrollments */}
              <div className="mt-5 border-t border-neutral-100 pt-4">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                  <ClipboardList className="h-3.5 w-3.5" />
                  Enrollments ({user._count.enrollments})
                </p>
                {user.enrollments.length === 0 ? (
                  <p className="mt-3 text-sm text-neutral-400">
                    No enrollments yet.
                  </p>
                ) : (
                  <ul className="mt-3 space-y-2">
                    {user.enrollments.map((enrollment) => (
                      <li
                        key={enrollment.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-neutral-100 px-3.5 py-2.5"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-neutral-800">
                            {enrollment.course.title}
                          </p>
                          <p className="text-xs text-neutral-400">
                            {new Date(enrollment.enrolledAt).toLocaleDateString()}
                            {enrollment.amountPaid != null &&
                              ` · Paid BDT ${enrollment.amountPaid.toLocaleString()}`}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            enrollmentBadges[enrollment.status] ??
                            "bg-neutral-100 text-neutral-600"
                          }`}
                        >
                          {enrollment.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-5 w-full rounded-full border border-neutral-200 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-neutral-50 px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-neutral-400">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <div className="mt-0.5 truncate text-sm font-semibold text-neutral-800">
        {value}
      </div>
    </div>
  );
}
