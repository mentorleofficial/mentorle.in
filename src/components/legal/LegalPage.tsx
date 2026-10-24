import Link from "next/link";
import type { ReactNode } from "react";
import { legalCopy } from "@/data/legal";
import type { LegalDocument, LegalSection, LegalTable } from "@/data/legal";

// Privacy Policy and Terms of Service. No Figma: built from the site's patterns. A dark header band (the event
// hero without a photo), then white reading space in the page column: a sticky "On this page" list beside the
// text from lg, the company facts in a surface box, sections split by hairlines, card-title headings, 16px body
// and the event pages' square bullets. Tables become stacked cards on phones.

const body = "text-base leading-[1.8125] text-ink/85";

// "Official Email: support@…" / "Right to Access & Summary: Request…": the short label before the colon is set
// in medium weight so the list scans; the wording itself is unchanged.
function Labelled({ text }: { text: string }) {
  const match = text.match(/^([^:.,]{3,55}):\s(.+)$/);
  if (!match) return <>{text}</>;
  return (
    <>
      <span className="font-medium text-ink">{match[1]}:</span> {match[2]}
    </>
  );
}

function Paragraph({ text, link }: { text: string; link?: LegalSection["link"] }) {
  if (!link || !text.includes("{link}")) {
    return (
      <p className={body}>
        <Labelled text={text} />
      </p>
    );
  }
  const [before, after] = text.split("{link}");
  return (
    <p className={body}>
      {before}
      <Link href={link.href} className="font-medium text-ink underline underline-offset-4 transition-colors hover:text-brand">
        {link.label}
      </Link>
      {after}
    </p>
  );
}

function Table({ table }: { table: LegalTable }) {
  return (
    <>
      {/* md+: a bordered table with a surface header row. */}
      <div className="hidden overflow-hidden border border-line md:block">
        <table className="w-full border-collapse text-left text-[0.9375rem] leading-relaxed">
          <thead className="bg-surface">
            <tr>
              {table.columns.map((column) => (
                <th key={column} scope="col" className="border-b border-line px-5 py-3.5 font-medium text-ink">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr key={row[0]} className="align-top not-last:border-b not-last:border-line">
                {row.map((cell, index) => (
                  <td key={index} className={`px-5 py-4 ${index === 0 ? "font-medium text-ink" : "text-ink/85"}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Phones: one card per row, column names as labels. */}
      <div className="space-y-3 md:hidden">
        {table.rows.map((row) => (
          <dl key={row[0]} className="border border-line p-4">
            <dt className="sr-only">{table.columns[0]}</dt>
            <dd className="text-base font-medium text-ink">{row[0]}</dd>
            {row.slice(1).map((cell, index) => (
              <div key={index} className="mt-3">
                <dt className="text-sm text-ink-soft">{table.columns[index + 1]}</dt>
                <dd className="mt-0.5 text-[0.9375rem] leading-relaxed text-ink/85">{cell}</dd>
              </div>
            ))}
          </dl>
        ))}
      </div>
    </>
  );
}

function Section({ section }: { section: LegalSection }) {
  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`} className="scroll-mt-8 border-t border-line pt-9 md:pt-10">
      <h2 id={`${section.id}-title`} className="text-xl font-medium text-ink lg:text-2xl">
        {section.title}
      </h2>
      <div className="mt-4 space-y-4">
        {section.paragraphs?.map((text) => <Paragraph key={text} text={text} link={section.link} />)}
        {section.list && (
          <ul className="space-y-3">
            {section.list.map((item) => (
              <li key={item} className={`flex gap-3 ${body}`}>
                <span className="mt-3 size-1 shrink-0 bg-ink-soft" aria-hidden />
                <span>
                  <Labelled text={item} />
                </span>
              </li>
            ))}
          </ul>
        )}
        {section.table && <Table table={section.table} />}
      </div>
    </section>
  );
}

export function LegalPage({ document, children }: { document: LegalDocument; children?: ReactNode }) {
  return (
    <>
      <section aria-labelledby="legal-title" className="bg-ink text-white">
        <div className="container-page pt-28 pb-12 md:pt-[10.5rem] md:pb-16 xl:pt-[12.125rem]">
          <p data-hero="1" className="text-sm tracking-[0.06em] text-white/75 uppercase">
            {legalCopy.eyebrow}
          </p>
          <h1 id="legal-title" data-hero="2" className="mt-4 max-w-[48rem] text-[2.125rem] leading-[1.18] font-medium tracking-[-0.01em] md:text-5xl">
            {document.title}
          </h1>
          <p data-hero="3" className="mt-5 max-w-[42rem] text-base leading-snug text-white/90 md:text-lg">
            {document.subtitle}
          </p>
          <p data-hero="4" className="mt-6 text-sm text-white/75">
            {legalCopy.effective} {document.effectiveDate}
          </p>
        </div>
      </section>

      <div className="bg-white py-14 md:py-20 lg:py-24">
        <div className="container-page lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16 xl:gap-24">
          <nav aria-label={legalCopy.onThisPage} className="hidden lg:block">
            <div className="sticky top-8">
              <p className="text-sm text-ink-soft">{legalCopy.onThisPage}</p>
              <ol className="mt-4 space-y-1 border-l border-line">
                {document.sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="-ml-px block border-l border-transparent py-1.5 pl-4 text-sm leading-snug text-ink/80 transition-colors hover:border-brand hover:text-ink"
                    >
                      {section.title.replace(/^\d+\.\s*/, "")}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <article className="max-w-[48rem] min-w-0">
            <dl data-animate="fade-up" className="grid gap-x-8 gap-y-4 border border-line bg-surface p-5 sm:grid-cols-2 md:p-7">
              {document.meta.map((item) => (
                <div key={item.label} className={item.value.length > 48 ? "sm:col-span-2" : undefined}>
                  <dt className="text-sm text-ink-soft">{item.label}</dt>
                  <dd className="mt-1 text-base break-words text-ink">{item.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-10 space-y-9 md:mt-12 md:space-y-10">
              {document.sections.map((section) => (
                <Section key={section.id} section={section} />
              ))}
            </div>

            {document.closing && <p className={`mt-10 border-t border-line pt-9 font-medium text-ink md:pt-10`}>{document.closing}</p>}
            {children}
            <p className="mt-10 text-sm text-ink-soft">{legalCopy.copyright}</p>
          </article>
        </div>
      </div>
    </>
  );
}
