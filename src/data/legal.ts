import { company } from "@/data/site";

// Privacy Policy (/privacy) and Terms of Service (/terms). The text is copied word for word from the legacy
// site's /privacy-policy (DPDP notice) and /terms-of-service on the `main` branch; legal wording isn't edited
// here. Differences from the rest of the site (grievance email and SLA) are logged in SPEC-VS-DESIGN (L1).

export type LegalTable = { columns: string[]; rows: string[][] };

export type LegalSection = {
  id: string; // anchor for the "On this page" list
  title: string;
  paragraphs?: string[];
  list?: string[];
  table?: LegalTable;
  // Inline link inside a paragraph: "{link}" in the paragraph text is replaced by it.
  link?: { label: string; href: string };
};

export type LegalDocument = {
  title: string;
  subtitle: string;
  effectiveDate: string;
  meta: { label: string; value: string }[];
  sections: LegalSection[];
  closing?: string;
};

const REGISTERED_OFFICE = "MOH. Sukhiabad, Near Baba Balak Nath Mandir, Hoshiarpur, Punjab — 146001, India";
const PLATFORM_BRAND = "Mentorle (mentorle.in / platform.mentorle.in)";

export const legalCopy = {
  eyebrow: "Legal",
  effective: "Effective",
  onThisPage: "On this page",
  copyright: `© ${company.copyrightYear} ${company.legalName} (CIN: ${company.cin}). All rights reserved. By Mentorle.`,
};

export const privacyPolicy: LegalDocument = {
  title: "Privacy Policy for Mentorle",
  subtitle: "Digital Personal Data Protection (DPDP) Act Compliance, Data Governance & User Rights Framework",
  effectiveDate: "September 2, 2026",
  meta: [
    { label: "Data Fiduciary", value: company.legalName },
    { label: "CIN", value: company.cin },
    { label: "Platform Brand", value: PLATFORM_BRAND },
    { label: "Data Grievance Officer", value: company.grievance.officer },
    { label: "Grievance Contact", value: "support@mentorle.in | +91 9888409232" },
    { label: "Registered Office", value: REGISTERED_OFFICE },
  ],
  sections: [
    {
      id: "scope",
      title: "1. Statutory Compliance & Scope",
      paragraphs: [
        "This Privacy Notice is published pursuant to the provisions of the Digital Personal Data Protection (DPDP) Act and applicable Indian data protection frameworks. AltioraEdtech Learning (OPC) Pvt. Ltd. operates as a Data Fiduciary in respect of all personal data provided by users, students, and mentors (Data Principals) across Mentorle digital interfaces.",
      ],
    },
    {
      id: "data-collected",
      title: "2. Categories of Personal Data Collected & Purpose Specification",
      table: {
        columns: ["Category", "Data", "Purpose"],
        rows: [
          ["Identity & Contact", "Full name, email address, mobile number, city/location", "User account provisioning, session scheduling, and communication."],
          ["Academic & Career", "College name, degree/branch, resume, LinkedIn URL, portfolio", "1:1 mentorship evaluations, mock interviews, and cohort participation."],
          ["Transaction Identifiers", "Payment reference IDs, order numbers, invoice details", "Payment gateway verification and tax/MCA statutory record-keeping."],
          ["Technical Metadata", "IP address, browser type, device information, access timestamps", "Platform security, abuse prevention, and session management."],
        ],
      },
    },
    {
      id: "consent",
      title: "3. Consent Framework & Purpose Limitation",
      paragraphs: [
        "Personal data is collected exclusively upon obtaining clear, informed, and affirmative consent from the Data Principal. Processing is strictly limited to the operational fulfillment of mentorship sessions, bootcamps, and platform features. AltioraEdtech Learning does not sell, rent, or trade personal data to third parties for commercial advertising.",
      ],
    },
    {
      id: "your-rights",
      title: "4. Statutory Rights of the Data Principal",
      list: [
        "Right to Access & Summary: Request an itemized summary of personal data being processed and third parties with whom data has been shared.",
        "Right to Correction & Erasure: Request the update of inaccurate records or permanent deletion of personal data and resumes upon account termination.",
        "Right of Grievance Redressal: Register grievances regarding data handling with our designated Data Protection Officer.",
        "Right to Nominate: Nominate an individual to exercise data rights in the event of death or incapacity.",
      ],
    },
    {
      id: "minors",
      title: "5. Protection of Minors",
      paragraphs: [
        "Mentorle does not knowingly collect personal data from individuals under 18 years of age without verifiable parental/guardian consent. We strictly prohibit tracking, targeted advertising, or behavioral monitoring directed at minors.",
      ],
    },
    {
      id: "retention",
      title: "6. Data Retention, Storage & Security",
      paragraphs: [
        "Personal data is stored securely on encrypted database clusters hosted within Indian data centers. Data is retained only for the duration necessary to satisfy the purpose of collection or statutory compliance under Indian law, after which it is permanently purged.",
      ],
    },
    {
      id: "grievance",
      title: "7. Data Grievance Redressal Mechanism",
      paragraphs: [
        "Designated Data Protection / Grievance Officer: Rachit Jain, AltioraEdtech Learning (OPC) Pvt. Ltd.",
        "Official Email: support@mentorle.in | rachitjain@mentorle.in",
        "Operating Address: MOH. Sukhiabad, Near Baba Balak Nath Mandir, Hoshiarpur, Punjab — 146001",
        "Statutory Redressal SLA: All formal data privacy inquiries and erasure requests are addressed within 7 working days.",
      ],
    },
  ],
};

