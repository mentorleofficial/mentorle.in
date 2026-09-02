import { Shield } from "lucide-react";

export function PolicyMeta({ items }) {
  if (!items?.length) return null;

  return (
    <div className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-5 text-sm text-gray-700 space-y-1">
      {items.map((item) => (
        <p key={item.label}>
          <span className="font-semibold text-gray-900">{item.label}:</span>{" "}
          {item.value}
        </p>
      ))}
    </div>
  );
}

export function PolicySection({ title, children }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
      <div className="space-y-4 text-gray-600">{children}</div>
    </section>
  );
}

export function PolicySubsection({ title, children }) {
  return (
    <div className="mb-5">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <div className="space-y-3 text-gray-600">{children}</div>
    </div>
  );
}

export function PolicyList({ items }) {
  return (
    <ul className="list-disc pl-6 space-y-2">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default function PolicyPage({ title, subtitle, meta = [], children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm mt-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3">
            <Shield className="h-8 w-8 text-black mt-1 flex-shrink-0" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {subtitle ? (
                <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <PolicyMeta items={meta} />
            <div className="prose max-w-none">{children}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
