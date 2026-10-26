import type { Metadata } from "next";
import { LiveRoute } from "@/components/event/LivePreview";
import { liveCopy } from "@/data/event";

export const metadata: Metadata = {
  title: liveCopy.metaTitle,
  robots: { index: false },
};

// Live signups and the lucky-draw countdown during an event. Everything is read in the browser (it changes every
// few seconds), so the page itself is static. ?preview=<state> shows each screen with made-up data (local or test
// sites only).
export default function LivePage() {
  return <LiveRoute />;
}
