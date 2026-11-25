import { Suspense } from "react";
import { AuthModal } from "@/components/auth/AuthModal";

// Soft navigation to /speaker-hub/request (the Speaker Hub's "Request for Event" buttons): the request opens in the
// modal over that page. Suspense: the flow reads ?speaker= from the URL.
export default function SpeakerRequestIntercepted() {
  return (
    <Suspense fallback={null}>
      <AuthModal mode="speaker" intercepted />
    </Suspense>
  );
}
