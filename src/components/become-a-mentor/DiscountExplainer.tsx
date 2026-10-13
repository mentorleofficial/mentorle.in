import { becomeAMentorPage } from "@/data/become-a-mentor";

export function DiscountExplainer() {
  const { discount } = becomeAMentorPage;

  return (
    <div
      data-animate="fade-up"
      className="grid gap-8 bg-surface p-6 md:p-10 lg:mx-[1.875rem] lg:grid-cols-[1fr_36.125rem] lg:items-center lg:gap-10 lg:px-[3.75rem] lg:py-[3.75rem]"
    >
      <div className="max-w-[23.5rem]">
        <h2 className="text-[1.625rem] leading-[1.3] font-medium text-ink md:text-[2rem]">{discount.title}</h2>
        <p className="mt-3 text-base leading-snug text-ink">{discount.description}</p>
      </div>

      <dl className="bg-white px-6 py-6 md:px-8 md:py-8">
        <div className="flex flex-col gap-4">
          {discount.rows.map((row) => (
            <div key={row.label} className="flex items-baseline justify-between gap-4">
              <dt className="text-base text-ink">{row.label}</dt>
              <dd className="text-2xl text-ink">{row.value}</dd>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-baseline justify-between gap-4 border-y border-line py-6">
          <dt className="text-xl font-medium text-ink">{discount.receive.label}</dt>
          <dd className="text-[2rem] leading-none font-semibold text-ink">{discount.receive.value}</dd>
        </div>
        <div className="mt-6 flex items-baseline justify-between gap-4">
          <dt className="text-base text-ink">{discount.keeps.label}</dt>
          <dd className="text-2xl text-ink">{discount.keeps.value}</dd>
        </div>
      </dl>
    </div>
  );
}
