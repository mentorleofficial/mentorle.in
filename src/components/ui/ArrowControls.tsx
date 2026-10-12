type ArrowControlsProps = {
  onPrev: () => void;
  onNext: () => void;
  canPrev?: boolean;
  canNext?: boolean;
  label: string;
  className?: string;
  size?: "sm" | "md";
};

function Arrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      {direction === "left" ? <path d="M20 12H4m6-6l-6 6 6 6" /> : <path d="M4 12h16m-6-6l6 6-6 6" />}
    </svg>
  );
}

export function ArrowControls({
  onPrev,
  onNext,
  canPrev = true,
  canNext = true,
  label,
  className = "",
  size = "md",
}: ArrowControlsProps) {
  const button =
    size === "sm"
      ? "group flex size-[2.5625rem] items-center justify-center text-white disabled:cursor-not-allowed disabled:opacity-40 [&_svg]:size-6"
      : "group flex h-[4.125rem] w-[4.3125rem] items-center justify-center text-white disabled:cursor-not-allowed disabled:opacity-40 [&_svg]:size-8";
  const icon = "transition-transform duration-300 ease-out";

  return (
    <div role="group" aria-label={label} className={`inline-flex bg-brand ${className}`}>
      <button type="button" className={button} onClick={onPrev} disabled={!canPrev} aria-label="Previous">
        <span className={`${icon} opacity-60 group-enabled:group-hover:-translate-x-1 group-enabled:group-hover:opacity-100`}>
          <Arrow direction="left" />
        </span>
      </button>
      <button type="button" className={button} onClick={onNext} disabled={!canNext} aria-label="Next">
        <span className={`${icon} group-enabled:group-hover:translate-x-1`}>
          <Arrow direction="right" />
        </span>
      </button>
    </div>
  );
}
