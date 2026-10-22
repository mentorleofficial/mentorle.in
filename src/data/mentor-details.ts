import type { ImageAsset } from "@/data/home";
import { mentors } from "@/data/mentors";
import type { Mentor } from "@/data/mentors";

// Mentor profile pages (/mentors/<slug>). Shaped like the platform's `get_public_mentor` record
// (full_name, headline, bio, expertise, years_experience, current_organization, current_role, linkedin_url,
// portfolio_url, experiences) plus the mentor's `mentorship_offerings`, so the static records below can be
// swapped for a database query in `getMentorProfile` / `getMentorSlugs` only. Fields the platform doesn't
// store yet (tagline, services, the section intros) are optional and logged in SPEC-VS-DESIGN.

export type MentorOffering = {
  title: string;
  description: string;
  format: string;
  price: number; // INR; 0 = free
  priceLabel?: string; // overrides the formatted price ("Free introductory session")
};

export type MentorExperience = {
  title: string;
  organization: string;
  start: string; // "Aug 2026"
  end?: string; // omitted = "Present"
  description?: string;
  location?: string;
};

export type MentorProfile = {
  slug: string;
  name: string;
  firstName: string;
  photo: ImageAsset & { alt: string };
  tagline?: string; // "STRATEGY. BRAND. GROWTH."
  headline: string;
  currentRole: string;
  organization: string;
  designation?: string; // shown under the years card and beside the organization in About
  yearsExperience: number;
  linkedinUrl?: string;
  portfolioUrl?: string;
  aboutEyebrow?: string;
  bio: string[];
  servicesIntro?: string;
  services: { title: string; description: string }[];
  expertiseIntro?: string;
  expertise: string[];
  offerings: MentorOffering[];
  experiences: MentorExperience[];
};

const neeru: MentorProfile = {
  slug: "neeru-sood",
  name: "Neeru Sood",
  firstName: "Neeru",
  // The design pairs this profile with the homepage's mentor photo (logged in SPEC-VS-DESIGN).
  photo: { src: "/homepage/community/arjun-malhotra.webp", width: 866, height: 756, alt: "Neeru Sood speaking at an event" },
  tagline: "Strategy. Brand. Growth.",
  headline:
    "Business Coach & Consultant | Leadership & Personal Branding Expert | AI-Powered Digital Marketing Strategist | Founder, Prep4Success",
  currentRole: "Business Consultant & Brand Growth Consultant",
  organization: "Prep4Success",
  designation: "Founder",
  yearsExperience: 22,
  // Placeholder profile URLs: the design shows the buttons only.
  linkedinUrl: "https://www.linkedin.com/",
  portfolioUrl: "https://www.prep4success.in/",
  aboutEyebrow: "The person behind the strategy",
  bio: [
    "Neeru Sood is a Business Consultant and Brand Growth Consultant with over 20 years of experience helping startups, small businesses, and established organizations strengthen their brands and achieve sustainable growth.",
    "Through strategic thinking, creative direction, and digital execution, she helps businesses define their positioning, build meaningful brand identities, and create marketing strategies that deliver measurable results.",
    "As the founder of Prep4Success, Neeru brings together business strategy, branding, digital marketing, and entrepreneurial education to help professionals and organizations turn ideas into impactful outcomes.",
  ],
  servicesIntro:
    "Neeru offers strategic guidance across business growth, brand development, and digital transformation. Her approach combines practical business insights with creative thinking to help founders and professionals make informed decisions.",
  services: [
    { title: "Strategic Business & Brand Consulting", description: "Define business goals, identify market opportunities, strengthen brand positioning, and build actionable growth roadmaps." },
    { title: "Performance-Driven Digital Marketing", description: "Develop ROI-focused campaigns across social media, search engines, and digital platforms to improve reach, leads, and conversions." },
    { title: "Web & E-commerce Development", description: "Build responsive, user-friendly websites and e-commerce experiences designed for visibility, engagement, and growth." },
    { title: "Corporate & Personal Brand Identity", description: "Create a consistent brand identity, compelling messaging, and a distinctive professional presence for businesses, founders, and individuals." },
    { title: "Social Media Management", description: "Plan and manage content, publishing, audience engagement, and performance tracking to build a stronger digital presence." },
  ],
  expertiseIntro:
    "Neeru helps founders and professionals build stronger brands, sharper marketing strategies, and more effective digital presence through the following areas of expertise.",
  expertise: [
    "Personal & Business Branding",
    "Strategic Marketing & AI-Powered Digital Marketing",
    "Entrepreneurship Education & Empowerment",
    "Brand Building & Brand Management",
    "Content Strategy, Creation & Marketing",
    "Personal Branding Workshops",
    "Digital Marketing Consulting & Expert Talks",
  ],
  offerings: [
    {
      title: "One-on-One Business & Brand Growth Consultation",
      description:
        "Get personalized guidance on business strategy, brand positioning, marketing challenges, and growth opportunities. Discuss your goals, explore practical solutions, and leave with clear next steps.",
      format: "One-on-one",
      price: 0,
      priceLabel: "Free introductory session",
    },
  ],
  experiences: [
    {
      title: "Business Consultant & Brand Growth Consultant",
      organization: "Prep4Success",
      // The design reads "Aug 2026 – Present" after a role ending Aug 2025; kept as designed (logged).
      start: "Aug 2026",
      description:
        "Helping businesses, professionals, and institutions strengthen brand positioning, improve digital visibility, and achieve measurable growth through integrated strategy, creative execution, and education.",
      location: "New Delhi, India",
    },
    {
      title: "Strategic Business & Brand Consulting",
      organization: "Independent Consulting",
      start: "Jan 2020",
      end: "Aug 2025",
      description:
        "Advised businesses on strategic planning, market positioning, performance-driven marketing, website development, brand identity, and social media management.",
      location: "New Delhi, India",
    },
  ],
};

