"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { BookingDialog } from "@/components/booking/BookingDialog";
import { bookingCopy } from "@/data/booking";
import type { BookingRules, MentorOffering } from "@/data/mentor-details";

type BookButtonProps = {
  mentor: { userId: string; fullName: string; slug: string };
  offering: MentorOffering;
  rules: BookingRules | null;
  label: string;
  className: string;
};

// "Book a Session" on a session card: opens the booking dialog. ?book=<offering>&at=<time> (set when signup or
// onboarding sends someone back here) reopens it at that time. Paid offerings and mentors without open times
// get a disabled note instead.
export function BookButton({ mentor, offering, rules, label, className }: BookButtonProps) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const resume = params.get("book") === offering.id ? params.get("at") : null;
  const [open, setOpen] = useState(false);
  const isOpen = open || resume !== null;

  const close = () => {
    setOpen(false);
    // Drop ?book=&at= so a refresh doesn't reopen the dialog.
    if (resume !== null) router.replace(pathname, { scroll: false });
  };

  if (offering.price > 0 || !offering.hasOpenTimes) {
    return (
      <p className="inline-flex h-11 items-center border border-[#dadada] px-5 text-sm text-ink-soft">
        {offering.price > 0 ? bookingCopy.card.paidSoon : bookingCopy.card.unavailable}
      </p>
    );
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className} aria-haspopup="dialog">
        {label} <span aria-hidden>→</span>
        <span className="sr-only">: {offering.title}</span>
      </button>
      {isOpen && <BookingDialog mentor={mentor} offering={offering} rules={rules} initialStartsAt={resume} onClose={close} />}
    </>
  );
}
