"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Spinner, outlineButtonClasses } from "@/components/forms/fields";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { useAuth } from "@/lib/auth/AuthProvider";

type GateCopy = { title: string; body: string; login: string; signup: string };
type ProfileGate = { title: string; body: string; cta: string };

// A bordered notice in the page column (signed out, profile unfinished).
export function AccountNotice({ title, body, children }: { title: string; body?: string; children?: ReactNode }) {
  return (
    <div className="animate-[auth-step-in_300ms_ease-out] border border-[#cbcbcb] bg-white p-6 motion-reduce:animate-none md:p-8">
      <h2 className="text-xl font-medium text-ink lg:text-2xl">{title}</h2>
      {body && <p className="mt-2 max-w-[34rem] text-base leading-snug text-ink-soft">{body}</p>}
      {children && <div className="mt-6 flex flex-wrap gap-3">{children}</div>}
    </div>
  );
}

export function AccountLoading({ label }: { label: string }) {
  return (
    <p className="flex items-center gap-3 py-10 text-sm text-muted" role="status">
      <Spinner />
      {label}
    </p>
  );
}

// Renders `children` for a signed-in mentee. Until the session is read it shows a spinner; signed out, a login
// prompt that returns here; with `profileGate`, an unfinished profile gets a "Finish your profile" prompt instead.
export function AccountGate({ path, loading, signedOut, profileGate, children }: { path: string; loading: string; signedOut: GateCopy; profileGate?: ProfileGate; children: ReactNode }) {
  const { status, onboarded } = useAuth();
  const redirect = encodeURIComponent(path);
  if (status === "loading") return <AccountLoading label={loading} />;
  if (status === "signed-out")
    return (
      <AccountNotice title={signedOut.title} body={signedOut.body}>
        <Link href={`/login?redirect=${redirect}`} className={buttonClasses("brand")}>
          {signedOut.login}
        </Link>
        <Link href={`/signup?redirect=${redirect}`} className={outlineButtonClasses()}>
          {signedOut.signup}
        </Link>
      </AccountNotice>
    );
  if (profileGate && !onboarded)
    return (
      <AccountNotice title={profileGate.title} body={profileGate.body}>
        <Link href={`/onboarding?redirect=${redirect}`} className={buttonClasses("brand")}>
          {profileGate.cta}
        </Link>
      </AccountNotice>
    );
  return <>{children}</>;
}
