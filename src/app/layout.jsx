import { Raleway } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import Head from "next/head";
import Script from "next/script";
import MicrosoftClarity from "@/components/Clarity";
import { Toaster } from "@/components/ui/toaster";
import GlobalFeedbackButton from "@/components/GlobalFeedbackButton";

// Font files can be colocated inside of `pages`
const myFont = localFont({ src: "./Kollektif.ttf" });

const raleway = Raleway({ subsets: ["latin"] });

export const metadata = {
  title: "Mentorle",
  description: "Connect with verified expert mentors who have real-world experience in IT, AI, cybersecurity, cloud computing, and more",
};

export default function RootLayout({ children }) {  return (
    <>
      <html lang="en" className="overflow-x-hidden">
        <body className="overflow-x-hidden max-w-full">
          {/* CRITICAL: Set password reset flag and redirect BEFORE any React code runs */}
          <Script
            id="prevent-reset-redirect"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  if (typeof window !== 'undefined') {
                    const hashParams = new URLSearchParams(window.location.hash.substring(1));
                    const hasRecoveryToken = hashParams.get('type') === 'recovery' || hashParams.has('access_token');
                    const currentPath = window.location.pathname;
                    
                    if (hasRecoveryToken || currentPath === '/reset-password') {
                      sessionStorage.setItem('isPasswordResetFlow', 'true');
                      
                      // If we have a recovery token but we're not on reset-password, redirect there
                      if (hasRecoveryToken && currentPath !== '/reset-password') {
                        const hash = window.location.hash;
                        window.location.href = '/reset-password' + hash;
                        return;
                      }
                      
                      // If we're on dashboard but have the flag, redirect to reset-password
                      if (currentPath.startsWith('/dashboard') && sessionStorage.getItem('isPasswordResetFlow') === 'true') {
                        const hash = window.location.hash;
                        window.location.href = '/reset-password' + hash;
                        return;
                      }
                    }
                  }
                })();
              `,
            }}
          />
          {children}
          <Toaster />
          <GlobalFeedbackButton />
        </body>
        <GoogleAnalytics gaId="G-HP61H76TFH" />
        <MicrosoftClarity />
      </html>
    </>
  );
}
