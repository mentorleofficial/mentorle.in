import { SectionHeader } from "@/components/ui/SectionHeader";
import { careerComparison } from "@/data/home";

function CrossIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" className="mt-1 size-4 shrink-0 text-ink/70" aria-hidden>
      <path d="M2.5 2.5l11 11M13.5 2.5l-11 11" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 18 16" fill="none" stroke="currentColor" strokeWidth="1.6" className="mt-1 h-4 w-[1.125rem] shrink-0 text-success" aria-hidden>
      <path d="M1.5 8.5l5 5 10-11" />
    </svg>
  );
}

export function CareerComparison() {
  return (
    <section aria-labelledby="career-title" className="bg-dots py-16 md:py-24 lg:py-[8.125rem]">
      <div className="container-page">
        <SectionHeader
          id="career-title"
          eyebrow="Career Growth"
          title="Stop guessing. Start growing."
          description="There are two ways to build your career. One takes years of frustrating trial and error. The other takes a single conversation."
        />
        <div data-animate="stagger" className="mt-12 grid gap-5 md:mt-16 md:grid-cols-2">
          <div className="border border-line bg-white p-6 md:px-8 md:py-9">
            <h3 className="text-2xl font-medium text-muted">The Hard Way</h3>
            <ul className="mt-5 flex flex-col gap-3.5">
              {careerComparison.hardWay.map((item) => (
                <li key={item} className="flex gap-3 text-base text-muted">
                  <CrossIcon />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-line bg-white p-6 transition-colors duration-300 hover:border-success/50 md:px-8 md:py-9">
            <h3 className="text-2xl font-medium text-ink">The Mentorle Way</h3>
            <ul className="mt-5 flex flex-col gap-3.5">
              {careerComparison.mentorleWay.map((item) => (
                <li key={item} className="flex gap-3 text-base text-ink">
                  <CheckIcon />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
