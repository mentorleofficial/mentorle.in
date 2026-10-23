import type { ImageAsset } from "@/data/home";
import type { Mentor } from "@/data/mentors";

// No request form is designed yet; these links point at the planned request page (it 404s until built).
export const SPEAKER_REQUEST_PATH = "/speaker-hub/request";

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
