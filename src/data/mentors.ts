import type { ImageAsset } from "@/data/home";

export type MentorDomain = "it-software" | "startups" | "academics";

// Shaped like the record the Mentorle API will return, so this file can be swapped for a fetch later.
export type Mentor = {
  slug: string;
  name: string;
  role: string;
  company: string;
  experience: string;
  focus: string;
  domain: MentorDomain;
  expertise: string[];
  photo: ImageAsset;
};

export type DomainFilter = {
  value: MentorDomain | "all";
  label: string;
  icon?: string;
};

export const domainFilters: DomainFilter[] = [
  { value: "all", label: "All Domains" },
  { value: "it-software", label: "IT & Software", icon: "/homepage/partners/IT-software.svg" },
  { value: "startups", label: "Startups", icon: "/homepage/partners/startup-pitching.svg" },
  { value: "academics", label: "Academics", icon: "/homepage/partners/academic-counseling.svg" },
];

const photos = {
  arjun: { src: "/homepage/community/arjun-malhotra.webp", width: 866, height: 756 },
  meera: { src: "/homepage/community/meera-kapoor.webp", width: 866, height: 756 },
  rohan: { src: "/homepage/community/rohan-mehta.webp", width: 866, height: 756 },
} satisfies Record<string, ImageAsset>;

// Placeholder directory: the Figma repeats the three homepage mentors; real profiles will come from the Mentorle database.
export const mentors: Mentor[] = [
  {
    slug: "arjun-malhotra",
    name: "Arjun Malhotra",
    role: "Head of Product · Ex-Microsoft",
    company: "Microsoft",
    experience: "12+ yrs",
    focus: "Growth Strategy",
    domain: "it-software",
    expertise: ["Product management", "Growth", "B2B SaaS", "PM interviews"],
    photo: photos.arjun,
  },
  {
    slug: "meera-kapoor",
    name: "Meera Kapoor",
    role: "Founder · Ex-McKinsey",
    company: "McKinsey",
    experience: "10+ yrs",
    focus: "Startup Strategy",
    domain: "startups",
    expertise: ["Fundraising", "Pitch decks", "Go-to-market", "Consulting"],
    photo: photos.meera,
  },
  {
    slug: "rohan-mehta",
    name: "Rohan Mehta",
    role: "Design Director · Ex-Adobe",
    company: "Adobe",
    experience: "08+ yrs",
    focus: "Growth Strategy",
    domain: "academics",
    expertise: ["UX design", "Portfolio reviews", "Design careers"],
    photo: photos.rohan,
  },
  {
    slug: "arjun-malhotra-2",
    name: "Arjun Malhotra",
    role: "Head of Product · Ex-Microsoft",
    company: "Microsoft",
    experience: "12+ yrs",
    focus: "Growth Strategy",
    domain: "it-software",
    expertise: ["Product management", "Growth", "B2B SaaS", "PM interviews"],
    photo: photos.arjun,
  },
  {
    slug: "meera-kapoor-2",
    name: "Meera Kapoor",
    role: "Founder · Ex-McKinsey",
    company: "McKinsey",
    experience: "10+ yrs",
    focus: "Startup Strategy",
    domain: "startups",
    expertise: ["Fundraising", "Pitch decks", "Go-to-market", "Consulting"],
    photo: photos.meera,
  },
  {
    slug: "rohan-mehta-2",
    name: "Rohan Mehta",
    role: "Design Director · Ex-Adobe",
    company: "Adobe",
    experience: "08+ yrs",
    focus: "Growth Strategy",
    domain: "academics",
    expertise: ["UX design", "Portfolio reviews", "Design careers"],
    photo: photos.rohan,
  },
];

export const featuredMentors = mentors.slice(0, 3);

export const mentorDirectoryPage = {
  hero: {
    title: "The rooms you want to be in",
    subtitle: "No generic advice. Just real, actionable insights from professionals who have already navigated your path.",
    background: {
      src: "/find-a-mentor/hero.webp",
      width: 2880,
      height: 1440,
      alt: "",
    },
    primaryCta: { label: "Explore Mentors", href: "#directory" },
    secondaryCta: { label: "Explore Mentorle Plus", href: "/pricing" },
  },
  searchPlaceholder: "Search by mentor, role, company or expertise...",
  emptyState: "No mentors match that search.",
};
