"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { browserSupabase } from "@/lib/supabase/browser";

// The signed-in mentee's plan (plus_quota_status: their active pass, its discounts and free sessions left).

export type MyPlan = {
  active: boolean;
  planName: string;
  planSlug: string;
  periodEnd: string | null;
  sessionDiscount: number;
  eventDiscount: number;
  freeTotal: number;
  freeLeft: number;
  freePeriod: "month" | "year" | null;
  // In its last 30 days, when buying the same plan again extends it.
  renewable: boolean;
};

const NONE: MyPlan = { active: false, planName: "", planSlug: "", periodEnd: null, sessionDiscount: 0, eventDiscount: 0, freeTotal: 0, freeLeft: 0, freePeriod: null, renewable: false };

type Row = {
  has_membership: boolean;
  quota_total: number;
  quota_remaining: number;
  discount_percent: number;
  event_discount_percent: number;
  plan_name: string | null;
  plan_slug: string | null;
  period_end: string | null;
  quota_period: "month" | "year" | null;
};

const RENEW_WINDOW_MS = 30 * 86_400_000;

export async function fetchMyPlan(): Promise<MyPlan> {
  const { data, error } = await browserSupabase().rpc("plus_quota_status");
  if (error) throw new Error(`plus_quota_status failed: ${error.message}`);
  const row = (data as Row[] | null)?.[0];
  if (!row?.has_membership) return NONE;
  return {
    active: true,
    planName: row.plan_name ?? "Mentorle Plus",
    planSlug: row.plan_slug ?? "",
    periodEnd: row.period_end,
    sessionDiscount: Number(row.discount_percent) || 0,
    eventDiscount: Number(row.event_discount_percent) || 0,
    freeTotal: Number(row.quota_total) || 0,
    freeLeft: Number(row.quota_remaining) || 0,
    freePeriod: row.quota_period,
    renewable: Boolean(row.period_end) && Date.parse(row.period_end!) - Date.now() < RENEW_WINDOW_MS,
  };
}

// null while loading or signed out.
export function useMyPlan() {
  const { status, user } = useAuth();
  const userId = status === "signed-in" ? (user?.id ?? null) : null;
  const [plan, setPlan] = useState<{ userId: string; plan: MyPlan } | null>(null);
  useEffect(() => {
    if (!userId) return;
    let live = true;
    fetchMyPlan()
      .then((next) => live && setPlan({ userId, plan: next }))
      .catch(() => live && setPlan({ userId, plan: NONE }));
    return () => {
      live = false;
    };
  }, [userId]);
  return userId && plan?.userId === userId ? plan.plan : null;
}

export const discounted = (price: number, percent: number) => (percent > 0 ? Math.round(price * (1 - percent / 100) * 100) / 100 : price);
