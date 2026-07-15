import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import { canAccessAdminPath, isStaff, SUPPORT_HOME } from "@/lib/roles";

export async function proxy(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // ── Admin routes: must be authenticated staff (ADMIN / SUPER_ADMIN /
  // STUDENT_SUPPORT). Support users only get their allowed sections. ────────
  if (pathname.startsWith("/admin")) {
    if (!session?.user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!isStaff(session.user.role)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (!canAccessAdminPath(session.user.role, pathname)) {
      return NextResponse.redirect(new URL(SUPPORT_HOME, request.url));
    }
  }

  // ── Profile & checkout: must be authenticated ─────────────────────────────
  if (pathname.startsWith("/profile") || pathname.startsWith("/checkout")) {
    if (!session?.user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── Students with an incomplete profile must finish it first ──────────────
  if (
    session?.user &&
    session.user.role === "STUDENT" &&
    !session.user.profileCompleted &&
    (pathname.startsWith("/profile") ||
      pathname.startsWith("/checkout") ||
      pathname.startsWith("/dashboard"))
  ) {
    const completeUrl = new URL("/complete-profile", request.url);
    completeUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(completeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*", "/checkout/:path*", "/dashboard/:path*"],
};
