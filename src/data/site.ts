export type NavLink = {
  label: string;
  href: string;
  external?: boolean;
};

// Where mentors actually apply (the mentor platform). The /become-a-mentor page on this site explains the programme.
// The live site's address, for absolute URLs (sitemap, robots, social previews). A preview deployment can set
// NEXT_PUBLIC_SITE_URL to its own address.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://mentorle.in").replace(/\/$/, "");

export const MENTOR_APPLY_URL = "https://platform.mentorle.in/become-a-mentor";
// Mentor and admin accounts sign in here.
export const PLATFORM_LOGIN_URL = "https://platform.mentorle.in/login";
export const BECOME_A_MENTOR_PATH = "/become-a-mentor";

export const primaryNav: NavLink[] = [
  { label: "Mentors", href: "/mentors" },
  { label: "Community", href: "/community" },
  { label: "Events", href: "/events" },
  { label: "Offers", href: "/offers" },
  { label: "Pricing", href: "/pricing" },
];

export const accountNav = {
  newHere: { label: "I'm new here ?", href: "/signup" },
  login: { label: "Login", href: "/login" },
} satisfies Record<string, NavLink>;

export const footerColumns: { title: string; links: NavLink[] }[] = [
  {
    title: "Platform",
    links: [
      { label: "Find a Mentor", href: "/mentors" },
      { label: "Mentorle Plus", href: "/pricing" },
      { label: "Events & Summits", href: "/events" },
      { label: "Student Offers", href: "/offers" },
      { label: "Become a Mentor", href: BECOME_A_MENTOR_PATH },
    ],
  },
  {
    title: "Partners",
    links: [
      { label: "For Universities", href: "/enterprise#universities" },
      { label: "For Enterprise", href: "/enterprise" },
      { label: "Speaker Hub", href: "/speaker-hub" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Community Guidelines", href: "/community-guidelines" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

export const legalLinks: NavLink[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

// Mentorle's social profiles (footer). Facebook and YouTube aren't used. A profile without a URL is hidden.
const SOCIAL_PROFILES = [
  { label: "Instagram", icon: "/homepage/footer/instagram.svg", href: "https://www.instagram.com/mentorleofficial/", width: 35, height: 35 },
  { label: "LinkedIn", icon: "/homepage/footer/linkedin.svg", href: "https://in.linkedin.com/company/mentorlee", width: 33, height: 33 },
  { label: "X", icon: "/homepage/footer/twitter.svg", href: "https://x.com/TheMentorle", width: 30, height: 30 },
];
export const socialLinks = SOCIAL_PROFILES.filter((profile) => profile.href);

export const company = {
  legalName: "AltioraEdtech Learning (OPC) Pvt. Ltd.",
  cin: "U85500PB2025OPC064679",
  location: "Hoshiarpur, Punjab, India",
  copyrightYear: 2026,
  tagline: "A global community of mentors and leaders shaping the future of how the world builds and learns.",
  // As in the Privacy Policy (DPDP notice, effective September 2, 2026).
  support: "support@mentorle.in",
  grievance: {
    officer: "Rachit Jain",
    email: "support@mentorle.in",
    phone: "+91 9888409232",
    sla: "7 working days",
  },
};
