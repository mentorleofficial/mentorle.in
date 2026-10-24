"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { accountCopy } from "@/data/account";
import { formatRupees } from "@/data/payments";
import { formatEventDate } from "@/lib/dates";
import { useMyPlan } from "@/lib/payments/membership";
import { browserSupabase } from "@/lib/supabase/browser";

const copy = accountCopy.plan;

type PaymentRow = { id: string; kind: string; status: string; amount: number; created_at: string; payload: { needs_refund?: boolean; plan?: { name?: string } } | null };

// Account → Your plan: the active pass (or the free tier), its benefits in numbers, and the last payments
// (the mentee's own `payments` rows).
export function AccountPlanCard({ userId }: { userId: string }) {
  const plan = useMyPlan();
  const [payments, setPayments] = useState<PaymentRow[] | null>(null);

  useEffect(() => {
    let live = true;
    browserSupabase()
      .from("payments")
      .select("id, kind, status, amount, created_at, payload")
      .eq("user_id", userId)
      .in("status", ["paid", "refunded", "pending"])
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data }) => live && setPayments((data ?? []) as PaymentRow[]));
    return () => {
      live = false;
    };
  }, [userId]);

  return (
    <section id="plan" aria-labelledby="plan-title" className="scroll-mt-8 border border-[#cbcbcb] bg-white p-5 md:p-8">
      <h2 id="plan-title" className="text-xl font-medium text-ink lg:text-2xl">
        {copy.title}
      </h2>
      <p className="mt-1.5 text-sm leading-snug text-ink-soft">{copy.body}</p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border border-line bg-surface px-5 py-4">
        {plan === null ? (
          <p className="text-sm text-muted">{copy.loading}</p>
        ) : plan.active ? (
          <div className="min-w-0">
            <p className="text-lg font-medium text-ink">{plan.planName}</p>
            <ul className="mt-1 space-y-0.5 text-sm text-ink-soft">
              {plan.periodEnd && <li>{copy.validUntil(formatEventDate(plan.periodEnd))}</li>}
              {plan.sessionDiscount > 0 && <li>{copy.discount(plan.sessionDiscount)}</li>}
              {plan.eventDiscount > 0 && <li>{copy.eventDiscount(plan.eventDiscount)}</li>}
              {plan.freeTotal > 0 && <li>{copy.free(plan.freeLeft, plan.freeTotal, plan.freePeriod ?? "year")}</li>}
            </ul>
          </div>
        ) : (
          <div className="min-w-0">
            <p className="text-lg font-medium text-ink">{copy.none}</p>
            <p className="mt-1 text-sm text-ink-soft">{copy.nonePitch}</p>
          </div>
        )}
        {plan && (!plan.active || plan.renewable) && (
          <Link href={plan.active ? `/pricing?plan=${plan.planSlug}#plan-${plan.planSlug}` : "/pricing#plans"} className={buttonClasses(plan.active ? "dark" : "brand")}>
            {plan.active ? copy.renew : copy.seePlans}
          </Link>
        )}
      </div>

      <h3 className="mt-7 text-sm font-medium text-ink">{copy.payments}</h3>
      {payments === null ? null : payments.length === 0 ? (
        <p className="mt-2 text-sm text-ink-soft">{copy.noPayments}</p>
      ) : (
        <ul className="mt-2 divide-y divide-line border-y border-line">
          {payments.map((payment) => (
            <li key={payment.id} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3 text-sm">
              <span className="text-ink">
                {payment.kind === "membership" && payment.payload?.plan?.name ? payment.payload.plan.name : (copy.kinds[payment.kind] ?? payment.kind)}
                <span className="ml-2 text-ink-soft">{formatEventDate(payment.created_at)}</span>
              </span>
              <span className="flex items-baseline gap-3">
                <span className={payment.payload?.needs_refund ? "text-brand-dark" : "text-ink-soft"}>
                  {payment.payload?.needs_refund ? copy.refund : (copy.statuses[payment.status] ?? payment.status)}
                </span>
                <span className="font-medium text-ink tabular-nums">{formatRupees(Number(payment.amount))}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
