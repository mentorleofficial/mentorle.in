import Link from "next/link";
import { PLATFORM_URL } from "@/lib/platform";

const PLANS = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Get started and explore Mentorle basics.",
    features: [
      "Browse mentor profiles",
      "Join community events",
      "Access free resources",
    ],
    cta: "Start exploring Mentorle",
    highlighted: false,
  },
  {
    name: "Starter",
    price: "₹999",
    period: "/ month",
    description: "For learners ready for guided mentorship.",
    features: [
      "1:1 mentor sessions",
      "Career roadmap support",
      "Priority event access",
      "Chat with mentors",
    ],
    cta: "Start exploring Mentorle",
    highlighted: true,
  },
  {
    name: "Pro",
    price: "₹2,499",
    period: "/ month",
    description: "For serious builders accelerating faster.",
    features: [
      "Unlimited session booking credits*",
      "Founder & industry expert access",
      "Project reviews & feedback",
      "Campus club leadership perks",
    ],
    cta: "Start exploring Mentorle",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          Pricing
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-gray-700">
          Simple, transparent plans
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Dummy plans for now — final pricing will be updated later.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl border p-8 flex flex-col ${
                plan.highlighted
                  ? "border-black bg-black text-white shadow-2xl scale-[1.02]"
                  : "border-gray-200 bg-[#f7f7f7]"
              }`}
            >
              <h2 className="text-2xl font-bold">{plan.name}</h2>
              <p
                className={`mt-2 text-sm ${
                  plan.highlighted ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {plan.description}
              </p>
              <div className="mt-6 flex items-end gap-1">
                <span className="text-4xl font-extrabold">{plan.price}</span>
                <span
                  className={`mb-1 text-sm ${
                    plan.highlighted ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {plan.period}
                </span>
              </div>
              <ul className="mt-8 space-y-3 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2 text-sm sm:text-base">
                    <span className="mt-1">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={PLATFORM_URL}
                className={`mt-8 block text-center rounded-full px-6 py-3 font-bold text-sm md:text-base transition-colors ${
                  plan.highlighted
                    ? "bg-white text-black hover:bg-gray-100"
                    : "bg-black text-white hover:bg-[#222222]"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
