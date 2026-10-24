"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AccountGate, AccountLoading, AccountNotice } from "@/components/account/AccountGate";
import { outlineButtonClasses } from "@/components/forms/fields";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { formatRupees, paymentCopy as copy } from "@/data/payments";
import { formatEventDate, formatEventDateTime } from "@/lib/dates";
import { verifyOrder } from "@/lib/payments/checkout";
import type { PaymentOutcome } from "@/lib/payments/checkout";
import { fetchMyPlan } from "@/lib/payments/membership";
import { browserSupabase } from "@/lib/supabase/browser";

const POLL_MS = 2500;
const SLOW_AFTER_MS = 20_000;
const GIVE_UP_MS = 120_000;

export function PaymentStatus() {
  return (
    <AccountGate path="/payments/status" loading={copy.checking} signedOut={copy.signedOut}>
      <Status />
    </AccountGate>
  );
}

type Shown = PaymentOutcome & { detail?: string; title?: string };

function Status() {
  const orderId = useSearchParams().get("order_id");
  const [outcome, setOutcome] = useState<Shown | null>(null);
  const [failed, setFailed] = useState(false);
  const [slow, setSlow] = useState(false);
  const started = useRef(0);
  const [from, setFrom] = useState<string | null>(null);

  const describe = useCallback(async (result: PaymentOutcome): Promise<Shown> => {
    if (result.status !== "paid") return result;
    if (result.kind === "session" && result.session_id) {
      const { data } = await browserSupabase().from("sessions").select("title, scheduled_at").eq("id", result.session_id).maybeSingle();
      return data ? { ...result, title: data.title, detail: formatEventDateTime(data.scheduled_at) } : result;
    }
    if (result.kind === "membership") {
      const plan = await fetchMyPlan().catch(() => null);
      return plan?.active ? { ...result, title: plan.planName, detail: plan.periodEnd ? formatEventDate(plan.periodEnd) : "" } : result;
    }
    return result;
  }, []);

  useEffect(() => {
    if (!orderId) return;
    started.current = Date.now();
    let live = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const check = async () => {
      try {
        const result = await verifyOrder(orderId);
        if (!live) return;
        setFailed(false);
        if (result.status === "pending" || result.status === "created") {
          const waited = Date.now() - started.current;
          setSlow(waited > SLOW_AFTER_MS);
          if (waited < GIVE_UP_MS) timer = setTimeout(() => void check(), POLL_MS);
          setOutcome(result);
          return;
        }
        const shown = await describe(result);
        if (live) setOutcome(shown);
      } catch {
        if (live) setFailed(true);
      }
    };
    queueMicrotask(() => {
      try {
        setFrom(sessionStorage.getItem(`mentorle-order:${orderId}`));
      } catch {
        // storage blocked: the generic links are used
      }
      void check();
    });
    return () => {
      live = false;
      clearTimeout(timer);
    };
  }, [orderId, describe]);

  if (!orderId)
    return (
      <AccountNotice title={copy.missing.title} body={copy.missing.body}>
        <Link href="/sessions" className={buttonClasses("dark")}>
          {copy.missing.cta}
        </Link>
      </AccountNotice>
    );
  if (failed && !outcome)
    return (
      <AccountNotice title={copy.error.title} body={copy.error.body}>
        <button type="button" onClick={() => window.location.reload()} className={buttonClasses("dark")}>
          {copy.error.retry}
        </button>
      </AccountNotice>
    );
  if (!outcome || outcome.status === "pending" || outcome.status === "created")
    return (
      <div>
        <AccountLoading label={copy.checking} />
        {slow && <p className="max-w-[36rem] text-sm leading-relaxed text-ink-soft">{copy.slow}</p>}
      </div>
    );

  const back = from ?? "/mentors";
  if (outcome.status === "failed")
    return (
      <AccountNotice title={copy.failed.title} body={copy.failed.body}>
        <Link href={back} className={buttonClasses("brand")}>
          {copy.failed.retry}
        </Link>
      </AccountNotice>
    );
  if (outcome.needs_refund)
    return (
      <AccountNotice title={copy.refund.title} body={copy.refund.body(formatRupees(outcome.amount))}>
        <Link href={back} className={buttonClasses("brand")}>
          {copy.refund.cta}
        </Link>
      </AccountNotice>
    );

  const paid = copy.paid(formatRupees(outcome.amount));
  if (outcome.kind === "membership")
    return (
      <AccountNotice title={copy.membership.title(outcome.title ?? "Mentorle")} body={`${outcome.detail ? copy.membership.body(outcome.detail) : ""} ${paid}.`.trim()}>
        <Link href="/mentors" className={buttonClasses("brand")}>
          {copy.membership.cta}
        </Link>
        <Link href="/account#plan" className={outlineButtonClasses()}>
          {copy.membership.account}
        </Link>
      </AccountNotice>
    );
  if (outcome.kind === "event")
    return (
      <AccountNotice title={copy.event.title} body={`${copy.event.body} ${paid}.`}>
        <Link href={back} className={buttonClasses("brand")}>
          {copy.event.cta}
        </Link>
      </AccountNotice>
    );
  return (
    <AccountNotice title={copy.session.title} body={`${outcome.title ? `${outcome.title}, ${outcome.detail}. ` : ""}${copy.session.body} ${paid}.`}>
      <Link href="/sessions" className={buttonClasses("brand")}>
        {copy.session.cta}
      </Link>
    </AccountNotice>
  );
}
