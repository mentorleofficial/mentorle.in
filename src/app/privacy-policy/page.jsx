import PolicyPage from "@/components/PolicyPage";
import { DpdpPrivacyContent } from "@/components/DpdpPrivacyContent";
import { DPDP_PRIVACY_META } from "@/content/policies/dpdp-privacy";

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      title="Privacy Policy for Mentorle"
      subtitle="Digital Personal Data Protection (DPDP) Act Compliance, Data Governance & User Rights Framework"
      meta={DPDP_PRIVACY_META}
    >
      <DpdpPrivacyContent />
    </PolicyPage>
  );
}
