import PolicyPage, { PolicySection } from "@/components/PolicyPage";
import { COMPANY_META, COPYRIGHT_NOTICE } from "@/content/policies/company-meta";

const TERMS_META = [
  ...COMPANY_META,
  { label: "Effective Date", value: "September 1, 2026" },
];

export default function TermsOfServicePage() {
  return (
    <PolicyPage
      title="Terms of Service for Mentorle"
      subtitle="Terms governing use of Mentorle websites, programs, and platform services"
      meta={TERMS_META}
    >
      <PolicySection title="Acceptance of Terms">
        <p>
          Welcome to Mentorle, operated by AltioraEdtech Learning (OPC) Pvt.
          Ltd. By accessing and using our website, platform, programs, or
          services, you agree to comply with and be bound by these Terms of
          Service.
        </p>
      </PolicySection>

      <PolicySection title="Use of Website and Services">
        <p>
          The content on this website and platform is provided for general
          information and service delivery. It is subject to change without
          notice.
        </p>
        <p>
          Neither we nor any third parties provide any warranty or guarantee as
          to the accuracy, timeliness, performance, completeness, or suitability
          of the information and materials found or offered on this website for
          any particular purpose. You acknowledge that such information and
          materials may contain inaccuracies or errors, and we expressly exclude
          liability for any such inaccuracies or errors to the fullest extent
          permitted by law.
        </p>
        <p>
          Your use of any information or materials on this website is entirely at
          your own risk, for which we shall not be liable. It shall be your own
          responsibility to ensure that any products, services, or information
          available through this website meet your specific requirements.
        </p>
      </PolicySection>

      <PolicySection title="Intellectual Property">
        <p>
          This website contains material which is owned by or licensed to us.
          This material includes, but is not limited to, the design, layout,
          look, appearance, graphics, curricula, and platform content.
          Reproduction is prohibited other than in accordance with the copyright
          notice, which forms part of these terms.
        </p>
        <p>
          All trademarks reproduced in this website, which are not the property
          of, or licensed to the operator, are acknowledged on the website.
        </p>
      </PolicySection>

      <PolicySection title="User Content">
        <p>
          You may post, upload, or submit content to our website or platform. By
          doing so, you grant us a non-exclusive, worldwide, perpetual,
          irrevocable, royalty-free, sublicensable right to use, reproduce,
          modify, adapt, publish, translate, create derivative works from,
          distribute, and display such content for platform operations.
        </p>
        <p>
          You agree not to submit any content that is unlawful, defamatory,
          abusive, harassing, harmful, threatening, obscene, or otherwise
          objectionable.
        </p>
      </PolicySection>

      <PolicySection title="Disclaimer and Limitation of Liability">
        <p>
          Your use of this website and any dispute arising out of such use is
          subject to the laws of India.
        </p>
        <p>
          We shall not be liable for any direct, indirect, incidental,
          consequential, or punitive damages arising out of your access to, or
          use of, this website or platform.
        </p>
        <p>
          The information provided on this website does not constitute
          professional advice. We recommend seeking appropriate professional
          advice for specific queries.
        </p>
      </PolicySection>

      <PolicySection title="Privacy">
        <p>
          We are committed to protecting your privacy. Please review our{" "}
          <a href="/privacy-policy" className="text-black underline">
            Privacy Policy
          </a>{" "}
          and{" "}
          <a href="/dpdp-compliance" className="text-black underline">
            DPDP Compliance Notice
          </a>{" "}
          for details on how personal data is collected, processed, and
          protected.
        </p>
      </PolicySection>

      <PolicySection title="Governing Law and Jurisdiction">
        <p>
          These terms shall be governed by and construed in accordance with the
          laws of India. Any dispute arising under these terms shall be subject
          to the exclusive jurisdiction of the courts of India.
        </p>
      </PolicySection>

      <PolicySection title="Changes to Terms">
        <p>
          We reserve the right to modify these terms at any time. You should
          check this page regularly to take notice of any changes we have made.
        </p>
      </PolicySection>

      <p className="text-sm text-gray-500 border-t border-gray-200 pt-6">
        By using our website, you signify your acceptance of these terms. If you
        do not agree to these terms, please do not use our website.
      </p>
      <p className="text-sm text-gray-500 mt-4">{COPYRIGHT_NOTICE}</p>
    </PolicyPage>
  );
}
