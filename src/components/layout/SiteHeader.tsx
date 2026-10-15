"use client";

import Image from "next/image";
import Link from "next/link";
import { prefetchFor } from "@/lib/routes";
import { useState } from "react";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { AccountLinks, AccountMenu, Avatar } from "@/components/layout/AccountMenu";
import { accountNav, primaryNav } from "@/data/site";
import { useAuth } from "@/lib/auth/AuthProvider";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const { status, user, onboarded, signOut } = useAuth();
  const signedIn = status === "signed-in" && user;

  return (
    <header className="absolute inset-x-0 top-0 z-50 pt-4 md:pt-8 xl:pt-[3.125rem]">
      <div className="container-page">
        {/* Animate the bar itself: fading an ancestor would disable its backdrop blur until the fade completes. */}
        <div data-hero="0" className="relative flex h-16 items-center justify-between border border-white/5 bg-black/20 px-4 backdrop-blur-[6px] md:h-[5.4375rem] md:px-[1.875rem]">
          {/* Hidden until the session is read, so signed-in users don't see Login flash before their avatar. */}
          <div className={`hidden items-center gap-[0.625rem] transition-opacity duration-300 lg:flex ${status === "loading" ? "opacity-0" : ""}`}>
            {signedIn ? (
              <AccountMenu />
            ) : (
              <>
                <Link href={accountNav.newHere.href} prefetch={prefetchFor(accountNav.newHere.href)} className={buttonClasses("light")}>
                  {accountNav.newHere.label}
                </Link>
                <Link href={accountNav.login.href} prefetch={prefetchFor(accountNav.login.href)} className={buttonClasses("ghost", "bg-transparent")}>
                  {accountNav.login.label}
                </Link>
              </>
            )}
          </div>

          <Link
            href="/"
            aria-label="Mentorle home"
            className="lg:absolute lg:left-1/2 lg:-translate-x-1/2"
            onClick={close}
          >
            <Image src="/homepage/logo.svg" alt="Mentorle" width={187} height={48} loading="eager" className="h-9 w-auto md:h-12" />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-6">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    prefetch={prefetchFor(item.href)}
                    className="relative text-[0.9375rem] text-white/90 transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-white after:transition-transform after:duration-300 hover:text-white hover:after:scale-x-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <button
            type="button"
            className="flex size-10 items-center justify-center text-white lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 7h18M3 12h18M3 17h18" />}
            </svg>
          </button>
        </div>

        <div
          id="mobile-menu"
          className={`grid border-white/5 bg-black/80 backdrop-blur-md transition-[grid-template-rows,opacity] duration-300 ease-out lg:hidden ${
            open ? "grid-rows-[1fr] border border-t-0 opacity-100" : "pointer-events-none grid-rows-[0fr] opacity-0"
          }`}
          inert={!open}
        >
          <div className="overflow-hidden">
            <div className="px-4 pt-2 pb-5 md:px-[1.875rem]">
              <nav aria-label="Mobile">
                <ul className="flex flex-col">
                  {primaryNav.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        prefetch={prefetchFor(item.href)}
                        onClick={close}
                        className="block border-b border-white/10 py-3 text-base text-white/90 hover:text-white"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              {status === "loading" ? null : signedIn ? (
                <div className="mt-4">
                  <div className="flex items-center gap-3 pb-2">
                    <Avatar name={user.full_name} url={user.avatar_url} />
                    <div className="min-w-0">
                      <p className="truncate text-sm text-white">{user.full_name}</p>
                      <p className="truncate text-xs text-white/60">{user.email}</p>
                    </div>
                  </div>
                  <AccountLinks
                    onboarded={onboarded}
                    onNavigate={close}
                    onSignOut={() => void signOut()}
                    itemClassName="block w-full border-b border-white/10 py-3 text-left text-base text-white/90 hover:text-white"
                  />
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-2 gap-[0.625rem] sm:max-w-sm">
                  <Link href={accountNav.newHere.href} prefetch={prefetchFor(accountNav.newHere.href)} onClick={close} className={buttonClasses("light")}>
                    {accountNav.newHere.label}
                  </Link>
                  <Link href={accountNav.login.href} prefetch={prefetchFor(accountNav.login.href)} onClick={close} className={buttonClasses("ghost")}>
                    {accountNav.login.label}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
