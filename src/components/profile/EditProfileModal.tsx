"use client";

import { useState } from "react";
import { Pencil, X } from "lucide-react";
import { ProfileForm, type ProfileFormValues } from "./ProfileForm";

interface EditProfileModalProps {
  email: string;
  initial: ProfileFormValues;
}

export function EditProfileModal({ email, initial }: EditProfileModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full bg-primary-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-800"
      >
        <Pencil className="h-4 w-4" />
        Edit Profile
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-3 border-b border-neutral-100 px-6 py-5">
              <div>
                <h2 className="font-display text-lg font-bold text-neutral-900">
                  Edit Profile
                </h2>
                <p className="mt-0.5 text-sm text-neutral-500">
                  Keep your information up to date.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="px-6 py-5">
              <ProfileForm
                email={email}
                initial={initial}
                submitLabel="Save Changes"
                onSuccess={() => setOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
