import type { Role } from "@/generated/prisma/client";

/** Admin sections a STUDENT_SUPPORT user may access. */
export const SUPPORT_ADMIN_PATHS = ["/admin/schedule", "/admin/enrollments"];

/** Admin sections an INSTRUCTOR user may access. */
export const INSTRUCTOR_ADMIN_PATHS = [
  "/admin/schedule",
  "/admin/assignments",
  "/admin/students",
];

/** Admin paths every staff role may reach, regardless of the restricted-section rules above. */
export const SHARED_ADMIN_PATHS = ["/admin/profile"];

/** Full admin access — every admin page and API. */
export function isAdmin(role?: Role | null): boolean {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export function isSuperAdmin(role?: Role | null): boolean {
  return role === "SUPER_ADMIN";
}

export function isInstructor(role?: Role | null): boolean {
  return role === "INSTRUCTOR";
}

/** Any role allowed into the admin panel (support/instructor see a subset of pages). */
export function isStaff(role?: Role | null): boolean {
  return isAdmin(role) || role === "STUDENT_SUPPORT" || role === "INSTRUCTOR";
}

/** Roles allowed to review/approve enrollments and payments — not INSTRUCTOR. */
export function canManageEnrollments(role?: Role | null): boolean {
  return isAdmin(role) || role === "STUDENT_SUPPORT";
}

/** Where a restricted staff role lands when they open the admin panel. */
export function adminHome(role?: Role | null): string {
  if (role === "STUDENT_SUPPORT") return "/admin/schedule";
  if (role === "INSTRUCTOR") return "/admin/students";
  return "/admin";
}

/** Whether `role` may view the admin page at `pathname`. */
export function canAccessAdminPath(
  role: Role | null | undefined,
  pathname: string
): boolean {
  if (isAdmin(role)) return true;
  if (!isStaff(role)) return false;

  const matches = (paths: string[]) =>
    paths.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  if (matches(SHARED_ADMIN_PATHS)) return true;
  if (role === "STUDENT_SUPPORT") return matches(SUPPORT_ADMIN_PATHS);
  if (role === "INSTRUCTOR") return matches(INSTRUCTOR_ADMIN_PATHS);
  return false;
}
