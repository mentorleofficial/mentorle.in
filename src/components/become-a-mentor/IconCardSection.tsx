import { IconCard } from "@/components/ui/IconCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { IconCardContent } from "@/data/become-a-mentor";

type IconCardSectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  cards: IconCardContent[];
  background: "surface" | "ink";
  columns: 3 | 4;
  cardHeight: string;
};

const backgrounds = { surface: "bg-surface", ink: "bg-ink" };
const grids = { 3: "md:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" };

export function IconCardSection({ id, eyebrow, title, description, cards, background, columns, cardHeight }: IconCardSectionProps) {
  const tone = background === "ink" ? "dark" : "light";

  return (
    <section aria-labelledby={id} className={`${backgrounds[background]} py-16 md:py-24 lg:py-[8.125rem]`}>
      <div className="container-page">
        <SectionHeader id={id} eyebrow={eyebrow} title={title} description={description} tone={tone} />
        <div data-animate="stagger" className={`mt-12 grid gap-5 md:mt-16 ${grids[columns]}`}>
          {cards.map((card) => (
            <IconCard key={card.title} icon={card.icon} title={card.title} description={card.description} tone={tone} className={cardHeight} />
          ))}
        </div>
      </div>
    </section>
  );
}
