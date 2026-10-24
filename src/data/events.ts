import type { IconCardContent } from "@/data/become-a-mentor";
import type { ImageAsset } from "@/data/home";
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
  image: ImageAsset & { alt: string };
};

// Card photos from the updated design (2026-10-22). Placeholder: the live feed will bring its own images
// (or a per-source fallback), logged in SPEC-VS-DESIGN.
const opportunityImages = [
  { src: "/events-and-summits/image-1.webp", width: 866, height: 624, alt: "An audience applauding at a tech event" },
  { src: "/events-and-summits/image-2.webp", width: 866, height: 624, alt: "Two professionals exchanging business cards" },
  { src: "/events-and-summits/image-3.webp", width: 866, height: 624, alt: "A speaker presenting on stage to a large audience" },
];

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
    image: opportunityImages[0],
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
    image: opportunityImages[1],
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
    image: opportunityImages[2],
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
    image: opportunityImages[0],
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
    image: opportunityImages[1],
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
    image: opportunityImages[2],
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
