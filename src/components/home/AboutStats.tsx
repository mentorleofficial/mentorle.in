import { CountUp } from "@/components/motion/CountUp";
import { ScrollRevealText } from "@/components/ui/ScrollRevealText";
import { about } from "@/data/home";

export function AboutStats() {
  return (
    <section aria-labelledby="about-title" className="bg-dots">
      <div className="container-page grid gap-8 py-[3.6rem] md:py-[5.4rem] lg:grid-cols-[37.5%_1fr] lg:gap-0 lg:py-[7.3125rem]">
        <div data-animate="stagger" className="flex flex-col justify-between gap-6 lg:gap-0">
          <p className="text-xl tracking-[-0.02em] text-ink md:text-2xl">{about.eyebrow}</p>
          <h2 id="about-title" className="max-w-[23.75rem] text-[1.75rem] leading-[1.3] font-medium text-ink md:text-[2rem]">
            <span className="text-brand">{about.highlight}</span> {about.title}
          </h2>
        </div>
        <ScrollRevealText
          lead={about.lead}
          text={about.body}
          className="text-2xl leading-[1.45] font-medium md:text-[2rem]"
        />
      </div>

      <dl data-animate="stagger" className="grid border-y border-line sm:grid-cols-3">
        {about.stats.map((stat, index) => (
          <div
            key={stat.label}
            className={`flex flex-col-reverse items-center py-10 md:py-[3.75rem] ${index > 0 ? "border-t border-line sm:border-t-0 sm:border-l" : ""}`}
          >
            <dt className="mt-3 text-base font-medium text-ink">{stat.label}</dt>
            <CountUp
              target={stat.target}
              decimals={stat.decimals}
              suffix={stat.suffix}
              className="text-[clamp(3.5rem,8.3vw,7.5rem)] leading-none font-medium tracking-[-0.02em] text-muted tabular-nums"
            />
          </div>
        ))}
      </dl>
    </section>
  );
}
