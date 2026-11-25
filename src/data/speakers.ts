import type { ImageAsset } from "@/data/home";
import type { Mentor } from "@/data/mentors";

// The speaker request (/speaker-hub/request): a two-step dialog in the auth modal's card, over the Speaker Hub.
// No Figma (SPEC-VS-DESIGN SR rows).
export const SPEAKER_REQUEST_PATH = "/speaker-hub/request";

export const speakerRequestCopy = {
  metaTitle: "Request a speaker",
  metaDescription: "Tell us about your event. The Mentorle team will reply by email with speakers, availability and next steps.",
  steps: [
    { title: "Request a speaker", subtitle: "Tell us about your event." },
    { title: "How do we reach you?", subtitle: "The Mentorle team will reply by email with speakers, availability and next steps." },
  ],
  stepOf: (step: number, total: number) => `Step ${step} of ${total}`,
  next: "Continue",
  back: "Back",
  fields: {
    speaker: "Speaker",
    anySpeaker: "Match me with the right speaker",
    name: "Your name",
    email: "Work email",
    phone: "Phone",
    phoneSuffix: "(optional)",
    country: "Country code",
    organization: "Organisation",
    organizationHint: "College, company or community hosting the event.",
    eventName: "Event name",
    eventType: "Type of event",
    eventDate: "Event date",
    eventDateSuffix: "(optional)",
    audienceSize: "Expected audience",
    format: "Format",
    city: "City",
    citySuffix: "(for in-person events)",
    message: "Anything else we should know?",
    messageSuffix: "(optional)",
    messagePlaceholder: "Topic, duration, budget, what you'd like attendees to take away…",
    choose: "Choose one",
  },
  eventTypes: [
    { value: "conference", label: "Conference" },
    { value: "university", label: "University or college event" },
    { value: "corporate", label: "Corporate event or offsite" },
    { value: "workshop", label: "Workshop" },
    { value: "webinar", label: "Webinar" },
    { value: "other", label: "Something else" },
  ],
  audienceSizes: [
    { value: "under_50", label: "Under 50 people" },
    { value: "50_200", label: "50–200 people" },
    { value: "200_500", label: "200–500 people" },
    { value: "500_plus", label: "500+ people" },
  ],
  formats: [
    { value: "in_person", label: "In person" },
    { value: "online", label: "Online" },
    { value: "hybrid", label: "Hybrid" },
  ],
  privacy: { before: "We use these details only to arrange your event. See our", link: "Privacy Policy", href: "/privacy", after: "." },
  submit: "Send request",
  submitting: "Sending…",
  sent: {
    title: "Request sent",
    body: (email: string) => `Thanks! The Mentorle team will reply to ${email} with next steps.`,
    done: "Done",
    another: "Send another request",
  },
  errors: {
    name: "Enter your name.",
    email: "Enter a valid email address.",
    phone: "Enter a valid phone number.",
    organization: "Enter your organisation.",
    eventName: "Enter the event's name.",
    choose: "Choose an option.",
    pastDate: "The event date is in the past.",
    city: "Enter the city for an in-person event.",
    rateLimited: "Too many requests from this email. Please try again in a while.",
    generic: "Couldn’t send your request. Please try again.",
  },
};

// Placeholder roster from the Figma (the design's two sample mentors). They aren't real mentors, so their cards
// link to the speaker request rather than a mentor profile. Real speakers will come from the Mentorle database.
export const speakers: Mentor[] = [
  {
    slug: "arjun-malhotra",
    name: "Arjun Malhotra",
    role: "Head of Product · Ex-Microsoft",
    company: "Microsoft",
    years: 12,
    experience: "12+ yrs",
    focus: "Growth Strategy",
    expertise: ["Product management", "Growth", "B2B SaaS", "PM interviews"],
    sessionTypes: [],
    photo: "/homepage/community/arjun-malhotra.webp",
  },
  {
    slug: "meera-kapoor",
    name: "Meera Kapoor",
    role: "Founder · Ex-McKinsey",
    company: "McKinsey",
    years: 10,
    experience: "10+ yrs",
    focus: "Startup Strategy",
    expertise: ["Fundraising", "Pitch decks", "Go-to-market", "Consulting"],
    sessionTypes: [],
    photo: "/homepage/community/meera-kapoor.webp",
  },
];

export const speakerRequestHref = (slug?: string) =>
  slug ? `${SPEAKER_REQUEST_PATH}?speaker=${encodeURIComponent(slug)}` : SPEAKER_REQUEST_PATH;

export const speakerHubPage = {
  hero: {
    title: "Book the World’s Best Speakers",
    subtitle: "Elevate your next conference, university summit, or corporate retreat with insights from top founders.",
    background: { src: "/speaker-hub/hero.webp", width: 2880, height: 1440, alt: "" } satisfies ImageAsset & { alt: string },
    primaryCta: { label: "Find a Mentor", href: "/mentors" },
    secondaryCta: { label: "Explore Mentorle Plus", href: "/pricing" },
  },
  requestLabel: "Request for Event",
  customRequest: {
    title: "Don’t see who you need?",
    description: "Tell us about your event and we will match you with the perfect speaker from our private network.",
    cta: "Request for Event",
  },
};
