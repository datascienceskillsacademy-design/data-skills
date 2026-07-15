"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { UserRoundCheck } from "lucide-react";
import { ProfileForm } from "./ProfileForm";

const DISMISS_KEY = "complete-profile-modal-dismissed";

/**
 * Nudges signed-in students with an incomplete profile to finish it,
 * wherever they are on the site. Dismissing snoozes it for the browser
 * session; it reappears on the next visit until the profile is complete.
 */
export function CompleteProfileModal() {
  const { data: session, update } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!session?.user) return;
    if (session.user.role !== "STUDENT" || session.user.profileCompleted) {
      setOpen(false);
      return;
    }
    if (pathname.startsWith("/complete-profile")) return;
    if (sessionStorage.getItem(DISMISS_KEY)) return;
    setOpen(true);
  }, [session, pathname]);

  if (!open || !session?.user) return null;

  function dismiss() {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setOpen(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="border-b border-neutral-100 px-6 py-6 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
            <UserRoundCheck className="h-6 w-6" />
          </span>
          <h2 className="mt-4 font-display text-xl font-bold text-neutral-900">
            Complete Your Profile
          </h2>
          <p className="mx-auto mt-1.5 max-w-xs text-sm text-neutral-500">
            A few details are missing. We use them for course communication and
            your certificates.
          </p>
        </div>

        <div className="px-6 py-5">
          <ProfileForm
            email={session.user.email ?? ""}
            initial={{
              name: session.user.name ?? "",
              phone: "",
              designation: "",
              organization: "",
            }}
            submitLabel="Save Profile"
            onSuccess={() => {
              update();
              setOpen(false);
            }}
          />
          <button
            type="button"
            onClick={dismiss}
            className="mt-3 w-full py-1 text-center text-sm font-medium text-neutral-400 transition hover:text-neutral-600"
          >
            I&rsquo;ll do it later
          </button>
        </div>
      </div>
    </div>
  );
}
