"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowControls } from "@/components/ui/ArrowControls";
import type { ImageAsset } from "@/data/home";

type HeroSpotlightProps = {
  slides: (ImageAsset & { alt: string })[];
};

export function HeroSpotlight({ slides }: HeroSpotlightProps) {
  const [index, setIndex] = useState(0);
  const frameRef = useRef<HTMLDivElement>(null);
  const canCycle = slides.length > 1;

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-slide]");
      items.forEach((item, itemIndex) => {
        const isActive = itemIndex === index;
        gsap.to(item, {
          autoAlpha: isActive ? 1 : 0,
          scale: isActive ? 1 : 1.08,
          duration: 0.8,
          ease: "power2.out",
        });
      });
    },
    { scope: frameRef, dependencies: [index] },
  );

  const step = (direction: 1 | -1) => setIndex((value) => (value + direction + slides.length) % slides.length);

  return (
    <div
      data-hero="3"
      className="absolute right-[var(--gutter)] bottom-[2.625rem] hidden w-[17rem] border-[0.5rem] border-white/30 backdrop-blur-sm md:block xl:right-[2.625rem] xl:w-[20.3125rem]"
    >
      <div ref={frameRef} className="relative aspect-[309/191] overflow-hidden">
        {slides.map((slide, slideIndex) => (
          <div key={slide.src} data-slide className={`absolute inset-0 ${slideIndex === 0 ? "" : "invisible opacity-0"}`}>
            <Image src={slide.src} alt={slide.alt} fill sizes="20rem" className="object-cover" />
          </div>
        ))}
        <ArrowControls
          size="sm"
          label="Spotlight images"
          className="absolute right-2 bottom-2"
          onPrev={() => step(-1)}
          onNext={() => step(1)}
          canPrev={canCycle}
          canNext={canCycle}
        />
      </div>
    </div>
  );
}
