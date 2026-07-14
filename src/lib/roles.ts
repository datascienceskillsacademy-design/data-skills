import type { Role } from "@/generated/prisma/client";

/** Admin sections a STUDENT_SUPPORT user may access. */
export const SUPPORT_ADMIN_PATHS = ["/admin/schedule", "/admin/enrollments"];

/** Where STUDENT_SUPPORT users land when they open the admin panel. */
export const SUPPORT_HOME = "/admin/schedule";

/** Full admin access — every admin page and API. */
export function isAdmin(role?: Role | null): boolean {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export function isSuperAdmin(role?: Role | null): boolean {
  return role === "SUPER_ADMIN";
}

/** Any role allowed into the admin panel (support sees a subset of pages). */
export function isStaff(role?: Role | null): boolean {
  return isAdmin(role) || role === "STUDENT_SUPPORT";
}

/** Whether `role` may view the admin page at `pathname`. */
export function canAccessAdminPath(
  role: Role | null | undefined,
  pathname: string
): boolean {
  if (isAdmin(role)) return true;
  if (role !== "STUDENT_SUPPORT") return false;
  return SUPPORT_ADMIN_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}
