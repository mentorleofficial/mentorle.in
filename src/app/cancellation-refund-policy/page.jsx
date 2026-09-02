import PolicyPage, {
  PolicyList,
  PolicySection,
  PolicySubsection,
} from "@/components/PolicyPage";
import {
  CANCELLATION_REFUND_META,
  CANCELLATION_REFUND_SECTIONS,
} from "@/content/policies/cancellation-refund";
import { COPYRIGHT_NOTICE } from "@/content/policies/company-meta";

export default function CancellationRefundPolicyPage() {
  return (
    <PolicyPage
      title="Cancellation & Refund Policy"
      subtitle="Official cancellation, refund, and grievance policy for Mentorle services"
      meta={CANCELLATION_REFUND_META}
    >
      {CANCELLATION_REFUND_SECTIONS.map((section) => (
        <PolicySection key={section.title} title={section.title}>
          {section.intro ? <p>{section.intro}</p> : null}
          {section.paragraphs?.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {section.subsections?.map((subsection) => (
            <PolicySubsection key={subsection.title} title={subsection.title}>
              {subsection.list ? <PolicyList items={subsection.list} /> : null}
              {subsection.table ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">
                          Stage
                        </th>
                        <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">
                          Timeline
                        </th>
                        <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">
                          Details
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {subsection.table.map((row) => (
                        <tr key={row.stage}>
                          <td className="border border-gray-200 px-4 py-3 align-top text-gray-600">
                            {row.stage}
                          </td>
                          <td className="border border-gray-200 px-4 py-3 align-top text-gray-600">
                            {row.timeline}
                          </td>
                          <td className="border border-gray-200 px-4 py-3 align-top text-gray-600">
                            {row.details}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </PolicySubsection>
          ))}
          {section.contacts ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">
                      Contact Level
                    </th>
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">
                      Channel / Information
                    </th>
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">
                      Operating Hours
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {section.contacts.map((contact) => (
                    <tr key={contact.level}>
                      <td className="border border-gray-200 px-4 py-3 align-top text-gray-600">
                        {contact.level}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 align-top text-gray-600">
                        {contact.channel}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 align-top text-gray-600">
                        {contact.hours}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </PolicySection>
      ))}
      <p className="text-sm text-gray-500 border-t border-gray-200 pt-6">
        {COPYRIGHT_NOTICE}
      </p>
    </PolicyPage>
  );
}
