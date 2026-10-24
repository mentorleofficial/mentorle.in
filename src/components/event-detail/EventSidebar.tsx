import Image from "next/image";
import { JoinLink, RegisterAction } from "@/components/event-detail/RegisterAction";
import { eventDetailCopy } from "@/data/event-details";
import type { EventDetail, EventSpeaker } from "@/data/event-details";
import { initialsOf } from "@/lib/initials";
import { formatEventDateTime } from "@/lib/dates";

const { details, registration, sections } = eventDetailCopy;

const cardTitle = "text-2xl leading-tight font-medium text-ink";

// "Event details": date, location and deadline rows, then the registration action. Upcoming events that take
// registrations get RegisterAction (client: depends on who's signed in); everything else shows the closed state.
export function EventDetailsCard({ event }: { event: EventDetail }) {
  const deadline = formatEventDateTime(event.registrationDeadline);
  const rows = [
    { icon: "/event-detail/date-and-time.svg", width: 18, height: 20, label: details.dateTime, value: formatEventDateTime(event.startsAt) },
    { icon: "/event-detail/location.svg", width: 22, height: 22, label: details.location, value: event.venue },
    { icon: "/event-detail/deadline.svg", width: 20, height: 20, label: details.deadline, value: deadline },
  ];
  const registrationOpen = event.status === "upcoming" ? event.registration : undefined;
  const note =
    event.status !== "upcoming"
      ? registration.notes[event.status]
      : event.closedReason === "deadline"
        ? registration.notes.deadline(deadline)
        : event.closedReason
          ? registration.notes[event.closedReason]
          : registration.notes.upcoming(deadline);

  return (
    <section aria-labelledby="event-details-title" data-animate="fade-up" className="border border-[#cbcbcb] bg-surface p-6 md:p-7 lg:self-start">
      <h2 id="event-details-title" className={cardTitle}>
        {details.title}
      </h2>
      <dl className="mt-6 space-y-5">
        {rows.map((row) => (
          <div key={row.label} className="flex gap-3.5">
            <span className="flex size-5 shrink-0 items-center justify-center">
              <Image src={row.icon} alt="" width={row.width} height={row.height} className="max-w-none" />
            </span>
            <div>
              <dt className="text-sm text-ink-soft">{row.label}</dt>
              <dd className="mt-1.5 text-base text-ink">{row.value}</dd>
            </div>
          </div>
        ))}
      </dl>

      <div className="mt-5 border-t border-[#cbcbcb] pt-5">
        {registrationOpen ? (
          <RegisterAction event={{ ...event, registration: registrationOpen }} deadlineNote={note} />
        ) : (
          <>
            <button type="button" disabled className="flex h-12 w-full cursor-not-allowed items-center justify-center gap-2.5 bg-[#e3e3e3] text-sm text-ink-soft">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" className="size-4" aria-hidden>
                <rect x="2.75" y="7" width="10.5" height="7.25" rx="1.5" />
                <path d="M5 7V5a3 3 0 0 1 6 0v2M8 10v1.5" strokeLinecap="round" />
              </svg>
              {registration.closed}
            </button>
            <p className="mt-5 text-sm text-ink-soft">{note}</p>
            {/* Happening now: registered attendees get the meeting link (nobody else can read it). */}
            {event.status === "live" && <JoinLink eventId={event.id} />}
          </>
        )}
      </div>
    </section>
  );
}

function SpeakerAvatar({ speaker }: { speaker: EventSpeaker }) {
  if (speaker.photo) {
    // Speaker photos are links from the event form (any host), so they skip the image optimizer.
    return (
      <Image
        src={speaker.photo.src}
        alt=""
        width={speaker.photo.width}
        height={speaker.photo.height}
        unoptimized={speaker.photo.src.startsWith("http")}
        className="size-[4.5rem] shrink-0 object-cover"
      />
    );
  }
  return (
    <span className="flex size-[4.5rem] shrink-0 items-center justify-center bg-surface text-2xl font-medium text-ink" aria-hidden>
      {initialsOf(speaker.name)}
    </span>
  );
}

export function SpeakersCard({ speakers }: { speakers: EventSpeaker[] }) {
  if (!speakers.length) return null;
  return (
    <section aria-labelledby="speakers-title" data-animate="fade-up" className="border border-line bg-white p-6 md:p-7">
      <h2 id="speakers-title" className={cardTitle}>
        {speakers.length > 1 ? sections.speakers : sections.speaker}
      </h2>
      <ul>
        {speakers.map((speaker) => (
          <li key={speaker.name} className="border-line not-last:mb-6 not-last:border-b not-last:pb-6">
            <div className="mt-6 flex items-center gap-[1.125rem]">
              <SpeakerAvatar speaker={speaker} />
              <p className="text-xl leading-tight font-medium text-ink md:text-2xl">{speaker.name}</p>
            </div>
            {speaker.role && <p className="mt-6 text-base text-ink">{speaker.role}</p>}
            {speaker.links.length > 0 && (
              <p className="mt-6 border-t border-line pt-6 text-sm text-ink-soft">
                {speaker.links.map((link, index) => (
                  <span key={link.label}>
                    {index > 0 && " · "}
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="underline-offset-4 transition-colors hover:text-ink hover:underline">
                      {link.label}
                    </a>
                  </span>
                ))}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function HighlightsCard({ highlights }: { highlights: string[] }) {
  if (!highlights.length) return null;
  return (
    <section aria-labelledby="highlights-title" data-animate="fade-up" className="bg-surface p-6 md:p-7">
      <h2 id="highlights-title" className={cardTitle}>
        {sections.highlights}
      </h2>
      <ul className="mt-6 space-y-6">
        {highlights.map((item) => (
          <li key={item} className="grid grid-cols-[2rem_1fr] text-base leading-[1.625] text-ink">
            <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.4" className="mt-[0.3125rem] ml-1 size-[0.5625rem] text-brand" aria-hidden>
              <path d="M1 9L9 1M3 1h6v6" />
            </svg>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
