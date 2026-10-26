# Spec vs Design — open questions

Where the Figma designs differ from the written specifications. The site is being built **to the Figma design**; each item here needs a decision on which one is right.

**Sources**

| Short name | Document |
|---|---|
| **BP §n** | Mentorle Master Blueprint V12 (Production Master) |
| **PP §n** | Mentorle Pro Pass ₹2,500 Master Specification (NoGFG) |
| **IC §n** | Implementation Context (decisions from the earlier wireframe) |

**Status key:** `Open` = needs a decision · `Resolved` = decided (note the outcome) · `Built as design` = shipped following Figma, still needs sign-off.

_Last updated: 2026-10-13 — Homepage, Find a Mentor, Mentorle Plus, Speaker Hub, Become a Mentor, Events & Summits, Enterprise and Community built._

---

## 1. Homepage

### 1a. Product and commercial differences

| # | Item | What the spec says | What Figma shows | Status |
|---|---|---|---|---|
| H1 | **Mentorle Plus: free sessions** | Pro Pass (₹2,500) gives **discounts** on 1:1s — 15% in month 1, then 10% (PP §1, §3). All-Access (₹5,999) gives **4 mock tokens a year** (BP §8). No plan includes monthly free sessions. | "2 Free Sessions — two 1-on-1 sessions **every single month** included with your subscription" (24 a year). A success story repeats it: "I got 2 free sessions with a YC founder". | Built as design |
| H2 | **Mentorle Plus: partner perks** | Perk stack is career tools: Overleaf, InterviewBit/Scaler, GitHub Student Pack, Instahyre/Cutshort, Notion, Canva (BP §5). | "UpGrad course passes and vouchers for **premium fashion & lifestyle brands**". | Built as design |
| H3 | **Mentorle Plus: referrals** | "Referral" means the **refer-a-peer streak engine** (PP §3). Startup-referral routing unlocks only after a completed on-platform session (BP §10). | "Exclusive Referrals — premium **job referrals** and study resources directly from top industry mentors." The Career section also promises "exclusive referrals that skip the resume screening pile". | Built as design |
| H4 | **Marketing claims** | Not in any spec. | "**Punjab's #1** Mentorship & Events Network" and the stats **25K+ mentees / 1,200+ experts / 4.9/5 rating**. These need a verifiable source before launch, or should be removed. | Built as design |
| H5 | **Partner logos** | No partners named except the perk-stack companies (BP §5). | "Partnered with **upGrad, Huptle, EduBridge**". Are these signed partnerships we may advertise? | Built as design |
| H6 | **Domain taxonomy** | No domain taxonomy is defined anywhere (IC §15). | Homepage band: IT & Software / Startup & Pitching / Academic Counseling / Career Transition. The Find a Mentor page uses **different** tabs: All / IT & Software / Startups / Academics. | Open |
| H7 | **Mentor card content** | Mentors have **tiers** (Starter / Verified ★ / Lead-FAANG / Elite) (BP §1) and **fame badges** like "Top 1% System Design Evaluator" (BP §2). | Cards show only "12+ yrs, Growth Strategy", name and role. No tier, badge, rating, session count or price. | Built as design |
| H8 | **"Become a Mentor" visibility** | Shown **only to signed-out visitors** (IC §2). | The homepage banner shows it to everyone. With no auth yet it currently always shows; this will be wired up when login exists. | Open |
| H9 | **Events as a core pillar** | BP §1 says "pure 1:1"; the PP adds group masterclasses and offline Builder Meetups (PP §1–2). | Events are a headline feature: "Mentorship **& Events** Network", Live Gatherings (summits, mixers) and Life at Mentorle. It's broadly consistent with the PP, but the scope isn't specified: who runs them, ticketing, pricing. | Open |
| H10 | **"I'm new here ?" button** | No spec target. | Header button for new visitors. Where should it go: signup, an onboarding page, or the free Saturday demo masterclass (PP §4)? Currently links to `/signup`. | Open |

### 1b. Content and design gaps (for the designer)

Copy or assets the design doesn't provide. Placeholders are in use until real ones arrive.

| # | Item | What's missing | What's built for now |
|---|---|---|---|
| D1 | Mentor Stories quotes | All three quotes are attributed to the same person ("Sarah Jenkins, VP of Product @ Google"). | Same as design; needs real names. |
| D2 | Live Gatherings carousel | Only the centre card has a title, tag and description. | Placeholder text for the two side events. |
| D3 | How it works | Only step 1 ("Find Your Insider") has a description. | Placeholder descriptions for steps 2 and 3. |
| D4 | Success story — Rahul Verma | Quote is cut off at the frame edge. | Ending reconstructed: "…saved me months of prep time." |
| D5 | "Your Experience Could Change…" banner | The first export had the headline and buttons baked into the image. | Resolved 2026-10-13: replaced with a clean, text-free background (no extra blur). |
| D6 | Hero slideshow | The design shows one hero image and a small card with prev/next arrows. Per the product owner, the hero background rotates (every 3s) and the arrows move it; the small card previews the next image. Only two hero-suitable images exist. | Rotates the café still and the whiteboard-session photo. More images (ideally high-res, with headroom above faces) can be added in `hero.slides` in `src/data/home.ts`. |
| D7 | Header logo position | In Figma the logo sits slightly left of centre (auto-layout spacing). | Centred exactly. Confirm that's acceptable. |
| D8 | Mobile and tablet layouts | Figma is desktop-only (1440px). | Responsive layouts derived from the desktop design. |
| D9 | Hero background | The hero video is only 1280×720, which looks soft on large and Retina screens. | A still frame from the video (6.3s) is used for now. A high-resolution photo or a 1080p/4K video is needed. |
| D10 | Statement paragraph under the hero | Figma copy was "Mentorle connects you with experienced professionals and industry experts…". Replaced by the product owner with "Degrees teach you the theory. But the industry demands the practical. The game has unwritten rules, and we’re handing you the playbook." (their reference used a serif font with a yellow italic ending). | New copy in the existing style (Manrope, scroll reveal). "Degrees teach you the theory." is the always-dark lead. |
| D11 | Pricing plans on the homepage | — | Now in the updated homepage design: after Career Growth, on a grey section, heading "Choose your access / Start free. Choose more support when you need it." | Built as designed (replaces the placeholder heading added before the design existed). |
| D12 | Updated homepage design (2026-10-22) | — | New hero copy ("The Right Connections / Real opportunities." + subtitle), a new first slide with a blurred background, a time/date row on gathering cards, a new "Start with your goal" section, and the pricing plans moved up (after Career Growth) on a grey section with new heading copy. | Built. |
| D13 | Hero preview card photo | — | The card shows a "Global Education Conclave" photo that isn't in the supplied assets. | The card previews the next slide (the café and whiteboard photos). Send the conclave photo to add it as a slide. |
| D14 | Plan feature wording | Pricing page Figma still has the old list. | The homepage design rewords Free and Pro features (e.g. "Join a free 60-minute group session every sat."). | One shared data set, so the new wording shows on the pricing page too. "sat." capitalised to "Sat." (writing "Saturday" no longer fits the card). The old Free card's crossed-out lines are gone, as in the new design. |
| D15 | "What would you like help with?" cards | — | Six domain cards and "Explore all domains"; cards aren't shown as links. | Cards are static; the button opens Find a Mentor. Open: should each card open the directory filtered to its domain? |
| D16 | Gathering card time/date on phones | — | Desktop only. | Shown from 640px; on phones the fixed-height card has no room, so the row is hidden there. |
| D17 | Spacing drift below the stats strip | — | — | The homepage runs ~10–20px lower than the design from the stats strip down (also against the old design). Pre-existing; not changed in this update. |