export const termsOfService: LegalDocument = {
  title: "Terms of Service for Mentorle",
  subtitle: "Terms governing use of Mentorle websites, programs, and platform services",
  effectiveDate: "September 1, 2026",
  meta: [
    { label: "Legal Entity", value: company.legalName },
    { label: "CIN", value: company.cin },
    { label: "Platform Brand", value: PLATFORM_BRAND },
    { label: "Support Email", value: "support@mentorle.in" },
    { label: "Registered Office", value: REGISTERED_OFFICE },
  ],
  sections: [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      paragraphs: [
        "Welcome to Mentorle, operated by AltioraEdtech Learning (OPC) Pvt. Ltd. By accessing and using our website, platform, programs, or services, you agree to comply with and be bound by these Terms of Service.",
      ],
    },
    {
      id: "use",
      title: "Use of Website and Services",
      paragraphs: [
        "The content on this website and platform is provided for general information and service delivery. It is subject to change without notice.",
        "Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness, or suitability of the information and materials found or offered on this website for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors, and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.",
        "Your use of any information or materials on this website is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services, or information available through this website meet your specific requirements.",
      ],
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property",
      paragraphs: [
        "This website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance, graphics, curricula, and platform content. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms.",
        "All trademarks reproduced in this website, which are not the property of, or licensed to the operator, are acknowledged on the website.",
      ],
    },
    {
      id: "user-content",
      title: "User Content",
      paragraphs: [
        "You may post, upload, or submit content to our website or platform. By doing so, you grant us a non-exclusive, worldwide, perpetual, irrevocable, royalty-free, sublicensable right to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display such content for platform operations.",
        "You agree not to submit any content that is unlawful, defamatory, abusive, harassing, harmful, threatening, obscene, or otherwise objectionable.",
      ],
    },
    {
      id: "liability",
      title: "Disclaimer and Limitation of Liability",
      paragraphs: [
        "Your use of this website and any dispute arising out of such use is subject to the laws of India.",
        "We shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your access to, or use of, this website or platform.",
        "The information provided on this website does not constitute professional advice. We recommend seeking appropriate professional advice for specific queries.",
      ],
    },
    {
      id: "privacy",
      title: "Privacy",
      // The legacy page also linked a separate "DPDP Compliance Notice"; that notice is the Privacy Policy here.
      paragraphs: ["We are committed to protecting your privacy. Please review our {link} for details on how personal data is collected, processed, and protected."],
      link: { label: "Privacy Policy (DPDP Compliance Notice)", href: "/privacy" },
    },
    {
      id: "governing-law",
      title: "Governing Law and Jurisdiction",
      paragraphs: [
        "These terms shall be governed by and construed in accordance with the laws of India. Any dispute arising under these terms shall be subject to the exclusive jurisdiction of the courts of India.",
      ],
    },
    {
      id: "changes",
      title: "Changes to Terms",
      paragraphs: ["We reserve the right to modify these terms at any time. You should check this page regularly to take notice of any changes we have made."],
    },
  ],
  closing: "By using our website, you signify your acceptance of these terms. If you do not agree to these terms, please do not use our website.",
};
