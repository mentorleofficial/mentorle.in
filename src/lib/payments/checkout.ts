"use client";

import { load } from "@cashfreepayments/cashfree-js";
import { browserSupabase } from "@/lib/supabase/browser";

// Paying for a session, an event or a pass. The platform's cashfree-create-order works out the price (with the
// member discount) and holds a session's slot; this sends the browser to Cashfree's hosted checkout, which
// comes back to /pay-return → /payments/status, where cashfree-verify-order confirms and delivers it.

export type CheckoutItem =
  | { kind: "session"; offeringId: string; startsAt: string; notes?: string }
  | { kind: "event"; eventId: string }
  | { kind: "membership"; planId: string };

export class CheckoutError extends Error {
  constructor(
    message: string,
    public code?: string,
  ) {
    super(message);
  }
}

type Order = { order_id: string; payment_session_id: string; cashfree_mode: "sandbox" | "production" };
type Cashfree = { checkout: (options: { paymentSessionId: string; redirectTarget: "_self" }) => Promise<{ error?: { message?: string } }> };

// Supabase wraps a function's error response; this reads its { error, code } body.
async function functionError(error: unknown): Promise<CheckoutError> {
  try {
    const body = await (error as { context?: Response }).context?.json();
    if (body?.error) return new CheckoutError(String(body.error), body.code);
  } catch {
    // keep the generic message
  }
  return new CheckoutError("Couldn’t start the payment. Please try again.");
}

export async function startCheckout(item: CheckoutItem) {
  const body =
    item.kind === "session"
      ? { kind: "session", offering_id: item.offeringId, scheduled_at: item.startsAt, notes: item.notes ?? "" }
      : item.kind === "event"
        ? { kind: "event", event_id: item.eventId }
        : { kind: "membership", plan_id: item.planId };
  const { data, error } = await browserSupabase().functions.invoke<Order>("cashfree-create-order", {
    body: { ...body, return_url: `${window.location.origin}/pay-return?order_id={order_id}` },
  });
  if (error || !data?.payment_session_id) throw error ? await functionError(error) : new CheckoutError("Couldn’t start the payment. Please try again.");
  // Remembered so the status page can link back to where checkout started.
  try {
    sessionStorage.setItem(`mentorle-order:${data.order_id}`, window.location.pathname + window.location.search);
  } catch {
    // storage blocked: the status page falls back to a generic link
  }
  const cashfree = (await load({ mode: data.cashfree_mode })) as Cashfree | null;
  if (!cashfree) throw new CheckoutError("Couldn’t load Cashfree. Check your connection and try again.");
  const result = await cashfree.checkout({ paymentSessionId: data.payment_session_id, redirectTarget: "_self" });
  if (result?.error) throw new CheckoutError(result.error.message ?? "The payment couldn’t be started.");
}

export type PaymentOutcome = {
  status: "paid" | "pending" | "failed" | "created" | "refunded";
  kind: "session" | "event" | "membership" | string;
  amount: number;
  session_id?: string | null;
  registration_id?: string | null;
  membership_id?: string | null;
  needs_refund?: boolean;
};

export async function verifyOrder(orderId: string): Promise<PaymentOutcome> {
  const { data, error } = await browserSupabase().functions.invoke<PaymentOutcome>("cashfree-verify-order", { body: { order_id: orderId } });
  if (error || !data) throw error ? await functionError(error) : new CheckoutError("Couldn’t check the payment.");
  return data;
}
