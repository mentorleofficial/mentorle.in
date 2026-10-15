import type { ImageAsset } from "@/data/home";

// Event detail pages (/events/<slug>). Each record is shaped like the row a mentor/admin will create on the
// platform later (one table + speakers), so swapping `eventDetails` for a database query only touches
// `getEvent` / `getEventSlugs`. Dates are ISO strings with the IST offset; the page formats them.

export type EventStatus = "upcoming" | "live" | "completed" | "cancelled";

// Icons for the journey row on the event cover card ("from" → "to"); add more as events need them.
export type CoverIcon = "graduation" | "briefcase";

export type EventSpeaker = {
  name: string;
  role: string;
  photo?: ImageAsset; // without a photo the card shows initials, as in the design
  links: { label: string; href: string }[];
};

export type EventDetail = {
  slug: string;
  kind: string; // label next to the status chip ("Event", "Workshop", "Summit"…)
  status: EventStatus;
  title: string;
  subtitle: string;
  host: string;
  startsAt: string;
  registrationDeadline: string;
  venue: string;
  hero: ImageAsset & { alt: string };
  cover: { journey?: [CoverIcon, CoverIcon] };
  about: string;
  learn: string[];
  prerequisites: string[];
  highlights: string[];
  speakers: EventSpeaker[];
  // Present when mentees can register on Mentorle (the platform's free RSVP into `event_participants`).
  // `label` is the button text; `externalLink` mirrors the platform's `registration_link`, opened after RSVP.
  registration?: { label: string; maxParticipants?: number; externalLink?: string };
};

