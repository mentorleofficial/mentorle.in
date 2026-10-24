import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { privacyPolicy } from "@/data/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Mentorle (AltioraEdtech Learning (OPC) Pvt. Ltd.) collects, uses and protects personal data under India's DPDP Act, and your rights.",
};

export default function PrivacyPage() {
  return <LegalPage document={privacyPolicy} />;
}
