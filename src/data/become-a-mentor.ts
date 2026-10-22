import type { HowItWorksStep, ImageAsset } from "@/data/home";
import { MENTOR_APPLY_URL } from "@/data/site";

const icon = (name: string, width: number, height: number): ImageAsset => ({ src: `/become-a-mentor/${name}.svg`, width, height });

export type IconCardContent = { icon: ImageAsset; title: string; description: string };

export const becomeAMentorPage = {
  hero: {
    // Line break as in the design.
    title: "Share what you know.\nHelp someone move forward.",
    subtitle: "Your experience can help someone make a better career decision, improve a project, or take their next step with confidence.",
    background: { src: "/become-a-mentor/hero-stage.webp", width: 1440, height: 720, alt: "" } satisfies ImageAsset & { alt: string },
    primaryCta: { label: "Become a Mentor", href: MENTOR_APPLY_URL, external: true },
    // The design doesn't say where this goes; it scrolls to "What happens after you apply" (logged in SPEC-VS-DESIGN).
    secondaryCta: { label: "See how it works", href: "#application" },
  },

  why: {
    eyebrow: "Why Mentorle",
    title: "Make your experience count.",
    description: "Share practical lessons from your career, projects or founder journey—and help someone learn from your experience.",
    cards: [
      { icon: icon("make-a-real-impact", 76, 76), title: "Make a real impact", description: "Help someone prepare, decide, build or solve a problem." },
      { icon: icon("build-your-reputation", 48, 76), title: "Build your reputation", description: "Showcase your expertise and the value you bring to learners." },
      { icon: icon("mentor-on-you-terms", 62, 69), title: "Mentor on your terms", description: "Share your availability and the topics you can genuinely help with." },
    ] satisfies IconCardContent[],
  },

  ways: {
    eyebrow: "Ways to mentor",
    title: "Choose how you can help.",
    description: "Offer practical guidance in a format that suits your expertise.",
    formats: [
      { number: "01", label: "Quick Feedback", title: "Voice-note review", description: "Give focused feedback on a resume, profile or job description." },
      { number: "02", label: "Quick Session", title: "Short 1:1 session", description: "Help with one question, a coding concept or a career concern." },
      { number: "03", label: "Focused Session", title: "Practical review", description: "Run a mock interview, review a portfolio or discuss a project." },
      { number: "04", label: "Deep Dive", title: "In-depth guidance", description: "Explore leadership, product, system design or startup strategy." },
    ],
  },
  tiers: {
    eyebrow: "Mentor Tiers",
    title: "Tiers are earned, not chosen",
    description: "Your tier is set by review and track record. It sets your price ceiling and how prominently you appear in the directory.",
    cards: [
      { level: "Entry", badge: "Async 1:1", description: "Two-minute WhatsApp voice teardown plus a line-by-line ATS fix on the resume PDF. No call, 24-hour SLA.", price: "₹60", unit: "/ per teardown" },
      { level: "Tier 1", badge: "Starter", description: "45-minute live call: foundational DSA and web, plus an ATS resume audit.", price: "₹250", unit: "/ 45 min" },
      { level: "Tier 2", badge: "★ Verified", description: "45-minute live coding drill, project defense and STAR behavioural rubric scoring.", price: "₹400", unit: "/ 45 min" },
      { level: "Tier 3", badge: "★★ Lead / FAANG", description: "45-minute senior system design and high-concurrency architecture drill.", price: "₹700", unit: "/ 45 min" },
      {
        level: "Tier 4",
        badge: "★★★ Elite Executive",
        description:
          "60-minute advisory sessions with industry-leading Principal, Staff, and VP-level Engineering experts, alongside strategic guidance from experienced founders to help you make high-impact decisions.",
        price: "₹1,750–3,500",
        unit: "/ 60 min",
        featured: true,
      },
    ],
  },

  recognition: [
    {
      title: "Badges you can show off",
      description: "Verified titles like “Top 1% System Design Evaluator” attach to a public profile with your session count and company history.",
      src: "/become-a-mentor/badges.svg",
      width: 168,
      height: 264,
    },
    {
      title: "Your number stays private",
      description: "Personal phone and email are never shown. Calls use a masked alias, and chat blocks phone numbers and UPI IDs automatically.",
      src: "/become-a-mentor/number-privacy.svg",
      width: 240,
      height: 240,
    },
    {
      title: "You see your own ranking",
      description: "No mystery algorithm. The score behind your directory position is published, and so are the four things that move it.",
      src: "/become-a-mentor/ranking.svg",
      width: 240,
      height: 240,
    },
  ] satisfies HowItWorksStep[],

  expectations: {
    eyebrow: "Mentor Expectations",
    title: "What we ask of you",
    description: "All important details are clearly stated upfront, not hidden in lengthy terms and conditions you only discover after signing up.",
    cards: [
      { icon: icon("every-tuesday", 62, 69), title: "One reschedule\nper 30 days", description: "With at least 12 hours notice. Under 12 hours deducts ₹150, credited to the mentee whose evening you moved." },
      { icon: icon("tier-price", 41, 69), title: "Tier price\nfloors", description: "You cannot undercut the tier below you. A 45-minute slot has a floor; price under it and the session is reshaped into a shorter drill." },
      { icon: icon("500-minimum", 69, 62), title: "24-hour\nasync SLA", description: "Every ₹99 teardown runs a countdown. Unanswered reviews reassign automatically and cost you listing priority." },
      { icon: icon("six-month", 76, 65), title: "Six-month non-circumvention", description: "Mentees introduced through Mentorle stay on Mentorle for six months. It protects the escrow, the dispute cover and tier standing." },
    ] satisfies IconCardContent[],
  },

  application: {
    eyebrow: "The Application Process",
    title: "What happens after you apply",
    description: "Most requests are handled within just a few days, so you can get the answers and support you need without waiting weeks.",
    cards: [
      { icon: icon("we-review", 55, 69), title: "We review", description: "A human reads your application and checks your track record against the tier you are applying for." },
      { icon: icon("you-set-up", 69, 69), title: "You set up", description: "Name your hourly take-home, pick the formats you want to offer, mark the hours you are free." },
      { icon: icon("you-go-live", 69, 69), title: "You go live", description: "Your profile enters the directory and bookings start arriving. Until approval it stays hidden." },
    ] satisfies IconCardContent[],
  },

  banner: {
    title: "Ready to take your next step?",
    // "Book a Session" opens the mentor directory, where sessions are booked.
    primaryCta: { label: "Book a Session", href: "/mentors" },
    secondaryCta: { label: "Explore Mentorle Plus", href: "/pricing" },
  },

  faq: {
    eyebrow: "FAQ",
    title: "Good to know.",
    description: "Everything you need to know before you apply to become a mentor on Mentorle.",
    // Only the first answer is in the design; the other three are placeholder copy based on the platform's
    // mentor rules (logged in SPEC-VS-DESIGN).
    items: [
      { question: "Do I need to be a full-time mentor?", answer: "No. You can mentor alongside your work, based on the availability you share during onboarding." },
      { question: "Can I choose my topics?", answer: "Yes. You pick the areas and formats you want to offer when you set up your profile, and you can change them any time." },
      { question: "Can I set my own session prices?", answer: "Yes. You name your hourly take-home within your tier’s price range, and that amount is what you receive." },
      { question: "When will I know my tier and payouts?", answer: "We confirm your tier after reviewing your application, usually within a few days. Earnings are paid out every Tuesday once a session clears." },
    ],
  },
};
