import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { IconCard } from "@/components/ui/IconCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { IconCardContent } from "@/data/become-a-mentor";

type CtaTile = {
  title: string;
  description?: string;
  cta: { label: string; href: string };
};

type IconCardSectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  cards: IconCardContent[];
  background: "surface" | "ink" | "dots";
  columns: 3 | 4;
  cardHeight: string;
  // Button under the header description (e.g. "Explore all domains").
  action?: ReactNode;
  // Section padding; override when the section continues the one above on the same background.
  padding?: string;
  headerAside?: "default" | "wide" | "narrow";
  // Optional brand CTA tile in the last grid cell (Speaker Hub request-tile pattern).
  ctaTile?: CtaTile;
};

const backgrounds = { surface: "bg-surface", ink: "bg-ink", dots: "bg-dots" };
const grids = { 3: "md:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" };

// Section header + a grid of pixel-icon cards. Used on Become a Mentor, the homepage ("What would you like
// help with?") and Events & Summits ("How it works").
export function IconCardSection({
  id,
  eyebrow,
  title,
  description,
  cards,
  background,
  columns,
  cardHeight,
  action,
  padding = "py-16 md:py-24 lg:py-[8.125rem]",
  headerAside,
  ctaTile,
}: IconCardSectionProps) {
  const tone = background === "ink" ? "dark" : "light";

  return (
    <section aria-labelledby={id} className={`${backgrounds[background]} ${padding}`}>
      <div className="container-page">
        <SectionHeader id={id} eyebrow={eyebrow} title={title} description={description} tone={tone} action={action} aside={headerAside} />
        <div data-animate="stagger" className={`mt-12 grid gap-5 md:mt-16 ${grids[columns]}`}>
          {cards.map((card) => (
            <IconCard key={card.title} icon={card.icon} title={card.title} description={card.description} tone={tone} className={cardHeight} />
          ))}
          {ctaTile && (
            <aside
              aria-labelledby={`${id}-cta`}
              className={`flex flex-col items-center justify-center bg-brand bg-[radial-gradient(85%_70%_at_50%_62%,#ef875f_0%,transparent_75%),linear-gradient(170deg,#e8521e_0%,#ef6c3d_38%,#ea7a54_100%)] px-8 pt-11 pb-8 text-center text-white ${cardHeight}`}
            >
              <h3 id={`${id}-cta`} className="max-w-[15rem] text-[2rem] leading-[1.35] font-medium">
                {ctaTile.title}
              </h3>
              {ctaTile.description ? (
                <p className="mt-3 max-w-[19.75rem] text-base leading-[1.45] text-white/95">{ctaTile.description}</p>
              ) : null}
              <ButtonLink href={ctaTile.cta.href} variant="light" className="mt-6">
                {ctaTile.cta.label}
              </ButtonLink>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}
