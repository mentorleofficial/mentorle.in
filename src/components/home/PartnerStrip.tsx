import Image from "next/image";
import { domains, partners } from "@/data/home";

function Marquee({ children, duration }: { children: React.ReactNode; duration: string }) {
  return (
    <div className="relative min-w-0 flex-1 overflow-hidden">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]" style={{ animationDuration: duration }}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}

export function PartnerStrip() {
  const partnerLoop = [...partners, ...partners, ...partners];

  return (
    <section
      aria-label="Partners and domains"
      data-animate="fade-up"
      className="mt-[1.125rem] flex flex-col lg:h-[4.5rem] lg:flex-row"
    >
      <div className="flex h-[4.5rem] min-w-0 items-center bg-surface lg:w-[53.6%]">
        <p className="shrink-0 pr-2 pl-[var(--gutter)] text-base font-medium text-ink lg:pr-[2.375rem]">Ecosystem Network</p>
        <Marquee duration="30s">
          {partnerLoop.map((partner, index) => (
            <span
              key={`${partner.name}-${index}`}
              className="mr-9 inline-flex h-8 items-center"
            >
              <Image
                src={partner.src}
                alt={index < partners.length ? partner.name : ""}
                width={partner.width}
                height={partner.height}
                className="h-8 w-auto object-contain grayscale"
                style={{ width: "auto" }}
              />
            </span>
          ))}
        </Marquee>
      </div>
      <div className="flex h-[4.5rem] min-w-0 items-center bg-brand-dark lg:flex-1">
        <Marquee duration="35s">
          {[...domains, ...domains].map((domain, index) => (
            <span
              key={`${domain.label}-${index}`}
              className="flex items-center gap-2 pl-6 text-lg font-medium whitespace-nowrap text-white"
            >
              <Image src={domain.src} alt="" width={domain.width} height={domain.height} className="h-[1.1875rem] w-auto" style={{ width: "auto" }} />
              {domain.label}
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
