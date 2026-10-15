// "Riya Sharma" → "RS". Used for avatar fallbacks (header account menu, onboarding, event speakers).
export const initialsOf = (name: string, fallback = "M") =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || fallback;
