import { mentors } from "@/data/mentors";
import type { Mentor } from "@/data/mentors";

// Mentor profile pages (/mentors/<slug>). Records mirror the platform's data field for field, so swapping the
// static list for the database only touches `getMentorProfile` / `getMentorSlugs`:
//   get_public_mentor → full_name, avatar_url, headline, bio, expertise, years_experience, current_organization,
//                       current_role, linkedin_url, portfolio_url, experiences (jsonb)
//   list_public_offerings (filtered by mentor) → title, description, duration_minutes, price, currency
// Mentors won't edit their profiles before launch, so the page uses only these fields: anything the design shows
// that the platform doesn't store is generated from them or hidden (see `mentorView`). Only name, bio,
// years_experience and at least one expertise tag are required on the platform; everything else may be empty.

export type MentorOffering = {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  price: number; // INR, 0 = free
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

// Sample profile built from the mentor-details design, expressed in platform fields only. The design's tagline,
// "Core Services", section intros and "Founder" designation have no platform field and are dropped.
const neeru: MentorProfile = {
  slug: "neeru-sood",
  fullName: "Neeru Sood",
  // The design pairs this profile with the homepage's mentor photo (logged in SPEC-VS-DESIGN).
  avatarUrl: "/homepage/community/arjun-malhotra.webp",
  headline: "Business Coach & Consultant | Leadership & Personal Branding Expert | AI-Powered Digital Marketing Strategist",
  bio: [
    "Neeru Sood is a Business Consultant and Brand Growth Consultant with over 20 years of experience helping startups, small businesses, and established organizations strengthen their brands and achieve sustainable growth.",
    "Through strategic thinking, creative direction, and digital execution, she helps businesses define their positioning, build meaningful brand identities, and create marketing strategies that deliver measurable results.",
    "As the founder of Prep4Success, Neeru brings together business strategy, branding, digital marketing, and entrepreneurial education to help professionals and organizations turn ideas into impactful outcomes.",
  ].join("\n\n"),
  expertise: [
    "Personal & Business Branding",
    "Strategic Marketing & AI-Powered Digital Marketing",
    "Entrepreneurship Education & Empowerment",
    "Brand Building & Brand Management",
    "Content Strategy, Creation & Marketing",
    "Personal Branding Workshops",
    "Digital Marketing Consulting & Expert Talks",
  ],
  yearsExperience: 22,
  currentOrganization: "Prep4Success",
  currentRole: "Business Consultant & Brand Growth Consultant",
  // Placeholder profile URLs: the design shows the buttons only.
  linkedinUrl: "https://www.linkedin.com/",
  portfolioUrl: "https://www.prep4success.in/",
  experiences: [
    {
      title: "Business Consultant & Brand Growth Consultant",
      company: "Prep4Success",
      location: "New Delhi, India",
      // The design reads "Aug 2026 – Present" after a role ending Aug 2025; kept as designed (logged).
      startDate: "2026-08",
      description:
        "Helping businesses, professionals, and institutions strengthen brand positioning, improve digital visibility, and achieve measurable growth through integrated strategy, creative execution, and education.",
    },
    {
      title: "Strategic Business & Brand Consulting",
      company: "Independent Consulting",
      location: "New Delhi, India",
      startDate: "2020-01",
      endDate: "2025-08",
      description:
        "Advised businesses on strategic planning, market positioning, performance-driven marketing, website development, brand identity, and social media management.",
    },
  ],
  offerings: [
    {
      id: "neeru-growth-consultation",
      title: "One-on-One Business & Brand Growth Consultation",
      description:
        "Get personalized guidance on business strategy, brand positioning, marketing challenges, and growth opportunities. Discuss your goals, explore practical solutions, and leave with clear next steps.",
      durationMinutes: 45,
      price: 0,
    },
  ],
};

// The directory's placeholder mentors only have card data. They become sparse profiles: no bio, sessions or
// experience, which is what the page must handle for real mentors with thin profiles.
const fromCard = (mentor: Mentor): MentorProfile => {
  const [role, company] = mentor.role.split(" · ");
  return {
    slug: mentor.slug,
    fullName: mentor.name,
    avatarUrl: mentor.photo.src,
    headline: null,
    bio: "",
    expertise: mentor.expertise,
    yearsExperience: Number.parseInt(mentor.experience, 10),
    currentOrganization: company ?? mentor.company,
    currentRole: role,
    linkedinUrl: null,
    portfolioUrl: null,
    experiences: [],
    offerings: [],
  };
};

export const mentorProfiles: MentorProfile[] = [neeru, ...mentors.filter((mentor) => mentor.slug !== neeru.slug).map(fromCard)];

export const getMentorProfile = (slug: string) => mentorProfiles.find((profile) => profile.slug === slug);
export const getMentorSlugs = () => mentorProfiles.map((profile) => profile.slug);

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
  // Until booking exists, a session's button asks visitors to sign up and returns them to the profile.
  bookHref: (slug: string) => `/signup?redirect=${encodeURIComponent(`/mentors/${slug}`)}`,
};
