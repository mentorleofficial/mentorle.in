import { SectionHeader } from "@/components/ui/SectionHeader";
import { becomeAMentorPage } from "@/data/become-a-mentor";

export function EarningsTable() {
  const { takeHome } = becomeAMentorPage;

  return (
    <div className="mt-20 lg:mt-[8.5rem]">
      <SectionHeader id="take-home-title" eyebrow={takeHome.eyebrow} title={takeHome.title} description={takeHome.description} />

      <table data-animate="fade-up" className="mt-12 w-full border-collapse text-ink md:mt-16" aria-labelledby="take-home-title">
        <thead className="hidden md:table-header-group">
          <tr className="border-y border-line">
            <th scope="col" className="py-[1.875rem] text-left text-xl font-normal">
              {takeHome.columns.format}
            </th>
            <th scope="col" className="py-[1.875rem] text-center text-xl font-normal">
              {takeHome.columns.pays}
            </th>
            <th scope="col" className="py-[1.875rem] text-right text-xl font-normal">
              {takeHome.columns.keep}
            </th>
          </tr>
        </thead>
        <tbody className="border-t border-line md:border-t-0">
          {takeHome.rows.map((row) => (
            <tr key={row.format} className="grid grid-cols-2 border-b border-line py-5 md:table-row md:py-0">
              <th scope="row" className="col-span-2 text-left font-normal md:w-1/3 md:py-8">
                <span className="block text-xl font-medium md:text-2xl">{row.format}</span>
                <span className="mt-1.5 block text-sm md:text-base">{row.detail}</span>
              </th>
              <td className="mt-3 text-base text-muted md:mt-0 md:w-1/3 md:py-8 md:text-center md:align-top md:text-2xl md:text-ink">
                <span className="text-sm text-muted md:hidden">{takeHome.columns.pays}: </span>
                {row.pays}
              </td>
              <td className="mt-3 text-right text-xl font-semibold md:mt-0 md:w-1/3 md:py-8 md:align-top md:text-[2rem] md:leading-tight">
                <span className="sr-only md:hidden">{takeHome.columns.keep}: </span>
                {row.keep}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
