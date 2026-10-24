import type { BookingRules } from "@/data/mentor-details";

// Booking dialog on mentor profiles (/mentors/<slug>, "Book a Session" on a session card). No Figma: built in the
// auth dialogs' style (logged in SPEC-VS-DESIGN, BK rows). Times are always IST, like the platform.

const hours = (n: number) => (n === 1 ? "1 hour" : `${n} hours`);

export const bookingCopy = {
  close: "Close",
  pick: {
    title: "Pick a time",
    subtitle: (mentor: string) => `Book a session with ${mentor}.`,
    timezone: "All times are in IST",
    loading: "Finding open times…",
    empty: "No open times in the next 90 days. Check back soon.",
    error: "Couldn’t load open times. Please try again.",
    retry: "Try again",
    chooseDay: "Choose a day to see open times.",
    times: (day: string) => `Open times on ${day}`,
    previousMonth: "Previous month",
    nextMonth: "Next month",
    weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    next: "Continue",
  },
  confirm: {
    title: "Confirm your session",
    notesLabel: "What would you like to discuss? (optional)",
    notesPlaceholder: "A line or two helps the mentor prepare.",
    submit: "Confirm Booking",
    submitting: "Booking…",
    back: "Change time",
    signIn: "Create a free account or log in to book. We’ll bring you back to this time.",
    signInCta: "Sign up to book",
    finishProfile: "Finish your profile to book. It takes about two minutes.",
    finishProfileCta: "Finish your profile",
    mentorAccount: "Mentor and admin accounts can’t book sessions.",
  },
  done: {
    title: "You’re booked",
    subtitle: (mentor: string) => `We’ve emailed you and ${mentor} the details.`,
    join: "Meeting link",
    copy: "Copy link",
    copied: "Copied",
    calendar: "Add to Google Calendar",
    close: "Done",
  },
  rules: (rules: BookingRules | null) => {
    if (!rules) return [];
    const cancel =
      rules.cancellationNoticeHours > 0 ? `Free cancellation up to ${hours(rules.cancellationNoticeHours)} before.` : "Free cancellation any time before it starts.";
    const reschedule = !rules.allowReschedule
      ? "This mentor doesn’t allow rescheduling."
      : rules.rescheduleNoticeHours > 0
        ? `You can reschedule once, up to ${hours(rules.rescheduleNoticeHours)} before.`
        : "You can reschedule once, any time before it starts.";
    return [cancel, reschedule];
  },
  errors: {
    taken: "That time was just taken. Please pick another.",
    generic: "Couldn’t book this session. Please try again.",
  },
  // Session cards
  card: {
    unavailable: "Not taking bookings yet",
    // Placeholder: paid sessions need checkout (after the Mentorle Plus decisions).
    paidSoon: "Paid booking opens soon",
  },
};
