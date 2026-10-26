import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";
import { ProfilePrompt } from "@/components/event/ProfilePrompt";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ScrollAnimations } from "@/components/motion/ScrollAnimations";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Mentorle — Fast-track your growth with Industry Insiders",
    template: "%s | Mentorle",
  },
  description:
    "Mentorle connects you with experienced professionals and industry experts for practical guidance, honest insights, and meaningful conversations.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({ children, auth }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${manrope.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col font-sans">
        {/* Adds .js-motion before paint so GSAP can reveal without a flash (skipped for reduced motion). */}
        <Script src="/motion-bootstrap.js" strategy="beforeInteractive" />
        <AuthProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          {auth}
          {/* After an event-mode quick signup only; uses usePathname(), hence Suspense. */}
          <Suspense fallback={null}>
            <ProfilePrompt />
          </Suspense>
        </AuthProvider>
        {/* usePathname() is URL data on dynamic routes (/events/[slug]); Cache Components needs it inside Suspense.
            It renders nothing, so the fallback is empty. */}
        <Suspense fallback={null}>
          <ScrollAnimations />
        </Suspense>
        <SmoothScroll />
      </body>
    </html>
  );
}
