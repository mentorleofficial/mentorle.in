const STAR = "M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z";

export function StarIcon({ filled, className = "size-4", filledClass = "text-brand", emptyClass = "text-line" }: { filled: boolean; className?: string; filledClass?: string; emptyClass?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${className} ${filled ? filledClass : emptyClass}`} aria-hidden>
      <path d={STAR} fill="currentColor" />
    </svg>
  );
}

// A read-only 1–5 rating in brand stars, with the value for screen readers.
export function Stars({ value, label, className = "size-4" }: { value: number; label: string; className?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={label}>
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon key={star} filled={star <= value} className={className} />
      ))}
    </span>
  );
}
