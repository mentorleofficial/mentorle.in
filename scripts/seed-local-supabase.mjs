// Seeds a LOCAL Supabase stack (the platform's schema) with sample mentors, offerings, events and test logins,
// so mentorle.in can be developed against real queries without touching production.
//
//   node scripts/seed-local-supabase.mjs
//
// Reads NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from .env.development.local and refuses to run
// against anything but localhost. Safe to re-run: users are reused by email and rows are upserted.
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.development.local", import.meta.url), "utf8")
    .split(/\r?\n/)
    .map((line) => line.match(/^([A-Z0-9_]+)=(.*)$/))
    .filter(Boolean)
    .map(([, key, value]) => [key, value.replace(/^"|"$/g, "")]),
);

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
if (!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(url ?? "")) {
  throw new Error(`Refusing to seed ${url}: this script only runs against a local Supabase stack.`);
}

const PASSWORD = "Mentorle@123";

async function api(path, { method = "GET", body, prefer } = {}) {
  const res = await fetch(`${url}${path}`, {
    method,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      ...(prefer ? { Prefer: prefer } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status} ${text}`);
  return text ? JSON.parse(text) : null;
}

// Creates (or finds) a confirmed user. The role goes in app_metadata, as the platform's admin tools now do,
// so handle_new_user assigns it.
async function ensureUser({ email, fullName, role, avatarUrl = null }) {
  const [existing] = await api(`/rest/v1/users?email=eq.${encodeURIComponent(email)}&select=id`);
  let id = existing?.id;
  if (!id) {
    const created = await api("/auth/v1/admin/users", {
      method: "POST",
      body: { email, password: PASSWORD, email_confirm: true, user_metadata: { full_name: fullName }, app_metadata: { role } },
    });
    id = created.id;
  }
  await api(`/rest/v1/users?id=eq.${id}`, { method: "PATCH", body: { full_name: fullName, avatar_url: avatarUrl } });
  return id;
}

const upsert = (table, rows, onConflict) =>
  api(`/rest/v1/${table}?on_conflict=${onConflict}`, {
    method: "POST",
    body: rows,
    prefer: "resolution=merge-duplicates,return=representation",
  });

// --- Mentors (from src/data/mentors.ts and src/data/mentor-details.ts) ---------------------------------------

const mentors = [
  {
    slug: "neeru-sood",
    fullName: "Neeru Sood",
    avatarUrl: "/homepage/community/arjun-malhotra.webp",
    domain: "startups",
    profile: {
      headline: "Business Coach & Consultant | Leadership & Personal Branding Expert | AI-Powered Digital Marketing Strategist",
      bio: [
        "Neeru Sood is a Business Consultant and Brand Growth Consultant with over 20 years of experience helping startups, small businesses, and established organizations strengthen their brands and achieve sustainable growth.",
        "Through strategic thinking, creative direction, and digital execution, she helps businesses define their positioning, build meaningful brand identities, and create marketing strategies that deliver measurable results.",
        "As the founder of Prep4Success, Neeru brings together business strategy, branding, digital marketing, and entrepreneurial education to help professionals and organizations turn ideas into impactful outcomes.",
      ].join("\n\n"),
      expertise: [
        "Personal & Business Branding",
        "Strategic Marketing & AI-Powered Digital Marketing",
        "Entrepreneurship Education & Empowerment",
        "Brand Building & Brand Management",
        "Content Strategy, Creation & Marketing",
        "Personal Branding Workshops",
        "Digital Marketing Consulting & Expert Talks",
      ],
      years_experience: 22,
      current_organization: "Prep4Success",
      current_role: "Business Consultant & Brand Growth Consultant",
      linkedin_url: "https://www.linkedin.com/",
      portfolio_url: "https://www.prep4success.in/",
      experiences: [
        {
          company: "Prep4Success",
          title: "Business Consultant & Brand Growth Consultant",
          location: "New Delhi, India",
          start_date: "2025-08",
          end_date: "",
          description:
            "Helping businesses, professionals, and institutions strengthen brand positioning, improve digital visibility, and achieve measurable growth through integrated strategy, creative execution, and education.",
        },
        {
          company: "Independent Consulting",
          title: "Strategic Business & Brand Consulting",
          location: "New Delhi, India",
          start_date: "2020-01",
          end_date: "2025-08",
          description:
            "Advised businesses on strategic planning, market positioning, performance-driven marketing, website development, brand identity, and social media management.",
        },
      ],
    },
    offerings: [
      {
        title: "One-on-One Business & Brand Growth Consultation",
        description:
          "Get personalized guidance on business strategy, brand positioning, marketing challenges, and growth opportunities. Discuss your goals, explore practical solutions, and leave with clear next steps.",
        duration_minutes: 45,
        price: 0,
        category: "General Mentorship",
      },
      {
        title: "Personal Branding Audit",
        description: "A focused review of your LinkedIn, portfolio and positioning, with a prioritised list of fixes.",
        duration_minutes: 30,
        price: 599,
        category: "Career Guidance",
      },
    ],
  },
  {
    slug: "arjun-malhotra",
    fullName: "Arjun Malhotra",
    avatarUrl: "/homepage/community/arjun-malhotra.webp",
    domain: "it-software",
    profile: {
      headline: null,
      bio: "Product leader who has shipped B2B SaaS at scale. I help PMs sharpen product sense and prepare for interviews.",
      expertise: ["Product management", "Growth", "B2B SaaS", "PM interviews"],
      years_experience: 12,
      current_organization: "Ex-Microsoft",
      current_role: "Head of Product",
    },
    offerings: [
      { title: "PM Interview Mock", description: "A full product-sense mock interview with written feedback.", duration_minutes: 60, price: 1499, category: "Mock Interview" },
    ],
  },
  {
    slug: "meera-kapoor",
    fullName: "Meera Kapoor",
    avatarUrl: "/homepage/community/meera-kapoor.webp",
    domain: "startups",
    profile: {
      headline: "Founder, ex-McKinsey. Fundraising and go-to-market for early-stage startups.",
      bio: "I help founders tighten their pitch, plan their raise and pick the right first market.",
      expertise: ["Fundraising", "Pitch decks", "Go-to-market", "Consulting"],
      years_experience: 10,
      current_organization: "Ex-McKinsey",
      current_role: "Founder",
    },
    offerings: [],
  },
  {
    slug: "rohan-mehta",
    fullName: "Rohan Mehta",
    avatarUrl: null, // exercises the initials fallback
    domain: "academics",
    profile: {
      headline: null,
      bio: "Design director. Portfolio reviews and design career planning.",
      expertise: ["UX design", "Portfolio reviews", "Design careers"],
      years_experience: 8,
      current_organization: "Ex-Adobe",
      current_role: "Design Director",
    },
    offerings: [
      { title: "Portfolio Review", description: "Walk me through two case studies; leave with concrete edits.", duration_minutes: 45, price: 999, category: "Portfolio Review" },
    ],
  },
];

const mentorIds = {};
for (const [i, mentor] of mentors.entries()) {
  const email = i === 0 ? "mentor@mentorle.local" : `${mentor.slug}@mentorle.local`;
  const userId = await ensureUser({ email, fullName: mentor.fullName, role: "mentor", avatarUrl: mentor.avatarUrl });
  await upsert(
    "mentor_profiles",
    [{ user_id: userId, slug: mentor.slug, domain: mentor.domain, is_active: true, experiences: [], ...mentor.profile }],
    "user_id",
  );
  await api(`/rest/v1/mentorship_offerings?mentor_id=eq.${userId}`, { method: "DELETE" });
  if (mentor.offerings.length) {
    await api("/rest/v1/mentorship_offerings", {
      method: "POST",
      body: mentor.offerings.map((offering) => ({ ...offering, mentor_id: userId, currency: "INR", status: "active" })),
    });
  }
  mentorIds[mentor.slug] = userId;
  console.log(`mentor   ${mentor.slug.padEnd(16)} ${email}`);
}

// Homepage featured mentors (normally picked in the platform's Admin → Settings → Homepage).
const featured = ["neeru-sood", "meera-kapoor", "rohan-mehta"];
await api("/rest/v1/featured_mentors?position=gte.1", { method: "DELETE" });
await api("/rest/v1/featured_mentors", { method: "POST", body: featured.map((slug, i) => ({ position: i + 1, mentor_id: mentorIds[slug] })) });
console.log(`featured ${featured.join(", ")}`);

// --- Events (from src/data/event-details.ts, upcoming ones moved into the future) ---------------------------

const adminId = await ensureUser({ email: "admin@mentorle.local", fullName: "Local Admin", role: "admin" });
const menteeId = await ensureUser({ email: "mentee@mentorle.local", fullName: "Test Mentee", role: "mentee" });

const events = [
  {
    slug: "from-classroom-to-boardroom",
    title: "From Classroom to Boardroom",
    subtitle: "Building Your Tech Future with Mentorle",
    event_type: "event",
    status: "completed",
    college_name: "CT University, Ludhiana",
    location: "A2 Seminar Hall, CT University, Ludhiana",
    start: "2025-10-13T11:00:00+05:30",
    registration_deadline: "2025-10-13T23:59:00+05:30",
    description:
      "Ready to turn your academic knowledge into career success? From Classroom to Boardroom is a career-focused session designed to help students prepare for the professional world.",
    learning_outcomes: "How to create a job-ready resume\nPractical interview strategies\nCareer planning techniques",
    prerequisites: "A curious mindset and willingness to learn\nA notebook or laptop",
    highlights: ["Practical career-building guidance", "Interactive discussion and Q&A", "Networking with fellow students"],
    speaker_name: "Ankit Kumar",
    speaker_linkedin: "https://www.linkedin.com/",
    speaker_github: "https://github.com/",
  },
  {
    slug: "punjab-technical-conclave",
    title: "Punjab Technical Conclave",
    subtitle: "A full-day campus summit for engineering students",
    event_type: "event",
    status: "upcoming",
    college_name: "Mentorle Campus Summits",
    location: "Campus auditorium, Punjab (confirmed on registration)",
    start: "2026-11-28T10:00:00+05:30",
    registration_deadline: "2026-11-25T23:59:00+05:30",
    max_participants: 500,
    banner_image_url: "/homepage/live-gatherings/image-2.webp",
    description:
      "A full-day campus summit featuring guest lectures from FAANG engineers and startup founders for over 500+ students.",
    learning_outcomes: "What top tech companies look for in fresh graduates\nHow founders hire their first engineers",
    prerequisites: "Currently enrolled in college\nYour college ID for entry",
    highlights: ["Guest lectures from FAANG engineers", "Founder panel and Q&A", "Networking with 500+ students"],
  },
  {
    slug: "builders-pitch-circle",
    title: "Builders Pitch Circle",
    subtitle: "Pitch to operators and angels, get unfiltered feedback",
    event_type: "other",
    status: "upcoming",
    college_name: "Mentorle Founders Circle",
    location: "Venue shared with selected founders",
    start: "2026-12-12T17:00:00+05:30",
    registration_deadline: "2026-12-05T23:59:00+05:30",
    max_participants: 12,
    description: "Early-stage founders pitch to a panel of operators and angels, then get unfiltered feedback over chai.",
    learning_outcomes: "How operators and angels judge an early-stage pitch",
    prerequisites: "An early-stage startup (idea to seed)\nA five-minute pitch deck",
    highlights: ["Five-minute pitch slot", "Feedback from operators and angels", "Chai and networking after"],
  },
];

// One row per request: a bulk upsert needs every row to have the same keys.
for (const { start, ...event } of events) {
  await upsert("events_programs", [{ ...event, start_date: start, end_date: start, start_time: start, created_by: adminId }], "slug");
  console.log(`event    ${event.slug}`);
}

console.log(`\nadmin    admin@mentorle.local\nmentee   mentee@mentorle.local (${menteeId})\npassword ${PASSWORD} for every account`);
