"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Bell, LogOut } from "lucide-react";
import type { User } from "@/lib/types";

export function Topbar({ user }: { user: User }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="flex items-center justify-between border-b border-neutral-200/70 bg-white/80 px-6 py-4 backdrop-blur-md lg:px-10">
      <div>
        <p className="text-xs text-neutral-400">Dashboard</p>
        <h2 className="font-display text-lg font-semibold text-neutral-900">
          Welcome back, {user.name.split(" ")[0]} 👋
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <button
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-colors hover:bg-neutral-100"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-accent-500" />
        </button>

        <button
          onClick={handleLogout}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-colors hover:bg-red-50 hover:text-red-600 lg:hidden"
          aria-label="Log out"
        >
          <LogOut className="h-4 w-4" />
        </button>

        <Image
          src={user.avatar}
          alt={user.name}
          width={40}
          height={40}
          className="rounded-full object-cover lg:hidden"
        />
      </div>
    </header>
  );
}
