"use client";

import { Manrope } from "next/font/google";
import { StatusScreen } from "@/components/system/StatusScreen";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { company } from "@/data/site";
import { errorCopy as copy } from "@/data/system";
import "./globals.css";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });

// Only when the root layout itself fails: it replaces the whole document, so it brings its own <html>, font and styles.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en" className={`${manrope.variable} h-full antialiased`}>
      <body className="min-h-full bg-ink font-sans">
        <StatusScreen eyebrow={copy.eyebrow} title={copy.title} body={copy.body} footer={<p>{copy.contact(company.support)}</p>}>
          <button type="button" onClick={reset} className={buttonClasses("brand")}>
            {copy.retry}
          </button>
          {/* A full page load, since the app itself failed. */}
          <a href={copy.home.href} className={buttonClasses("ghost")}>
            {copy.home.label}
          </a>
        </StatusScreen>
      </body>
    </html>
  );
}