export const eventDetails: EventDetail[] = [
  {
    slug: "from-classroom-to-boardroom",
    kind: "Event",
    status: "completed",
    title: "From Classroom to Boardroom",
    subtitle: "Building Your Tech Future with Mentorle",
    host: "CT University, Ludhiana",
    startsAt: "2025-10-13T11:00:00+05:30",
    registrationDeadline: "2025-10-13T23:59:00+05:30",
    venue: "A2 Seminar Hall, CT University, Ludhiana",
    hero: { src: "/event-detail/hero.webp", width: 2880, height: 1040, alt: "A speaker addressing a packed auditorium" },
    cover: { journey: ["graduation", "briefcase"] },
    about:
      "Ready to turn your academic knowledge into career success? From Classroom to Boardroom is a career-focused session designed to help students prepare for the professional world. Learn how to build a standout resume, approach interviews with confidence, plan your career strategically, and connect with experienced professionals. Discover practical insights and actionable advice to help you take your first step toward a successful career in tech.",
    learn: [
      "How to create a job-ready resume that stands out to recruiters",
      "Practical interview strategies to build confidence",
      "How to use Mentorle to connect with experienced professionals",
      "Career planning techniques for identifying the right opportunities",
      "Industry insights into the skills employers value most",
    ],
    prerequisites: [
      "A curious mindset and willingness to learn",
      "Basic understanding of resumes and job applications",
      "A notebook or laptop to capture important insights",
      "Interest in technology, career planning, and professional growth",
      "Openness to networking and receiving mentor feedback",
    ],
    highlights: [
      "Practical career-building guidance",
      "Real-world insights from industry experience",
      "Interactive discussion and Q&A",
      "Networking opportunities with fellow students",
      "Actionable steps for your professional journey",
    ],
    speakers: [
      {
        name: "Ankit Kumar",
        role: "Technology Professional & Career Mentor",
        // Placeholder profile URLs: the design shows the labels only (logged in SPEC-VS-DESIGN).
        links: [
          { label: "LinkedIn", href: "https://www.linkedin.com/" },
          { label: "GitHub", href: "https://github.com/" },
        ],
      },
    ],
  },
  // The three hosted gatherings on Events & Summits. Only their card text exists in the Figma: everything
  // below the card copy (times, venues, agenda, speakers) is placeholder, logged in SPEC-VS-DESIGN.
  {
    slug: "mohali-leadership-dinner",
    kind: "Leadership Dinner",
    status: "upcoming",
    title: "Mohali Leadership Dinner",
    subtitle: "An intimate evening with senior operators",
    host: "Mentorle, Mohali",
    startsAt: "2026-09-12T19:00:00+05:30",
    registrationDeadline: "2026-09-08T23:59:00+05:30",
    venue: "Venue shared with confirmed guests, Mohali",
    hero: { src: "/event-detail/hero.webp", width: 2880, height: 1040, alt: "Guests at a Mentorle gathering" },
    cover: {},
    about:
      "An intimate evening where senior operators share what they wish they had known earlier, with time for one-on-one questions. Seats are limited so every guest gets real time with the people at their table.",
    learn: [
      "How senior operators think about career moves and timing",
      "The mistakes they would avoid if they started again",
      "How to ask for mentorship and keep the relationship going",
    ],
    prerequisites: ["Two or more years of work experience", "One question you would like answered over dinner"],
    highlights: ["Small tables with senior operators", "Open one-on-one questions", "Dinner on Mentorle"],
    speakers: [],
    registration: { label: "Request Invite", maxParticipants: 40 },
  },
  {
    slug: "punjab-technical-conclave",
    kind: "Summit",
    status: "upcoming",
    title: "Punjab Technical Conclave",
    subtitle: "A full-day campus summit for engineering students",
    host: "Mentorle Campus Summits",
    startsAt: "2026-08-28T10:00:00+05:30",
    registrationDeadline: "2026-08-25T23:59:00+05:30",
    venue: "Campus auditorium, Punjab (confirmed on registration)",
    hero: { src: "/event-detail/hero.webp", width: 2880, height: 1040, alt: "A speaker addressing a packed auditorium" },
    cover: { journey: ["graduation", "briefcase"] },
    about:
      "A full-day campus summit featuring guest lectures from FAANG engineers and startup founders for over 500+ students. Expect talks on landing your first role, building real projects and growing in your first years on the job.",
    learn: [
      "What top tech companies look for in fresh graduates",
      "How founders hire their first engineers",
      "Building a portfolio that gets interviews",
      "Planning your first three years in tech",
    ],
    prerequisites: ["Currently enrolled in college", "Your college ID for entry"],
    highlights: ["Guest lectures from FAANG engineers", "Founder panel and Q&A", "Networking with 500+ students"],
    speakers: [],
    registration: { label: "Register Free", maxParticipants: 500 },
  },
  {
    slug: "builders-pitch-circle",
    kind: "Pitch Circle",
    status: "upcoming",
    title: "Builders Pitch Circle",
    subtitle: "Pitch to operators and angels, get unfiltered feedback",
    host: "Mentorle Founders Circle",
    startsAt: "2026-10-04T17:00:00+05:30",
    registrationDeadline: "2026-09-27T23:59:00+05:30",
    venue: "Venue shared with selected founders",
    hero: { src: "/event-detail/hero.webp", width: 2880, height: 1040, alt: "Founders pitching at a Mentorle pitch circle" },
    cover: {},
    about:
      "Early-stage founders pitch to a panel of operators and angels, then get unfiltered feedback over chai. Applications are reviewed and selected founders get a five-minute slot plus a feedback round.",
    learn: [
      "How operators and angels judge an early-stage pitch",
      "Where your story, market and traction land with investors",
      "The next steps the panel would take in your place",
    ],
    prerequisites: ["An early-stage startup (idea to seed)", "A five-minute pitch deck"],
    highlights: ["Five-minute pitch slot", "Feedback from operators and angels", "Chai and networking after"],
    speakers: [],
    registration: { label: "Apply to Pitch", maxParticipants: 12 },
  },
];

export const getEvent = (slug: string) => eventDetails.find((event) => event.slug === slug);
export const getEventSlugs = () => eventDetails.map((event) => event.slug);

export const eventDetailCopy = {
  breadcrumb: { parent: "Events & Summits", parentHref: "/events", current: "Event detail" },
  hostedBy: "Hosted by:",
  coverBrand: "MENTORLE",
  status: { upcoming: "Upcoming", live: "Happening now", completed: "Completed", cancelled: "Cancelled" } satisfies Record<EventStatus, string>,
  details: { title: "Event details", dateTime: "Date & Time", location: "Location", deadline: "Registration Deadline" },
  registration: {
    register: "Register Now",
    closed: "Registration closed",
    working: "Registering…",
    registered: "You’re registered",
    registeredNote: "We’ll email you the details before the event.",
    cancel: "Cancel registration",
    cancelling: "Cancelling…",
    full: "This event is full.",
    failed: "Couldn’t register. Please try again.",
    finishProfile: "Finish your profile to register. It takes about two minutes.",
    signIn: "Create a free account or log in to register.",
    notes: {
      upcoming: (deadline: string) => `Registration closes ${deadline}.`,
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
