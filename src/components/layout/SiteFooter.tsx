import Image from "next/image";
import Link from "next/link";
import type { NavLink } from "@/data/site";
import { company, footerColumns, legalLinks, socialLinks } from "@/data/site";

const linkClasses = "text-lg whitespace-nowrap text-white/75 transition-colors hover:text-white md:text-xl";

function FooterLink({ link }: { link: NavLink }) {
  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClasses}>
        {link.label}
      </a>
    );
  }
  return (
    <Link href={link.href} className={linkClasses}>
      {link.label}
    </Link>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-ink text-white">
      <div className="container-page">
        <div className="grid gap-12 py-14 md:py-20 xl:grid-cols-[1fr_auto] xl:gap-0 xl:py-0">
          <div data-animate="fade-up" className="xl:py-[8.125rem] xl:pr-10">
            <Link href="/" aria-label="Mentorle home" className="inline-block">
              <Image src="/homepage/logo.svg" alt="Mentorle" width={187} height={48} className="h-14 w-auto md:h-[5.75rem]" />
            </Link>
            <p className="mt-8 max-w-[24.375rem] text-base leading-snug text-white/90 md:mt-11">{company.tagline}</p>
            <ul className="mt-8 flex items-center gap-5 md:mt-14">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    aria-label={social.label}
                    className="block opacity-90 transition duration-300 hover:-translate-y-0.5 hover:opacity-100"
                  >
                    <Image src={social.icon} alt="" width={social.width} height={social.height} className="h-8 w-auto" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div data-animate="stagger" className="grid grid-cols-2 gap-10 sm:grid-cols-3 xl:gap-0">
            {footerColumns.map((column, index) => (
              <nav
                key={column.title}
                aria-label={column.title}
                className={`xl:py-[8.125rem] ${index === 0 ? "xl:pr-[3.125rem]" : "xl:border-l xl:border-white/15 xl:px-[2.9375rem]"} ${index === footerColumns.length - 1 ? "xl:pr-0" : ""}`}
              >
                <h3 className="text-xl font-medium">{column.title}</h3>
                <ul className="mt-5 flex flex-col gap-4 md:mt-6 md:gap-[1.375rem]">
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
        <div className="container-page grid gap-6 py-10 text-base md:grid-cols-2 md:text-lg xl:grid-cols-[37.3125rem_1fr] xl:py-[3.125rem] xl:text-xl">
          <div className="space-y-2">
            <p className="font-medium">{company.legalName}</p>
            <p className="text-white/70">
              CIN: {company.cin} · {company.location}
            </p>
          </div>
          <div className="grid gap-x-10 gap-y-2 lg:grid-cols-[auto_auto] lg:justify-start">
            <p className="text-white/85">
              Grievance Officer: <span className="font-medium text-white">{company.grievance.officer}</span>
            </p>
            <p className="text-white/85">
              Resolution SLA: <span className="font-medium text-white">{company.grievance.slaDays} days</span>
            </p>
            <p className="text-white/85 lg:col-span-2">
              Email:{" "}
              <a href={`mailto:${company.grievance.email}`} className="font-medium text-white hover:underline">
                {company.grievance.email}
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="container-page flex flex-col gap-3 py-8 text-base md:flex-row md:items-center md:justify-between md:text-lg xl:py-10 xl:text-xl">
          <p>© {company.copyrightYear} Mentorle. All rights reserved.</p>
          <ul className="flex items-center gap-3">
            {legalLinks.map((link, index) => (
              <li key={link.href} className="flex items-center gap-3">
                {index > 0 && <span aria-hidden className="h-3.5 w-px bg-white/50" />}
                <Link href={link.href} className="hover:underline">
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
