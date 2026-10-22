import Image from "next/image";
import { MaskIcon } from "@/components/ui/MaskIcon";
import type { ImageAsset } from "@/data/home";

type IconCardProps = {
  icon: ImageAsset;
  title: string;
  description: string;
  tone?: "light" | "dark";
  className?: string;
};

// Pixel-icon card: icon at the top, title and description pinned to the bottom. On dark sections the
// icon is painted light via MaskIcon, so the grey icon files can be reused. Icons keep their own size
// (designed at 1px = 1 design px) and sit vertically centred in a 69px slot, so a short icon like the
// homepage's </> doesn't get stretched to the full slot height.
export function IconCard({ icon, title, description, tone = "light", className = "" }: IconCardProps) {
  const dark = tone === "dark";
  // Below lg everything renders at 80%.
  const iconSize = { height: `calc(${icon.height / 16}rem * var(--icon-scale))` };

  return (
    <article
      className={`group flex flex-col border px-5 pt-7 pb-6 transition-[border-color,background-color] duration-300 lg:px-6 lg:pt-8 ${
        dark ? "border-white/25 hover:border-white/50" : "border-[#cbcbcb] hover:border-ink/40 hover:bg-white"
      } ${className}`}
    >
      <div className="flex h-14 items-center self-start [--icon-scale:0.8] lg:h-[4.3125rem] lg:[--icon-scale:1]">
        {dark ? (
          <MaskIcon
            src={icon.src}
            className="text-[#d9d9d9] transition-transform duration-500 ease-out group-hover:-translate-y-1"
            style={{ ...iconSize, aspectRatio: `${icon.width} / ${icon.height}` }}
          />
        ) : (
          <Image
            src={icon.src}
            alt=""
            width={icon.width}
            height={icon.height}
            style={iconSize}
            className="w-auto transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:scale-105"
          />
        )}
      </div>
      <div className="mt-auto pt-12">
        <h3 className={`text-xl font-medium whitespace-pre-line lg:text-2xl ${dark ? "text-white" : "text-ink"}`}>{title}</h3>
        <p className={`mt-2 text-sm leading-snug lg:text-base ${dark ? "text-white/90" : "text-ink"}`}>{description}</p>
      </div>
    </article>
  );
}
