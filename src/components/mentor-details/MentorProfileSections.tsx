import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { MaskIcon } from "@/components/ui/MaskIcon";
import { mentorDetailCopy as copy } from "@/data/mentor-details";
import type { MentorProfile } from "@/data/mentor-details";
import { prefetchFor } from "@/lib/routes";

// Mentor profile page sections (design: figma/mentor-details). The design's rounded corners are squared off
// and its 88px content inset uses the site's page column, so the page matches the rest of the site.

const eyebrow = "text-sm tracking-[0.15em] text-brand uppercase";
const title = "mt-5 text-[2.25rem] leading-[1.08] font-medium tracking-[-0.03em] whitespace-pre-line text-ink md:text-5xl";
const body = "text-lg leading-[1.875rem] text-muted";
const card = "border border-line bg-white";

function SectionHead({ id, eyebrowText, titleText }: { id: string; eyebrowText: string; titleText: string }) {
  return (
    <div data-animate="stagger">
      <p className={eyebrow}>{eyebrowText}</p>
      <h2 id={id} className={title}>
        {titleText}
      </h2>
    </div>
  );
}

function Section({ id, children, surface = false }: { id: string; children: ReactNode; surface?: boolean }) {
  return (
    <section aria-labelledby={id} className={`border-t border-line py-16 md:py-[4.75rem] ${surface ? "bg-surface" : "bg-white"}`}>
      <div className="container-page">{children}</div>
    </section>
  );
}

const ArrowUpRight = () => (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" className="size-2.5" aria-hidden>
    <path d="M2 10L10 2M4 2h6v6" />
  </svg>
);

const bookButton =
  "inline-flex h-14 md:max-xl:h-11 md:max-xl:px-4 md:max-xl:text-sm items-center justify-center gap-2 bg-brand px-7 text-lg text-white transition-colors duration-300 hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

export function MentorHero({ mentor }: { mentor: MentorProfile }) {
  const links = [
    mentor.linkedinUrl && { label: copy.linkedin, href: mentor.linkedinUrl, icon: "/mentor-details/linkedin.svg" },
    mentor.portfolioUrl && { label: copy.portfolio, href: mentor.portfolioUrl, icon: "/mentor-details/portfolio.svg" },
  ].filter(Boolean) as { label: string; href: string; icon: string }[];

  return (
    <>
      {/* No hero image on this page: a dark band sits behind the (transparent) site header, as in the design. */}
      <div className="h-24 bg-ink md:h-[9.25rem] xl:h-[10.375rem]" aria-hidden />
      <section aria-labelledby="mentor-name" className="bg-white pt-12 pb-16 md:pt-[4.5rem] md:pb-[4.5rem]">
        <div className="container-page grid gap-10 md:grid-cols-[minmax(0,1fr)_15rem] md:items-start md:gap-8 lg:grid-cols-[minmax(0,1fr)_21.75rem] lg:gap-16">
          <div data-animate="stagger" className="md:pt-2 lg:pt-9">
            {mentor.tagline && <p className={eyebrow}>{mentor.tagline}</p>}
            <h1 id="mentor-name" className="mt-6 text-[2.75rem] leading-none font-medium tracking-[-0.04em] text-ink md:mt-6 md:text-[3.25rem] lg:mt-10 lg:text-7xl xl:text-[5.5rem]">
              {mentor.name}
            </h1>
            <p className="mt-6 max-w-[47.5rem] text-lg leading-[1.55] text-ink md:mt-6 md:text-base lg:mt-10 lg:text-[1.375rem]">{mentor.headline}</p>
            <p className="mt-4 text-[0.9375rem] text-muted md:text-sm lg:mt-8 lg:text-[0.9375rem]">
              {mentor.currentRole} · {mentor.organization}
            </p>
            <div className="mt-8 flex flex-wrap gap-3 md:mt-6 md:max-xl:gap-2 lg:mt-8">
              <a href="#sessions" className={bookButton}>
                {copy.bookSession} <span aria-hidden>→</span>
              </a>
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-14 items-center gap-3 border border-line bg-white px-[1.125rem] md:max-xl:h-11 md:max-xl:gap-2 md:max-xl:px-3 md:max-xl:text-sm text-base text-ink transition-colors duration-300 hover:border-ink"
                >
                  <MaskIcon src={link.icon} className="size-4" />
                  {link.label}
                  <span className="ml-2 text-muted md:max-xl:ml-0">
                    <ArrowUpRight />
                  </span>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ))}
            </div>
          </div>

          <aside data-animate="fade-up" className="order-first mx-auto w-full max-w-[21.75rem] border border-[#d2d2d2] md:order-none md:mx-0">
            <div className="relative aspect-[348/288] overflow-hidden">
              <Image src={mentor.photo.src} alt={mentor.photo.alt} fill preload sizes="(min-width: 1024px) 21.75rem, 100vw" className="object-cover" />
            </div>
            <div className="bg-[#f0f0f0] px-7 pt-7 pb-12 md:max-lg:px-5 md:max-lg:pt-5 md:max-lg:pb-7">
              <p className="flex items-baseline gap-3 md:max-lg:gap-2">
                <span className="text-5xl leading-none font-medium tracking-[-0.03em] text-ink md:max-lg:text-4xl">{mentor.yearsExperience}+</span>
                <span className="text-[0.9375rem] whitespace-nowrap text-muted md:max-lg:text-[0.8125rem]">{copy.yearsLabel}</span>
              </p>
              {(mentor.designation || mentor.organization) && (
                <p className="mt-4 text-[0.8125rem] tracking-[0.06em] text-muted uppercase">
                  {[mentor.designation, mentor.organization].filter(Boolean).join(", ")}
                </p>
              )}
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