---

## 2. Mentorle Plus (pricing) page (`/pricing`) — built 2026-10-12

The plan cards now **match the spec**: Free ₹0, Pro Pass ₹2,500/yr (anchored at ₹10,000, ~₹208/month), All-Access ₹5,999/yr or 6 × ₹999, tokens on day 0/90/180/270, 365-day expiry and the 7-day refund rule (PP §1–3, BP §5, §8, §9 Fix 6). What's still open:

| # | Item | What the spec says | What Figma shows | Status |
|---|---|---|---|---|
| P1 | Free plan card | — | "Standard 1:1 retail pricing" is listed **twice** (both crossed out). Likely a copy error. | Built as design |
| P2 | Benefits section contradicts the plan cards | Pro gives discounts, not free sessions; All-Access gives **4 tokens a year** (BP §8). Perks are career tools (BP §5). | The "What you actually get" section on the same page still promises "2 free 1-on-1 sessions **every month**" and "UpGrad passes / fashion & lifestyle vouchers" (see H1–H3). A visitor sees both claims together. | Open |
| P3 | Resource Vault vs perk stack | The perk stack belongs to the ₹5,999 pass (BP §5), but the Resource Vault is listed under ₹2,500 (PP §1) — open conflict C3. | Pro gets "Full Resource Vault & LaTeX templates"; All-Access gets the "₹13,900+ partner perk stack". | Built as design |
| P4 | Free plan button says "Current Plan" | — | Shown to everyone, including signed-out visitors who have no plan. | Open |
| P5 | Missing Pro Pass details | Referral rewards: ₹200 wallet cash and a 20% boost when a referred peer buys Pro (PP §3); weekly Saturday demo masterclass (PP §4). | Only "Re-boost to 15–20% through referrals" is shown. | Open |
| P6 | All-Access EMI fallback | If cardless EMI is declined: parent debit-card EMI or a 2-part split, ₹2,999 + ₹3,000 (BP §9 Fix 2). | Only "or 6 EMIs of ₹999/month". | Open |
| P7 | Plans (2026-10-24 update) | Design: Free / Pro Pass ₹2,500 / All-Access ₹5,999. | **Plans now come from the database and are managed by admins** (platform → Settings → Payments → Plans: add, edit, reorder, hide, delete; price, months of access, session / event discount, free sessions per month or year, card copy). Seeded from the new plan document: **Free Community** (₹0 forever, "Join the Free Community") and **Pro Pass** (₹4,999 / year, one-time payment, 15% off 1:1 sessions, no free sessions, "Most Popular"). The cards keep the design (badge bar, price, star intro line, check list; `**bold**` leads in benefits) and centre as a pair when there are two. | Built |
| P8 | Plan buttons | Design: "Current Plan" / "Get Pro Pass" links to signup. | Signed out → sign up, then back to `/pricing?plan=…`; unfinished profile → onboarding; a pass you hold shows "Your current plan" + valid until (Renew in its last 30 days); otherwise Cashfree checkout. The free tier shows "You’re in the community" once signed in (fixes P4). | Built |
| P9 | Terms line under the plans | "Tokens expire 365 days from purchase. Refunds within 7 days, provided no token has been redeemed." | "Passes last 12 months… Refunds within 7 days of purchase, provided no member benefit has been used." **Placeholder** until the Cancellation & Refund Policy is written. | Open |
| P10 | "What you actually get" section | Still the old Plus perks (free sessions…). | Unchanged; no longer matches Pro Pass. | Open: needs new copy |

**Content and design gaps**

| # | Item | What's missing | What's built for now |
|---|---|---|---|
| PD1 | Plan buttons | No checkout or accounts exist yet. | "Current Plan" → `/signup`, "Get Pro Pass" → `/signup?plan=pro`, "Get All-Access" → `/signup?plan=all-access`. |
| PD2 | Benefit card text | The Figma cards are identical to the homepage's Plus cards. | Reuses the homepage `PlusBenefits` component, so editing one updates both. |

## 3. Find a Mentor page (`/mentors`) — built 2026-10-12

| # | Item | What the spec says | What Figma shows | Status |
|---|---|---|---|---|
| F1 | Domain tabs | No taxonomy (IC §15). | All Domains / IT & Software / Startups / Academics. | **Changed 2026-10-23 (user):** platform mentors have no domain data, so the tabs are replaced by the platform's own filters, simplified: an "All" tab, Experience (0–2 / 3–5 / 6–10 / 10+ years) and Session type dropdowns, and search. Session types are the platform's offering categories, listing only those some mentor offers. |
| F2 | Directory ranking and pricing | Listing order uses the ranking score (BP §2). Price comes from the gross-up engine (BP §2). Tiers (Starter / Verified / Lead / Elite) affect price and ranking (BP §1). | Cards show no price, tier, rating or session count, and there's no sort control. | Built as design |
| F3 | Session formats on the listing | Six formats from ₹99 async to ₹2,499 executive sprint (BP §3–4). | Nothing about formats or what you can book appears on the directory. | Open |
| F4 | Mentor card destination | — | The design doesn't say what clicking a card does. | Links to the mentor's profile, `/mentors/<slug>` (built 2026-10-22). |

**Content and design gaps**

