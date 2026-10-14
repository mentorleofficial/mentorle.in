import type { ImageAsset } from "@/data/home";
import { BECOME_A_MENTOR_PATH } from "@/data/site";

export type CommunityPillar = { title: string; description: string };

export type CommunityFeature = {
  eyebrow: string;
  title: string;
  description: string;
  image: ImageAsset & { alt: string };
  cta: { label: string; href: string };
};

// No WhatsApp/community join flow exists yet; "Join the community" goes to signup (logged in SPEC-VS-DESIGN).
const JOIN_HREF = "/signup";

export const communityPage = {
  hero: {
    title: "The community is already meeting.",
    subtitle: "Saturday mornings, the jobs near your campus, and one open hour each quarter. You do not need a pass to take a seat.",
    background: { src: "/community/hero.webp", width: 2880, height: 1440, alt: "" } satisfies ImageAsset & { alt: string },
    // The design copies the Become a Mentor hero buttons here (logged in SPEC-VS-DESIGN).
    primaryCta: { label: "Become a Mentor", href: BECOME_A_MENTOR_PATH },
    secondaryCta: { label: "See what you would earn", href: `${BECOME_A_MENTOR_PATH}#calculator` },
  },
  pillars: [
    { title: "Every Saturday", description: "The onboarding masterclass stays open. Come once, or keep coming back." },
    { title: "Your city first", description: "Jobs, internships, hackathons, and meetups that start near your campus." },
    { title: "One open hour", description: "An expert sits with the room once a quarter. The first conversation is free to join." },
    { title: "No pass", description: "Walk in and take a seat. A year-long door is a later choice, not the price of entry." },
  ] satisfies CommunityPillar[],
  features: [
    {
      eyebrow: "Saturday room",
      title: "Show up. Leave with the next step written down.",
      description:
        "The onboarding masterclass is the same room every week. People who are already building sit next to people who just walked in.",
      image: { src: "/community/saturday-room.webp", width: 1368, height: 824, alt: "A group of people talking around laptops at a weekend masterclass" },
      cta: { label: "Join the community", href: JOIN_HREF },
    },
    {
      eyebrow: "Near you",
      title: "The list starts in your city.",
      description: "Local jobs, internships, college hackathons, and meetups. It widens when you want it to. It does not start somewhere else.",
      image: { src: "/community/near-you.webp", width: 1368, height: 824, alt: "Students discussing plans around a table at a campus café" },
      cta: { label: "Browse events", href: "/events" },
    },
    {
      eyebrow: "One open hour",
      title: "Once a quarter, an expert holds the room.",
      description:
        "The first conversation is not locked behind a plan. You sit in, ask the thing you are stuck on, and hear it from someone who has already done the job.",
      image: { src: "/community/one-open-hour.webp", width: 1368, height: 824, alt: "An experienced mentor talking with a young professional" },
      cta: { label: "Meet the mentors", href: "/mentors" },
    },
  ] satisfies CommunityFeature[],
  banner: {
    title: "Take a seat this Saturday.",
    primaryCta: { label: "Join the community", href: JOIN_HREF },
    secondaryCta: { label: "Explore Mentorle Plus", href: "/pricing" },
  },
};
