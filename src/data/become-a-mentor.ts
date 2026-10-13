import type { HowItWorksStep, ImageAsset } from "@/data/home";
import { MENTOR_APPLY_URL } from "@/data/site";

const icon = (name: string, width: number, height: number): ImageAsset => ({ src: `/become-a-mentor/${name}.svg`, width, height });

export type IconCardContent = { icon: ImageAsset; title: string; description: string };

export const becomeAMentorPage = {
  hero: {
    title: "You name your take-home. We never touch it.",
    subtitle:
      "Tell us what you want to earn per hour. We add our margin on top of that number, never out of it so the amount that lands in your account is the amount you asked for, every time.",
    background: { src: "/become-a-mentor/hero.webp", width: 2880, height: 1440, alt: "" } satisfies ImageAsset & { alt: string },
    primaryCta: { label: "Become a Mentor", href: MENTOR_APPLY_URL, external: true },
    secondaryCta: { label: "See what you would earn", href: "#calculator" },
  },

  discount: {
    title: "Discounts come out of our margin, not your fee",
    description: "When a Pro Pass member books you with a 15% discount, they pay less. You do not. Mentorle absorbs it.",
    // The design repeats "List price ₹499" on the second row; it is the Pro Pass member's 15%-off price (logged in SPEC-VS-DESIGN).
    rows: [
      { label: "List price", value: "₹499" },
      { label: "Pro Pass member pays", value: "₹424" },
    ],
    receive: { label: "You still receive", value: "₹330" },
    keeps: { label: "Mentorle keeps", value: "₹84" },
  },

  takeHome: {
    eyebrow: "Mentor Benefits",
    title: "What you take home",
    description: "Standard rates. Senior tiers earn more on the same formats.",
    columns: { format: "Format", pays: "Mentee pays", keep: "You keep" },
    rows: [
      { format: "2-min async teardown", detail: "Voice note on a resume, no call", pays: "₹99", keep: "₹60" },
      { format: "15-min flash call", detail: "Resume roast or one DSA check", pays: "₹199", keep: "₹125" },
      { format: "30-min focused drill", detail: "Live coding or portfolio review", pays: "₹299", keep: "₹190" },
      { format: "45-min standard mock", detail: "Coding, project defense, STAR rubric", pays: "₹499", keep: "₹330" },
      { format: "60-min deep architecture", detail: "System design and scalability", pays: "₹999", keep: "₹680" },
      { format: "90-min executive sprint", detail: "Staff transition or investor pitch", pays: "₹2,499", keep: "₹1,700" },
      { format: "60-min group masterclass", detail: "One-to-many, 12 run each year", pays: "Included in Pro Pass", keep: "₹1,000–1,500" },
    ],
  },

  calculator: {
    eyebrow: "Mentor Earnings",
    title: "Set your own rate",
    description: "You enter one number. We work out what to charge so that number reaches you intact.",
    inputLabel: "Your desired take-home, per hour",
    hint: "Drag or type. Most mentors on the platform sit between ₹500 and ₹2,500 an hour.",
    note: "You never see a commission line in your dashboard only the payout. We add the gateway fee and our margin on top of your number.",
    // Slider range is an assumption (the design only shows the thumb at ₹1,400); typed values may go wider.
    defaultRate: 1400,
    slider: { min: 300, max: 3000, step: 50 },
    typedRange: { min: 100, max: 10000 },
    // Gross-up engine (BP §2): mentee price = payout × (1 + gateway fee) ÷ (1 − platform take), rounded up to the next ₹…99.
    gatewayFee: 0.0236,
    platformTake: 0.3,
    formats: [
      { minutes: 15, name: "Flash Call" },
      { minutes: 30, name: "Focused Drill" },
      { minutes: 45, name: "Standard Mock" },
      { minutes: 60, name: "Deep Architecture" },
      { minutes: 90, name: "Executive Sprint" },
    ],
    columns: { format: "Format", pays: "Mentee pays", keep: "You keep" },
    cta: { label: "Become a Mentor", href: MENTOR_APPLY_URL, external: true },
  },

  commute: {
    eyebrow: "Flexible Mentorship",
    title: "Mentor from your commute",
    intro:
      "The lowest-effort way to start. No calendar, no call, no scheduling. A student uploads a resume and a job description. You listen on your phone and record a two-minute voice note. That is the whole job.",
    points: [
      { title: "Two minutes of speaking", text: "Thirty seconds on ATS formatting, a minute on project and metric gaps, thirty seconds on the exact fix." },
      { title: "24 hours to reply", text: "Answer during lunch or on the train. Miss the window and it reassigns, so nobody is left waiting." },
      { title: "₹60 per teardown", text: "Paid into your wallet once the student rates it." },
    ],
    flowTitle: "How a teardown moves",
    flow: [
      { title: "Assigned", text: "WhatsApp ping with a secure resume link" },
      { title: "You review", text: "Read on mobile, record a voice note" },
      { title: "Delivered", text: "Bot checks length, forwards to the student" },
      { title: "Paid", text: "₹60 credited after the student rates it" },
    ],
  },

  payments: {
    eyebrow: "Seamless Payments",
    title: "Getting paid is the part we over-engineered",
    description: "You should never be chasing a student for money. You never will be.",
    cards: [
      { icon: icon("collected-upfront", 69, 69), title: "Collected upfront", description: "Student payments are secured in a regulated escrow account before your session is confirmed." },
      { icon: icon("every-tuesday", 62, 69), title: "Every Tuesday, 6PM IST", description: "Cleared balances settle automatically by UPI or IMPS. No invoice to raise, no follow-up need." },
      { icon: icon("24-hour-buffer", 69, 69), title: "24-hour buffer", description: "Funds sit in pending clearance for a day after the session so disputes can be raised, then clear." },
      { icon: icon("500-minimum", 69, 62), title: "₹500 minimum", description: "Withdraw once your cleared balance passes ₹500. Anything below rolls into the next Tuesday." },
    ] satisfies IconCardContent[],
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

  ranking: {
    // The design repeats the "Seamless Payments" eyebrow here (logged in SPEC-VS-DESIGN).
    eyebrow: "Directory Ranking",
    title: "How the directory ranks you",
    description: "Most platforms hide their ranking formula. We believe in transparency, so here’s exactly how your score is calculated and rankings are determined.",
    weights: [
      { value: "35%", title: "Conversion rate", description: "How often a profile view turns into a booking." },
      { value: "25%", title: "Rating", description: "Structured rubric scores from the mentees you have already seen." },
      { value: "25%", title: "Fair price index", description: "How closely your rate matches your tier’s experience benchmark." },
      { value: "15%", title: "SLA adherence", description: "Turning up on time and answering async reviews inside 24 hours." },
    ],
    note: "Price yourself well above your tier benchmark and your fair-price index falls, which quietly moves you down the listings. We will not argue with you about it but after two weeks with no bookings you will get a note telling you what comparable mentors charge.",
  },

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
    title: "Someone is stuck on the thing you solved three years ago",
    primaryCta: { label: "Become a Mentor", href: MENTOR_APPLY_URL, external: true },
    secondaryCta: { label: "Explore Mentorle Plus", href: "/pricing" },
  },
};
