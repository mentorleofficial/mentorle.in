import type { Metadata } from "next";
import { Suspense } from "react";
import SpeakerHubPage from "@/app/speaker-hub/page";
import { AuthModal } from "@/components/auth/AuthModal";
import { speakerRequestCopy } from "@/data/speakers";

export const metadata: Metadata = {
  title: speakerRequestCopy.metaTitle,
  description: speakerRequestCopy.metaDescription,
};

// Direct visit or refresh: the request opens over the Speaker Hub, and closing it lands there.
// Suspense: the flow reads ?speaker= from the URL.
export default function SpeakerRequestPage() {
  return (
    <>
      <SpeakerHubPage />
      <Suspense fallback={null}>
        <AuthModal mode="speaker" intercepted={false} closeHref="/speaker-hub" />
      </Suspense>
    </>
  );
}
