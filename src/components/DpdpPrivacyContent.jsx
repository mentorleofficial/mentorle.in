import {
  PolicyList,
  PolicySection,
} from "@/components/PolicyPage";
import { DPDP_PRIVACY_SECTIONS } from "@/content/policies/dpdp-privacy";
import { COPYRIGHT_NOTICE } from "@/content/policies/company-meta";

function PolicyDataTable({ rows, columns }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td
                  key={column}
                  className="border border-gray-200 px-4 py-3 align-top text-gray-600"
                >
                  {row[column]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DpdpPrivacyContent() {
  return (
    <>
      {DPDP_PRIVACY_SECTIONS.map((section) => (
        <PolicySection key={section.title} title={section.title}>
          {section.paragraphs?.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {section.list ? <PolicyList items={section.list} /> : null}
          {section.table ? (
            <PolicyDataTable
              columns={["category", "data", "purpose"]}
              rows={section.table.map((row) => ({
                category: row.category,
                data: row.data,
                purpose: row.purpose,
              }))}
            />
          ) : null}
        </PolicySection>
      ))}
      <p className="text-sm text-gray-500 border-t border-gray-200 pt-6">
        {COPYRIGHT_NOTICE}
      </p>
    </>
  );
}
