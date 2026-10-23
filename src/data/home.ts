import type { IconCardContent } from "@/data/become-a-mentor";

export type ImageAsset = {
  src: string;
  width: number;
  height: number;
};

export type HeroSlide = ImageAsset & {
  alt: string;
  // Tailwind object-position classes; per image so faces stay in frame at every width.
  position: string;
  // Small copy for the preview card. A separate file on purpose: Next tracks the LCP image by URL, so a lazy
  // card copy of the same file as a full-screen slide triggers its "LCP image should be eager" warning.
  thumb: string;
};

export const hero = {
  // The line break is part of the design ("The Right Connections / Real opportunities.").
  title: "The Right Connections\nReal opportunities.",
  subtitle: "Meet mentors, find opportunities, build projects, and connect with people who can help you move forward.",
  primaryCta: { label: "Find a Mentor", href: "/mentors" },
  secondaryCta: { label: "Explore Mentorle Plus", href: "/pricing" },
  autoplayMs: 2100,
  // Rotates as the hero background; the small card previews the next slide. Add more slides here.
  slides: [
    {
      src: "/homepage/hero-section-2.webp",
      thumb: "/homepage/hero-thumbs/hero-section-2.webp",
      width: 1672,
      height: 941,
      alt: "Students filling a university auditorium for a Mentorle session",
      position: "object-center",
    },
    {
      src: "/homepage/hero-background.webp",
      thumb: "/homepage/hero-thumbs/hero-background.webp",
      width: 1280,
      height: 720,
      alt: "A mentor and a mentee reviewing a résumé together at a café table",
      position: "object-[62%_30%] md:object-top",
    },
    {
      src: "/homepage/hero-section-image.webp",
      thumb: "/homepage/hero-thumbs/hero-section-image.webp",
      width: 2880,
      height: 1882,
      alt: "A mentor walking a group of mentees through a plan on a whiteboard",
      position: "object-[65%_40%] md:object-top",
    },
  ] satisfies HeroSlide[],
};

export const partners: (ImageAsset & { name: string })[] = [
  { name: "upGrad", src: "/homepage/partners/upgrad.svg", width: 111, height: 32 },
  { name: "Huptle", src: "/homepage/partners/huptle.svg", width: 109, height: 32 },
  { name: "EduBridge", src: "/homepage/partners/edubridge.svg", width: 83, height: 38 },
];

export const domains: (ImageAsset & { label: string })[] = [
  { label: "IT & Software", src: "/homepage/partners/IT-software.svg", width: 19, height: 14 },
  { label: "Startup & Pitching", src: "/homepage/partners/startup-pitching.svg", width: 16, height: 19 },
  { label: "Academic Counseling", src: "/homepage/partners/academic-counseling.svg", width: 15, height: 18 },
  { label: "Career Transition", src: "/homepage/partners/career-transition.svg", width: 18, height: 16 },
];

export const about = {
  eyebrow: "Who we’re",
  highlight: "Punjab’s #1",
  title: "Mentorship & Events Network",
  lead: "Degrees teach you the theory.",
  body: "But the industry demands the practical. The game has unwritten rules, and we’re handing you the playbook.",
  stats: [
    { target: 25, decimals: 0, suffix: "K+", label: "Ambitious Mentees" },
    { target: 1200, decimals: 0, suffix: "+", label: "Vetted Experts" },
    { target: 4.9, decimals: 1, suffix: "/5", label: "Quality Rating" },
  ],
};

export type GatheringEvent = ImageAsset & {
  tag?: string;
  title: string;
  date?: string;
  description: string;
  alt: string;
  audience?: string;
  cta?: { label: string; href: string; external?: boolean };
  // Bottom-right of the active card: a clock row and a calendar row.
  when?: { time: string; day: string };
};

