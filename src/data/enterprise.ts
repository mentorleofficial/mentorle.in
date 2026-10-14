import type { ImageAsset } from "@/data/home";
import { BECOME_A_MENTOR_PATH } from "@/data/site";

export type EnterpriseOffer = { icon: ImageAsset; title: string; description: string };
export type EnterpriseAudience = { id: string; title: string; offers: EnterpriseOffer[] };

const icon = (name: string, width: number, height: number): ImageAsset => ({ src: `/enterprise/${name}.svg`, width, height });

export const enterprisePage = {
  hero: {
    title: "Empower Your Students & Teams",
    // The design reuses the Events page subtitle and the Become a Mentor buttons here (logged in SPEC-VS-DESIGN).
    subtitle:
      "Our own curated gatherings, plus auto-curated hackathons, meetups, jobs and freelance gigs from MLH, Devfolio, Luma, Wellfound and more.",
    background: { src: "/enterprise/hero.webp", width: 2880, height: 1440, alt: "" } satisfies ImageAsset & { alt: string },
    primaryCta: { label: "Become a Mentor", href: BECOME_A_MENTOR_PATH },
    secondaryCta: { label: "See what you would earn", href: `${BECOME_A_MENTOR_PATH}#calculator` },
  },
  audiences: [
    {
      id: "universities",
      title: "For Universities",
      offers: [
        { icon: icon("host-campus-summits", 20, 20), title: "Host Campus Summits", description: "We bring FAANG engineers and YC founders to your campus." },
        { icon: icon("alumni-mentoring", 20, 15), title: "Alumni Mentoring", description: "White-label our booking platform for your internal network." },
      ],
    },
    {
      id: "companies",
      title: "For Companies",
      offers: [
        { icon: icon("employee-upskilling", 20, 20), title: "Employee Upskilling", description: "Give your juniors 1-on-1 access to senior leaders at top firms." },
        { icon: icon("edtech-api-integrations", 22, 19), title: "EdTech API Integrations", description: "Integrate our mentor directory directly into your learning platform." },
      ],
    },
  ] satisfies EnterpriseAudience[],
  // No contact page or sales inbox exists yet; this points at the planned route (logged in SPEC-VS-DESIGN).
  contactCta: { label: "Contact Sales", href: "/contact" },
};
