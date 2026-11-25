import type { Metadata } from "next";
import Link from "next/link";
import { StatusScreen } from "@/components/system/StatusScreen";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { notFoundCopy as copy } from "@/data/system";
import { prefetchFor } from "@/lib/routes";

export const metadata: Metadata = {
  title: copy.metaTitle,
  robots: { index: false },
};

// Any URL with no page (and pages that call notFound(), e.g. an unknown mentor or event).
export default function NotFound() {
  return (
    <StatusScreen
      eyebrow={copy.eyebrow}
      title={copy.title}
      body={copy.body}
      footer={
        <p className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <span>{copy.more}</span>
          {copy.links.map((link) => (
            <Link key={link.href} href={link.href} prefetch={prefetchFor(link.href)} className="text-white underline-offset-4 hover:underline">
              {link.label}
            </Link>
          ))}
        </p>
      }
    >
      <Link href={copy.primary.href} className={buttonClasses("brand")}>
        {copy.primary.label}
      </Link>
      <Link href={copy.secondary.href} prefetch={prefetchFor(copy.secondary.href)} className={buttonClasses("ghost")}>
        {copy.secondary.label}
      </Link>
    </StatusScreen>
  );
}