// Only the centre card's text (and its time/date) exists in Figma; the other two cards use placeholder copy.
export const gatherings: GatheringEvent[] = [
  {
    src: "/homepage/live-gatherings/image-1.webp",
    width: 700,
    height: 998,
    tag: "Leadership Dinner",
    title: "Leadership Roundtable",
    description: "An intimate dinner where senior operators share what they wish they had known earlier.",
    alt: "Guests talking at a leadership dinner",
    when: { time: "7:30 PM – 10:00 PM IST", day: "Saturday, 24 October 2026" },
  },
  {
    src: "/homepage/live-gatherings/image-2.webp",
    width: 1836,
    height: 1064,
    tag: "University Summit",
    title: "Founders & Leaders Mixer",
    description: "An evening of networking and meaningful conversations with industry leaders.",
    alt: "Founders and leaders networking at a mixer",
    when: { time: "5:00 PM – 7:00 PM IST", day: "Saturday, 14 November 2026" },
  },
  {
    src: "/homepage/live-gatherings/image-3.webp",
    width: 1200,
    height: 1800,
    tag: "Tech Sprint",
    title: "Builders Tech Sprint",
    description: "A hands-on sprint where students build alongside engineers from product companies.",
    alt: "Participants at a tech sprint",
    when: { time: "10:00 AM – 6:00 PM IST", day: "Saturday, 5 December 2026" },
  },
];


export type Quote = {
  quote: string;
  name: string;
  title: string;
};

// Figma attributes all three quotes to the same person — placeholder attribution.
export const mentorQuotes: Quote[] = [
  {
    quote:
      "I remember struggling for years trying to figure out product management, Mentoring on Mentorle allows me to hand down the exact playbook I wish I had 10 years ago. It’s incredibly fulfilling.",
    name: "Sarah Jenkins",
    title: "VP of Product @ Google",
  },
  {
    quote:
      "The talent coming out of universities today is raw and brilliant, but they often lack the tactical networking skills to land the interview. I’m here to bridge that exact gap.",
    name: "Sarah Jenkins",
    title: "VP of Product @ Google",
  },
  {
    quote:
      "Building a startup is a lonely journey. Being able to review pitches and provide unfiltered, honest feedback to early-stage founders is how we elevate the entire ecosystem.",
    name: "Sarah Jenkins",
    title: "VP of Product @ Google",
  },
];

export const mentorBanner = {
  title: "Your Experience Could Change Someone’s Next Move.",
  image: { src: "/homepage/mentor-banner-bg.webp", width: 2880, height: 1240 },
  secondaryCta: { label: "Explore Mentorle Plus", href: "/pricing" },
};

export const careerComparison = {
  hardWay: [
    "Applying to hundreds of jobs and hearing nothing back.",
    "Relying on generic, outdated advice from YouTube or blogs.",
    "Pitching your startup without knowing what investors actually want.",
    "Feeling isolated and stuck when you hit a major career roadblock.",
  ],
  mentorleWay: [
    "Get your resume reviewed by your dream company’s hiring manager.",
    "Unlocking exclusive referrals that skip the resume screening pile entirely.",
    "Pitch your story to founders before meeting investors.",
    "Having an industry insider in your corner, exactly when you need them.",
  ],
};

export type HowItWorksStep = ImageAsset & {
  title: string;
  description: string;
};

// Figma only shows copy for the first step; the other two descriptions are placeholders.
export const howItWorks: HowItWorksStep[] = [
  {
    title: "Find Your Insider",
    description:
      "Filter our private directory by role, company, or exact challenge. Find the perfect match for your current roadblock.",
    src: "/homepage/find-your-insider.svg",
    width: 240,
    height: 240,
  },
  {
    title: "Lock in a Time",
    description:
      "Pick a slot that fits your schedule and book a 1:1 session in a few clicks — no back-and-forth emails.",
    src: "/homepage/lock-in-a-time.svg",
    width: 216,
    height: 240,
  },
  {
    title: "Unlock the Playbook",
    description:
      "Walk away with honest feedback, an actionable plan, and the exact next steps for your goal.",
    src: "/homepage/unlock-the-playbook.svg",
    width: 216,
    height: 240,
  },
];

export type LifeStory = {
  title: string;
  description: string;
};

