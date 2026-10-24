// "My sessions" (/sessions): a signed-in mentee's booked, past and cancelled sessions. No Figma: built from the
// site's patterns (legal-page header band, filter tabs, bordered cards; logged in SPEC-VS-DESIGN, MS rows).

export const sessionsCopy = {
  eyebrow: "Your account",
  title: "My sessions",
  subtitle: "Join upcoming sessions, add them to your calendar and look back at past ones.",
  tabs: { upcoming: "Upcoming", past: "Past" },
  count: (n: number) => (n === 1 ? "1 session" : `${n} sessions`),
  loading: "Loading your sessions…",
  error: "Couldn’t load your sessions. Please try again.",
  retry: "Try again",
  next: "Next session",
  now: "Happening now",
  with: "with",
  join: "Join session",
  copyLink: "Copy link",
  copied: "Copied",
  calendar: "Add to Google Calendar",
  viewMentor: "View mentor",
  notesLabel: "Your note",
  movedFrom: (when: string) => `Moved from ${when}`,
  cancelledReason: (reason: string) => `Reason: ${reason}`,
  status: { booked: "Booked", completed: "Completed", cancelled: "Cancelled", no_show: "Missed" } as Record<string, string>,
  // Placeholder copy (MS3): only the mentor or a Mentorle admin cancels or reschedules a session.
  final: "Booked times are final. If something comes up, your mentor or the Mentorle team can move or cancel a session, and you’ll get an email.",
  empty: {
    upcoming: { title: "No upcoming sessions", body: "Book a free session with a mentor to get started.", cta: "Find a mentor" },
    past: { title: "No past sessions yet", body: "Sessions you’ve had, or that were cancelled, show up here." },
  },
  gate: {
    signedOut: { title: "Log in to see your sessions", body: "Your booked sessions and meeting links are here once you’re signed in.", login: "Log in", signup: "Create an account" },
    finishProfile: { title: "Finish your profile", body: "Complete your profile to book sessions with mentors.", cta: "Finish your profile" },
  },
};
