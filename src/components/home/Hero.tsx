import { ButtonLink } from "@/components/ui/ButtonLink";
import { HeroSlideshow } from "@/components/home/HeroSlideshow";
import { hero } from "@/data/home";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex h-svh max-h-[53.75rem] min-h-[37.5rem] items-center overflow-hidden bg-ink md:max-h-[50rem] md:min-h-[45rem]"
    >
      <HeroSlideshow slides={hero.slides} autoplayMs={hero.autoplayMs} />

      <div className="container-page pt-16 text-center text-white md:pt-[9.625rem]">
        <h1
          id="hero-title"
          data-hero="1"
          className="mx-auto max-w-[40rem] text-[2.125rem] leading-[1.2] font-medium tracking-[-0.01em] whitespace-pre-line md:text-5xl"
        >
          {hero.title}
        </h1>
        <p data-hero="2" className="mx-auto mt-3 max-w-[27.5rem] text-[0.9375rem] leading-[1.375rem] text-white/85 md:max-w-[40rem]">
          {hero.subtitle}
        </p>
        <div data-hero="3" className="mt-8 flex flex-wrap items-center justify-center gap-2 md:mt-[2.375rem]">
          <ButtonLink href={hero.primaryCta.href} variant="ghost">
            {hero.primaryCta.label}
          </ButtonLink>
          <ButtonLink href={hero.secondaryCta.href} variant="light">
            {hero.secondaryCta.label}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