export const lifeAtMentorle = {
  leadershipSummit: {
    title: "Leadership Summit ’26",
    description:
      "When our top mentors addressed students, they highlighted the power of building a resilient career. We championed hands-on learning, transitioning from rote memorization to real-world adaptability in the AI age.",
    image: { src: "/homepage/mentor-stories/leadership-summit-26.webp", width: 866, height: 672 },
    alt: "Students in the audience at the Mentorle Leadership Summit",
  },
  workshop: {
    image: { src: "/homepage/mentor-stories/beyond-the-algorithm.webp", width: 866, height: 720 },
    alt: "Students collaborating around a table during a Mentorle workshop",
  },
  beyondTheAlgorithm: {
    title: "Beyond the Algorithm",
    description:
      "Go beyond digital connections and generic advice. Meet experienced professionals, exchange fresh perspectives, and build relationships through meaningful conversations that create opportunities beyond your screen.",
  },
  connections: {
    title: "Connections That Matter",
    description:
      "Great opportunities often begin with the right conversation. Connect with ambitious individuals, startup founders, and industry leaders who share ideas, exchange experiences, and create meaningful opportunities for long-term growth.",
    image: { src: "/homepage/mentor-stories/connections-that-matter.webp", width: 866, height: 672 },
    alt: "Professionals in conversation around a café table",
  },
};

export const plusBenefits: (ImageAsset & LifeStory)[] = [
  {
    title: "2 Free Sessions",
    description: "Get two 1-on-1 mentorship sessions every single month included with your subscription.",
    src: "/homepage/mentor-plus/2-free-sessions.svg",
    width: 62,
    height: 69,
  },
  {
    title: "Exclusive Referrals",
    description: "Gain access to premium job referrals and study resources directly from top industry mentors.",
    src: "/homepage/mentor-plus/exclusive-rewards.svg",
    width: 74,
    height: 64,
  },
  {
    title: "Partner Perks",
    description: "Unlock UpGrad course passes and vouchers for premium fashion & lifestyle brands.",
    src: "/homepage/mentor-plus/partner-perks.svg",
    width: 69,
    height: 69,
  },
];

export type SuccessStory = Quote & ImageAsset;

// Rahul Verma's quote is cut off at the frame edge in Figma; the ending is reconstructed.
export const successStories: SuccessStory[] = [
  {
    quote:
      "The 1-on-1 guidance I received here was unparalleled. My mentor helped me completely revamp my portfolio, which directly led to my offer at Microsoft.",
    name: "Aditi Sharma",
    title: "Product Designer @ Microsoft",
    src: "/homepage/success-stories/aditi-sharma.webp",
    width: 598,
    height: 706,
  },
  {
    quote:
      "Being a Mentorle Plus member is a cheat code. Not only did I get 2 free sessions with a YC founder, but the exclusive study resources saved me months of prep time.",
    name: "Rahul Verma",
    title: "Founder @ FinTech Startup",
    src: "/homepage/success-stories/rahul-verma.webp",
    width: 598,
    height: 706,
  },
];

// Heading for the pricing plans on the homepage (between Career Growth and How it works).
export const homePlans = {
  eyebrow: "Choose your access",
  // Line break as in the design.
  title: "Start free. Choose more\nsupport when you need it.",
  description: "Join for free, get expert learning with Pro Pass, or choose All-Access if you want four one-to-one mock sessions included.",
};

const goalIcon = (name: string, width: number, height: number): ImageAsset => ({ src: `/homepage/start-with-your-goal/${name}.svg`, width, height });

// "Start with your goal" (after Live Gatherings). The cards aren't links in the design; the button opens the
// mentor directory.
export const helpWith = {
  eyebrow: "Start with your goal",
  title: "What would you like help with?",
  description: "Choose the area you care about. We’ll help you find people who can share useful advice and real experience.",
  action: { label: "Explore all domains", href: "/mentors" },
  cards: [
    { icon: goalIcon("IT", 76, 41), title: "IT & Software", description: "Build coding skills, explore emerging technologies, and learn from experienced developers." },
    { icon: goalIcon("startup", 69, 69), title: "Startup & Pitching", description: "Turn your ideas into reality with expert guidance on business growth and investor pitching." },
    { icon: goalIcon("academic-counselling", 69, 52), title: "Academic Counseling", description: "Make informed study choices, explore opportunities, and plan your academic confidently." },
    { icon: goalIcon("product-management", 69, 69), title: "Product Management", description: "Master product strategy, understand user needs, and learn to build successful products." },
    { icon: goalIcon("design", 69, 69), title: "Design & UI/UX", description: "Improve your design skills through user research, wireframing, prototyping, and visual design." },
    { icon: goalIcon("career-transitions", 69, 69), title: "Career Transitions", description: "Navigate career changes, develop new skills, and prepare for your next professional opportunity." },
  ] satisfies IconCardContent[],
};
