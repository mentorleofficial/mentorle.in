// Copy for the mentee onboarding wizard (/onboarding). Steps, limits and suggestions mirror the Mentorle
// platform's wizard (../Mentorle-Version2/src/pages/MenteeOnboarding.tsx). No Figma design exists yet; the steps
// run inside the login/signup modal card (logged in SPEC-VS-DESIGN).

export const onboardingLimits = {
  headline: 160,
  bio: 600,
  goalsMin: 20,
  goals: 800,
  academic: 500,
  interestsMin: 3,
  interestsMax: 20,
  areasMin: 1,
  areasMax: 15,
  chip: 40,
};

export const onboardingSteps = [
  { title: "Welcome", subtitle: "Let’s set up your profile so mentors get to know you." },
  { title: "About you", subtitle: "A short headline and bio help mentors understand your context." },
  { title: "Your goals", subtitle: "What do you want to achieve through mentorship?" },
  { title: "Interests & skills", subtitle: "Add at least 3. These help us match you with the right mentors." },
  { title: "Who do you want to learn from?", subtitle: "Pick the areas you want guidance in." },
  { title: "Review & finish", subtitle: "Looks good? You can edit any of this later from your profile." },
] as const;

export const onboardingCopy = {
  stepOf: (step: number, total: number) => `Step ${step} of ${total}`,
  back: "Back",
  next: "Continue",
  finish: "Finish & explore mentors",
  saving: "Saving…",
  saveExit: "Save & exit",
  draftSaved: "Draft saved. Pick up where you left off any time.",
  optional: "(optional)",
  goalsMin: `(min ${onboardingLimits.goalsMin} characters)`,
  photo: { change: "Change photo", add: "Add a photo", hint: "JPG, PNG or WebP, up to 5 MB.", tooLarge: "Choose an image under 5 MB.", notImage: "Choose a JPG, PNG or WebP image." },
  emailNote: (email: string) => ({ before: "Your email", email, after: "is taken from your sign-up." }),
  fields: {
    fullName: { label: "Full name", placeholder: "Jane Doe" },
    headline: { label: "Headline", placeholder: "e.g. Final-year CS student exploring product roles" },
    bio: { label: "About you", placeholder: "A couple of sentences about your background…" },
    organization: { label: "College / company", placeholder: "e.g. IIT Delhi, or Infosys – Platform team" },
    goals: { label: "What do you want to achieve?", placeholder: "e.g. Land a product role within 12 months, get feedback on my portfolio, prepare for interviews…" },
    academic: { label: "Academic details", placeholder: "e.g. B.Tech Computer Science, Class of 2027" },
    interests: { label: "Your interests & skills", placeholder: "Type an interest and press Enter" },
    areas: { label: "Areas you want guidance in", placeholder: "Type an area and press Enter" },
    linkedin: { label: "LinkedIn URL", placeholder: "https://www.linkedin.com/in/your-handle" },
    github: { label: "GitHub profile", placeholder: "https://github.com/your-username" },
    portfolio: { label: "Portfolio URL", placeholder: "https://your-portfolio.com" },
  },
  chips: { add: "Add", remove: (value: string) => `Remove ${value}`, suggestions: "Suggestions:", count: (n: number, min: number) => `${n} added · at least ${min}` },
  review: {
    name: "Name",
    headline: "Headline",
    organization: "College / company",
    bio: "About",
    goals: "Goals",
    academic: "Academic details",
    interests: "Interests",
    areas: "Preferred mentor areas",
    linkedin: "LinkedIn",
    github: "GitHub",
    portfolio: "Portfolio",
    edit: "Edit",
  },
  errors: {
    fullName: "Please enter your full name.",
    headline: `Keep your headline under ${onboardingLimits.headline} characters.`,
    bio: `Keep your bio under ${onboardingLimits.bio} characters.`,
    goals: `Tell mentors a bit more (at least ${onboardingLimits.goalsMin} characters).`,
    interests: `Add at least ${onboardingLimits.interestsMin} interests.`,
    interestsMax: `That’s plenty. Keep it under ${onboardingLimits.interestsMax}.`,
    areas: "Pick at least one area.",
    areasMax: `Keep it under ${onboardingLimits.areasMax}.`,
    linkedin: "Must be a linkedin.com/in/… URL.",
    github: "Must be a github.com/… URL.",
    portfolio: "Must be a valid URL.",
    save: "Couldn’t save. Please try again.",
  },
  done: "You’re all set. Welcome aboard!",
  signedOut: { title: "Log in to set up your profile", body: "Your profile tells mentors who you are and what you’re working towards.", login: "Log In", signup: "Create an account" },
  loading: "Loading your profile…",
};

export const interestSuggestions = [
  "Product Management", "Design", "Engineering", "Data", "AI/ML",
  "Marketing", "Sales", "Leadership", "Career Growth", "Public Speaking",
];

export const areaSuggestions = [
  "Career advice", "Interview prep", "Technical skills", "Leadership",
  "Startup / Entrepreneurship", "Product thinking", "Networking",
];
