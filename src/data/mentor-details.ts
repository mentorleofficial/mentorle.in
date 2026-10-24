// Mentor profile pages (/mentors/<slug>). `MentorProfile` mirrors the platform's data field for field; it is
// loaded by src/lib/mentors/queries.ts from:
//   get_public_mentor → full_name, avatar_url, headline, bio, expertise, years_experience, current_organization,
//                       current_role, linkedin_url, portfolio_url, experiences (jsonb)
//   list_public_offerings (filtered by mentor) → title, description, duration_minutes, price
// Mentors won't edit their profiles before launch, so the page uses only these fields: anything the design shows
// that the platform doesn't store is generated from them or hidden (see `mentorView`). Only name, bio,
// years_experience and at least one expertise tag are required on the platform; everything else may be empty.

export type MentorOffering = {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  price: number; // INR, 0 = free
  hasOpenTimes: boolean; // any open slot in the next 90 days (mentor_open_slots)
  plusEligible: boolean; // a plan's free session can book it (mentorship_offerings.plus_eligible)
};

// Platform `experiences` item: start_date / end_date are "YYYY-MM"; no end_date = current role.
export type MentorExperience = {
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description?: string;
};

export type MentorProfile = {
  userId: string;
  slug: string;
  fullName: string;
  avatarUrl: string | null;
  headline: string | null;
  bio: string;
  expertise: string[];
  yearsExperience: number;
  currentOrganization: string | null;
  currentRole: string | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  experiences: MentorExperience[];
  offerings: MentorOffering[];
};

// --- Derived display values: generated from the mentor's own fields, never invented -------------------------

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const TAGLINE_TAG_MAX = 18; // longer tags make an unreadable uppercase line, so the tagline is skipped

export const formatMonth = (yyyyMm: string) => {
  const [year, month] = yyyyMm.split("-").map(Number);
  return month ? `${MONTHS[month - 1]} ${year}` : String(year);
};

export const formatPrice = (price: number) => (price > 0 ? `₹${price.toLocaleString("en-IN")}` : "Free");

export function mentorView(mentor: MentorProfile) {
  const firstName = mentor.fullName.split(" ")[0];
  const roleLine = [mentor.currentRole, mentor.currentOrganization].filter(Boolean).join(" · ");
  const shortTags = mentor.expertise.filter((tag) => tag.length <= TAGLINE_TAG_MAX).slice(0, 3);
  return {
    firstName,
    // "Strategy. Brand. Growth." from the first three short expertise tags.
    tagline: shortTags.length >= 2 ? shortTags.map((tag) => `${tag}.`).join(" ") : null,
    // No headline: fall back to "Role at Organization"; the role line underneath is then dropped.
    headline: mentor.headline || (mentor.currentRole && mentor.currentOrganization ? `${mentor.currentRole} at ${mentor.currentOrganization}` : mentor.currentRole),
    roleLine: mentor.headline ? roleLine : "",
    bioParagraphs: mentor.bio.split(/\n\s*\n|\n/).map((paragraph) => paragraph.trim()).filter(Boolean),
  };
}

export const mentorDetailCopy = {
  yearsLabel: "Years of Experience",
  bookSession: "Book a Session",
  linkedin: "LinkedIn",
  portfolio: "Portfolio",
  photoAlt: (name: string) => `${name}, mentor on Mentorle`,
  aboutEyebrow: "About the mentor",
  aboutTitle: (firstName: string) => `About ${firstName}`,
  sessionsEyebrow: "Sessions",
  sessionsTitle: (firstName: string) => `Book time with\n${firstName}`,
  durationLabel: "Duration",
  priceLabel: "Price",
  minutes: (n: number) => `${n} min`,
  noSessions: (firstName: string) => `${firstName} hasn’t published sessions yet. Check back soon.`,
  expertiseEyebrow: "Expertise",
  expertiseTitle: "Areas of\nExpertise",
  expertiseIntro: (firstName: string) => `${firstName} can help you with:`,
  experienceEyebrow: "Experience",
  experienceTitle: "Professional\nExperience",
  present: "Present",
  banner: {
    title: "Ready to take your next step?",
    // Booking isn't built yet; both "Book a Session" buttons scroll to the session list (logged).
    primaryCta: { label: "Book a Session", href: "#sessions" },
    secondaryCta: { label: "Explore Mentorle Plus", href: "/pricing" },
  },
};
