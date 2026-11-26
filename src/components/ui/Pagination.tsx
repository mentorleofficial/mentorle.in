"use client";

// Page numbers for long lists, in the filter bar's style: square 37px buttons, the current page in ink, ‹ › arrows.
// Shows the first and last page, the pages around the current one, and "…" for the gaps.
type PaginationProps = {
  page: number; // 1-based
  pageCount: number;
  onChange: (page: number) => void;
  label: string; // the nav's accessible name
  summary?: string; // e.g. "Showing 13–24 of 101"
};

const pages = (page: number, count: number): (number | "gap")[] => {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  const around = [page - 1, page, page + 1].filter((n) => n > 1 && n < count);
  const list: (number | "gap")[] = [1];
  if (around[0] > 2) list.push("gap");
  list.push(...around);
  if (around[around.length - 1] < count - 1) list.push("gap");
  list.push(count);
  return list;
};

const base =
  "inline-flex h-[2.3125rem] min-w-[2.3125rem] items-center justify-center border px-3 text-sm tabular-nums transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

export function Pagination({ page, pageCount, onChange, label, summary }: PaginationProps) {
  if (pageCount <= 1) return summary ? <p className="text-center text-sm text-ink-soft">{summary}</p> : null;
  const arrow = (direction: -1 | 1) => {
    const target = page + direction;
    const disabled = target < 1 || target > pageCount;
    return (
      <button
        type="button"
        onClick={() => onChange(target)}
        disabled={disabled}
        aria-label={direction < 0 ? "Previous page" : "Next page"}
        className={`${base} border-[#dadada] text-ink hover:border-ink disabled:pointer-events-none disabled:opacity-35`}
      >
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-4" aria-hidden>
          <path d={direction < 0 ? "M10 3L5 8l5 5" : "M6 3l5 5-5 5"} />
        </svg>
      </button>
    );
  };

  return (
    <nav aria-label={label} className="flex flex-col items-center gap-4">
      <ul className="flex flex-wrap items-center justify-center gap-2">
        <li>{arrow(-1)}</li>
        {pages(page, pageCount).map((entry, index) =>
          entry === "gap" ? (
            <li key={`gap-${index}`} aria-hidden className="px-1 text-sm text-ink-soft">
              …
            </li>
          ) : (
            <li key={entry}>
              <button
                type="button"
                onClick={() => onChange(entry)}
                aria-current={entry === page ? "page" : undefined}
                aria-label={`Page ${entry}`}
                className={`${base} ${entry === page ? "border-ink bg-ink text-white" : "border-[#dadada] text-ink hover:border-ink"}`}
              >
                {entry}
              </button>
            </li>
          ),
        )}
        <li>{arrow(1)}</li>
      </ul>
      {summary && <p className="text-sm text-ink-soft">{summary}</p>}
    </nav>
  );
}
