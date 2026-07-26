"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ClipboardList,
  UserCircle,
  Star,
  CalendarDays,
  Wallet,
  TicketPercent,
  FileText,
  GraduationCap,
  UserCog,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useCloseSidebar } from "./AdminShell";
import type { Role } from "@/generated/prisma/client";

const ALL_STAFF: Role[] = ["ADMIN", "SUPER_ADMIN"];

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, roles: ALL_STAFF },
  { href: "/admin/earnings", label: "Earnings", icon: Wallet, roles: ALL_STAFF },
  { href: "/admin/courses", label: "Courses", icon: BookOpen, roles: ALL_STAFF },
  {
    href: "/admin/assignments",
    label: "Assignments",
    icon: FileText,
    roles: [...ALL_STAFF, "INSTRUCTOR"] as Role[],
  },
  {
    href: "/admin/schedule",
    label: "Schedule",
    icon: CalendarDays,
    roles: [...ALL_STAFF, "STUDENT_SUPPORT", "INSTRUCTOR"] as Role[],
  },
  {
    href: "/admin/students",
    label: "Students",
    icon: GraduationCap,
    roles: [...ALL_STAFF, "INSTRUCTOR"] as Role[],
  },
  { href: "/admin/instructors", label: "Instructors", icon: UserCircle, roles: ALL_STAFF },
  { href: "/admin/reviews", label: "Reviews", icon: Star, roles: ALL_STAFF },
  { href: "/admin/users", label: "Users", icon: Users, roles: ALL_STAFF },
  {
    href: "/admin/enrollments",
    label: "Enrollments",
    icon: ClipboardList,
    roles: [...ALL_STAFF, "STUDENT_SUPPORT"] as Role[],
  },
  { href: "/admin/coupons", label: "Coupons", icon: TicketPercent, roles: ALL_STAFF },
  {
    href: "/admin/profile",
    label: "My Profile",
    icon: UserCog,
    roles: ["INSTRUCTOR"] as Role[],
  },
];

function isLinkActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebarNav({ role }: { role: Role }) {
  const pathname = usePathname();
  const closeSidebar = useCloseSidebar();
  const visibleLinks = links.filter((link) => link.roles.includes(role));

  return (
    <nav className="flex-1 overflow-y-auto p-4">
      <ul className="space-y-1">
        {visibleLinks.map(({ href, label, icon: Icon }) => {
          const active = isLinkActive(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                onClick={() => closeSidebar?.()}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-300"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
