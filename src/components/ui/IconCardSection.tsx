import type { ReactNode } from "react";
import { IconCard } from "@/components/ui/IconCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { IconCardContent } from "@/data/become-a-mentor";

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
        </div>
      </div>
    </section>
  );
}
