import type { ReactNode } from "react";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
  id?: string;
};

export function SectionHeader({ eyebrow, title, description, action, id }: SectionHeaderProps) {
  return (
    <div
      data-animate="stagger"
      className="grid gap-5 md:grid-cols-[1fr_minmax(0,22rem)] md:items-center md:gap-10 lg:grid-cols-[1fr_25.625rem]"
    >
      <div>
        <p className="text-xl tracking-[-0.02em] text-ink md:text-2xl">{eyebrow}</p>
        <h2 id={id} className="mt-2 text-[1.625rem] leading-tight font-medium text-ink md:mt-3 md:text-[2rem]">
          {title}
        </h2>
      </div>
      <div className="flex flex-col items-start gap-4">
        <p className="text-base leading-snug text-ink">{description}</p>
        {action}
      </div>
    </div>
  );
}
