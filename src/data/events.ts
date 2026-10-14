import type { GatheringEvent, ImageAsset } from "@/data/home";
import { BECOME_A_MENTOR_PATH } from "@/data/site";

export type OpportunityType = "hackathon" | "event" | "job" | "freelance";

// Shaped like the record the CMS/database will return, so the static list can be swapped for a fetch later.
export type Opportunity = {
  id: string;
  type: OpportunityType;
  source: string;
  categories: string[];
  title: string;
  organiser: string;
  location: string;
  reward: string;
  url: string;
};

export type OpportunityFilter = { value: OpportunityType | "all"; label: string };

export const opportunityFilters: OpportunityFilter[] = [
  { value: "all", label: "All Opportunities" },
  { value: "hackathon", label: "Hackathons & Buildathons" },
  { value: "event", label: "Events & Meetups" },
  { value: "job", label: "Jobs & Internships" },
  { value: "freelance", label: "Freelance Gigs" },
];

export const opportunityCta: Record<OpportunityType, string> = {
  hackathon: "Register",
  event: "RSVP",
  job: "Apply Now",
  freelance: "Bid on Gig",
};

// Placeholder feed: the Figma repeats one Upwork gig; these entries show every type until the live feed is wired up.
export const opportunities: Opportunity[] = [
  {
    id: "upwork-fintech-mvp",
    type: "freelance",
    source: "Upwork",
    categories: ["Freelance", "Creative"],
    title: "UI/UX Design for FinTech MVP",
    organiser: "Indie Founder",
    location: "Online",
    reward: "$500 Fixed",
    url: "https://www.upwork.com",
  },
  {
    id: "devfolio-buildathon",
    type: "hackathon",
    source: "Devfolio",
    categories: ["Hackathon", "Web3"],
    title: "Punjab Builders Buildathon 2026",
    organiser: "Devfolio Community",
    location: "Chandigarh",
    reward: "₹2,00,000 Prize Pool",
    url: "https://devfolio.co",
  },
  {
    id: "mlh-global-hack-week",
    type: "hackathon",
    source: "MLH",
    categories: ["Hackathon", "AI / ML"],
    title: "Global Hack Week: AI Edition",
    organiser: "Major League Hacking",
    location: "Online",
    reward: "Swag + Certificates",
    url: "https://mlh.io",
  },
  {
    id: "luma-founder-mixer",
    type: "event",
    source: "Luma",
    categories: ["Meetup", "Startups"],
    title: "Founders & Builders Evening Mixer",
    organiser: "Mohali Startup Circle",
    location: "Mohali",
    reward: "Free Entry",
    url: "https://lu.ma",
  },
  {
    id: "wellfound-frontend-intern",
    type: "job",
    source: "Wellfound",
    categories: ["Internship", "Engineering"],
    title: "Frontend Engineering Intern (React)",
    organiser: "Seed-stage SaaS Startup",
    location: "Remote, India",
    reward: "₹30,000 / month",
    url: "https://wellfound.com",
  },
  {
    id: "naukri-associate-pm",
    type: "job",
    source: "Naukri",
    categories: ["Full-time", "Product"],
    title: "Associate Product Manager",
    organiser: "Series B Fintech",
    location: "Gurugram",
    reward: "₹12–16 LPA",
    url: "https://www.naukri.com",
  },
];

const gatheringImages = {
  conclave: { src: "/homepage/live-gatherings/image-2.webp", width: 1836, height: 1064 },
  dinner: { src: "/homepage/live-gatherings/image-1.webp", width: 700, height: 998 },
  sprint: { src: "/homepage/live-gatherings/image-3.webp", width: 1200, height: 1800 },
} satisfies Record<string, ImageAsset>;

// Only the centre card's text exists in Figma; the other two are placeholders in the same shape.
export const hostedGatherings: GatheringEvent[] = [
  {
    ...gatheringImages.dinner,
    title: "Mohali Leadership Dinner",
    date: "12th September, 2026",
    description: "An intimate evening where senior operators share what they wish they had known earlier, with time for one-on-one questions.",
    alt: "Guests talking at a leadership dinner",
    audience: "Open for Professionals",
    cta: { label: "Request Invite", href: "/signup" },
  },
  {
    ...gatheringImages.conclave,
    title: "Punjab Technical Conclave",
    date: "28th August, 2026",
    description: "A full-day campus summit featuring guest lectures from FAANG engineers and startup founders for over 500+ students.",
    alt: "Attendees networking at the Punjab Technical Conclave",
    audience: "Open for Students",
    cta: { label: "Register Free", href: "/signup" },
  },
  {
    ...gatheringImages.sprint,
    title: "Builders Pitch Circle",
    date: "4th October, 2026",
    description: "Early-stage founders pitch to a panel of operators and angels, then get unfiltered feedback over chai.",
    alt: "Founders pitching at a Mentorle pitch circle",
    audience: "Open for Founders",
    cta: { label: "Apply to Pitch", href: "/signup" },
  },
];

export const eventsPage = {
  hero: {
    title: "Events, Summits & Opportunities",
    subtitle:
      "Our own curated gatherings, plus auto-curated hackathons, meetups, jobs and freelance gigs from MLH, Devfolio, Luma, Wellfound and more.",
    background: { src: "/events-and-summits/hero.webp", width: 2880, height: 1440, alt: "" } satisfies ImageAsset & { alt: string },
    // The design copies the Become a Mentor hero buttons here (logged in SPEC-VS-DESIGN).
    primaryCta: { label: "Become a Mentor", href: BECOME_A_MENTOR_PATH },
    secondaryCta: { label: "See what you would earn", href: `${BECOME_A_MENTOR_PATH}#calculator` },
  },
  hosted: {
    // The design spells this "Hosteded by Mentorle" (logged in SPEC-VS-DESIGN).
    eyebrow: "Hosted by Mentorle",
    title: "Our upcoming gatherings",
    description: "Leadership dinners, campus summits, and pitch circles run by the Mentorle team.",
  },
  opportunities: {
    eyebrow: "Opportunity Discovery",
    title: "Global Opportunities Engine",
    description:
      "Discover everything worth applying for in one curated feed, refreshed daily with the latest opportunities so you never miss a chance to take your next big step.",
    searchPlaceholder: "Search opportunities",
    emptyState: "No opportunities match that search.",
  },
};
