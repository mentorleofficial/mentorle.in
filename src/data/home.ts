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
  subtitle: "Learn from experienced professionals, connect with ambitious people, build meaningful projects, and discover opportunities to grow your skills and career.",
  primaryCta: { label: "Find a Mentor", href: "/mentors" },
  secondaryCta: { label: "Join Mentorle", href: "/pricing" },
  autoplayMs: 2100,
  // Rotates as the hero background; the small card previews the next slide.
  // Full-bleed slides use /homepage/hero-thumbs/. Root /homepage/ copies are only for the card
  // preview (separate URLs so Next's LCP check stays clean).
  slides: [
    {
      src: "/homepage/hero-thumbs/hero-section-2.webp",
      thumb: "/homepage/hero-section-2.webp",
      width: 660,
      height: 371,
      alt: "Students filling a university auditorium for a Mentorle session",
      position: "object-center",
    },
    {
      src: "/homepage/hero-thumbs/hero-background.webp",
      thumb: "/homepage/hero-background.webp",
      width: 1200,
      height: 1600,
      alt: "A mentor and a mentee reviewing a résumé together at a café table",
      position: "object-[50%_28%]",
    },
    {
      src: "/homepage/hero-thumbs/hero-section-image.webp",
      thumb: "/homepage/hero-section-image.webp",
      width: 1600,
      height: 1281,
      alt: "A mentor walking a group of mentees through a plan on a whiteboard",
      position: "object-center md:object-[50%_35%]",
    },
  ] satisfies HeroSlide[],
};

