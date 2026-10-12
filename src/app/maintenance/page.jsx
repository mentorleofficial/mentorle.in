import Image from "next/image";
import Countdown from "@/components/maintenance/Countdown";
import NewsletterForm from "@/components/maintenance/NewsletterForm";

export const metadata = {
  title: "Mentorle 3.0 is coming",
  description:
    "We're rebuilding Mentorle from the ground up. Sign up to be the first to know when Mentorle 3.0 launches.",
  robots: { index: false, follow: false },
};

export default async function MaintenancePage({ searchParams }) {
  const { subscribed } = await searchParams;

  return (
    <main
      data-page="maintenance"
      className="min-h-screen flex flex-col items-center bg-[#fbfbfb] px-4 sm:px-8"
    >
      <header className="w-full max-w-[77.5rem] flex justify-center sm:justify-start py-6 sm:py-8">
        <Image
          src="/mentorlelogo.png"
          width={180}
          height={180}
          alt="Mentorle"
          priority
          className="w-[11.25rem] h-auto"
        />
      </header>

      <section className="flex-1 w-full flex flex-col items-center justify-center text-center gap-8 sm:gap-10 py-10">
        <div className="max-w-2xl">
          <span className="inline-block rounded-full border border-gray-300 bg-white px-4 py-1.5 text-xs sm:text-sm font-semibold text-black/70">
            Launching 26 October 2026
          </span>
          <h1 className="mt-5 text-black text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight">
            Mentorle 3.0 is coming.
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-black/80 leading-relaxed">
            We&apos;re rebuilding Mentorle from the ground up. Leave your email
            and we&apos;ll let you know the moment we&apos;re live.
          </p>
        </div>

        <Countdown />

        {subscribed ? (
          <p className="text-base font-semibold text-black">
            Thanks for confirming — you&apos;re on the list.
          </p>
        ) : (
          <NewsletterForm />
        )}
      </section>

      <footer className="w-full py-6 flex flex-wrap justify-center gap-x-2 gap-y-1 text-center text-sm text-black/60">
        <span>
          Questions?{" "}
          <a href="mailto:mentorleofficial@gmail.com" className="underline hover:text-black">
            mentorleofficial@gmail.com
          </a>
        </span>
        <span aria-hidden="true" className="hidden sm:inline">·</span>
        <span className="whitespace-nowrap">© {new Date().getFullYear()} Mentorle</span>
      </footer>
    </main>
  );
}
