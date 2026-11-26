import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Manrope } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";
import { ProfilePrompt } from "@/components/event/ProfilePrompt";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ScrollAnimations } from "@/components/motion/ScrollAnimations";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { SITE_URL } from "@/data/site";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const DESCRIPTION =
  "Mentorle connects you with experienced professionals and industry experts for practical guidance, honest insights, and meaningful conversations.";

// metadataBase makes the social preview (app/opengraph-image.jpg, twitter-image.jpg) and canonical links absolute.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Mentorle — Fast-track your growth with Industry Insiders",
    template: "%s | Mentorle",
  },
  description: DESCRIPTION,
  applicationName: "Mentorle",
  openGraph: {
    type: "website",
    siteName: "Mentorle",
    locale: "en_IN",
    url: "/",
    title: "Mentorle — Fast-track your growth with Industry Insiders",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Mentorle — Fast-track your growth with Industry Insiders",
    description: DESCRIPTION,
  },
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
        {/* Vercel Web Analytics: page views, cookie-free. Only on Vercel builds (VERCEL is set there), since its script
            exists only on Vercel and would 404 on every page elsewhere. It reads the route, hence Suspense. */}
        {process.env.VERCEL && (
          <Suspense fallback={null}>
            <Analytics debug={false} />
          </Suspense>
        )}
      </body>
    </html>
  );
}
