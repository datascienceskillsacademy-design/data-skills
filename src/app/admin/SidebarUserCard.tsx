"use client";

import { useState } from "react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { LogOut, User } from "lucide-react";

interface SidebarUserCardProps {
  name: string | null;
  email: string | null;
  image: string | null;
}

export function SidebarUserCard({ name, email, image }: SidebarUserCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  function handleSignOut() {
    setSigningOut(true);
    signOut({ callbackUrl: "/" });
  }

  return (
    <>
      <div className="mt-3 flex items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-900">
        {image ? (
          <Image
            src={image}
            alt={name ?? "Account"}
            width={36}
            height={36}
            className="h-9 w-9 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700">
            <User className="h-4 w-4" />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-neutral-900">
            {name ?? "Account"}
          </p>
          <p className="truncate text-xs text-neutral-400">{email}</p>
        </div>
        <button
          onClick={() => setConfirmOpen(true)}
          title="Sign out"
          aria-label="Sign out"
          className="rounded-lg p-2 text-neutral-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>

      {confirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => !signingOut && setConfirmOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                <LogOut className="h-5 w-5" />
              </span>
              <h2 className="text-sm font-semibold text-neutral-900">Sign out</h2>
            </div>
            <p className="mt-3 text-sm text-neutral-600">
              Are you sure you want to sign out of the admin panel?
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                disabled={signingOut}
                className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-60"
              >
                {signingOut ? "Signing out…" : "Sign Out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
