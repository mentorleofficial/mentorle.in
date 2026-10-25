import { cacheLife, cacheTag } from "next/cache";
import type { PricingPlan } from "@/data/pricing";
import { publicSupabase } from "@/lib/supabase/public";

// The plans on sale, as admins configure them in the platform (Settings → Payments → Plans), in their order.
// Public (list_active_plans), cached for a few minutes like the mentor directory.

type Row = {
  id: string;
  slug: string;
  name: string;
  billing: PricingPlan["billing"] | null;
  price: number | string;
  access_months: number | null;
  tagline: string | null;
  intro: string | null;
  price_note: string | null;
  badge: string | null;
  featured: boolean | null;
  benefits: unknown;
  cta_label: string | null;
  session_discount_percent: number | string | null;
  free_sessions: number | null;
  free_sessions_period: "month" | "year" | null;
};

export async function getPlans(): Promise<PricingPlan[]> {
  "use cache";
  // Hours (not "minutes"): Cache Components treats caches that expire under 5 minutes as runtime
  // data, which blocks prerender on /pricing unless every caller is inside Suspense.
  cacheLife("hours");
  cacheTag("plans");
  const { data, error } = await publicSupabase().rpc("list_active_plans");
  if (error) throw new Error(`list_active_plans failed: ${error.message}`);
  return ((data ?? []) as Row[])
    .filter((row) => row.billing === "free" || row.billing === "one_time")
    .map((row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      billing: row.billing ?? "one_time",
      price: Number(row.price) || 0,
      accessMonths: row.access_months,
      tagline: row.tagline?.trim() ?? "",
      intro: row.intro?.trim() ?? "",
      note: row.price_note?.trim() ?? "",
      badge: row.badge?.trim() ?? "",
      featured: Boolean(row.featured),
      benefits: Array.isArray(row.benefits) ? (row.benefits as unknown[]).map(String).filter((line) => line.trim()) : [],
      ctaLabel: row.cta_label?.trim() ?? "",
      sessionDiscount: Number(row.session_discount_percent) || 0,
      freeSessions: Number(row.free_sessions) || 0,
      freePeriod: row.free_sessions_period ?? "year",
    }));
}
