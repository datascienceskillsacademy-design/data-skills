import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { GraduationCap, LayoutDashboard, BookOpen, Users, ClipboardList } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const navLinks = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/enrollments", label: "Enrollments", icon: ClipboardList },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Sidebar */}
      <aside className="flex w-64 shrink-0 flex-col border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
              <GraduationCap className="h-4 w-4" />
            </span>
            <span className="font-display text-sm font-bold text-neutral-900">
              Admin Panel
            </span>
          </div>
          {/* <ThemeToggle /> */}
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-neutral-200 p-4 dark:border-neutral-800">
          <Link
            href="/"
            className="block rounded-xl px-3 py-2 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
          >
            ← Back to site
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl px-8 py-10">{children}</div>
      </main>
    </div>
  );
}
