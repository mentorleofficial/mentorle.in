import { useMemo } from "react";

export type LoopSlide<T> = { item: T; key: string; sourceIndex: number };

export function useCarouselLoop<T>(items: T[], minSlides: number): LoopSlide<T>[] {
  return useMemo(() => {
    const copies = Math.max(1, Math.ceil(minSlides / items.length));
    return Array.from({ length: items.length * copies }, (_, index) => ({
      item: items[index % items.length],
      key: `slide-${index}`,
      sourceIndex: index % items.length,
    }));
  }, [items, minSlides]);
}
