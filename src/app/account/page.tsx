import type { Metadata } from "next";
import { AccountBand } from "@/components/account/AccountBand";
import { AccountSettings } from "@/components/account/AccountSettings";
import { accountCopy } from "@/data/account";

export const metadata: Metadata = {
  title: accountCopy.title,
  robots: { index: false },
};

// The band is static; the forms load in the browser for the signed-in mentee.
export default function AccountPage() {
  return (
    <>
      <AccountBand id="account-title" eyebrow={accountCopy.eyebrow} title={accountCopy.title} subtitle={accountCopy.subtitle} />
      <section className="bg-surface py-14 md:py-20 lg:py-24">
        <div className="container-page">
          <AccountSettings />
        </div>
      </section>
    </>
  );
}
