import type { Metadata } from "next";
import { LiveBoard } from "@/components/event/LiveBoard";
import { liveCopy } from "@/data/event";

export const metadata: Metadata = {
  title: liveCopy.metaTitle,
  robots: { index: false },
};

// Live signups and the lucky-draw countdown during an event. Everything is read in the browser (it changes every
// few seconds), so the page itself is static.
export default function LivePage() {
  return <LiveBoard />;
}
