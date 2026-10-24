export type NavLink = {
  label: string;
  href: string;
  external?: boolean;
};

// Where mentors actually apply (the mentor platform). The /become-a-mentor page on this site explains the programme.
export const MENTOR_APPLY_URL = "https://platform.mentorle.in/become-a-mentor";
// Mentor and admin accounts sign in here.
export const PLATFORM_LOGIN_URL = "https://platform.mentorle.in/login";
export const BECOME_A_MENTOR_PATH = "/become-a-mentor";

export const primaryNav: NavLink[] = [
  { label: "Mentors", href: "/mentors" },
  { label: "Community", href: "/community" },
  { label: "About Us", href: "/about" },
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

export const socialLinks = [
  { label: "Instagram", icon: "/homepage/footer/instagram.svg", href: "#", width: 35, height: 35 },
  { label: "Facebook", icon: "/homepage/footer/facebook.svg", href: "#", width: 33, height: 33 },
  { label: "LinkedIn", icon: "/homepage/footer/linkedin.svg", href: "#", width: 33, height: 33 },
  { label: "X", icon: "/homepage/footer/twitter.svg", href: "#", width: 30, height: 30 },
  { label: "YouTube", icon: "/homepage/footer/youtube.svg", href: "#", width: 35, height: 28 },
];

export const company = {
  legalName: "AltioraEdtech Learning (OPC) Pvt. Ltd.",
  cin: "U85500PB2025OPC064679",
  location: "Hoshiarpur, Punjab, India",
  copyrightYear: 2026,
  tagline: "A global community of mentors and leaders shaping the future of how the world builds and learns.",
  grievance: {
    officer: "Rachit Jain",
    email: "grievance@mentorle.in",
    slaDays: 30,
  },
};
