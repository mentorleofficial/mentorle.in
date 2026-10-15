import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Suspense } from "react";
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

// Hides animated elements before hydration so GSAP can reveal them without a flash; skipped for reduced motion.
const motionBootstrap = `if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('js-motion')}`;

export default function RootLayout({ children, auth }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${manrope.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBootstrap }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <AuthProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          {auth}
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
