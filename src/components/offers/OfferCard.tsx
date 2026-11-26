"use client";

import { useId, useState } from "react";
import { outlineButtonClasses } from "@/components/forms/fields";
import { OfferLogo } from "@/components/offers/OfferLogo";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { SiteDialog } from "@/components/ui/SiteDialog";
import { offerCardCopy as copy, offerCategories } from "@/data/offers";
import type { Offer } from "@/data/offers";

const categoryLabel = (offer: Offer) => offerCategories.find((category) => category.slug === offer.category)?.label ?? "";

function Tags({ offer }: { offer: Offer }) {
  return (
    <ul className="flex flex-wrap gap-2 text-xs">
      <li className={`inline-flex h-6 items-center px-2.5 ${offer.kind === "free" ? "bg-[#fff0ea] text-brand-dark" : "bg-surface text-ink"}`}>{copy.kind[offer.kind]}</li>
      {offer.via && <li className="inline-flex h-6 items-center border border-line px-2.5 text-ink-soft">{copy.via[offer.via]}</li>}
    </ul>
  );
}

function ClaimLink({ offer, variant, className = "" }: { offer: Offer; variant: "brand" | "dark"; className?: string }) {
  return (
    <a href={offer.claimUrl} target="_blank" rel="noopener noreferrer" className={buttonClasses(variant, `gap-1.5 ${className}`)}>
      {copy.claim}
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-3.5" aria-hidden>
        <path d="M5 11L11 5M6 5h5v5" />
      </svg>
      <span className="sr-only">
        : {offer.brand} {copy.opensInNewTab}
      </span>
    </a>
  );
}

// One offer: logo, brand and category, the offer in large type, what the product is, who can claim, tags, and
// Claim (the official page, new tab; dark in grids so a page of cards isn't a wall of orange, brand in the dialog)
// + Details (eligibility and steps in a dialog). Equal heights in a grid row.
export function OfferCard({ offer, onSurface = true }: { offer: Offer; onSurface?: boolean }) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const steps = copy.dialog.steps[offer.via ?? "direct"](offer.brand);

  return (
    <li className={`flex min-w-0 flex-col bg-white p-5 lg:p-6 ${onSurface ? "border border-[#cbcbcb]" : "border border-line"}`}>
      <div className="flex items-center gap-3.5">
        <OfferLogo offer={offer} />
        <div className="min-w-0">
          <h3 className="truncate text-lg font-medium text-ink">{offer.brand}</h3>
          <p className="truncate text-sm text-ink-soft">{categoryLabel(offer)}</p>
        </div>
      </div>
      <p className="mt-5 text-xl leading-snug font-medium text-ink lg:text-[1.375rem]">{offer.title}</p>
      <p className="mt-2 text-sm leading-snug text-ink/85 lg:text-base">{offer.description}</p>
      <div className="mt-auto pt-5">
        <Tags offer={offer} />
        <div className="mt-4 flex gap-2">
          <ClaimLink offer={offer} variant="dark" className="flex-1" />
          <button type="button" onClick={() => setOpen(true)} className={outlineButtonClasses()} aria-haspopup="dialog">
            {copy.details}
            <span className="sr-only">: {offer.brand}</span>
          </button>
        </div>
      </div>

      {open && (
        <SiteDialog titleId={titleId} closeLabel={copy.dialog.close} onClose={() => setOpen(false)}>
          <div className="flex items-center gap-4">
            <OfferLogo offer={offer} size="lg" />
            <div className="min-w-0">
              <h2 id={titleId} className="text-2xl font-medium text-ink">
                {offer.brand}
              </h2>
              <p className="text-sm text-ink-soft">{categoryLabel(offer)}</p>
            </div>
          </div>
          <p className="mt-6 text-xl leading-snug font-medium text-ink">{offer.title}</p>
          <p className="mt-2 text-base leading-snug text-ink/85">{offer.description}</p>
          <div className="mt-4">
            <Tags offer={offer} />
          </div>
          <h3 className="mt-7 text-sm font-medium tracking-[0.06em] text-ink-soft uppercase">{copy.dialog.eligibility}</h3>
          <p className="mt-2 text-base text-ink">{offer.eligibility}</p>
          <h3 className="mt-6 text-sm font-medium tracking-[0.06em] text-ink-soft uppercase">{copy.dialog.howTo}</h3>
          <ol className="mt-3 space-y-2.5">
            {steps.map((step, index) => (
              <li key={step} className="flex gap-3 text-base leading-snug text-ink">
                <span className="flex size-6 shrink-0 items-center justify-center bg-ink text-xs text-white tabular-nums">{index + 1}</span>
                {step}
              </li>
            ))}
          </ol>
          <ClaimLink offer={offer} variant="brand" className="mt-8 h-12 w-full" />
          <p className="mt-3 text-center text-xs text-ink-soft">{copy.dialog.note}</p>
        </SiteDialog>
      )}
    </li>
  );
}
