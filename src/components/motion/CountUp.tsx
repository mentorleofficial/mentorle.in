"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type CountUpProps = {
  target: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  as?: "dd" | "span" | "p";
  className?: string;
};

const format = (value: number, decimals: number) =>
  value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

export function CountUp({ target, decimals = 0, prefix = "", suffix = "", as: Tag = "dd", className }: CountUpProps) {
  const ref = useRef<HTMLElement>(null);
  const finalText = `${prefix}${format(target, decimals)}${suffix}`;

  useGSAP(
    () => {
      const element = ref.current;
      if (!element) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const counter = { value: 0 };
        element.textContent = `${prefix}${format(0, decimals)}${suffix}`;
        gsap.to(counter, {
          value: target,
          duration: 2.2,
          ease: "power2.out",
          scrollTrigger: { trigger: element, start: "top 90%", once: true },
          onUpdate: () => {
            element.textContent = `${prefix}${format(counter.value, decimals)}${suffix}`;
          },
        });
        return () => {
          element.textContent = finalText;
        };
      });
      return () => mm.revert();
    },
    { dependencies: [target, decimals, prefix, suffix] },
  );

  return (
    <Tag className={className}>
      <span className="sr-only">{finalText}</span>
      <span ref={ref} aria-hidden>
        {finalText}
      </span>
    </Tag>
  );
}
