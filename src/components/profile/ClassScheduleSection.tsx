import { CalendarDays, Clock, Video } from "lucide-react";
import { formatClassDate, formatClassTimeRange } from "@/lib/scheduleTime";
import type { ClassSchedule } from "@/generated/prisma/client";

export function ClassScheduleSection({ classes }: { classes: ClassSchedule[] }) {
  if (classes.length === 0) return null;

  const now = new Date();
  const upcoming = classes
    .filter((c) => new Date(c.endsAt) >= now)
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  const past = classes
    .filter((c) => new Date(c.endsAt) < now)
    .sort((a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime());

  const [next, ...rest] = upcoming;

  return (
    <div className="mt-5 border-t border-neutral-100 pt-4">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-400">
        <CalendarDays className="h-3.5 w-3.5" />
        Class Schedule
      </p>

      {next && (
        <div className="mt-3 rounded-2xl border border-primary-100 bg-primary-50/60 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">
                Next Class
              </p>
              <p className="mt-1 truncate text-sm font-bold text-neutral-900">{next.title}</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-neutral-600">
                <Clock className="h-3.5 w-3.5 shrink-0" />
                {formatClassDate(next.startsAt)} · {formatClassTimeRange(next.startsAt, next.endsAt)}
              </p>
            </div>
            {next.meetLink && (
              <a
                href={next.meetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex shrink-0 items-center gap-2 rounded-full bg-primary-700 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-800"
              >
                <Video className="h-4 w-4" />
                Join Google Meet
              </a>
            )}
          </div>
        </div>
      )}

      {rest.length > 0 && (
        <ul className="mt-3 space-y-2">
          {rest.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-neutral-100 px-3.5 py-2.5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-neutral-800">{c.title}</p>
                <p className="text-xs text-neutral-500">
                  {formatClassDate(c.startsAt)} · {formatClassTimeRange(c.startsAt, c.endsAt)}
                </p>
              </div>
              {c.meetLink && (
                <a
                  href={c.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-xs font-semibold text-primary-600 hover:text-primary-800"
                >
                  Meet Link
                </a>
              )}
            </li>
          ))}
        </ul>
      )}

      {upcoming.length === 0 && (
        <p className="mt-3 text-sm text-neutral-400">No upcoming classes scheduled yet.</p>
      )}

      {past.length > 0 && (
        <details className="mt-3">
          <summary className="cursor-pointer text-xs font-medium text-neutral-400 hover:text-neutral-600">
            {past.length} past {past.length === 1 ? "class" : "classes"}
          </summary>
          <ul className="mt-2 space-y-1.5">
            {past.slice(0, 10).map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between gap-3 text-xs text-neutral-400"
              >
                <span className="truncate">{c.title}</span>
                <span className="shrink-0">{formatClassDate(c.startsAt)}</span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
