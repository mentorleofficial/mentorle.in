// Not-found (404) and error screens. No Figma: the account pages' dark band style, full height (SPEC-VS-DESIGN SY rows).

export const notFoundCopy = {
  metaTitle: "Page not found",
  eyebrow: "404",
  title: "This page doesn’t exist",
  body: "The link may be broken, or the page may have moved. Here are some places to start instead.",
  primary: { label: "Go to the homepage", href: "/" },
  secondary: { label: "Find a mentor", href: "/mentors" },
  more: "Or try",
  links: [
    { label: "Events & Summits", href: "/events" },
    { label: "Mentorle Plus", href: "/pricing" },
    { label: "Become a Mentor", href: "/become-a-mentor" },
  ],
};

export const errorCopy = {
  eyebrow: "Something went wrong",
  title: "We couldn’t load this page",
  body: "It’s probably a short hiccup on our side. Try again, or head back to the homepage.",
  retry: "Try again",
  home: { label: "Go to the homepage", href: "/" },
  contact: (email: string) => `If it keeps happening, write to us at ${email}.`,
};
