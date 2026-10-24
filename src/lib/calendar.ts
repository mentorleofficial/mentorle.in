// "Add to Google Calendar" link for a session (booking dialog, My sessions).
const toCalDate = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export function googleCalendarUrl(title: string, startsAt: string, minutes: number, link: string) {
  const end = new Date(Date.parse(startsAt) + minutes * 60_000).toISOString();
  const params = new URLSearchParams({ action: "TEMPLATE", text: title, dates: `${toCalDate(startsAt)}/${toCalDate(end)}`, details: `Meeting link: ${link}`, location: link });
  return `https://calendar.google.com/calendar/render?${params}`;
}
