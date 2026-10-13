import type { ImageAsset } from "@/data/home";
import { mentors } from "@/data/mentors";
import type { Mentor } from "@/data/mentors";

// No request form is designed yet; these links point at the planned request page (it 404s until built).
export const SPEAKER_REQUEST_PATH = "/speaker-hub/request";

const speakerSlugs = ["arjun-malhotra", "meera-kapoor"];

// Placeholder roster: the Figma shows two homepage mentors as speakers; real speakers will come from the Mentorle database.
export const speakers: Mentor[] = speakerSlugs.map((slug) => {
  const mentor = mentors.find((entry) => entry.slug === slug);
  if (!mentor) throw new Error(`Unknown speaker slug: ${slug}`);
  return mentor;
});

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
