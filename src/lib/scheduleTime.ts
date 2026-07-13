const TIMEZONE = "Asia/Dhaka";
const TIMEZONE_OFFSET = "+06:00";

export function formatClassDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatClassTime(date: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
}

export function formatClassTimeRange(startsAt: Date | string, endsAt: Date | string) {
  return `${formatClassTime(startsAt)} – ${formatClassTime(endsAt)} (BDT)`;
}

/** Interprets a `YYYY-MM-DD` + `HH:mm` pair as Bangladesh local time (fixed UTC+6, no DST). */
export function dhakaLocalToISOString(dateStr: string, timeStr: string) {
  return new Date(`${dateStr}T${timeStr}:00${TIMEZONE_OFFSET}`).toISOString();
}

/** Splits a stored UTC instant back into the `YYYY-MM-DD` / `HH:mm` pair, as seen in Dhaka. */
export function isoToDhakaLocalParts(date: Date | string) {
  const d = new Date(date);
  const dateStr = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
  const timeStr = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
  return { dateStr, timeStr };
}

/**
 * Renders a stored UTC instant as a timezone-less "YYYY-MM-DDTHH:mm:00" string
 * representing its Dhaka wall-clock time. Feed this to libraries (like FullCalendar
 * in its default 'local' mode) that display date strings verbatim — it guarantees
 * every viewer sees the same Bangladesh-local time regardless of their own timezone,
 * without needing a timezone-database plugin.
 */
export function toDhakaNaiveLocalString(date: Date | string) {
  const { dateStr, timeStr } = isoToDhakaLocalParts(date);
  return `${dateStr}T${timeStr}:00`;
}
