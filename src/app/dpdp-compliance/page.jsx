import PolicyPage from "@/components/PolicyPage";
import { DpdpPrivacyContent } from "@/components/DpdpPrivacyContent";
import { DPDP_PRIVACY_META } from "@/content/policies/dpdp-privacy";

export default function DpdpCompliancePage() {
  return (
    <PolicyPage
      title="DPDP Compliance Notice"
      subtitle="Statutory compliance notice under the Digital Personal Data Protection (DPDP) Act"
      meta={DPDP_PRIVACY_META}
    >
      <DpdpPrivacyContent />
    </PolicyPage>
  );
}
