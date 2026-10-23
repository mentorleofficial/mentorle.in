// A directory card, built from the platform's list_public_mentors() row (src/lib/mentors/queries.ts).
export type Mentor = {
  slug: string;
  name: string;
  role: string; // "Head of Product · Microsoft"; empty when the mentor set neither
  company: string | null;
  years: number;
  experience: string; // "12+ yrs"
  focus: string | null; // first expertise tag, shown on the photo badge
  expertise: string[];
  sessionTypes: SessionType[]; // categories of the mentor's published offerings
  photo: string | null; // no photo → initials
};

// "08+ yrs", as the design writes it.
export const formatYears = (years: number) => `${String(years).padStart(2, "0")}+ yrs`;

// Experience filter, the same ranges as the platform's Find Mentors page.
export type ExperienceRange = { value: string; label: string; min: number; max: number };
export const experienceRanges: ExperienceRange[] = [
  { value: "0-2", label: "0–2 years", min: 0, max: 2 },
  { value: "3-5", label: "3–5 years", min: 3, max: 5 },
  { value: "6-10", label: "6–10 years", min: 6, max: 10 },
  { value: "10+", label: "More than 10 years", min: 11, max: Number.POSITIVE_INFINITY },
];

// Session type filter: the offering categories mentors pick on the platform (MentorOfferings CATEGORIES), in
// that order. Older offerings store lowercase or legacy names ("mentorship"); they map onto these.
export const SESSION_TYPES = [
  "General Mentorship",
  "Resume Review",
  "Portfolio Review",
  "Career Guidance",
  "Mock Interview",
  "Code Review",
  "Project Guidance",
  "Other",
] as const;
export type SessionType = (typeof SESSION_TYPES)[number];

export const toSessionType = (category: string | null | undefined): SessionType => {
  const value = category?.trim().toLowerCase() ?? "";
  if (value === "mentorship") return "General Mentorship";
  return SESSION_TYPES.find((type) => type.toLowerCase() === value) ?? "Other";
};

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
  filters: {
    all: "All",
    experience: "Experience",
    anyExperience: "Any experience",
    sessionType: "Session type",
    anySessionType: "Any session type",
  },
  searchPlaceholder: "Search by mentor, role, company or expertise...",
  emptyState: "No mentors match that search.",
};
