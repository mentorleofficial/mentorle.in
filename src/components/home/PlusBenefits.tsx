import Image from "next/image";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { plusBenefits } from "@/data/home";

export function PlusBenefits() {
  return (
    <section aria-labelledby="plus-title" className="bg-surface py-16 md:py-24 lg:py-[8.125rem]">
      <div className="container-page">
        <SectionHeader
          id="plus-title"
          eyebrow="Mentorle Plus"
          title="Supercharge your growth"
          description="Unlock exclusive perks, free sessions, and premium resources designed for high achievers."
          action={
            <ButtonLink href="/pricing" variant="brand">
              See Plus Pricing
            </ButtonLink>
          }
        />
        <div data-animate="stagger" className="mt-12 grid gap-5 md:mt-16 md:grid-cols-3">
          {plusBenefits.map((benefit) => (
            <article
              key={benefit.title}
              className="group border border-[#cbcbcb] px-5 pt-7 pb-6 transition-[border-color,background-color] duration-300 hover:border-ink/40 hover:bg-white lg:px-6 lg:pt-8"
            >
              <Image
                src={benefit.src}
                alt=""
                width={benefit.width}
                height={benefit.height}
                className="h-14 w-auto transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:scale-105 lg:h-[4.3125rem]"
              />
              <h3 className="mt-12 text-xl font-medium text-ink lg:mt-[4.375rem] lg:text-2xl">{benefit.title}</h3>
              <p className="mt-2 text-sm leading-snug text-ink/85 lg:text-base">{benefit.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