| # | Item | What's missing | What's built for now |
|---|---|---|---|
| FD1 | Mentor list | The design repeats the three homepage mentors. | **Live data since 2026-10-23:** every active mentor from the platform (`list_public_mentors`). Order: mentors with a photo first, then most years of experience. |
| FD2 | Search scope | The placeholder says "mentor, role, company or expertise". | Search matches name, role, organization and expertise tags. |
| FD3 | Empty state | No design for "no results". | A muted "No mentors match that search." line with a "Clear filters" link. |
| FD4 | Pagination | No pagination or "load more" in the design. | Not built; 42 mentors load at once (fine at this size). Revisit past ~100. |
| FD5 | Header styling | On this page the logo mark is orange and the header has no frosted bar; the homepage has a white logo on a frosted bar. | Kept the shared homepage header for consistency. Confirm which is intended. |
| FD6 | Hero CTAs | Buttons in this design have rounded corners (~6px); everywhere else they're square. | Square, to match the rest of the site. Confirm. |
| FD7 | Card badge and role line | The design's badge reads "12+ yrs, Growth Strategy"; "focus" isn't a platform field. | Years + the mentor's first expertise tag (only the part before a `;` or `,`, since some mentors typed several skills into one tag). Role line is "Role · Organization", either part omitted when empty. |
| FD8 | Mentors without a photo | — | 19 of 42 live mentors have no photo: the card shows their initials on the dark panel, as the profile hero does. |

## 4. Speaker Hub page (`/speaker-hub`) — built 2026-10-12

| # | Item | What the spec says | What Figma shows | Status |
|---|---|---|---|---|
| S1 | Speaker booking for events | Not mentioned in either spec. Both specs only cover 1:1 sessions, group masterclasses and memberships. | "Book the World's Best Speakers" for conferences, university summits and corporate retreats. Needs a defined flow, pricing, mentor payout model and escrow rules. | Built as design |
| S2 | Who counts as a speaker | — | The two speakers are regular mentors (same cards as Find a Mentor). Are speakers a subset of mentors, a separate roster, or a mentor opt-in? | Open |
| S3 | Hero buttons | — | "Find a Mentor" and "Explore Mentorle Plus" are copied from the other heroes; neither relates to booking a speaker. A "Request a Speaker" CTA may be intended. | Open |

**Content and design gaps**

| # | Item | What's missing | What's built for now |
|---|---|---|---|
| SD1 | Request flow | "Request for Event" has no form or page designed. | Buttons link to `/speaker-hub/request?speaker=<slug>` (generic tile: `/speaker-hub/request`), which 404s until designed. |
| SD2 | Speaker roster | Only two speakers are shown, and they're the placeholder homepage mentors. No filters, topics or fees. | Two placeholder records drawn from `src/data/mentors.ts`; real speakers will come from the database. |

## 5. Become a Mentor page (`/become-a-mentor`) — built 2026-10-13

The earnings numbers on this page **match the spec**: format prices and payouts (BP §3–4), tier payouts (BP §1), Tuesday 6 PM payouts, ₹500 minimum, 24-hour buffer (BP §6), ranking weights (BP §2), reschedule penalty and non-circumvention (BP §9–10), and the ₹499 → ₹424 → ₹330 / ₹84 Pro Pass example (PP §3).

| # | Item | What the spec says | What Figma shows | Status |
|---|---|---|---|---|
| B1 | Receipt card, second row | Pro Pass member pays ₹424 on a ₹499 session (PP §3). | "List price ₹499" repeated twice. | Superseded: section removed in the 2026-10-22 redesign. |
| B2 | Ranking section eyebrow | — | Repeats "Seamless Payments" from the payments section. | Superseded: section removed in the 2026-10-22 redesign. |
| B3 | Tier 4 copy | — | Missing spaces ("industry-leadingPrincipal", "experts,alongside", "experiencedfounders"). | Fixed |
| B4 | Rate calculator formula | Gross-up engine: payout = rate × minutes ÷ 60; price = (payout + gateway fee) ÷ 0.70 (BP §2). Gateway fee "~2.36%" with no base given (open conflict C5). | Example at ₹1,400/hr. | Superseded: section removed in the 2026-10-22 redesign. |
| B5 | Calculator range | No limits in either spec. | Slider thumb at ₹1,400; hint says most mentors sit at ₹500–₹2,500. | Superseded: section removed in the 2026-10-22 redesign. |
| B6 | Group masterclass pay | Flat ₹1,000–1,500 per session (PP §2). | Shown as a range. | Superseded: section removed in the 2026-10-22 redesign. |
| B7 | Tier 3 price vs formats | Tier 3 is ₹999 retail → ₹700 (BP §1), but the 45-min standard mock is ₹499 → ₹330 (BP §4) — open conflict C4. | Both appear on this page. | Superseded: section removed in the 2026-10-22 redesign. |
| B8 | Accordion copy and icons | — | The design showed one generic search icon and copy for one point only. | Copy and icons from the supplied `content-for-points.png` (badges, privacy, ranking). |
| B9 | "Become a Mentor" links | Mentors apply on the separate platform (IC §2). | — | Per the product owner: site links (footer, homepage banner) → `/become-a-mentor`; this page's apply buttons → `platform.mentorle.in/become-a-mentor` (new tab). |
| B10 | Reused icons | — | Several icons repeat across sections. | "What we ask of you" reuses the calendar (reschedule) and wallet (async SLA) icons in light colour via `MaskIcon`. Confirm, or supply dedicated icons. |
| B11 | Redesign (2026-10-22) | — | Shorter page: new hero ("Share what you know. / Help someone move forward."), "Make your experience count" cards, "Choose how you can help" format cards, a new banner ("Ready to take your next step?") and an FAQ. The discount explainer, earnings table, rate calculator, teardown flow, payments cards and ranking weights are gone. | Built as designed. |
| B12 | Payout and pricing facts | The spec's take-home model, gross-up pricing, payout schedule and ranking formula (BP §1–§4). | No longer explained on the page. | Open: confirm this is intended; mentors now only see tier prices and the FAQ. |
| B13 | "See how it works" (hero) | — | No destination designed. | Scrolls to "What happens after you apply". |
| B14 | "Book a Session" (banner) | — | A mentee action on the mentor recruitment page. | Opens Find a Mentor. Open: should it be "Become a Mentor" instead? |
| B15 | FAQ answers | — | Only the first answer is written. | The other three are placeholder copy based on the platform's rules (topics chosen at setup, take-home within the tier's range, tier confirmed after review, payouts every Tuesday). Needs sign-off. |
| B16 | "See what you would earn" on Community, Enterprise and Events | — | Those heroes still link to the removed calculator. | Now scroll to the tier grid (`/become-a-mentor#tiers`), which shows what each tier earns. |
| B17 | FAQ column | — | The FAQ block sits 10px left of the page column. | Aligned to the page column like every other section. |

## 6. Events & Summits page (`/events`) — built 2026-10-13

