// Static placeholder while PricingPlans streams (Cache Components / Suspense).
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
        <div className="mx-auto grid max-w-[34rem] gap-5 lg:max-w-none lg:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <div key={index} className="min-h-[28rem] border border-line bg-white" />
          ))}
        </div>
      </div>
    </section>
  );
}
