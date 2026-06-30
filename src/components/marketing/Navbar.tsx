"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Menu, X, LayoutDashboard, LogOut, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { AuthModal } from "@/components/auth/AuthModal";
import { LinkButton } from "@/components/ui/Button";

const links = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/#instructors", label: "Instructors" },
  { href: "/#testimonials", label: "Reviews" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"signin" | "signup">("signin");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: session } = useSession();

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
      <header className="sticky top-0 z-40 border-b border-neutral-200/70 bg-white/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-lg font-bold text-neutral-900"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white">
              <GraduationCap className="h-5 w-5" />
            </span>
            DataSkills
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-neutral-600 transition-colors hover:text-primary-700"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop auth */}
          <div className="hidden items-center gap-3 md:flex">
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
                      className="absolute right-0 top-12 z-50 w-52 rounded-2xl border border-neutral-100 bg-white py-2 shadow-xl"
                    >
                      <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50"
                      >
                        <User className="h-4 w-4 text-neutral-400" />
                        My Profile
                      </Link>
                      {session.user.role === "ADMIN" && (
                        <Link
                          href="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50"
                        >
                          <LayoutDashboard className="h-4 w-4 text-neutral-400" />
                          Admin Dashboard
                        </Link>
                      )}
                      <hr className="my-1 border-neutral-100" />
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
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

          <button
            className="rounded-lg p-2 text-neutral-700 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-neutral-200/70 bg-white md:hidden"
            >
              <div className="flex flex-col gap-1 px-6 py-4">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                  >
                    {link.label}
                  </Link>
                ))}
                {session?.user ? (
                  <div className="mt-2 flex flex-col gap-2 px-3">
                    <LinkButton href="/profile" variant="outline" size="sm">
                      My Profile
                    </LinkButton>
                    {session.user.role === "ADMIN" && (
                      <LinkButton href="/admin" variant="outline" size="sm">
                        Admin
                      </LinkButton>
                    )}
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="rounded-full border border-neutral-200 py-2 text-sm font-medium text-red-600"
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
                      className="flex-1 rounded-full border border-neutral-200 py-2 text-sm font-medium text-neutral-700"
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
