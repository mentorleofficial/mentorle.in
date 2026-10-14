import type { CommunityPillar } from "@/data/community";

export function CommunityPillars({ pillars }: { pillars: CommunityPillar[] }) {
  return (
    <section aria-label="What the community offers" className="bg-ink py-16 text-white md:py-20 lg:pt-[6.75rem] lg:pb-[6.25rem]">
      <ul data-animate="stagger" className="container-page grid gap-10 text-center sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {pillars.map((pillar) => (
          <li key={pillar.title}>
            <h2 className="text-[1.625rem] font-medium md:text-[2rem]">{pillar.title}</h2>
            <p className="mx-auto mt-3 max-w-[16.25rem] text-base leading-snug text-white/90">{pillar.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
