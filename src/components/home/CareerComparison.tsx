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
    <section aria-labelledby="career-title" className="bg-dots py-[3.6rem] md:py-[5.4rem] lg:py-[7.3125rem]">
      <div className="container-page">
        <SectionHeader
          id="career-title"
          eyebrow="Career Growth"
          title="Make your next move with more clarity."
          description="You don't have to figure everything out alone. Get guidance, learn from real experience, and take practical steps towards your goals."
        />
        <div data-animate="stagger" className="mt-12 grid gap-5 md:mt-16 md:grid-cols-2">
          <div className="border border-line bg-white p-6 md:px-8 md:py-9">
            <h3 className="text-2xl font-medium text-muted">Going it Alone</h3>
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
            <h3 className="text-2xl font-medium text-ink">The Mentorle Approach</h3>
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
