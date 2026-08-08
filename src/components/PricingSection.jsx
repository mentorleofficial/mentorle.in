import { PLATFORM_URL } from "@/lib/platform";

const FREE_FEATURES = [
  "Join the Mentorle community",
  "Explore verified mentors and experts",
  "Access selected expert sessions",
  "Discover opportunities and updates",
  "Get basic discounts on selected products or services",
];

const PLUS_FEATURES = [
  "2 live expert sessions every month",
  "Better discounts on 1:1 mentorship sessions",
  "Exclusive offline meetups or industry visits",
  "Special discounts on Mentorle events",
  "Merch and partner discounts",
  "Premium resources: roadmaps, cheatsheets, AI workflows",
  "Add-on support: mock interviews, resume reviews, startup guidance",
];

function CheckIcon({ filled = false }) {
  if (filled) {
    return (
      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-black text-white">
        <svg
          viewBox="0 0 16 16"
          fill="none"
          className="h-3 w-3"
          aria-hidden="true"
        >
          <path
            d="M3.5 8.5L6.5 11.5L12.5 4.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }

  return (
    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center text-gray-400">
      <svg
        viewBox="0 0 16 16"
        fill="none"
        className="h-4 w-4"
        aria-hidden="true"
      >
        <path
          d="M3.5 8.5L6.5 11.5L12.5 4.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default function PricingSection() {
  return (
    <section className="w-full bg-[#f5f5f5] py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl text-center">
        <h2
          className="text-3xl sm:text-4xl lg:text-5xl text-black leading-tight"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Start free. Go deeper with Mentorle Plus.
        </h2>
        <p className="mt-4 sm:mt-5 mx-auto max-w-2xl text-sm sm:text-base text-gray-600 leading-relaxed">
          Explore Mentorle at no cost, then upgrade when you want more sessions,
          stronger discounts, exclusive meetups, and premium resources built for
          serious growth.
        </p>
      </div>

      <div className="mx-auto mt-10 sm:mt-14 grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8 items-stretch">
        {/* Free */}
        <div className="flex flex-col rounded-3xl bg-white p-7 sm:p-9 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
          <h3
            className="text-3xl sm:text-4xl text-black"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Free
          </h3>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed">
            For curious students, learners, founders, and first-time members.
          </p>
          <p
            className="mt-6 text-3xl sm:text-4xl font-semibold text-black"
            style={{ fontFamily: "Georgia, serif" }}
          >
            ₹0{" "}
            <span className="text-lg sm:text-xl font-normal text-gray-600">
              / forever
            </span>
          </p>

          <ul className="mt-8 space-y-3.5 flex-1">
            {FREE_FEATURES.map((feature) => (
              <li key={feature} className="flex gap-3 text-sm sm:text-[15px] text-gray-700">
                <CheckIcon />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <a
            href={PLATFORM_URL}
            className="mt-8 inline-flex w-full items-center justify-center rounded-full border border-gray-300 bg-white px-6 py-3.5 text-sm sm:text-base font-semibold text-black transition-colors hover:bg-gray-50"
          >
            Join Free
          </a>
        </div>

        {/* Mentorle Plus */}
        <div className="relative flex flex-col rounded-3xl border-2 border-black bg-white p-7 sm:p-9 pt-10">
          <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-black px-4 py-1.5 text-[11px] sm:text-xs font-semibold tracking-wide text-white uppercase whitespace-nowrap">
            ★ Most Popular
          </span>

          <h3
            className="text-3xl sm:text-4xl text-black"
            style={{ fontFamily: "Georgia, serif" }}
          >
            ✦ Mentorle Plus
          </h3>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed">
            For serious individuals who want more access, better value, and
            faster growth.
          </p>
          <p
            className="mt-6 text-3xl sm:text-4xl text-black"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Plus membership
          </p>

          <ul className="mt-8 space-y-3.5 flex-1">
            {PLUS_FEATURES.map((feature) => (
              <li key={feature} className="flex gap-3 text-sm sm:text-[15px] text-gray-800">
                <CheckIcon filled />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <a
            href={PLATFORM_URL}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-black px-6 py-3.5 text-sm sm:text-base font-semibold text-white transition-colors hover:bg-[#222222]"
          >
            Explore Mentorle Plus
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