| # | Item | What the spec says | What Figma shows | Status |
|---|---|---|---|---|
| E1 | Opportunity types | Four types: hackathon, event, job, freelance (IC §12). | Same four as filter tabs. | Matches |
| E2 | Sources | Prototype: "MLH, Devfolio, Eventbrite, and more"; wireframe assumed Luma, District, Wellfound, Naukri, Upwork (IC §12, an assumption). | Hero names MLH, Devfolio, Luma, Wellfound; the feed shows Upwork. | Built as design; source list still needs confirming |
| E3 | Membership gating | Free users see only local/regional listings; Pro sees all-India, remote MNC and global (PP Table 2). | No gating, Pro badge or "unlock" state anywhere in the feed. | Open |
| E4 | Hero buttons | — | "Become a Mentor" / "See what you would earn" are copied from the Become a Mentor hero and don't relate to events. Built linking to `/become-a-mentor` and its calculator. | Open — suggest e.g. "Browse Opportunities" / "Host with Mentorle" |
| E5 | Eyebrow typo | — | "Hosteded by Mentorle". | Fixed ("Hosted by Mentorle") |
| E6 | "Open for Students" | — | Looks like a ghost button but has no obvious action. | Built as a non-clickable audience tag |
| E9 | Updated Events design (2026-10-22) | — | Opportunity feed as a 3-column grid of photo cards; gathering cards get a time/date row; new "Mentorle × Huptle" Pro Pass section, "How it works" cards and the "Someone is stuck…" banner. | Built. |
| E10 | Gathering card dates | — | The Events card shows "Saturday, 14 November 2026" (copied from the homepage card) under a "28th August, 2026" date. | Each event shows its own day and time (placeholder times for the three hosted gatherings). |
| E11 | Opportunity card photos | — | Three stock photos repeated. | Placeholder; the live feed will need an image per listing or a per-source fallback. |
| E12 | Huptle feature icons | — | Cap, briefcase and shield icons with no asset files. | Drawn as inline line icons. Open: the eligibility criteria and program terms the fine print refers to; "Explore Pro Pass" opens the pricing page. |
| E13 | Closing banner | — | Same banner and copy as Become a Mentor. | "Become a Mentor" opens the internal info page, like other site-wide links. |
| E14 | Hosted gatherings carousel (also the homepage's "Upcoming Events & Summits") | — | Three designed cards. | **Live data (2026-10-23):** upcoming and live events from `events_programs`, soonest in the centre, topped up with the most recent past events (marked "· Completed", button "View Event") so the carousel is never empty; up to five cards. Banners are used as card photos; events without one use the design's gathering photos. |

**Content and design gaps**

| # | Item | What's missing | What's built for now |
|---|---|---|---|
| ED1 | Feed data | The design repeats one Upwork gig four times. | Six placeholder records across all four types in `src/data/events.ts`, shaped for a future CMS/database feed. Buttons link to each source's site (new tab). |
| ED2 | Button labels per type | Only "Bid on Gig" is designed. | Hackathon → "Register", event → "RSVP", job → "Apply Now", freelance → "Bid on Gig". |
| ED3 | Registration | Platform: free RSVP into `event_participants` (capacity-checked); Plus-quota and paid (Cashfree) registration too. | Only the closed state is designed. | **Built (free RSVP, live since 2026-10-24):** "Register Now" (or the event's own label) on the detail page. Signed out → signup modal, then onboarding, then back to the event. Signed in with an unfinished profile → onboarding, then back. Signed in and onboarded → registers, then shows "You're registered" with "Cancel registration". Stored in `event_participants` by `src/lib/events/service.ts`, which makes the platform's `registerForEvent` / `unregisterFromEvent`. Open: Plus and paid events, confirmation emails, and the registered/full states have no design. |
| ED4 | Empty state, pagination, "refreshed daily" | Not designed. | Empty state + "Clear filters" as on Find a Mentor; no pagination yet. |

## 7. Enterprise page (`/enterprise`) — built 2026-10-14

| # | Item | What the spec says | What Figma shows | Status |
|---|---|---|---|---|
| N1 | B2B offering | Not in either spec (both are mentee/mentor only). | Universities: campus summits, white-label alumni mentoring. Companies: employee upskilling, EdTech API integrations. Needs pricing, contracts and scope. | Built as design |
| N2 | Hero copy and buttons | — | Subtitle is copied from the Events page; buttons are copied from Become a Mentor ("Become a Mentor" / "See what you would earn"). Neither fits a B2B page. | Open — suggest a B2B subtitle and "Contact Sales" / "Book a Demo" |
| N3 | Contact Sales | — | Button with no destination designed. | Links to `/contact` (planned, 404s for now). Needs a contact form or sales email. |
| N4 | "For Universities" footer link | — | Footer has separate "For Universities" and "For Enterprise" links; one page covers both. | "For Universities" → `/enterprise#universities`; "For Enterprise" → `/enterprise`. |

## 8. Community page (`/community`) — built 2026-10-14

The content **matches the spec's Free Community tier**: weekly Saturday 6–7 PM demo masterclass, local/regional jobs and hackathons, and one open expert session per quarter (PP §1, §4).

| # | Item | What the spec says | What Figma shows | Status |
|---|---|---|---|---|
| C1 | Hero buttons | — | "Become a Mentor" / "See what you would earn" again copied from Become a Mentor; they don't fit a mentee community page. | Open — suggest "Join the community" / "See this Saturday's session" |
| C2 | "Join the community" | The spec's free tier is a WhatsApp community (referral loop, PP §3). | Buttons with no destination designed. | Links to `/signup` for now. Needs the real join flow (WhatsApp invite, signup, or Saturday session RSVP). |
| C3 | Saturday session details | Saturday, 6–7 PM, 60 min (PP §4). | No time, location or online/offline info. | Open |
| C4 | Closing banner | — | Taller (622px) than the homepage banner. | Built at the shared 555px height, per the product owner's earlier decision that this banner is the same size everywhere. |


## 9. Login, Sign up, Forgot password and Onboarding (`/login`, `/signup`, `/forgot-password`, `/onboarding`) — built 2026-10-14, flows added 2026-10-15

The auth screens open as a modal over whatever page the user is on (Next intercepting routes): the page behind is blurred and darkened, the URL changes, and Back, Esc, ✕ or a click outside closes it. A direct visit or refresh opens the modal over the homepage. Each flow's steps change inside the same card.

**The flows copy the Mentorle platform's mentee side** (`../Mentorle-Version2`: `MenteeSignupForm`, `Login`, `ForgotPassword`, `MenteeOnboarding`), because mentorle.in will replace the platform's mentee side and connect to its database:
- **Sign up:** name, email, phone, date of birth, password and consent → 8-digit email code (resend after 60s, "Edit email") → "You're in!" → `/onboarding`.
- **Log in:** email and password, plus a "Forgot password?" link. An unverified account gets the email-code step. Afterwards, a mentee who hasn't finished onboarding goes to `/onboarding`; otherwise the user goes to `?redirect=` or back to the page they were on.
- **Forgot password:** email → 8-digit code, new password and confirm password → signed in.
- **Onboarding:** further steps in the same modal card (not a separate page), running the platform's 6-step wizard (photo and name, about you, goals, interests (at least 3), mentor areas and links, review), with the same limits, plus Save & exit. Finishing goes to `/mentors`.
- **Header:** when signed in, it shows the user's initials or photo with a menu: Complete your profile / Find a mentor, and Log out.

**Live since 2026-10-24.** `src/lib/auth/service.ts` makes the platform's own Supabase calls (accounts are shared with the platform). Codes arrive by email (production templates contain the 8-digit code). Mentor and admin accounts that log in here get a "Use the Mentorle platform" step and are signed out of mentorle.in (A9).

| # | Item | What the spec says | What Figma shows | Status |
|---|---|---|---|---|
| A1 | Date of birth / 18+ gate | Signup must collect date of birth and refuse anyone under 18 (BP §7, PP Table 1). | Full Name, Email, Password only. | **Built**: Day/Month/Year selects under the phone field; under-18s are blocked. The platform's signup still lacks it, and its DB needs a `date_of_birth` column. |
| A2 | Forgot password | — | No link or screens. | **Built** from the platform's flow (8-digit recovery code). Unlike the platform, it never says whether an account exists. |
| A3 | Social / phone login | — | Email and password only. | Kept as email + password, matching the platform. Open: confirm whether Google login is wanted. |
| A4 | Password placeholder | — | Lowercase "password" while the other fields are capitalised. | Built as "Password" for consistency. |
| A5 | Terms consent | DPDP Act: unbundled consent; promotional profiling can't be forced (BP §7). | No terms/privacy line. | **Built**: a required "I agree to the Terms and Privacy Policy" checkbox. **Changed 2026-10-24 (user):** the optional "session reminders, new mentors and offers" checkbox is removed. Service emails (session reminders, booking and account emails) go to everyone; **marketing emails (new mentors, offers) need separate consent under DPDP**, so `mentee_profiles.marketing_opt_in` stays false and none should be sent until a mentee opts in (e.g. a future account-settings toggle). |
| A6 | Backend | — | — | **Live:** Supabase auth on the platform's project. Signup stores phone, date of birth and marketing consent in `mentee_profiles`, and the terms acceptance time on the auth user's metadata (`terms_accepted_at`). |
| A7 | Phone at signup | Platform signup requires a phone number. | Not in the Figma. | Built as on the platform (country code, India +91 by default, 10 digits for India). |
| A8 | Screens with no design | — | Only the first login and signup screens are designed. | Verify email, You're in, Forgot/Reset password, Password updated and all 6 onboarding steps reuse the login card's style (onboarding adds a progress bar along the card's top edge). Needs design review. |
| A9 | Code length | Guest booking spec says a 6-digit OTP (to the phone). | — | Account codes are 8 digits, matching the platform's Supabase setting (`otp_length = 8`). |
| A10 | Reset email button | — | — | **Built (2026-10-24):** the button returns people to the site they asked from. Requests made here send `redirectTo: <site>/reset-password`; the platform sends its own. Supabase's redirect list has mentorle.in, www.mentorle.in and the platform. `/reset-password` works on any device (the link carries its own short-lived session, used through a throwaway client so it never becomes the browser's session), then mentees are logged in and mentor/admin accounts get the platform step (A9). Used or expired links show "This link has expired" with "Send a New Link". The 8-digit code in the same email still works. |
| A9 | Mentor and admin accounts | — | — | mentorle.in is for mentees and sessions aren't shared with the platform, so a mentor/admin login shows "Use the Mentorle platform" (button to platform.mentorle.in/login, "Use a different account") and ends the session here. Placeholder copy; no design. |
| A10 | Email links | — | — | Production's auth "redirect URLs" list is empty and its site URL is the platform, so any link in an auth email opens the platform. mentorle.in's flows use the 8-digit code only, so this doesn't block anything; add mentorle.in to the redirect list before relying on email links. |


## 10. Event detail (`/events/<slug>`) — built 2026-10-15

One page template renders any event from `src/data/event-details.ts`. Each record is shaped like the row a mentor or admin will create on the platform, so moving to the database only changes `getEvent` / `getEventSlugs`. The sample event is the one in the Figma ("From Classroom to Boardroom", CT University, completed).

| # | Item | What the spec says | What Figma shows | Status |
|---|---|---|---|---|
| ED1 | The dark card under the hero | — | Looks like an exported poster image. | The event's own banner (`banner_image_url`) fills this slot, shown whole (posters carry text, so no cropping; capped at 640px tall). Events without a banner get the generated card (host, title in caps, subtitle, date, time; the "from → to" icons for campus events). |
| ED2 | Event status | — | "Completed" chip, "Registration closed" button and "This event has been completed." | **Live data (2026-10-23):** the platform's `status` is rarely updated after an event ends (two 2025/2026 events still say "upcoming"), so status comes from the dates (upcoming → live → completed); only "cancelled" is taken from the row. Upcoming events also close for registration when the deadline passes, the event is full, or it's paid (checkout isn't built: "Registration for this event opens soon.", placeholder). |
| ED3 | Registration destination | — | Only the closed state is designed. | Open: where "Register Now" goes (platform signup, a form, an external link). The data has a `registration.href` per event. |
| ED4 | Speaker links | — | "LinkedIn · GitHub" labels only. | Resolved: the event's `speaker_name` / `speaker_image` / `speaker_linkedin` / `speaker_github`; the role line hides (the platform stores none). |
| ED5 | How users reach the page | — | No link from Events & Summits to a detail page is designed. | The hosted-gathering cards' buttons ("Request Invite", "Register Free", "Apply to Pitch") now open each event's detail page, where registration happens. Past events (like the Figma's sample) aren't listed anywhere yet. |
| ED6 | Breadcrumb | — | "Events & Summits / Event detail". | Built as designed (the generic "Event detail", not the event title). |
| ED7 | Unknown event URLs | — | — | Show the site's not-found page with `noindex`. With Cache Components the HTTP status stays 200; a real 404 needs a Proxy check, worth adding with the database. |
| ED9 | Register buttons for signed-in users | — | — | Resolved by ED3/ED5: the cards no longer link to `/signup`. The auth modals still send any signed-in visitor on (to onboarding if unfinished) instead of showing a form. |
| ED8 | Body text width | — | The design's 16px text renders about 1% wider than Manrope at 16px in the browser. | Kept at the design system's 16px with no added letter-spacing, so the "About" paragraph can wrap one word differently on wide screens. |
| ED10 | Detail content | — | Only card text existed for the three sample gatherings. | Resolved: every field comes from `events_programs`. Free text is cleaned: HTML entities decoded ("&amp;"), Markdown bold removed, ✓ / • / - bullets turned into list items. Host "Online"/"Mentorle" in `college_name` shows as "Hosted by: Mentorle". |
| ED11 | Hero background | — | A pre-blurred, darkened auditorium photo. | Every event uses the design's background; real banners are bright photos that would make the white hero text unreadable, so they go in the cover slot (ED1). |
| ED12 | Meeting links (security) | Platform: the join link is for registered attendees. | — | mentorle.in never selects `meeting_link`. **Fixed in the platform (2026-10-24, migration `20261024130000_private_event_meeting_links`):** links moved to the private `event_meeting_links` table, readable only by the event's creator, admins and registered attendees through `get_event_meeting_links()`. When registration goes live here, show the link to registered users through that function. |
| ED13 | Who fills subtitle, highlights and the web address | — | — | **Platform event form (2026-10-24):** "Subtitle" (120 characters) and "Web address" (`mentorle.in/events/…`, empty = generated from the title, taken addresses refused, warning when registered people would lose the old link, "View on mentorle.in") under Event Basics; "Highlights" (one per line, up to 6) under Content Details. The database only accepts lowercase letters, digits and single hyphens (migration `20261024140000_event_slug_format`). |

## 11. Mentor profile (`/mentors/<slug>`) — built 2026-10-22

One template renders every mentor from `src/data/mentor-details.ts`, shaped like the platform's `get_public_mentor` record plus the mentor's `mentorship_offerings`, so moving to the database only changes `getMentorProfile` / `getMentorSlugs`. The design's profile (Neeru Sood) is fully built; the directory's placeholder mentors get pages from their card data with empty sections hidden.

| # | Item | What the spec says | What Figma shows | Status |
|---|---|---|---|---|
| M1 | Corners and page column | — | Rounded cards and buttons; content inset 88px. | Built square with the site's page column so the page matches every other page. Say if the rounded style should spread site-wide instead. |
| M2 | Header | — | A solid dark header bar; this page has no hero image. | A dark band sits behind the site's (transparent) header. |
| M3 | Profile photo | — | Neeru Sood's card uses the homepage's "Arjun Malhotra" photo. | Resolved: profiles use the mentor's own platform photo (initials when missing). |
| M4 | Fields the platform doesn't store | `mentor_profiles` + `users` + `mentorship_offerings` hold name, photo, headline, bio, expertise, years, role, organization, LinkedIn, portfolio, experiences and offerings. | Tagline, Core Services, section intros, About eyebrow, "Founder" designation. | **Decided 2026-10-23:** mentors won't edit profiles before launch, so the page uses platform fields only. Core Services removed; the tagline is generated from the first three expertise tags (only when they're 18 characters or shorter); intros and eyebrows are generic; missing photo → initials; empty sections hide. |
| M5 | Booking | Booking flow exists on the platform (slots, payment, Plus). | "Book a Session" buttons. | Hero and banner buttons scroll to the sessions list; the session card's button opens signup and returns to the profile. Real booking is Phase 2. |
| M6 | Experience dates | — | Current role "Aug 2026 – Present" follows a role ending Aug 2025. | Kept as designed; probably a typo for Aug 2025. |
| M7 | LinkedIn / Portfolio links | — | Buttons only. | Resolved: the mentor's platform URLs; each button hides when empty. |
| M8 | Homepage mentors | — | The design shows three mentors. | **Admin-picked (2026-10-23):** the platform's Admin → Settings → Homepage chooses up to three (`featured_mentors`, read through `list_featured_mentors`). Only those show, in slot order; with none picked the section keeps its header and button but no cards. |
| M9 | Sessions section | Platform offerings: title, description, duration, price. | One full-width session card ("Session format: One-on-one", "Price: Free introductory session"). | Lists every offering (2 columns, odd last one full width) with duration, price and Book. Session "format" and custom price labels aren't platform fields, so duration and the formatted price ("Free" / "₹599") are shown instead. Section order: Hero, About, Sessions, Expertise, Experience. |
| M10 | Sparse profiles | Only name, bio, years and one expertise tag are required. | — | Text centres against the photo card so short profiles don't leave a gap; headline falls back to "Role at Organization". |
| M11 | Data freshness | — | — | Profiles, the directory and the homepage cards are cached for about a minute (`cacheLife("minutes")`, tag `mentors`): a mentor's edit on the platform appears within ~1 minute; a newly activated mentor's page renders on its first visit. |
| M12 | Speaker Hub speakers | — | The two speakers are the design's sample mentors, not platform mentors. | Kept as static placeholders in `src/data/speakers.ts`; their cards now open the speaker request instead of a (non-existent) mentor profile. |

## 12. Privacy Policy and Terms of Service (`/privacy`, `/terms`) — built 2026-10-24

No Figma. Text copied word for word from the legacy site (`main`: `/privacy-policy`, the DPDP notice, and `/terms-of-service`) into `src/data/legal.ts`; layout built from the site's patterns (see DESIGN-SYSTEM, Legal pages).

| # | Item | What the legacy pages say | Rest of the site | Status |
|---|---|---|---|---|
| L1 | **Grievance contact and SLA** | Privacy §7: support@mentorle.in / rachitjain@mentorle.in (+91 9888409232); "addressed within 7 working days". | Footer: grievance@mentorle.in, "Resolution SLA: 30 days". | **Deferred (user, 2026-10-24):** left as is for now. Pick one email and one SLA later; the footer and the policy should match (the policy is the legal document). |
| L2 | Separate "DPDP Compliance Notice" | Terms linked `/privacy-policy` and `/dpdp-compliance`. | The privacy page *is* the DPDP notice. | The Terms link reads "Privacy Policy (DPDP Compliance Notice)" and goes to `/privacy`. |
| L3 | Old addresses | `/privacy-policy`, `/private-policy` (an older privacy text), `/terms-of-service`, `/dpdp-compliance`. | New: `/privacy`, `/terms`. | Permanent redirects in `next.config.ts`, so old links keep working after launch. The older `/private-policy` text isn't carried over. |
| L4 | Cancellation & Refund Policy | Exists on the legacy site (`/cancellation-refund-policy`). | Not linked anywhere on the new site. | **Waiting for content (user will share):** not ported yet; same for the Community Guidelines page. Payment gateways (Cashfree) usually require the refund policy to be public before going live. |
| L5 | Effective dates | Privacy: September 2, 2026. Terms: September 1, 2026. | — | Kept. Update `effectiveDate` in `src/data/legal.ts` when the text changes. |
| L6 | Footer label | — | The footer's bottom row said "Terms and Conditions". | Resolved (user, 2026-10-24): "Terms of Service" everywhere. |

## 13. Booking a session (mentor profile → "Book a Session") — built 2026-10-25

No Figma: a dialog over the profile in the auth dialogs' style (user decision). Data and rules come from the platform's database through `mentor_open_slots` and `book_session` (platform migrations `20261025120000_secure_booking` and `20261026120000_admin_only_cancel_reschedule`).

| # | Item | Platform before | What's built | Status |
|---|---|---|---|---|
| BK1 | Who sees open times | Signed-in users only (availability tables). | Anyone (user decision): `mentor_open_slots` is public. Booking still needs an account and a finished profile. | Built |
| BK2 | Flow | `/book/<mentorId>` page + dialog. | Book on a session card → pick a day (calendar, IST) and time → confirm (optional note, "booked times are final") → "You're booked" with the meeting link, copy, Add to Google Calendar. Signed out → signup, then back to the chosen time (`?book=&at=`); unfinished profile → onboarding, then back. | Built |
| BK3 | Security | Mentees inserted sessions themselves: paid offerings could be booked free, any time/length/status/meeting link. | Only `book_session` can create a mentee's session: checks offering (active, the mentor's, free), the time (an open slot) and onboarding; sets length, title and link itself. Applied to the platform's dialog too. | Built (platform migration) |
| BK4 | Mentor settings | Notice and buffer only. | Mentors can also set their own meeting link (platform: Availability → Booking Settings; default: an automatic Jitsi room). | Built |
| BK5 | Paid sessions | Cashfree checkout on the platform. | Paid offerings show "Paid booking opens soon" (placeholder). | Deferred until the Mentorle Plus decisions |
| BK6 | Mentors with no hours | — | "Not taking bookings yet" instead of Book (no open time in the next 90 days). | Built |
| BK7 | Confirmation email | Browser sent any addresses to an unauthenticated function. | `send-booking-email` takes only a session id, needs the mentee or mentor signed in, looks people up itself, sends once. | Built (platform) |
| BK8 | After booking | Platform: "My sessions". | The dialog and the email carry the link; the "You're booked" step links to My sessions (section 14). | Built |
| BK9 | Cancelling and rescheduling | Platform: mentees cancelled any time and rescheduled once; mentors cancelled their own sessions. | **Mentees can't cancel or reschedule; only the session's mentor or a Mentorle admin can (user decision, 2026-10-24).** Enforced in the database (a trigger on `sessions`, `cancel_session` for the mentor or an admin, `book_session` refuses reschedules); the mentee cancel/reschedule buttons are gone on the platform, mentors keep Cancel. The confirm step says booked times are final and that the mentor or the Mentorle team can move or cancel it (placeholder copy). | Built. Mentors (booking details, Sessions list, offering bookings) and admins (Sessions) reschedule through `reschedule_session` (platform migration `20261026130000`): new date and time in IST with the mentor's open times as quick picks, moved in place (same meeting link), both people notified and emailed ("Session moved"). |

## 14. My sessions, Account and notifications (`/sessions`, `/account`, header bell) — built 2026-10-24

No Figma: built from the site's patterns (the legal pages' dark header band, the filter tabs, bordered white cards on `bg-surface`, the auth form fields). Data is the platform's: the same `sessions`, `users`, `mentee_profiles` and `notifications` rows its mentee screens use, so both sites stay in step.

| # | Item | Platform | What's built | Status |
|---|---|---|---|---|
| MS1 | My sessions | `/mentee/sessions`: upcoming + past, join, calendar, reschedule, cancel, rate, action items. | `/sessions`: Upcoming / Past tabs with counts. Each session is a card with an IST date block, title, mentor (links to their profile), time and length, status chip, "Moved from …" after a reschedule, cancellation reason, the mentee's note. Upcoming: Join, Add to Google Calendar, Copy link; the first is marked "Next session" (or "Happening now" while it runs). | Built |
| MS2 | Rating and action items | Rating: `/session/<id>/feedback` (5-question survey + comment). Tasks: `/mentee/tasks`. | **Rating:** "Rate session" on completed sessions opens the platform's survey (same questions and scoring) in the site's dialog, one question per step, then the overall rating and an optional comment. Saved as the platform's `feedback` row, so mentors see it there. The card then shows the stars, the comment and the mentor's reply; the mentor's feedback about the mentee shows too. **Action items:** a third tab (also `/sessions#action-items`, where the bell's "New Action Item Assigned" goes) with To do / Done groups: tick off, due or overdue date, the session it came from, the mentor's files, and the mentee's own files when the mentor allows replies with files. Session cards link to their items. | Built |
| MS3 | Cancel / reschedule | Mentee buttons. | None (user decision, BK9). The page says booked times are final and the mentor or the Mentorle team can move or cancel (placeholder copy, no support address yet). | Built |
| MS4 | Signed out / unfinished profile | Route guards. | A prompt in the page: log in or sign up (returns to `/sessions`), or finish your profile. | Built |
| AC1 | Account | Separate profile and settings pages. | `/account`: Profile (photo, name, phone, email read-only), About you, Goals, Interests & mentors, all with onboarding's fields and rules and one "Save changes" bar pinned to the bottom of the screen (Discard when there are changes). Password (current + new + confirm; the current one is checked first). Log out. A section list on the left from lg. | Built |
| AC2 | Changing email, date of birth | — | Not editable (email is the sign-in; date of birth is set at signup for the 18+ check). | Open: ask if needed |
| AC4 | Resume | Upload card on the mentee profile (PDF/Word, 10 MB). Its View link didn't work (a public link into a private bucket), and mentors couldn't open it. | Resume card on Account: upload, View (a signed link), Replace, Remove, saved as the platform's `resume_url`. Platform migration `20261027130000` lets mentors with a session or program with the mentee open it; the platform's own View links now use signed links too. | Built (needs `db push` + platform deploy) |
| AC3 | Unfinished profile | — | Account shows "Finish your profile" (onboarding) instead of the profile form; password and log out still work. | Built |
| NB1 | Notification bell | Header bell with unread count, mark read, mark all, clear. | Same actions in the site's style: a bell beside the account menu (desktop) and the menu button (phones), a brand count badge, a white panel (the account menu's style) with an icon per kind, title, message, relative time, unread dot and ✕. Session notifications open My sessions. The phone panel spans the header bar. | Built |
| NB2 | Live updates | Subscribed to realtime, but `notifications` wasn't in the realtime publication, so nothing arrived live. | Platform migration `20261027120000_notifications_realtime` publishes the table (fixes the platform's bell too). The bell also refreshes every minute and when the tab comes back into view. | Built (needs `db push`) |
| NB3 | Notification wording | Written by the platform's database triggers. | Shown as written (e.g. "Session Confirmed", "Session Cancelled by Mentor"). | As platform |
| NB4 | Database fixes found on the way | — | Platform migration `20261027130000_mentee_ratings_tasks_resumes`: ratings only for completed sessions; mentees can only tick items and manage their own files (they could rewrite the mentor's text); mentee file uploads on action items were refused by storage since `20261025120000` (fixed). | Built (needs `db push`) |

## 15. Payments: passes, paid sessions and paid events — built 2026-10-24

Through the platform's Cashfree integration (sandbox until `CASHFREE_ENV=production`). One-time payments only (user decision); the legacy auto-renewing Plus subscriptions keep working for their members on the platform. Platform migration `20261028120000_configurable_plans_and_checkout`.

| # | Item | Platform before | What's built | Status |
|---|---|---|---|---|
| PY1 | Buying a pass | Cashfree subscription mandate (Plus monthly / yearly). | One-time Cashfree checkout from the pricing page; the pass lasts the plan's months and ends by itself (renewing in the last 30 days adds the time to the end). | Built |
| PY2 | Paid 1:1 sessions | Booking dialog → Cashfree; the server trusted the browser's time and length. | The booking dialog shows the price, the member discount and the total, then "Pay ₹X & book". The server checks the slot is open, takes the length from the offering, holds the time 15 minutes, and books it (with the confirmation email) when paid. If the time was taken while paying, nothing is double-booked: the payment is flagged for a refund and admins and the buyer are told. | Built |
| PY3 | Free sessions from a plan | 2 per month on Plus, booked with the browser's time. | When a plan includes free sessions (none on Pro Pass today) and the offering is "Plus eligible", the dialog offers "Use a free session (n left)" or paying. Booked through the database like any booking. | Built |
| PY4 | Paid events | Cashfree checkout on the platform. | "Pay ₹X & register" on the event page (member event discount applies; Pro Pass has 0%). Paid registrations can't be cancelled from the page. | Built |
| PY5 | After paying | Platform return route. | `/pay-return` → `/payments/status`, which confirms the order with Cashfree (works even if the webhook is late) and shows what was bought. | Built |
| PY6 | Account | Platform Go Plus page. | Account → "Your plan": pass, valid until, discounts, free sessions left, Renew / See plans, and the last payments. | Built |
| PY7 | Refunds | — | Flagged automatically (slot clash) and listed for admins; refunding is done in Cashfree's dashboard for now. | Open |
| PY8 | Before taking live payments | — | Publish the Cancellation & Refund Policy (Cashfree requires it), whitelist mentorle.in in Cashfree's dashboard, and switch `CASHFREE_ENV` to production. | Open |


## 16. Event mode: quick signup, live page and lucky draw — built 2026-10-26

For live events (client brief, no Figma). An admin turns event mode on in the platform (Admin → Event mode); while it's on, signup needs no email code and every new mentee is entered into the lucky draw. Platform migration `20261030120000_event_mode`, edge function `event-quick-signup`. Pages use the account pages' dark band, bordered cards and the auth dialog.

| # | Item | Brief | What's built | Status |
|---|---|---|---|---|
| EV1 | Quick signup | OTP-free signup with name, phone, email, password, only during the event. | While event mode is on, the signup dialog shows "Join Mentorle" with those fields plus the Terms/Privacy consent (kept for the DPDP Act). No date of birth, so the 18+ check moves to the profile. The server refuses quick signup once the event is off, and signup goes back to the code. | Built |
| EV2 | After signup | Straight to the dashboard; onboarding prompt that can be skipped. | Lands on the homepage (user decision: mentorle.in has no dashboard) with a one-time "Complete your profile / Later" dialog. Booking a session still asks for the profile. | Built |
| EV3 | Who's in the draw | People who registered during the event; each counted once. | Every new mentee confirmed while the event is on, by quick or normal signup; one entry per account and per phone number. The first spin closes the list (later signups are listed but not in the draw). Admins can disqualify entries. | Built |
| EV4 | Live page | Names and random avatars of people signing up. | Changed by the user: attendees don't see names or counts. `/live` shows the event name and "The winner will be revealed soon" (checked every 4 seconds), then the countdown and their own result. Names, counts and contact details stay in the admin panel; the public feed doesn't return them at all. | Built |
| EV5 | The draw | Wheel spin when the admin clicks a button; random, fair winner. | A separate **presenter screen** (Admin → Event mode → Open presenter screen, its own window for the projector): light, in mentorle.in's style (the ink header bar, white dot grid, orange accents, square corners, Manrope), the wheel with every name in the draw, Spin button (or Space), and at the end **only the winner's name** with confetti. Contact details are only on the Event mode page. The server picks the winner at random before anything animates and records it. Phones on `/live` count down 12 seconds to the same moment, then show "In a Crowd of 1000s we found you" to the winner and "Better luck next time!" to everyone else in the draw (client's lines). "Draw again" excludes earlier winners. | Built |
| EV6 | Stats afterwards | Signups, names, etc. | Admin → Event mode keeps every event: signups, quick signups, profiles completed, signups per hour, the full list (name, email, phone, time, profile) with search and CSV export, and every draw's winner. | Built |
| EV7 | Risks to know | — | Without the email code, someone could sign up with an email that isn't theirs during the event. Mitigations: one entry per phone, a per-network rate limit (generous, since a venue shares one Wi-Fi), disqualify, and the details admins see. Nothing about entrants is public. | Accepted |
| EV8 | Removing events | — | Ended events can be deleted from Admin → Event mode ("All events", or Delete on the event), with a confirmation. Their list, stats and winners go; the accounts people created stay. A running event has to be turned off first. | Built |
| EV9 | Checking the screens | — | Admin → Event mode → "Try the screens": a presenter-screen preview with sample names and a practice spin (nothing drawn or saved), and links to every `/live` state (waiting, in the draw, countdown, winner, better luck, not in the draw, signed-out result, ended, no event) via `/live?preview=<state>`, with a switcher bar. The `/live` previews only work in local development or on a test deployment built with `NEXT_PUBLIC_EVENT_PREVIEW=1`, never on the real site (so nobody can show a fake winner screen). | Built |
