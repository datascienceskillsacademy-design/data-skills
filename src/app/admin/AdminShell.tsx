"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";

const SidebarCloseContext = createContext<(() => void) | null>(null);

/** Lets nav links inside the sidebar dismiss the mobile drawer on tap. */
export function useCloseSidebar() {
  return useContext(SidebarCloseContext);
}

interface AdminShellProps {
  panelLabel: string;
  sidebar: ReactNode;
  children: ReactNode;
}

export function AdminShell({ panelLabel, sidebar, children }: AdminShellProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const close = () => setOpen(false);

  // Close the drawer on navigation. Adjusting state during render (rather
  // than in an effect) avoids a flash of the open drawer on the new page.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  return (
    <SidebarCloseContext.Provider value={close}>
      <div className="flex h-screen overflow-hidden bg-neutral-50 dark:bg-neutral-950">
        {open && (
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={close}
            aria-hidden="true"
          />
        )}

        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] -translate-x-full flex-col border-r border-neutral-200 bg-white transition-transform duration-200 ease-in-out dark:border-neutral-800 dark:bg-neutral-950 lg:static lg:z-auto lg:w-64 lg:max-w-none lg:translate-x-0",
            open && "translate-x-0"
          )}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="absolute right-3 top-4 flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 lg:hidden dark:hover:bg-neutral-800"
          >
            <X className="h-4 w-4" />
          </button>
          {sidebar}
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex shrink-0 items-center gap-3 border-b border-neutral-200 bg-white px-4 py-4 dark:border-neutral-800 dark:bg-neutral-950 lg:hidden">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="font-display text-sm font-bold text-neutral-900 dark:text-white">
              {panelLabel}
            </span>
          </div>

          <main className="flex-1 overflow-auto">
            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarCloseContext.Provider>
  );
}
