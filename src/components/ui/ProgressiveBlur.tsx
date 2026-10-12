type ProgressiveBlurProps = {
  active?: boolean;
  className?: string;
};

const layers = [
  { blur: "backdrop-blur-[2px]", mask: "[mask-image:linear-gradient(to_bottom,transparent_0%,black_35%)]" },
  { blur: "backdrop-blur-[6px]", mask: "[mask-image:linear-gradient(to_bottom,transparent_20%,black_60%)]" },
  { blur: "backdrop-blur-[12px]", mask: "[mask-image:linear-gradient(to_bottom,transparent_40%,black_80%)]" },
  { blur: "backdrop-blur-[20px]", mask: "[mask-image:linear-gradient(to_bottom,transparent_60%,black_100%)]" },
];

// Must not sit inside an element whose opacity, filter or clip-path animates: those disable backdrop-filter until they settle.
export function ProgressiveBlur({ active = true, className = "" }: ProgressiveBlurProps) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-x-0 bottom-0 ${className}`}>
      {layers.map((layer) => (
        <div
          key={layer.blur}
          className={`absolute inset-0 transition-[backdrop-filter] duration-700 ease-out ${layer.mask} ${active ? layer.blur : "backdrop-blur-none"}`}
        />
      ))}
      <div
        className={`absolute inset-0 bg-gradient-to-b from-transparent via-ink/20 to-ink/65 transition-opacity duration-700 ${active ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
