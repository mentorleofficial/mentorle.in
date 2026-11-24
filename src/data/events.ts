import type { IconCardContent } from "@/data/become-a-mentor";
import type { ImageAsset } from "@/data/home";
import { BECOME_A_MENTOR_PATH } from "@/data/site";

export type OpportunityType = "hackathon" | "event" | "job" | "freelance";

// One card in the "Global Opportunities Engine" feed on /events. Today: Mentorle's own upcoming events and Huptle
// jobs (src/lib/opportunities.ts); more sources can be mapped to the same shape later.
export type Opportunity = {
  id: string;
  type: OpportunityType;
  source: string;
  categories: string[];
  title: string;
  organiser?: string;
  location?: string;
  reward?: string;
  url: string;
  external?: boolean;
  cta?: string; // overrides the type's button label
  note?: string; // a short line under the button
  // A photo, or the dark generated poster (brand + a corner label + the title) for items without one.
  media: (ImageAsset & { kind: "image"; alt: string }) | { kind: "poster"; brand: string; corner: string };
};

export type OpportunityFilter = { value: OpportunityType | "all"; label: string };

// Only the types that have something in the feed are shown (plus "All").
export const opportunityFilters: OpportunityFilter[] = [
  { value: "all", label: "All Opportunities" },
  { value: "hackathon", label: "Hackathons & Buildathons" },
  { value: "event", label: "Events & Meetups" },
  { value: "job", label: "Jobs & Internships" },
  { value: "freelance", label: "Freelance Gigs" },
];

export const opportunityCta: Record<OpportunityType, string> = {
  hackathon: "Register",
  event: "View event",
  job: "Apply Now",
  freelance: "Bid on Gig",
};

// Card text for the two live sources.
export const opportunitySources = {
  mentorle: { source: "Mentorle", poster: "Mentorle", free: "Free" },
  huptle: {
    source: "Huptle",
    poster: "Huptle",
    job: "Job",
    screening: (minutes: number) => `${minutes}-min AI screening`,
    cta: "Apply on Huptle",
    note: "We share your name and email with Huptle to start your application.",
  },
};

export const eventsPage = {
  hero: {
    title: "Events, Summits & Opportunities",
    subtitle:
      "Our own curated gatherings, plus auto-curated hackathons, meetups, jobs and freelance gigs from MLH, Devfolio, Luma, Wellfound and more.",
    background: { src: "/events-and-summits/hero.webp", width: 2880, height: 1440, alt: "" } satisfies ImageAsset & { alt: string },
    // The design copies the Become a Mentor hero buttons here (logged in SPEC-VS-DESIGN).
    primaryCta: { label: "Become a Mentor", href: BECOME_A_MENTOR_PATH },
    secondaryCta: { label: "See what you would earn", href: `${BECOME_A_MENTOR_PATH}#tiers` },
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
    none: "New opportunities are on their way. Check back soon.",
  },
  // "Exclusive for Pro Pass members" partner block (updated design, 2026-10-22).
  proPass: {
    eyebrow: "Exclusive for Pro Pass members",
    title: "Mentorle × Huptle",
    subtitle: "Learn, build, and land your next role.",
    description: "Access Huptle’s curated programs through Mentorle Pro Pass, including its job-guarantee pathway.",
    cta: { label: "Explore Pro Pass", href: "/pricing" },
    features: [
      { icon: "cap", title: "Skill with experts", note: "Structured programs" },
      { icon: "briefcase", title: "Job guarantee", note: "Career-ready pathway" },
      { icon: "shield", title: "Exclusive access", note: "Only for Pro Pass members" },
    ] as const,
    fineprint: "Eligibility criteria and program terms apply.",
    image: {
      src: "/events-and-summits/exclusive-for-pro-pass-members.webp",
      width: 1288,
      height: 966,
      alt: "Illustration: a student at a laptop on the Mentorle × Huptle platform, moving from learning and mentoring to building a portfolio and landing a job offer",
    },
  },
  howItWorks: {
    eyebrow: "Your Path to Success",
    title: "How it works",
    description: "From discovery to your next opportunity, in a few simple steps.",
    cards: [
      { icon: { src: "/events-and-summits/explore.svg", width: 69, height: 69 }, title: "Explore", description: "Browse events, jobs, hackathons and more." },
      { icon: { src: "/events-and-summits/check-details.svg", width: 55, height: 41 }, title: "Check details", description: "Review requirements, deadlines and eligibility." },
      { icon: { src: "/events-and-summits/register-or-apply.svg", width: 69, height: 62 }, title: "Register or Apply", description: "Take the next step and get closer to your goals." },
    ] satisfies IconCardContent[],
  },
  banner: {
    title: "Someone is stuck on the thing you solved three years ago",
    primaryCta: { label: "Become a Mentor", href: BECOME_A_MENTOR_PATH },
    secondaryCta: { label: "Explore Mentorle Plus", href: "/pricing" },
  },
};
