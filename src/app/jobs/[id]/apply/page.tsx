import type { Metadata } from "next";
import { Suspense } from "react";
import { AccountBand } from "@/components/account/AccountBand";
import { AccountLoading } from "@/components/account/AccountGate";
import { JobApply } from "@/components/jobs/JobApply";
import { jobApplyCopy } from "@/data/jobs";

export const metadata: Metadata = {
  title: jobApplyCopy.metaTitle,
  robots: { index: false },
};

// The band is static; the apply step runs in the browser for the signed-in mentee (useParams is URL data, hence
// Suspense). The privacy note is shown on the job card and here.
export default function JobApplyPage() {
  return (
    <>
      <AccountBand id="job-apply-title" eyebrow={jobApplyCopy.eyebrow} title={jobApplyCopy.title} subtitle={jobApplyCopy.subtitle} />
      <section className="bg-surface py-14 md:py-20 lg:py-24">
        {/* A narrow column aligned with the band's title (like the account pages), not centred. */}
        <div className="container-page">
          <div className="max-w-[48rem]">
            <Suspense fallback={<AccountLoading label={jobApplyCopy.checking} />}>
              <JobApply />
            </Suspense>
            <p className="mt-6 text-sm text-ink-soft">{jobApplyCopy.shareNote}</p>
          </div>
        </div>
      </section>
    </>
  );
}