export const partners: (ImageAsset & { name: string })[] = [
  { name: "Logo Black", src: "/homepage/partners/Logo_Black.svg", width: 128, height: 32 },
  { name: "CT", src: "/homepage/partners/ct.svg", width: 32, height: 32 },
  { name: "Success Brew", src: "/homepage/partners/success-brew.svg", width: 183, height: 32 },
  { name: "GNDU", src: "/homepage/partners/GNDU.svg", width: 30, height: 32 },
  { name: "Welzin", src: "/homepage/partners/welzin.svg", width: 101, height: 32 },
  { name: "CGC", src: "/homepage/partners/cgc.svg", width: 77, height: 32 },
  { name: "Huptle", src: "/homepage/partners/huptle.svg", width: 109, height: 32 },
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
  title: "Platform for Network & Opportunities",
  lead: "Degrees teach you the theory.",
  body: "But the industry demands the practical. The game has unwritten rules, and we’re handing you the playbook.",
  stats: [
    { target: 350, decimals: 0, suffix: "+", label: "Ambitious Mentees" },
    { target: 50, decimals: 0, suffix: "+", label: "Vetted Experts" },
    { target: 2, decimals: 0, suffix: "", label: "Institutionals Partners" },
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



export type Quote = {
  quote: string;
  name: string;
  title: string;
};

// Figma attributes all three quotes to the same person — placeholder attribution.
export const mentorQuotes: Quote[] = [
  {
    quote:
      "Looking back, I realise how valuable the right guidance would have been at the beginning of my career. I want to help others navigate those decisions with more clarity.",
    name: "Sourabh Goyal",
    title: "Founder & CEO @ Successbrew",
  },
  {
    quote:
      "I’ve learned that career growth isn't just about what you know. It’s also about the questions you ask, the people you learn from, and the work you put into practice.",
    name: "Neeru Sood",
    title: "Business Consultant @ Prep4Success",
  },
  {
    quote:
      "Sometimes, one honest conversation can help someone see a problem differently. I enjoy sharing what I’ve learned and helping people take their next step with confidence.",
    name: "Sourabh Mhaisekar",
    title: "Senior Software Engineer",
  },
];

export const mentorBanner = {
  title: "Your Experience Could Change Someone’s Next Move.",
  image: { src: "/homepage/mentor-banner-bg.webp", width: 2880, height: 1240 },
  secondaryCta: { label: "Explore Mentorle Plus", href: "/pricing" },
};

export const careerComparison = {
  hardWay: [
    "Unsure which career step to take next.",
    "Getting stuck on resumes, interviews, or projects.",
    "Following scattered advice without knowing what applies to you.",
    "Trying to solve every challenge through trial and error.",
  ],
  mentorleWay: [
    "Get guidance from people with relevant experience.",
    "Improve your resume, projects, and interview preparation.",
    "Explore career paths and gain practical industry insights.",
    "Build connections and discover relevant opportunities.",
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
    image: { src: "/homepage/mentor-stories/leadership-summit.webp", width: 1280, height: 960 },
    alt: "Mentorle session with students filling a university classroom",
  },
  workshop: {
    image: { src: "/homepage/mentor-stories/workshop.webp", width: 1512, height: 1008 },
    alt: "Students and mentors collaborating around a table during a Mentorle workshop",
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
    image: { src: "/homepage/mentor-stories/connections.webp", width: 1280, height: 853 },
    alt: "Mentors and partners together at a Mentorle campus event",
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
  eyebrow: "Choose Your Membership",
  // Line break as in the design.
  title: "Start free. Get more support when you're ready..",
  description: "Join Mentorle to discover opportunities, connect with builders, and learn from experts. Upgrade for mentorship and career support.",
};

export const homeFaq = {
  eyebrow: "FAQ",
  title: "Good to know.",
  description: "Common questions about joining Mentorle, who it’s for, and what to expect.",
  items: [
    {
      question: "Who can join Mentorle?",
      answer:
        "Students, graduates, working professionals, builders, founders and mentors can explore Mentorle, depending on the available programmes and services.",
    },
    {
      question: "Do I need to be from a particular college or city?",
      answer:
        "Mentorle's goal is to make useful guidance and connections more accessible. Check the eligibility requirements for any specific programme before registering.",
    },
    {
      question: "Is Mentorle free?",
      answer:
        "Check the current membership and programme details on our Pricing page for the latest information about free access, paid memberships and individual services.",
    },
    {
      question: "Does joining Mentorle guarantee a job or internship?",
      answer:
        "No. Joining a community or using mentorship services does not guarantee a job, internship, funding or a particular career outcome. Mentorle can help you explore guidance and opportunities that may support your progress.",
    },
  ],
};

const goalIcon = (name: string, width: number, height: number): ImageAsset => ({ src: `/homepage/start-with-your-goal/${name}.svg`, width, height });

// "Start with your goal" (after Live Gatherings). Domain cards aren't links; the header button and the CTA
// tile (request-tile pattern) send people into signup / the mentor directory.
export const helpWith = {
  eyebrow: "Find Your Next Step",
  title: "What would you like help with?",
  description: "Whether you're building a startup, learning new skills, or exploring careers, connect with experts who can guide you forward.",
  action: { label: "Explore all domains", href: "/mentors" },
  cards: [
    { icon: goalIcon("IT", 76, 41), title: "IT & Software", description: "Build coding skills, explore emerging technologies, and learn from experienced developers." },
    { icon: goalIcon("startup", 69, 69), title: "Startup & Pitching", description: "Turn your ideas into reality with expert guidance on business growth and investor pitching." },
    { icon: goalIcon("academic-counselling", 69, 52), title: "Academic Counseling", description: "Make informed study choices, explore opportunities, and plan your academic confidently." },
    { icon: goalIcon("product-management", 69, 69), title: "Product Management", description: "Master product strategy, understand user needs, and learn to build successful products." },
    { icon: goalIcon("design", 69, 69), title: "Design & UI/UX", description: "Improve your design skills through user research, wireframing, prototyping, and visual design." },
  ] satisfies IconCardContent[],
  // Replaces the old Career Transitions card (request-tile pattern from Speaker Hub).
  ctaTile: {
    title: "Not sure where you fit?",
    cta: { label: "Join for free and Explore", href: "/signup" },
  },
};
