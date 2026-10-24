import type { ImageAsset } from "@/data/home";

// Event detail pages (/events/<slug>). `EventDetail` is built from the platform's events_programs row by
// src/lib/events/queries.ts (never selecting meeting_link, which is only for registered attendees).
// Dates are ISO strings; the page formats them in IST.

export type EventStatus = "upcoming" | "live" | "completed" | "cancelled";

// Icons for the journey row on the generated event cover ("from" → "to"); add more as events need them.
export type CoverIcon = "graduation" | "briefcase";

export type EventSpeaker = {
  name: string;
  role?: string;
  photo?: ImageAsset; // without a photo the card shows initials, as in the design
  links: { label: string; href: string }[];
};

export type EventDetail = {
  id: string; // events_programs.id, used for registration
  slug: string;
  kind: string; // label next to the status chip ("Event", "Workshop", "Guest Session"…)
  status: EventStatus;
  title: string;
  subtitle: string | null;
  host: string;
  startsAt: string;
  endsAt: string;
  registrationDeadline: string;
  venue: string;
  // The event's own banner (events_programs.banner_image_url) takes the cover slot; without one the page
  // draws the dark generated cover.
  banner: { src: string; alt: string } | null;
  cover: { journey?: [CoverIcon, CoverIcon] };
  about: string[]; // paragraphs
  learn: string[];
  prerequisites: string[];
  highlights: string[];
  speakers: EventSpeaker[];
  // Present when mentees can register on Mentorle (the platform's free RSVP into `event_participants`).
  // `label` is the button text; `externalLink` mirrors the platform's `registration_link`, opened after RSVP.
  registration?: { label: string; maxParticipants?: number; externalLink?: string };
  // Why an upcoming event isn't taking registrations.
  closedReason?: "deadline" | "full" | "paid";
};

// Every event page shares the design's pre-blurred hero background; event banners are bright photos that
// would make the white hero text unreadable, so they go in the cover slot instead.
export const eventHeroBackground: ImageAsset & { alt: string } = { src: "/event-detail/hero.webp", width: 2880, height: 1040, alt: "" };

export const eventDetailCopy = {
  breadcrumb: { parent: "Events & Summits", parentHref: "/events", current: "Event detail" },
  hostedBy: "Hosted by:",
  viewEvent: "View Event",
  coverBrand: "MENTORLE",
  status: { upcoming: "Upcoming", live: "Happening now", completed: "Completed", cancelled: "Cancelled" } satisfies Record<EventStatus, string>,
  details: { title: "Event details", dateTime: "Date & Time", location: "Location", deadline: "Registration Deadline" },
  registration: {
    register: "Register Now",
    closed: "Registration closed",
    working: "Registering…",
    registered: "You’re registered",
    join: "Join the meeting",
    registeredNote: "We’ll email you the details before the event.",
    cancel: "Cancel registration",
    cancelling: "Cancelling…",
    full: "This event is full.",
    failed: "Couldn’t register. Please try again.",
    finishProfile: "Finish your profile to register. It takes about two minutes.",
    signIn: "Create a free account or log in to register.",
    notes: {
      upcoming: (deadline: string) => `Registration closes ${deadline}.`,
      deadline: (deadline: string) => `Registration closed ${deadline}.`,
      full: "This event is full.",
      // Placeholder: paid events (events_programs.price > 0) need checkout, which isn't built yet.
      paid: "Registration for this event opens soon.",
      live: "This event is happening now.",
      completed: "This event has been completed.",
      cancelled: "This event has been cancelled.",
    },
  },
  sections: {
    about: "About This Event",
    learn: "What You'll Learn",
    prerequisites: "Prerequisites",
    speaker: "Guest Speaker",
    speakers: "Guest Speakers",
    highlights: "Event Highlights",
  },
};
