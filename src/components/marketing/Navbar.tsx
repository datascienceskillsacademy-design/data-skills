"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LayoutDashboard, LogOut, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { AuthModal } from "@/components/auth/AuthModal";
import { LinkButton } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/cn";
import { isStaff } from "@/lib/roles";

const links = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/instructors", label: "Instructors" },
  { href: "/reviews", label: "Reviews" },
];

function isLinkActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"signin" | "signup">("signin");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

  function openSignIn() {
    setAuthTab("signin");
    setAuthOpen(true);
  }

  function openSignUp() {
    setAuthTab("signup");
    setAuthOpen(true);
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-neutral-200/70 bg-white/80 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/80">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-mark.png"
              alt="Data Science Skills Academy"
              width={2220}
              height={734}
              priority
              className="h-11 w-auto object-contain"
            />
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {links.map((link) => {
              const active = isLinkActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary-700",
                    active ? "text-primary-700" : "text-neutral-600"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop auth */}
          <div className="hidden items-center gap-3 md:flex">
            {/* <ThemeToggle /> */}
            {session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 transition hover:border-primary-300 hover:text-primary-700"
                >
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name ?? ""}
                      width={28}
                      height={28}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                      <User className="h-4 w-4" />
                    </span>
                  )}
                  {session.user.name?.split(" ")[0] ?? "Account"}
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className="absolute right-0 top-12 z-50 w-52 rounded-2xl border border-neutral-100 bg-white py-2 shadow-xl dark:border-neutral-800 dark:bg-neutral-900"
                    >
                      <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800"
                      >
                        <User className="h-4 w-4 text-neutral-400" />
                        My Profile
                      </Link>
                      {isStaff(session.user.role) && (
                        <Link
                          href="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800"
                        >
                          <LayoutDashboard className="h-4 w-4 text-neutral-400" />
                          Admin Dashboard
                        </Link>
                      )}
                      <hr className="my-1 border-neutral-100 dark:border-neutral-800" />
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <button
                  onClick={openSignIn}
                  className="text-sm font-medium text-neutral-600 transition-colors hover:text-primary-700"
                >
                  Log in
                </button>
                <button
                  onClick={openSignUp}
                  className="rounded-full bg-primary-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary-800"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-1 md:hidden">
            {/* <ThemeToggle /> */}
            <button
              className="rounded-lg p-2 text-neutral-700 dark:text-neutral-300"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-neutral-200/70 bg-white md:hidden dark:border-neutral-800 dark:bg-neutral-950"
            >
              <div className="flex flex-col gap-1 px-6 py-4">
                {links.map((link) => {
                  const active = isLinkActive(pathname, link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-300"
                          : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                {session?.user ? (
                  <div className="mt-2 flex flex-col gap-2 px-3">
                    <LinkButton href="/profile" variant="outline" size="sm">
                      My Profile
                    </LinkButton>
                    {isStaff(session.user.role) && (
                      <LinkButton href="/admin" variant="outline" size="sm">
                        Admin
                      </LinkButton>
                    )}
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="rounded-full border border-neutral-200 py-2 text-sm font-medium text-red-600 dark:border-neutral-700"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="mt-2 flex gap-3 px-3">
                    <button
                      onClick={() => {
                        setOpen(false);
                        openSignIn();
                      }}
                      className="flex-1 rounded-full border border-neutral-200 py-2 text-sm font-medium text-neutral-700 dark:border-neutral-700 dark:text-neutral-300"
                    >
                      Log in
                    </button>
                    <button
                      onClick={() => {
                        setOpen(false);
                        openSignUp();
                      }}
                      className="flex-1 rounded-full bg-primary-700 py-2 text-sm font-semibold text-white"
                    >
                      Get Started
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        defaultTab={authTab}
      />
    </>
  );
}
