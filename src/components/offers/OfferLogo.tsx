import type { Offer } from "@/data/offers";

// Two letters for brands without a logo: the first letters of the first two words ("Name Thing" → NT), or one letter
// for a one-word name.
const initials = (brand: string) => {
  const words = brand.split(/[\s.+|-]+/).filter((word) => /^[a-z0-9]/i.test(word));
  return (words.length > 1 ? words[0][0] + words[1][0] : (words[0]?.[0] ?? "?")).toUpperCase();
};

// The brand's square tile: its own logo (public/offers/logos, fetched from the brand's site by npm run offers:logos)
// on white with a hairline, or initials on ink. Decorative: the brand name is always next to it.
export function OfferLogo({ offer, size = "md" }: { offer: Offer; size?: "md" | "lg" }) {
  const box = size === "lg" ? "size-14" : "size-12";
  if (offer.logo)
    return (
      <span className={`${box} flex shrink-0 items-center justify-center border border-line bg-white p-1.5`}>
        {/* eslint-disable-next-line @next/next/no-img-element -- small local logos (SVG or 128px WebP); next/image adds nothing here */}
        <img src={`/offers/logos/${offer.logo}`} alt="" width={36} height={36} loading="lazy" decoding="async" className="size-full object-contain" />
      </span>
    );
  return (
    <span aria-hidden className={`${box} flex shrink-0 items-center justify-center bg-ink text-base font-medium tracking-[0.02em] text-white`}>
      {initials(offer.brand)}
    </span>
  );
}
