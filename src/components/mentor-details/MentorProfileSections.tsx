import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { MaskIcon } from "@/components/ui/MaskIcon";
import { mentorDetailCopy as copy, formatMonth, formatPrice, mentorView } from "@/data/mentor-details";
import type { MentorProfile } from "@/data/mentor-details";
import { initialsOf } from "@/lib/initials";
import { prefetchFor } from "@/lib/routes";

// Mentor profile page sections (design: figma/mentor-details). The design's rounded corners are squared off
// and its 88px content inset uses the site's page column, so the page matches the rest of the site. Every
// value comes from the platform's mentor fields; blocks with no data are hidden (see `mentorView`).

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
  const view = mentorView(mentor);
  const links = [
    mentor.linkedinUrl && { label: copy.linkedin, href: mentor.linkedinUrl, icon: "/mentor-details/linkedin.svg" },
    mentor.portfolioUrl && { label: copy.portfolio, href: mentor.portfolioUrl, icon: "/mentor-details/portfolio.svg" },
  ].filter(Boolean) as { label: string; href: string; icon: string }[];

  return (
    <>
      {/* No hero image on this page: a dark band sits behind the (transparent) site header, as in the design. */}
      <div className="h-24 bg-ink md:h-[9.25rem] xl:h-[10.375rem]" aria-hidden />
      <section aria-labelledby="mentor-name" className="bg-white pt-12 pb-16 md:pt-[4.5rem] md:pb-[4.5rem]">
        {/* Text is centred against the photo card, so short (sparse) profiles don't leave a gap above the card. */}
        <div className="container-page grid gap-10 md:grid-cols-[minmax(0,1fr)_15rem] md:items-center md:gap-8 lg:grid-cols-[minmax(0,1fr)_21.75rem] lg:gap-16">
          <div data-animate="stagger">
            {view.tagline && <p className={`${eyebrow} mb-6 lg:mb-10`}>{view.tagline}</p>}
            <h1 id="mentor-name" className="text-[2.75rem] leading-none font-medium tracking-[-0.04em] text-ink md:text-[3.25rem] lg:text-7xl xl:text-[5.5rem]">
              {mentor.fullName}
            </h1>
            {view.headline && (
              <p className="mt-6 max-w-[47.5rem] text-lg leading-[1.55] text-ink md:mt-6 md:text-base lg:mt-10 lg:text-[1.375rem]">{view.headline}</p>
            )}
            {view.roleLine && <p className="mt-4 text-[0.9375rem] text-muted md:text-sm lg:mt-8 lg:text-[0.9375rem]">{view.roleLine}</p>}
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
            <div className="relative aspect-[348/288] overflow-hidden bg-ink">
              {mentor.avatarUrl ? (
                <Image src={mentor.avatarUrl} alt={copy.photoAlt(mentor.fullName)} fill preload sizes="(min-width: 1024px) 21.75rem, 100vw" className="object-cover" />
              ) : (
                // No photo on the profile: initials on the dark panel, same size as a photo.
                <span className="absolute inset-0 flex items-center justify-center text-[4rem] font-medium tracking-[-0.03em] text-white md:text-[3.5rem] lg:text-[6rem]" aria-hidden>
                  {initialsOf(mentor.fullName)}
                </span>
              )}
            </div>
            <div className="bg-[#f0f0f0] px-7 pt-7 pb-12 md:max-lg:px-5 md:max-lg:pt-5 md:max-lg:pb-7">
              <p className="flex items-baseline gap-3 md:max-lg:gap-2">
                <span className="text-5xl leading-none font-medium tracking-[-0.03em] text-ink md:max-lg:text-4xl">{mentor.yearsExperience}+</span>
                <span className="text-[0.9375rem] whitespace-nowrap text-muted md:max-lg:text-[0.8125rem]">{copy.yearsLabel}</span>
              </p>
              {mentor.currentOrganization && <p className="mt-4 text-[0.8125rem] tracking-[0.06em] text-muted uppercase">{mentor.currentOrganization}</p>}
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

export function MentorAbout({ mentor }: { mentor: MentorProfile }) {
  const view = mentorView(mentor);
  if (!view.bioParagraphs.length) return null;
  return (
    <Section id="about-title">
      <div className="grid gap-10 lg:grid-cols-[23.5rem_minmax(0,1fr)] lg:gap-[3.25rem]">
        <div>
          <SectionHead id="about-title" eyebrowText={copy.aboutEyebrow} titleText={copy.aboutTitle(view.firstName)} />
          {mentor.currentOrganization && <p className="mt-10 text-lg text-brand">{mentor.currentOrganization}</p>}
        </div>
        <div data-animate="fade-up" className={`space-y-5 ${body}`}>
          {view.bioParagraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function MentorExpertise({ mentor }: { mentor: MentorProfile }) {
  if (!mentor.expertise.length) return null;
  return (
    <Section id="expertise-title">
      <SectionHead id="expertise-title" eyebrowText={copy.expertiseEyebrow} titleText={copy.expertiseTitle} />
      <p className={`mt-10 ${body}`}>{copy.expertiseIntro(mentorView(mentor).firstName)}</p>
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

// Every offering the mentor has published (the platform's `mentorship_offerings`), each bookable. Replaces the
// design's "Core Services", which had no data behind it. One offering spans the full width, as in the design.
export function MentorSessions({ mentor }: { mentor: MentorProfile }) {
  const { firstName } = mentorView(mentor);
  const { offerings } = mentor;
  return (
    <section id="sessions" aria-labelledby="sessions-title" className="scroll-mt-4 border-t border-line bg-surface py-16 md:py-[4.75rem]">
      <div className="container-page">
        <SectionHead id="sessions-title" eyebrowText={copy.sessionsEyebrow} titleText={copy.sessionsTitle(firstName)} />
        {offerings.length > 0 ? (
          <ul data-animate="stagger" className="mt-10 grid gap-5 md:grid-cols-2">
            {offerings.map((offering, index) => (
              <li
                key={offering.id}
                className={`${card} flex flex-col p-6 transition-colors duration-300 hover:border-ink/40 md:p-[1.875rem] ${
                  offerings.length % 2 === 1 && index === offerings.length - 1 ? "md:col-span-2" : ""
                }`}
              >
                <h3 className="text-[1.375rem] font-medium tracking-[-0.01em] text-ink md:text-[1.625rem]">{offering.title}</h3>
                {offering.description && <p className="mt-4 text-base leading-[1.625rem] text-muted">{offering.description}</p>}
                <dl className="mt-6 flex flex-wrap gap-x-12 gap-y-4">
                  <div>
                    <dt className="text-[0.8125rem] tracking-[0.06em] text-muted">{copy.durationLabel}</dt>
                    <dd className="mt-2 text-base text-ink">{copy.minutes(offering.durationMinutes)}</dd>
                  </div>
                  <div>
                    <dt className="text-[0.8125rem] tracking-[0.06em] text-muted">{copy.priceLabel}</dt>
                    <dd className="mt-2 text-base text-ink">{formatPrice(offering.price)}</dd>
                  </div>
                </dl>
                <div className="mt-auto pt-6">
                  <Link href={copy.bookHref(mentor.slug)} prefetch={prefetchFor("/signup")} className={bookButton}>
                    {copy.bookSession} <span aria-hidden>→</span>
                    <span className="sr-only">: {offering.title}</span>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className={`mt-8 ${body}`}>{copy.noSessions(firstName)}</p>
        )}
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
          <li key={`${item.title}-${item.startDate}`} className={`${card} p-6 md:p-[1.875rem]`}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
              <div>
                <h3 className="text-xl font-medium tracking-[-0.01em] text-ink md:text-2xl">{item.title}</h3>
                <p className="mt-2 text-base text-ink">{item.company}</p>
              </div>
              <p className="order-first shrink-0 text-sm text-muted sm:order-none sm:pt-2">
                {formatMonth(item.startDate)} – {item.endDate ? formatMonth(item.endDate) : copy.present}
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
