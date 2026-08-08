import { Raleway } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import MicrosoftClarity from "@/components/Clarity";
import { Toaster } from "@/components/ui/toaster";

// Font files can be colocated inside of `pages`
const myFont = localFont({ src: "./Kollektif.ttf" });

const raleway = Raleway({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true
});

export const metadata = {
  title: "Mentorle",
  description: "Connect with verified expert mentors who have real-world experience in IT, AI, cybersecurity, cloud computing, and more",
};

export default function RootLayout({ children }) {
  return (
    <>
      <html lang="en" className="overflow-x-hidden">
        <body className="overflow-x-hidden max-w-full">
          {children}
          <Toaster />
        </body>
        <GoogleAnalytics gaId="G-HP61H76TFH" />
        <MicrosoftClarity />
      </html>
    </>
  );
}
