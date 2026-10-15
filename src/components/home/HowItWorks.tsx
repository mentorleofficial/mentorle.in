"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { howItWorks } from "@/data/home";
import type { HowItWorksStep } from "@/data/home";

type HowItWorksProps = {
  steps?: HowItWorksStep[];
  ariaLabel?: string;
  // How long each point stays open; its line fills over this time, then the next point opens.
  autoplayMs?: number;
};

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function HowItWorks({ steps = howItWorks, ariaLabel = "How Mentorle works", autoplayMs = 2500 }: HowItWorksProps) {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useRef<gsap.core.Tween | null>(null);
  const initialised = useRef(false);
  const count = steps.length;

  // Only advance while the section is on screen, so it isn't cycling while you're elsewhere on the page.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // The open point's line is a progress bar: it fills over `autoplayMs`, then the next point opens (wrapping).
  // Created paused; the effect below plays or pauses it. Reduced motion: no autoplay, the line just shows full.
  useGSAP(
    () => {
      const lines = gsap.utils.toArray<HTMLElement>("[data-step-line]");
      lines.forEach((line, index) => index !== active && gsap.set(line, { scaleX: 0 }));
      const line = lines[active];
      if (!line) return;
      if (reducedMotion() || count < 2) {
        gsap.set(line, { scaleX: 1 });
        return;
      }
      progress.current = gsap.fromTo(
        line,
        { scaleX: 0 },
        { scaleX: 1, duration: autoplayMs / 1000, ease: "none", paused: true, onComplete: () => setActive((value) => (value + 1) % count) },
      );
      return () => {
        progress.current?.kill();
        progress.current = null;
      };
    },
    { scope: sectionRef, dependencies: [active, autoplayMs, count] },
  );

  // Hovering the section (mouse only, so a tap on a phone doesn't pause it forever) or focusing inside it pauses
  // the bar where it is; leaving resumes from there.
  const running = inView && !hovered && !focused;
  useEffect(() => {
    if (running) progress.current?.play();
    else progress.current?.pause();
  }, [running, active]);

  useGSAP(
    () => {
      const panels = gsap.utils.toArray<HTMLElement>("[data-step-panel]");
      const icons = gsap.utils.toArray<HTMLElement>("[data-step-icon]");
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

    },
    { scope: sectionRef, dependencies: [active] },
  );

  return (
    <section
      ref={sectionRef}
      aria-label={ariaLabel}
      className="bg-ink text-white"
      onPointerEnter={(event) => event.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={(event) => event.pointerType === "mouse" && setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
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
                {/* Faint track under the open point; the fill on top is the progress bar. */}
                <span
                  aria-hidden
                  className={`absolute -bottom-px left-0 h-[0.1875rem] w-[10.8125rem] bg-white/15 transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-0"}`}
                />
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
