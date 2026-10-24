import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Cashfree sends the buyer back here after checkout, as a GET or a form POST (which a page can't take). Either
// way it becomes a normal visit to the status page.
async function back(request: NextRequest) {
  let orderId = request.nextUrl.searchParams.get("order_id");
  if (!orderId && request.method === "POST") {
    const form = await request.formData().catch(() => null);
    orderId = (form?.get("order_id") as string | null) ?? null;
  }
  const target = new URL("/payments/status", request.nextUrl.origin);
  if (orderId && /^[A-Za-z0-9_-]{1,64}$/.test(orderId)) target.searchParams.set("order_id", orderId);
  return NextResponse.redirect(target, 303);
}

export const GET = back;
export const POST = back;
