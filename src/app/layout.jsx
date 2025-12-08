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
      <html lang="en">
        <body className={""}>
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
