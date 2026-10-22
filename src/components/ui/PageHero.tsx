import Image from "next/image";
import { ButtonLink } from "@/components/ui/ButtonLink";
import type { ImageAsset } from "@/data/home";

type Cta = { label: string; href: string; external?: boolean };

type PageHeroProps = {
  title: string;
  subtitle?: string;
  background: ImageAsset & { alt: string };
  primaryCta?: Cta;
  secondaryCta?: Cta;
  overlayOpacity?: number;
  subtitleSize?: "sm" | "base";
  subtitleWidth?: string;
  contentOffset?: string;
};

export function PageHero({ title, subtitle, background, primaryCta, secondaryCta, overlayOpacity = 0, subtitleSize = "sm", subtitleWidth, contentOffset = "md:pt-[7rem]" }: PageHeroProps) {
  return (
    <section
      aria-labelledby="page-hero-title"
      className="relative isolate flex h-svh max-h-[53.75rem] min-h-[37.5rem] items-center overflow-hidden bg-ink md:h-[45rem] md:max-h-none"
    >
      <Image
        src={background.src}
        alt={background.alt}
        fill
        preload
        sizes="100vw"
        className="-z-10 object-cover"
      />
      {overlayOpacity > 0 && (
        <div className="absolute inset-0 -z-10" style={{ backgroundColor: `rgb(0 0 0 / ${overlayOpacity})` }} aria-hidden />
      )}

      <div className={`container-page pt-16 text-center text-white ${contentOffset}`}>
        <h1
          id="page-hero-title"
          data-hero="1"
          className="mx-auto max-w-[50rem] text-[2.125rem] leading-[1.18] font-medium tracking-[-0.01em] whitespace-pre-line md:text-5xl"
        >
          {title}
        </h1>
        {subtitle && (
          <p
            data-hero="2"
            className={`mx-auto mt-4 text-white/85 md:mt-5 ${
              subtitleSize === "base" ? `${subtitleWidth ?? "max-w-[30rem]"} text-base leading-snug` : `${subtitleWidth ?? "max-w-[28rem]"} text-sm leading-[1.55]`
            }`}
          >
            {subtitle}
          </p>
        )}
        {(primaryCta || secondaryCta) && (
          <div data-hero="3" className={`flex flex-wrap items-center justify-center gap-2 ${subtitleSize === "base" ? "mt-6" : "mt-8"}`}>
            {primaryCta && (
              <ButtonLink href={primaryCta.href} external={primaryCta.external} variant="ghost">
                {primaryCta.label}
              </ButtonLink>
            )}
            {secondaryCta && (
              <ButtonLink href={secondaryCta.href} external={secondaryCta.external} variant="light">
                {secondaryCta.label}
              </ButtonLink>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
