"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Users, ClipboardList, UserCircle, Star, CalendarDays, Wallet, TicketPercent } from "lucide-react";
import { cn } from "@/lib/cn";
import { useCloseSidebar } from "./AdminShell";
import type { Role } from "@/generated/prisma/client";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/earnings", label: "Earnings", icon: Wallet },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/schedule", label: "Schedule", icon: CalendarDays, support: true },
  { href: "/admin/instructors", label: "Instructors", icon: UserCircle },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/enrollments", label: "Enrollments", icon: ClipboardList, support: true },
  { href: "/admin/coupons", label: "Coupons", icon: TicketPercent },
];

function isLinkActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebarNav({ role }: { role: Role }) {
  const pathname = usePathname();
  const closeSidebar = useCloseSidebar();
  const visibleLinks =
    role === "STUDENT_SUPPORT" ? links.filter((link) => link.support) : links;

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
