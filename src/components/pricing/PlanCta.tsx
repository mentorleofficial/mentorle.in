"use client";

import Link from "next/link";
import { useState } from "react";
import { Spinner } from "@/components/forms/fields";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { planCopy } from "@/data/pricing";
import type { PricingPlan } from "@/data/pricing";
import { useAuth } from "@/lib/auth/AuthProvider";
import { formatEventDate } from "@/lib/dates";
import { CheckoutError, startCheckout } from "@/lib/payments/checkout";
import { useMyPlan } from "@/lib/payments/membership";

// A plan card's button. Signed out: sign up and come back here. Unfinished profile: onboarding first. A pass
// already held shows until when (and can be renewed in its last 30 days); otherwise it opens Cashfree checkout.
// The server render is the signed-out state; the rest appears once the session is read.
export function PlanCta({ plan }: { plan: PricingPlan }) {
  const { status, onboarded } = useAuth();
  const mine = useMyPlan();
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  const variant = plan.featured ? "brand" : "dark";
  const label = plan.ctaLabel || (plan.billing === "free" ? planCopy.freeCta : planCopy.get(plan.name));
  const here = `/pricing?plan=${plan.slug}`;

  if (plan.billing === "free") {
    if (status === "signed-in") return <p className={buttonClasses("dark", "pointer-events-none w-full opacity-60")}>{planCopy.freeSignedIn}</p>;
    return (
      <Link href={`/signup?redirect=${encodeURIComponent("/mentors")}`} className={buttonClasses(variant, "w-full")}>
        {label}
      </Link>
    );
  }

  if (status !== "signed-in") {
    return (
      <Link href={`/signup?redirect=${encodeURIComponent(here)}`} className={buttonClasses(variant, "w-full")}>
        {label}
      </Link>
    );
  }
  if (!onboarded) {
    return (
      <Link href={`/onboarding?redirect=${encodeURIComponent(here)}`} className={buttonClasses(variant, "w-full")}>
        {label}
      </Link>
    );
  }

  const holdsThis = mine?.active && mine.planSlug === plan.slug;
  const holdsOther = mine?.active && mine.planSlug !== plan.slug;
  const renewable = holdsThis && mine?.renewable;
  const until = mine?.periodEnd ? planCopy.validUntil(formatEventDate(mine.periodEnd)) : null;

  if (holdsOther || (holdsThis && !renewable)) {
    return (
      <div>
        <p className={buttonClasses("dark", "pointer-events-none w-full opacity-60")}>{holdsThis ? planCopy.yourPlan : planCopy.otherPlan(mine!.planName)}</p>
        {holdsThis && until && <p className="mt-2 text-center text-sm text-ink-soft">{until}</p>}
      </div>
    );
  }

  const buy = async () => {
    setWorking(true);
    setError("");
    try {
      await startCheckout({ kind: "membership", planId: plan.id });
      // Cashfree takes over the page from here.
    } catch (cause) {
      setError(cause instanceof CheckoutError ? cause.message : planCopy.error);
      setWorking(false);
    }
  };

  return (
    <div>
      <button type="button" onClick={() => void buy()} disabled={working || mine === null} aria-busy={working} className={buttonClasses(variant, "w-full gap-2 disabled:opacity-60")}>
        {working ? (
          <>
            <Spinner />
            {planCopy.starting}
          </>
        ) : renewable ? (
          planCopy.renew(plan.name)
        ) : (
          label
        )}
      </button>
      {renewable && until && <p className="mt-2 text-center text-sm text-ink-soft">{until}</p>}
      {error && (
        <p className="mt-2 text-center text-sm text-brand-dark" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
