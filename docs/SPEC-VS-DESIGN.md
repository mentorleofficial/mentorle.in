# Spec vs Design — open questions

Where the Figma designs differ from the written specifications. The site is being built **to the Figma design**; each item here needs a decision on which one is right.

**Sources**

| Short name | Document |
|---|---|
| **BP §n** | Mentorle Master Blueprint V12 (Production Master) |
| **PP §n** | Mentorle Pro Pass ₹2,500 Master Specification (NoGFG) |
| **IC §n** | Implementation Context (decisions from the earlier wireframe) |

**Status key:** `Open` = needs a decision · `Resolved` = decided (note the outcome) · `Built as design` = shipped following Figma, still needs sign-off.

_Last updated: 2026-10-12 — Homepage and Find a Mentor built._

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
| D5 | "Your Experience Could Change…" banner | The exported image has the headline and buttons **baked into it**. | Image is heavily blurred to hide the baked text. A clean background export is needed. |
| D6 | Hero image card (bottom-right) | Has prev/next arrows but only one image was provided. | Carousel supports multiple images; both arrows are disabled with one. |
| D7 | Header logo position | In Figma the logo sits slightly left of centre (auto-layout spacing). | Centred exactly. Confirm that's acceptable. |
| D8 | Mobile and tablet layouts | Figma is desktop-only (1440px). | Responsive layouts derived from the desktop design. |
| D9 | Hero background | The hero video is only 1280×720, which looks soft on large and Retina screens. | A still frame from the video (6.3s) is used for now. A high-resolution photo or a 1080p/4K video is needed. |

---

## 2. Mentorle Plus (pricing) page — _not built yet; noted from Figma_

| # | Item | What the spec says | What Figma shows | Status |
|---|---|---|---|---|
| P1 | Free plan card | — | "Standard 1:1 retail pricing" is listed **twice** (both crossed out). Likely a copy error. | Open |
| P2 | Benefits strip | See H1–H3. | Repeats "2 Free Sessions", "Exclusive Referrals", "UpGrad passes / fashion & lifestyle". | Open |
| P3 | Resource Vault vs perk stack | The perk stack belongs to the ₹5,999 pass (BP §5), but the Resource Vault is listed under ₹2,500 (PP §1) — open conflict C3. | Pro gets "Full Resource Vault & LaTeX templates"; All-Access gets the "₹13,900+ partner perk stack". Matches the earlier wireframe's interim choice. | Open |

## 3. Find a Mentor page (`/mentors`) — built 2026-10-12

| # | Item | What the spec says | What Figma shows | Status |
|---|---|---|---|---|
| F1 | Domain tabs | No taxonomy (IC §15). | All Domains / IT & Software / Startups / Academics. Doesn't match the homepage band (H6), which also has "Career Transition". | Built as design |
| F2 | Directory ranking and pricing | Listing order uses the ranking score (BP §2). Price comes from the gross-up engine (BP §2). Tiers (Starter / Verified / Lead / Elite) affect price and ranking (BP §1). | Cards show no price, tier, rating or session count, and there's no sort control. | Built as design |
| F3 | Session formats on the listing | Six formats from ₹99 async to ₹2,499 executive sprint (BP §3–4). | Nothing about formats or what you can book appears on the directory. | Open |
| F4 | Mentor card destination | — | The design doesn't say what clicking a card does. Built to link to `/mentors/<slug>` (a profile page, not designed yet, so it 404s for now). | Open |

**Content and design gaps**

| # | Item | What's missing | What's built for now |
|---|---|---|---|
| FD1 | Mentor list | The design repeats the three homepage mentors. | Six placeholder records in `src/data/mentors.ts`, shaped for the future API. Each is assigned a domain so the tabs visibly filter. |
| FD2 | Search scope | The placeholder says "mentor, role, company or expertise", but no expertise data is defined. | Placeholder expertise tags per mentor; search matches name, role, company, focus and expertise. |
| FD3 | Empty state | No design for "no results". | A muted "No mentors match that search." line with a "Clear filters" link. |
| FD4 | Pagination | No pagination or "load more" in the design. | Not built; needed once real data arrives. |
| FD5 | Header styling | On this page the logo mark is orange and the header has no frosted bar; the homepage has a white logo on a frosted bar. | Kept the shared homepage header for consistency. Confirm which is intended. |
| FD6 | Hero CTAs | Buttons in this design have rounded corners (~6px); everywhere else they're square. | Square, to match the rest of the site. Confirm. |

## 4. Speaker Hub page — _not built yet; noted from Figma_

| # | Item | What the spec says | What Figma shows | Status |
|---|---|---|---|---|
| S1 | Speaker booking for events | Not mentioned in either spec. | "Book the World's Best Speakers" for conferences, summits and corporate retreats, with "Request for Event" buttons and a request form. Needs a defined flow, pricing and payout model. | Open |
