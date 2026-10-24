import type { Metadata } from "next";
import { Suspense } from "react";
import { AccountBand } from "@/components/account/AccountBand";
import { AccountLoading } from "@/components/account/AccountGate";
import { PaymentStatus } from "@/components/payments/PaymentStatus";
import { paymentCopy } from "@/data/payments";

export const metadata: Metadata = {
  title: paymentCopy.title,
  robots: { index: false },
};

// Where Cashfree checkout ends up (through /pay-return). The order id is read in the browser.
export default function PaymentStatusPage() {
  return (
    <>
      <AccountBand id="payment-title" eyebrow={paymentCopy.eyebrow} title={paymentCopy.title} subtitle={paymentCopy.subtitle} />
      <section className="bg-surface py-14 md:py-20 lg:py-24">
        <div className="container-page">
          <div className="max-w-[48rem]">
            <Suspense fallback={<AccountLoading label={paymentCopy.checking} />}>
              <PaymentStatus />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
