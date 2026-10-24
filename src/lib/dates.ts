// Event dates are stored as ISO strings and always shown in IST (the design's "11:00 AM IST"). Pinning the
// time zone keeps the server and browser output identical, so there's no hydration mismatch.

const TIME_ZONE = "Asia/Kolkata";

const dateFormat = new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, month: "long", day: "numeric", year: "numeric" });
const timeFormat = new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, hour: "numeric", minute: "2-digit", hour12: true });

export const formatEventDate = (iso: string) => dateFormat.format(new Date(iso)); // October 13, 2025
// Some ICU versions put a narrow no-break space before AM/PM; normalise it so output is identical everywhere.
export const formatEventTime = (iso: string) => `${timeFormat.format(new Date(iso)).replace(/ /g, " ")} IST`; // 11:00 AM IST
export const formatEventDateTime = (iso: string) => `${formatEventDate(iso)} · ${formatEventTime(iso)}`;

const dayFormat = new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, weekday: "long", day: "numeric", month: "long", year: "numeric" });
const clock = (iso: string) => formatEventTime(iso).replace(/ IST$/, "");

export const formatEventDay = (iso: string) => dayFormat.format(new Date(iso)); // Saturday, 12 September 2026
// "7:00 PM – 10:00 PM IST"; a single time when the event has no separate end.
export const formatEventTimeRange = (startIso: string, endIso: string) =>
  endIso && endIso !== startIso ? `${clock(startIso)} – ${clock(endIso)} IST` : `${clock(startIso)} IST`;

const dayKeyFormat = new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" });
// "2026-10-26": the IST calendar day of an instant (groups booking slots by day).
export const istDayKey = (iso: string | Date) => dayKeyFormat.format(typeof iso === "string" ? new Date(iso) : iso);
// "10:00 AM" (IST, no suffix).
export const formatClock = clock;

const shortDateFormat = new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, month: "short", day: "numeric" });
// "5 min ago", "3 h ago", "2 d ago", then "Oct 21". Client-only (needs the current time).
export function formatRelativeTime(iso: string, now: number, justNow: string) {
  const minutes = Math.floor((now - Date.parse(iso)) / 60_000);
  if (minutes < 1) return justNow;
  if (minutes < 60) return `${minutes} min ago`;
  if (minutes < 24 * 60) return `${Math.floor(minutes / 60)} h ago`;
  if (minutes < 7 * 24 * 60) return `${Math.floor(minutes / (24 * 60))} d ago`;
  return shortDateFormat.format(new Date(iso));
}

const partsFormat = new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, weekday: "short", day: "numeric", month: "short", year: "numeric" });
// { weekday: "Mon", day: "26", month: "Oct", year: "2026" } in IST, for date blocks.
export function formatDateParts(iso: string) {
  const parts = Object.fromEntries(partsFormat.formatToParts(new Date(iso)).map((part) => [part.type, part.value]));
  return { weekday: parts.weekday ?? "", day: parts.day ?? "", month: parts.month ?? "", year: parts.year ?? "" };
}
