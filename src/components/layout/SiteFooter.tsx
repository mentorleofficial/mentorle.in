import Image from "next/image";
import Link from "next/link";
import { prefetchFor } from "@/lib/routes";
import type { NavLink } from "@/data/site";
import { company, footerColumns, legalLinks, socialLinks } from "@/data/site";

const linkClasses = "text-base whitespace-nowrap text-white/75 transition-colors hover:text-white md:text-lg";

function FooterLink({ link }: { link: NavLink }) {
  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClasses}>
        {link.label}
      </a>
    );
  }
  return (
    <Link href={link.href} prefetch={prefetchFor(link.href)} className={linkClasses}>
      {link.label}
    </Link>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-ink text-white">
      <div className="container-page">
        <div className="grid gap-10 py-10 md:py-14 xl:grid-cols-[1fr_auto] xl:gap-0 xl:py-0 min-[90rem]:grid-cols-[37.3125rem_1fr]">
          <div data-animate="fade-up" className="xl:pt-16 xl:pb-10 xl:pr-10">
            <Link href="/" aria-label="Mentorle home" className="inline-block">
              <Image src="/homepage/logo.svg" alt="Mentorle" width={187} height={48} loading="eager" className="h-12 w-auto md:h-14" style={{ width: "auto" }} />
            </Link>
            <p className="mt-5 max-w-[24.375rem] text-sm leading-snug text-white/90 md:text-base">{company.tagline}</p>
            <ul className="mt-6 flex items-center gap-4">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    aria-label={social.label}
                    className="block opacity-90 transition duration-300 hover:-translate-y-0.5 hover:opacity-100"
                  >
                    <Image src={social.icon} alt="" width={social.width} height={social.height} className="h-7 w-auto" style={{ width: "auto" }} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div data-animate="stagger" className="grid grid-cols-2 gap-8 sm:grid-cols-3 xl:grid-cols-[auto_auto_auto] xl:gap-0 min-[90rem]:grid-cols-[13.625rem_16.5625rem_1fr]">
            {footerColumns.map((column, index) => (
              <nav
                key={column.title}
                aria-label={column.title}
                className={`xl:pt-16 xl:pb-10 ${index === 0 ? "xl:pr-10" : "xl:border-l xl:border-white/15 xl:px-10"} ${index === footerColumns.length - 1 ? "xl:pr-0" : ""}`}
              >
                <h3 className="text-lg font-medium">{column.title}</h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <FooterLink link={link} />
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="container-page flex flex-col gap-3 py-5 text-sm md:flex-row md:items-center md:justify-between md:py-6">
          <div className="space-y-1">
            <p>© {company.copyrightYear} Mentorle. All rights reserved.</p>

            {/* <p className="text-xs text-white/60">Grievance Officer: {company.grievance.officer}</p> */}
          </div>
          <div className="space-y-1">
          <p className="text-xs text-white/60">
              {company.legalName} · CIN: {company.cin}
            </p>
          </div>
          <ul className="flex items-center gap-3 text-sm">
            {legalLinks.map((link, index) => (
              <li key={link.href} className="flex items-center gap-3">
                {index > 0 && <span aria-hidden className="h-3 w-px bg-white/50" />}
                <Link href={link.href} prefetch={prefetchFor(link.href)} className="text-white/80 hover:text-white hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
