import type { ImageAsset } from "@/data/home";

export type PlanFeature = {
  text: string;
  kind: "check" | "star" | "cross";
};

export type Plan = {
  id: "free" | "pro" | "all-access";
  name: string;
  tagline: string;
  price: number;
  period: string;
  note?: string;
  badge?: string;
  featured?: boolean;
  features: PlanFeature[];
  cta: { label: string; href: string; variant: "dark" | "brand" };
};

// No checkout or accounts exist yet, so plan CTAs go to signup with the plan preselected.
export const plans: Plan[] = [
  {
    id: "free",
    name: "Free Community",
    tagline: "Discovery tier",
    price: 0,
    period: "/Free",
    features: [
      // Wording from the updated homepage design (2026-10-22), used on the pricing page too. The design's
      // "every sat." is only capitalised: written out, the line no longer fits the card.
      { kind: "check", text: "Join a free 60-minute group session every Sat." },
      { kind: "check", text: "Find local and regional jobs and internships" },
      { kind: "check", text: "Discover nearby hackathons and meetups" },
      { kind: "check", text: "Join one open expert session each quarter" },
      { kind: "check", text: "Sample templates and community links" },
      { kind: "check", text: "Standard 1:1 session pricing" },
    ],
    cta: { label: "Current Plan", href: "/signup", variant: "dark" },
  },
  {
    id: "pro",
    name: "Pro Pass",
    tagline: "Community, group mentorship & discounts",
    price: 2500,
    period: "/year",
    note: "Regular value ₹10,000, about ₹208/month",
    badge: "Most Popular",
    featured: true,
    features: [
      { kind: "star", text: "12 live group masterclasses a year" },
      { kind: "check", text: "15% off 1:1 in month 1, then 10% all year" },
      { kind: "check", text: "Invite friends to unlock bigger session discounts" },
      { kind: "check", text: "Find opportunities across India, including remote" },
      { kind: "check", text: "Get priority entry to regional Builder Meetups" },
      { kind: "check", text: "Career guides, AI prompts & templates" },
      { kind: "check", text: "Discover hackathons and find teammates." },
    ],
    cta: { label: "Get Pro Pass", href: "/signup?plan=pro", variant: "brand" },
  },
  {
    id: "all-access",
    name: "All-Access",
    tagline: "Everything in Pro, plus 1:1 tokens",
    price: 5999,
    period: "/year",
    note: "or 6 EMIs of ₹999/month",
    features: [
      { kind: "star", text: "Everything in Pro Pass" },
      { kind: "check", text: "4 live 1:1 mock tokens" },
      { kind: "check", text: "Tokens unlock on day 0, 90, 180 and 270" },
      { kind: "check", text: "₹13,900+ partner perk stack" },
      { kind: "check", text: "Overleaf, GitHub Pack, Notion, Canva & more" },
      { kind: "check", text: "Priority recruiter routing" },
    ],
    cta: { label: "Get All-Access", href: "/signup?plan=all-access", variant: "dark" },
  },
];

export const pricingPage = {
  hero: {
    title: "Supercharge your career trajectory",
    subtitle: "Unlock exclusive 1-on-1 sessions, private study resources, and partner perks designed for high achievers.",
    background: { src: "/mentorle-plus/hero.webp", width: 2880, height: 1440, alt: "" } satisfies ImageAsset & { alt: string },
    primaryCta: { label: "Find a Mentor", href: "/mentors" },
    secondaryCta: { label: "Explore Mentorle Plus", href: "#plans" },
  },
  terms: {
    lead: "Tokens expire 365 days from purchase.",
    emphasis: "Refunds within 7 days of purchase",
    tail: ", provided no token has been redeemed.",
  },
  benefits: {
    eyebrow: "Benefits",
    title: "What you actually get",
    description: "Three perks that compound every month you stay subscribed.",
  },
};
