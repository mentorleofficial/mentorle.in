import type { CSSProperties } from "react";

type MaskIconProps = {
  src: string;
  className?: string;
  style?: CSSProperties;
};

// Paints a single-colour SVG with `currentColor`, so one asset works on light and dark surfaces.
export function MaskIcon({ src, className = "size-4", style: extraStyle }: MaskIconProps) {
  const style = {
    maskImage: `url("${src}")`,
    WebkitMaskImage: `url("${src}")`,
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskPosition: "center",
    WebkitMaskPosition: "center",
    maskSize: "contain",
    WebkitMaskSize: "contain",
    ...extraStyle,
  } as CSSProperties;

  return <span aria-hidden className={`inline-block shrink-0 bg-current ${className}`} style={style} />;
}
