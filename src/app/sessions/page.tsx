import type { Metadata } from "next";
import { AccountBand } from "@/components/account/AccountBand";
import { MySessions } from "@/components/sessions/MySessions";
import { sessionsCopy } from "@/data/sessions";

export const metadata: Metadata = {
  title: sessionsCopy.title,
  robots: { index: false },
};

// The band is static; the list is read in the browser for the signed-in mentee.
export default function SessionsPage() {
  return (
    <>
      <AccountBand id="sessions-title" eyebrow={sessionsCopy.eyebrow} title={sessionsCopy.title} subtitle={sessionsCopy.subtitle} />
      <section className="bg-surface py-14 md:py-20 lg:py-24">
        <div className="container-page">
          <div className="max-w-[64rem]">
            <MySessions />
          </div>
        </div>
      </section>
    </>
  );
}
