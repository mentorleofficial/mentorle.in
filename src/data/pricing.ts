import type { ImageAsset } from "@/data/home";

// A plan as configured in the platform's admin panel (subscription_plans, read through list_active_plans) and
// shown on the pricing page and the homepage. Benefits are lines of text; "**Bold** rest" bolds the lead.
export type PricingPlan = {
  id: string;
  slug: string;
  name: string;
  billing: "free" | "one_time" | "subscription";
  price: number;
  accessMonths: number | null;
  tagline: string;
  intro: string;
  note: string;
  badge: string;
  featured: boolean;
  benefits: string[];
  ctaLabel: string;
  sessionDiscount: number;
  freeSessions: number;
  freePeriod: "month" | "year";
};

export const planCopy = {
  free: "/forever",
  perYear: "/year",
  perMonths: (months: number) => (months === 12 ? "/year" : months === 1 ? "/month" : `/${months} months`),
  freeCta: "Join the Free Community",
  freeSignedIn: "You’re in the community",
  get: (name: string) => `Get ${name}`,
  yourPlan: "Your current plan",
  validUntil: (date: string) => `Valid until ${date}`,
  renew: (name: string) => `Renew ${name}`,
  otherPlan: (name: string) => `You have ${name}`,
  starting: "Opening checkout…",
  finishProfile: "Finish your profile first",
  mentorAccount: "Plans are for mentee accounts",
  error: "Couldn’t start the payment. Please try again.",
  empty: "Plans are being updated. Please check back soon.",
};

export const pricingPage = {
  hero: {
    title: "Supercharge your career trajectory",
    subtitle: "Unlock exclusive 1-on-1 sessions, private study resources, and partner perks designed for high achievers.",
    background: { src: "/mentorle-plus/hero.webp", width: 2880, height: 1440, alt: "" } satisfies ImageAsset & { alt: string },
    primaryCta: { label: "Find a Mentor", href: "/mentors" },
    secondaryCta: { label: "Explore Mentorle Plus", href: "#plans" },
  },
  // Placeholder (P7): the refund terms stand in for the Cancellation & Refund Policy page (content pending).
  terms: {
    lead: "Passes last 12 months from the day you buy them.",
    emphasis: "Refunds within 7 days of purchase",
    tail: ", provided no member benefit has been used.",
  },
  benefits: {
    eyebrow: "Benefits",
    title: "What you actually get",
    description: "Three perks that compound every month you stay subscribed.",
  },
};