// The directory's placeholder mentors only have card data, so their pages show what that covers (hero,
// expertise) and hide the rest, the same way a sparse database profile will.
const fromCard = (mentor: Mentor): MentorProfile => {
  const [role, company] = mentor.role.split(" · ");
  return {
    slug: mentor.slug,
    name: mentor.name,
    firstName: mentor.name.split(" ")[0],
    photo: { ...mentor.photo, alt: mentor.name },
    headline: `${mentor.focus} mentor · ${mentor.expertise.join(", ")}`,
    currentRole: role,
    organization: company ?? mentor.company,
    yearsExperience: Number.parseInt(mentor.experience, 10),
    bio: [],
    services: [],
    expertise: mentor.expertise,
    offerings: [],
    experiences: [],
  };
};

export const mentorProfiles: MentorProfile[] = [neeru, ...mentors.filter((mentor) => mentor.slug !== neeru.slug).map(fromCard)];

export const getMentorProfile = (slug: string) => mentorProfiles.find((profile) => profile.slug === slug);
export const getMentorSlugs = () => mentorProfiles.map((profile) => profile.slug);

export const mentorDetailCopy = {
  yearsLabel: "Years of Experience",
  bookSession: "Book a Session",
  linkedin: "LinkedIn",
  portfolio: "Portfolio",
  aboutEyebrow: "The person behind the profile",
  aboutTitle: (firstName: string) => `About ${firstName}`,
  servicesEyebrow: "Service portfolio",
  servicesTitle: "Our Core\nServices",
  expertiseEyebrow: "Expertise",
  expertiseTitle: "Areas of\nExpertise",
  sessionsEyebrow: "Sessions",
  sessionsTitle: "One-on-One\nSessions",
  formatLabel: "Session format",
  priceLabel: "Price",
  free: "Free",
  experienceEyebrow: "Experience",
  experienceTitle: "Professional\nExperience",
  present: "Present",
  noSessions: (firstName: string) => `${firstName} hasn’t published sessions yet. Check back soon.`,
  banner: {
    title: "Ready to take your next step?",
    // Booking isn't built yet; both "Book a Session" buttons scroll to the session list (logged).
    primaryCta: { label: "Book a Session", href: "#sessions" },
    secondaryCta: { label: "Explore Mentorle Plus", href: "/pricing" },
  },
  // Until booking exists, the session card's button asks visitors to sign up and returns them here.
  bookHref: (slug: string) => `/signup?redirect=${encodeURIComponent(`/mentors/${slug}`)}`,
};
