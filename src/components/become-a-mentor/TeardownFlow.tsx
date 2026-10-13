import { becomeAMentorPage } from "@/data/become-a-mentor";

export function TeardownFlow() {
  const { commute } = becomeAMentorPage;

  return (
    <section aria-labelledby="commute-title" className="bg-dots py-16 md:py-24 lg:py-[8.125rem]">
      <div className="container-page grid gap-10 lg:grid-cols-[1fr_39.375rem] lg:items-start">
        <div data-animate="stagger" className="max-w-[32rem]">
          <p className="text-xl tracking-[-0.02em] text-ink md:text-2xl">{commute.eyebrow}</p>
          <h2 id="commute-title" className="mt-2 text-[1.625rem] leading-tight font-medium text-ink md:mt-3 md:text-[2rem]">
            {commute.title}
          </h2>
          <p className="mt-4 text-base leading-snug text-ink">{commute.intro}</p>
          {commute.points.map((point) => (
            <div key={point.title} className="mt-8">
              <h3 className="text-xl font-medium text-ink md:text-2xl">{point.title}</h3>
              <p className="mt-2 text-base leading-snug text-ink">{point.text}</p>
            </div>
          ))}
        </div>

        <div data-animate="fade-up" className="border border-line p-6 md:p-8 lg:min-h-[30rem]">
          <h3 className="text-xl font-medium text-ink md:text-2xl">{commute.flowTitle}</h3>
          <ol className="mt-6 flex flex-col gap-6">
            {commute.flow.map((step, index) => (
              <li key={step.title}>
                <p className="text-lg font-medium text-ink md:text-xl">
                  {index + 1} · {step.title}
                </p>
                <p className="mt-1.5 text-base text-ink">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
