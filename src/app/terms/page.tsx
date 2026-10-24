import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { termsOfService } from "@/data/legal";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern use of Mentorle's websites, programs and platform services.",
};

export default function TermsPage() {
  return <LegalPage document={termsOfService} />;
}
