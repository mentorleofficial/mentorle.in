// After Cashfree checkout (/payments/status): confirming the payment and what it bought. No Figma: the account
// pages' dark band and bordered notice (logged in SPEC-VS-DESIGN, PY rows).

export const paymentCopy = {
  eyebrow: "Payment",
  title: "Your payment",
  subtitle: "We confirm it with Cashfree and set everything up for you.",
  checking: "Confirming your payment…",
  slow: "This is taking longer than usual. You can leave this page: we’ll finish setting things up and email you.",
  missing: { title: "No payment to show", body: "Open this page from the link after checkout.", cta: "Go to My sessions" },
  signedOut: { title: "Log in to see your payment", body: "Log in with the account you paid from.", login: "Log in", signup: "Create an account" },
  error: { title: "Couldn’t check the payment", body: "Please try again in a moment.", retry: "Check again" },
  failed: { title: "The payment didn’t go through", body: "Nothing was charged, or it will be refunded automatically by your bank.", retry: "Try again" },
  refund: {
    title: "We couldn’t book that time",
    body: (amount: string) => `Someone else booked it while you were paying. Your ${amount} will be refunded, and the Mentorle team has been told.`,
    cta: "Pick another time",
  },
  session: { title: "You’re booked", body: "We’ve emailed you and your mentor the details and the meeting link.", cta: "Go to My sessions" },
  event: { title: "You’re registered", body: "We’ll send you the details before the event.", cta: "Back to the event" },
  membership: { title: (plan: string) => `Welcome to ${plan}`, body: (until: string) => `Your pass is active until ${until}.`, cta: "Find a mentor", account: "See your plan" },
  paid: (amount: string) => `Paid ${amount}`,
};

export const formatRupees = (amount: number) => `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
