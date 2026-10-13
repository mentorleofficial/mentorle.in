"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useRef, useState } from "react";
import { howItWorks } from "@/data/home";
import type { HowItWorksStep } from "@/data/home";

type HowItWorksProps = {
  steps?: HowItWorksStep[];
  ariaLabel?: string;
};

export function HowItWorks({ steps = howItWorks, ariaLabel = "How Mentorle works" }: HowItWorksProps) {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const initialised = useRef(false);

  useGSAP(
    () => {
      const panels = gsap.utils.toArray<HTMLElement>("[data-step-panel]");
      const icons = gsap.utils.toArray<HTMLElement>("[data-step-icon]");
      const lines = gsap.utils.toArray<HTMLElement>("[data-step-line]");
      const instant = !initialised.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      initialised.current = true;

      panels.forEach((panel, index) => {
        const isActive = index === active;
        const vars = { height: isActive ? "auto" : 0, autoAlpha: isActive ? 1 : 0 };
        if (instant) gsap.set(panel, vars);
        else gsap.to(panel, { ...vars, duration: 0.6, ease: "power3.inOut", overwrite: true });
      });

      icons.forEach((icon, index) => {
        const isActive = index === active;
        if (instant) {
          gsap.set(icon, { autoAlpha: isActive ? 1 : 0, scale: 1, y: 0 });
        } else if (isActive) {
          gsap.fromTo(
            icon,
            { autoAlpha: 0, scale: 0.8, y: 24 },
            { autoAlpha: 1, scale: 1, y: 0, duration: 0.7, delay: 0.15, ease: "back.out(1.6)", overwrite: true },
          );
        } else {
          gsap.to(icon, { autoAlpha: 0, scale: 1.1, y: -16, duration: 0.35, ease: "power2.in", overwrite: true });
        }
      });

      lines.forEach((line, index) => {
        const isActive = index === active;
        if (instant) gsap.set(line, { scaleX: isActive ? 1 : 0 });
        else gsap.to(line, { scaleX: isActive ? 1 : 0, duration: isActive ? 0.7 : 0.3, delay: isActive ? 0.25 : 0, ease: "power3.out", overwrite: true });
      });
    },
    { scope: sectionRef, dependencies: [active] },
  );

  return (
    <section ref={sectionRef} aria-label={ariaLabel} className="bg-ink text-white">
      <div data-animate="fade-up" className="grid md:grid-cols-[38%_1fr] lg:grid-cols-[34.5rem_1fr]">
        <div className="relative flex h-[13.75rem] items-center justify-center border-white/15 md:h-auto md:min-h-[24rem] md:border-r lg:min-h-[30rem]">
          {steps.map((step, index) => (
            <Image
              key={step.src}
              data-step-icon
              src={step.src}
              alt=""
              width={step.width}
              height={step.height}
              className={`absolute h-[7.5rem] w-auto brightness-[0.85] md:h-[10rem] lg:h-[15rem] ${index === 0 ? "" : "invisible opacity-0"}`}
            />
          ))}
        </div>

        <ol className="pb-4 md:flex md:flex-col md:justify-center md:py-6 lg:py-3">
          {steps.map((step, index) => {
            const isActive = index === active;
            return (
              <li key={step.title} className="relative border-b border-white/15 last:border-b-0">
                <h3>
                  <button
                    type="button"
                    id={`how-step-${index}`}
                    aria-expanded={isActive}
                    aria-controls={`how-panel-${index}`}
                    onClick={() => setActive(index)}
                    className={`group flex w-full items-center px-[var(--gutter)] text-left text-2xl font-medium transition-[color,padding] duration-500 md:text-[1.75rem] lg:px-10 lg:text-[2rem] ${
                      isActive ? "pt-8 pb-0 text-white lg:pt-9" : "py-7 text-white/90 hover:text-white lg:py-9"
                    }`}
                  >
                    <span className="transition-transform duration-500 ease-out group-hover:translate-x-1.5">{step.title}</span>
                  </button>
                </h3>
                <div
                  id={`how-panel-${index}`}
                  role="region"
                  aria-labelledby={`how-step-${index}`}
                  aria-hidden={!isActive}
                  data-step-panel
                  className={`overflow-hidden ${index === 0 ? "" : "invisible h-0 opacity-0"}`}
                >
                  <p className="max-w-[37.5rem] px-[var(--gutter)] pt-3 pb-9 text-base leading-snug text-white/90 lg:px-10">
                    {step.description}
                  </p>
                </div>
                <span
                  data-step-line
                  aria-hidden
                  className={`absolute -bottom-px left-0 h-[0.1875rem] w-[10.8125rem] origin-left bg-white/80 ${index === 0 ? "" : "scale-x-0"}`}
                />
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