export function MentorAbout({ mentor }: { mentor: MentorProfile }) {
  if (!mentor.bio.length) return null;
  return (
    <Section id="about-title">
      <div className="grid gap-10 lg:grid-cols-[23.5rem_minmax(0,1fr)] lg:gap-[3.25rem]">
        <div>
          <SectionHead id="about-title" eyebrowText={mentor.aboutEyebrow ?? copy.aboutEyebrow} titleText={copy.aboutTitle(mentor.firstName)} />
          <p className="mt-10 text-base">
            <span className="text-lg text-brand">{mentor.organization}</span>
            {mentor.designation && <span className="ml-3 text-[0.8125rem] text-muted">/ {mentor.designation}</span>}
          </p>
        </div>
        <div data-animate="fade-up" className={`space-y-5 ${body}`}>
          {mentor.bio.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function MentorServices({ mentor }: { mentor: MentorProfile }) {
  if (!mentor.services.length) return null;
  const odd = mentor.services.length % 2 === 1;
  return (
    <Section id="services-title" surface>
      <div className="grid gap-8 lg:grid-cols-[23.5rem_minmax(0,1fr)] lg:gap-[3.25rem]">
        <SectionHead id="services-title" eyebrowText={copy.servicesEyebrow} titleText={copy.servicesTitle} />
        {mentor.servicesIntro && <p className={`${body} lg:pt-7`}>{mentor.servicesIntro}</p>}
      </div>
      <ol data-animate="stagger" className="mt-10 grid gap-5 md:grid-cols-2">
        {mentor.services.map((service, index) => (
          <li
            key={service.title}
            className={`${card} p-[1.875rem] transition-colors duration-300 hover:border-ink/40 ${odd && index === mentor.services.length - 1 ? "md:col-span-2" : ""}`}
          >
            <p className="text-sm tracking-[0.05em] text-muted tabular-nums" aria-hidden>
              {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-7 text-[1.375rem] font-medium tracking-[-0.01em] text-ink md:text-[1.625rem]">{service.title}</h3>
            <p className="mt-4 text-base leading-[1.625rem] text-muted">{service.description}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function MentorExpertise({ mentor }: { mentor: MentorProfile }) {
  if (!mentor.expertise.length) return null;
  return (
    <Section id="expertise-title">
      <SectionHead id="expertise-title" eyebrowText={copy.expertiseEyebrow} titleText={copy.expertiseTitle} />
      {mentor.expertiseIntro && <p className={`mt-10 ${body}`}>{mentor.expertiseIntro}</p>}
      <ul data-animate="stagger" className="mt-6 flex flex-wrap gap-3">
        {mentor.expertise.map((area) => (
          <li key={area} className="bg-[#f0f0f0] px-4 py-2.5 text-base text-ink">
            {area}
          </li>
        ))}
      </ul>
    </Section>
  );
}

const formatPrice = (price: number) => (price > 0 ? `₹${price.toLocaleString("en-IN")}` : copy.free);

export function MentorSessions({ mentor }: { mentor: MentorProfile }) {
  return (
    <section id="sessions" aria-labelledby="sessions-title" className="scroll-mt-4 border-t border-line bg-white py-16 md:py-[4.75rem]">
      <div className="container-page">
        <SectionHead id="sessions-title" eyebrowText={copy.sessionsEyebrow} titleText={copy.sessionsTitle} />
        {mentor.offerings.length > 0 && (
          <ul data-animate="stagger" className="mt-10 flex flex-col gap-5">
            {mentor.offerings.map((offering) => (
              <li key={offering.title} className={`${card} p-6 md:p-[1.875rem]`}>
                <h3 className="text-2xl font-medium tracking-[-0.01em] text-ink md:text-[2rem]">{offering.title}</h3>
                <p className={`mt-4 ${body}`}>{offering.description}</p>
                <dl className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div>
                    <dt className="text-[0.8125rem] tracking-[0.06em] text-muted">{copy.formatLabel}</dt>
                    <dd className="mt-2 text-base text-ink">{offering.format}</dd>
                  </div>
                  <div>
                    <dt className="text-[0.8125rem] tracking-[0.06em] text-muted">{copy.priceLabel}</dt>
                    <dd className="mt-2 text-base text-ink">{offering.priceLabel ?? formatPrice(offering.price)}</dd>
                  </div>
                </dl>
                <Link href={copy.bookHref(mentor.slug)} prefetch={prefetchFor("/signup")} className={`mt-6 ${bookButton}`}>
                  {copy.bookSession} <span aria-hidden>→</span>
                  <span className="sr-only">: {offering.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        {/* Mentors without published sessions (placeholder directory profiles) */}
        {!mentor.offerings.length && <p className={`mt-8 ${body}`}>{copy.noSessions(mentor.firstName)}</p>}
      </div>
    </section>
  );
}

export function MentorExperience({ mentor }: { mentor: MentorProfile }) {
  if (!mentor.experiences.length) return null;
  return (
    <Section id="experience-title">
      <SectionHead id="experience-title" eyebrowText={copy.experienceEyebrow} titleText={copy.experienceTitle} />
      <ol data-animate="stagger" className="mt-10 flex flex-col gap-5">
        {mentor.experiences.map((item) => (
          <li key={`${item.title}-${item.start}`} className={`${card} p-6 md:p-[1.875rem]`}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
              <div>
                <h3 className="text-xl font-medium tracking-[-0.01em] text-ink md:text-2xl">{item.title}</h3>
                <p className="mt-2 text-base text-ink">{item.organization}</p>
              </div>
              <p className="order-first shrink-0 text-sm text-muted sm:order-none sm:pt-2">
                {item.start} – {item.end ?? copy.present}
              </p>
            </div>
            {item.description && <p className={`mt-6 ${body}`}>{item.description}</p>}
            {item.location && <p className="mt-4 text-sm text-muted">{item.location}</p>}
          </li>
        ))}
      </ol>
    </Section>
  );
}
