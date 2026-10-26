"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { outlineButtonClasses } from "@/components/forms/fields";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { SiteDialog } from "@/components/ui/SiteDialog";
import { profilePromptCopy as copy } from "@/data/event";
import { useAuth } from "@/lib/auth/AuthProvider";

// After an event-mode quick signup: a one-time "complete your profile" dialog over whatever page they land on.
// Skippable; the profile can be finished later from Account (booking a session still asks for it).
const KEY = "mentorle-profile-prompt";

export function markProfilePrompt() {
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {
    // storage blocked: no prompt, the profile can still be completed from Account
  }
}

export function ProfilePrompt() {
  const { status, user, onboarded } = useAuth();
  const pathname = usePathname();
  const titleId = useId();
  const [wanted, setWanted] = useState(false);

  useEffect(() => {
    if (status !== "signed-in") return;
    try {
      const pending = sessionStorage.getItem(KEY) === "1";
      if (pending && onboarded) sessionStorage.removeItem(KEY);
      queueMicrotask(() => setWanted(pending && !onboarded));
    } catch {
      // storage blocked
    }
  }, [status, onboarded]);

  if (!wanted || status !== "signed-in" || pathname.startsWith("/onboarding")) return null;

  const dismiss = () => {
    try {
      sessionStorage.removeItem(KEY);
    } catch {
      // storage blocked
    }
    setWanted(false);
  };
  const firstName = (user?.full_name ?? "").trim().split(/\s+/)[0] ?? "";

  return (
    <SiteDialog titleId={titleId} closeLabel={copy.close} onClose={dismiss}>
      <div className="text-center">
        <h2 id={titleId} className="text-[1.75rem] leading-tight font-medium text-ink md:text-[2rem]">
          {copy.title(firstName)}
        </h2>
        <p className="mx-auto mt-3 max-w-[26rem] text-base leading-snug text-ink-soft">{copy.body}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <Link href={`/onboarding?redirect=${encodeURIComponent(pathname)}`} onClick={dismiss} className={buttonClasses("brand")}>
            {copy.cta}
          </Link>
          <button type="button" onClick={dismiss} className={outlineButtonClasses()}>
            {copy.later}
          </button>
        </div>
      </div>
    </SiteDialog>
  );
}
