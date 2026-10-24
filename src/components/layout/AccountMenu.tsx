"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { accountMenu } from "@/data/auth";
import { useAuth } from "@/lib/auth/AuthProvider";
import { initialsOf } from "@/lib/initials";
import { prefetchFor } from "@/lib/routes";

export function Avatar({ name, url, className = "size-[2.3125rem] text-sm" }: { name: string; url: string | null; className?: string }) {
  return url ? (
    // Data/remote URLs from the profile; next/image isn't needed for a 37px avatar.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt="" className={`shrink-0 object-cover ${className}`} />
  ) : (
    <span className={`flex shrink-0 items-center justify-center bg-brand font-semibold text-white ${className}`} aria-hidden>
      {initialsOf(name)}
    </span>
  );
}

const menuItemClasses = "block w-full px-4 py-2.5 text-left text-sm text-ink transition-colors hover:bg-surface focus-visible:bg-surface focus-visible:outline-none";

// Signed-in replacement for the header's "I'm new here ?" / "Login" buttons (desktop).
export function AccountMenu() {
  const { user, onboarded, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!user) return null;
  const firstName = user.full_name.split(" ")[0] || user.email;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`${accountMenu.label}: ${user.full_name}`}
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2.5 text-[0.9375rem] text-white/90 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <Avatar name={user.full_name} url={user.avatar_url} />
        <span className="max-w-[9rem] truncate">{firstName}</span>
        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" className={`size-3 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden>
          <path d="M2.5 4.5L6 8l3.5-3.5" />
        </svg>
      </button>
      {open && (
        <div id={menuId} className="absolute top-full left-0 mt-3 w-60 animate-[auth-step-in_200ms_ease-out] bg-white py-2 shadow-[0_0.75rem_2rem_rgb(0_0_0/0.18)]">
          <p className="truncate border-b border-line px-4 pt-1 pb-3 text-xs text-muted">{user.email}</p>
          <AccountLinks onboarded={onboarded} onNavigate={() => setOpen(false)} onSignOut={() => void signOut()} itemClassName={menuItemClasses} />
        </div>
      )}
    </div>
  );
}

export function AccountLinks({ onboarded, onNavigate, onSignOut, itemClassName }: { onboarded: boolean; onNavigate: () => void; onSignOut: () => void; itemClassName: string }) {
  const links = [onboarded ? accountMenu.findMentor : accountMenu.completeProfile, accountMenu.sessions, accountMenu.account];
  return (
    <ul>
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} prefetch={prefetchFor(link.href)} onClick={onNavigate} className={itemClassName}>
            {link.label}
          </Link>
        </li>
      ))}
      <li>
        <button
          type="button"
          onClick={() => {
            onNavigate();
            onSignOut();
          }}
          className={itemClassName}
        >
          {accountMenu.logout}
        </button>
      </li>
    </ul>
  );
}
