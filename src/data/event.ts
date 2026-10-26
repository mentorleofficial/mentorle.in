// Event mode (switched on by admins on the platform): quick signup with no email code, the "complete your profile"
// prompt, and the public live page (/live): a waiting screen, the lucky-draw countdown and each viewer's own result
// (no names or counts; the wheel itself is on the admin's projected screen). No Figma: built from the account pages' dark
// band, bordered cards and the auth dialog (logged in SPEC-VS-DESIGN, EV rows). The two result lines are the client's.

export const quickSignupCopy = {
  title: "Join Mentorle",
  subtitle: "Sign up in seconds. No code to enter.",
  submit: "Create account",
  submitting: "Creating your account…",
  checking: "One moment…",
  errors: {
    phoneTaken: "This phone number is already registered for the event.",
    eventOff: "Quick signup has just ended. Please sign up the usual way.",
    rateLimited: "Too many signups from this network. Please try again in a few minutes.",
  },
};

export const profilePromptCopy = {
  title: (firstName: string) => (firstName ? `Welcome to Mentorle, ${firstName}!` : "Welcome to Mentorle!"),
  body: "Complete your profile so mentors know what you’re looking for. It takes about two minutes, and you can do it later from your account.",
  cta: "Complete profile",
  later: "Later",
  close: "Close",
};

// /live?preview=… (local or test sites only): made-up data for checking every screen.
export const livePreviewCopy = {
  label: "Preview",
  exit: "Exit preview",
  eventName: "Mentorle Meetup (preview)",
  firstName: "Riya",
  states: [
    ["waiting", "Waiting (signed out)"],
    ["entered", "Waiting (in the draw)"],
    ["countdown", "Countdown"],
    ["won", "Winner"],
    ["lost", "Better luck next time"],
    ["not-entered", "Not in the draw"],
    ["signed-out-result", "Result, signed out"],
    ["ended", "Event ended"],
    ["no-event", "No event on"],
  ],
} as const;

export const liveCopy = {
  metaTitle: "Live",
  eyebrow: "Lucky draw",
  live: "Live",
  fallbackTitle: "Mentorle Live",
  waiting: { title: "The winner will be revealed soon", body: "Keep this page open. When the draw starts you’ll see a countdown here, then your result." },
  entered: (firstName: string) => (firstName ? `You’re in the draw, ${firstName}` : "You’re in the draw"),
  notEntered: "Only people who joined Mentorle at the event are in this draw.",
  loading: "One moment…",
  noEvent: { title: "Nothing live right now", body: "This page comes alive during Mentorle events.", cta: "Find a mentor" },
  ended: "Signups for this event have closed.",
  join: { prompt: "Join Mentorle now to take part.", cta: "Join Mentorle", login: "Log in" },
  error: "Can’t reach Mentorle right now. Retrying…",
  countdown: { label: "The lucky draw is on", sub: "Is it you?" },
  result: {
    won: { title: "In a Crowd of 1000s we found you", body: "You’ve won the lucky draw! Find the Mentorle team to collect your surprise gift." },
    lost: { title: "Better luck next time!", body: "Thanks for joining Mentorle. Your mentors are waiting." },
    notEntered: { title: "The winner has been picked", body: "Only people who joined during the event were in the draw." },
    signedOut: { title: "The winner has been picked", body: "Log in to see if it’s you.", cta: "Log in" },
    checking: "Checking…",
    close: "Close",
    explore: "Find a mentor",
  },
};
