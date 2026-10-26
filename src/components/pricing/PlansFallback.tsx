// Static placeholder while PricingPlans streams (Cache Components / Suspense). Two cards, centred like the
// two plans on sale today and as tall as the real ones (about 36 + 54rem stacked, 46–48rem side by side),
// so the section doesn't jump when they arrive.
export function PlansFallback({
  className = "pt-16 pb-16 md:py-24 lg:pt-[8.5rem] lg:pb-[8.125rem]",
  background = "dots",
}: {
  className?: string;
  background?: "dots" | "surface";
}) {
  return (
    <section aria-hidden className={`${background === "surface" ? "bg-surface" : "bg-dots"} ${className}`}>
      <div className="container-page">
        <div className="mx-auto grid max-w-[34rem] gap-5 lg:max-w-[57rem] lg:grid-cols-2">
          {[0, 1].map((index) => (
            <div key={index} className="min-h-[45rem] border border-line bg-white lg:min-h-[47rem]" />
          ))}
        </div>
      </div>
    </section>
  );
}
