"use client";

import Link from "next/link";
import { useEffect } from "react";
import { StatusScreen } from "@/components/system/StatusScreen";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { company } from "@/data/site";
import { errorCopy as copy } from "@/data/system";

// A page that failed to load (the header and footer still show). "Try again" re-renders the page.
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[page error]", error.digest ?? error.message);
  }, [error]);

  return (
    <StatusScreen eyebrow={copy.eyebrow} title={copy.title} body={copy.body} footer={<p>{copy.contact(company.support)}</p>}>
      <button type="button" onClick={reset} className={buttonClasses("brand")}>
        {copy.retry}
      </button>
      <Link href={copy.home.href} className={buttonClasses("ghost")}>
        {copy.home.label}
      </Link>
    </StatusScreen>
  );
}
