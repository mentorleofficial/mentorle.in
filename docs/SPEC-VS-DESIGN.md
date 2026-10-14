# Spec vs Design — open questions

Where the Figma designs differ from the written specifications. The site is being built **to the Figma design**; each item here needs a decision on which one is right.

**Sources**

| Short name | Document |
|---|---|
| **BP §n** | Mentorle Master Blueprint V12 (Production Master) |
| **PP §n** | Mentorle Pro Pass ₹2,500 Master Specification (NoGFG) |
| **IC §n** | Implementation Context (decisions from the earlier wireframe) |

**Status key:** `Open` = needs a decision · `Resolved` = decided (note the outcome) · `Built as design` = shipped following Figma, still needs sign-off.

_Last updated: 2026-10-13 — Homepage, Find a Mentor, Mentorle Plus, Speaker Hub, Become a Mentor, Events & Summits and Enterprise built._

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

**Content and design gaps**

| # | Item | What's missing | What's built for now |
|---|---|---|---|
| PD1 | Plan buttons | No checkout or accounts exist yet. | "Current Plan" → `/signup`, "Get Pro Pass" → `/signup?plan=pro`, "Get All-Access" → `/signup?plan=all-access`. |
| PD2 | Benefit card text | The Figma cards are identical to the homepage's Plus cards. | Reuses the homepage `PlusBenefits` component, so editing one updates both. |

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
| B1 | Receipt card, second row | Pro Pass member pays ₹424 on a ₹499 session (PP §3). | "List price ₹499" repeated twice. | Fixed (shows "Pro Pass member pays ₹424") |
| B2 | Ranking section eyebrow | — | Repeats "Seamless Payments" from the payments section. | Fixed (shows "Directory Ranking") |
| B3 | Tier 4 copy | — | Missing spaces ("industry-leadingPrincipal", "experts,alongside", "experiencedfounders"). | Fixed |
| B4 | Rate calculator formula | Gross-up engine: payout = rate × minutes ÷ 60; price = (payout + gateway fee) ÷ 0.70 (BP §2). Gateway fee "~2.36%" with no base given (open conflict C5). | Example at ₹1,400/hr. | Built with the fee as 2.36% of the payout, rounded up to the next ₹…99. Reproduces every design number and all three BP §4 worked examples. Confirm the rounding rule. |
| B5 | Calculator range | No limits in either spec. | Slider thumb at ₹1,400; hint says most mentors sit at ₹500–₹2,500. | Slider ₹300–₹3,000 (₹50 steps); typed values ₹100–₹10,000. Open. |
| B6 | Group masterclass pay | Flat ₹1,000–1,500 per session (PP §2). | Shown as a range. | Built as design |
| B7 | Tier 3 price vs formats | Tier 3 is ₹999 retail → ₹700 (BP §1), but the 45-min standard mock is ₹499 → ₹330 (BP §4) — open conflict C4. | Both appear on this page. | Open |
| B8 | Accordion copy and icons | — | The design showed one generic search icon and copy for one point only. | Copy and icons from the supplied `content-for-points.png` (badges, privacy, ranking). |
| B9 | "Become a Mentor" links | Mentors apply on the separate platform (IC §2). | — | Per the product owner: site links (footer, homepage banner) → `/become-a-mentor`; this page's apply buttons → `platform.mentorle.in/become-a-mentor` (new tab). |
| B10 | Reused icons | — | Several icons repeat across sections. | "What we ask of you" reuses the calendar (reschedule) and wallet (async SLA) icons in light colour via `MaskIcon`. Confirm, or supply dedicated icons. |

## 6. Events & Summits page (`/events`) — built 2026-10-13

| # | Item | What the spec says | What Figma shows | Status |
|---|---|---|---|---|
| E1 | Opportunity types | Four types: hackathon, event, job, freelance (IC §12). | Same four as filter tabs. | Matches |
| E2 | Sources | Prototype: "MLH, Devfolio, Eventbrite, and more"; wireframe assumed Luma, District, Wellfound, Naukri, Upwork (IC §12, an assumption). | Hero names MLH, Devfolio, Luma, Wellfound; the feed shows Upwork. | Built as design; source list still needs confirming |
| E3 | Membership gating | Free users see only local/regional listings; Pro sees all-India, remote MNC and global (PP Table 2). | No gating, Pro badge or "unlock" state anywhere in the feed. | Open |
| E4 | Hero buttons | — | "Become a Mentor" / "See what you would earn" are copied from the Become a Mentor hero and don't relate to events. Built linking to `/become-a-mentor` and its calculator. | Open — suggest e.g. "Browse Opportunities" / "Host with Mentorle" |
| E5 | Eyebrow typo | — | "Hosteded by Mentorle". | Fixed ("Hosted by Mentorle") |
| E6 | "Open for Students" | — | Looks like a ghost button but has no obvious action. | Built as a non-clickable audience tag |

**Content and design gaps**

| # | Item | What's missing | What's built for now |
|---|---|---|---|
| ED1 | Feed data | The design repeats one Upwork gig four times. | Six placeholder records across all four types in `src/data/events.ts`, shaped for a future CMS/database feed. Buttons link to each source's site (new tab). |
| ED2 | Button labels per type | Only "Bid on Gig" is designed. | Hackathon → "Register", event → "RSVP", job → "Apply Now", freelance → "Bid on Gig". |
| ED3 | Hosted gatherings | Only the centre card (Punjab Technical Conclave) has content. | Two placeholder gatherings; registration buttons go to `/signup` until an event/registration flow exists. |
| ED4 | Empty state, pagination, "refreshed daily" | Not designed. | Empty state + "Clear filters" as on Find a Mentor; no pagination yet. |

## 7. Enterprise page (`/enterprise`) — built 2026-10-14

| # | Item | What the spec says | What Figma shows | Status |
|---|---|---|---|---|
| N1 | B2B offering | Not in either spec (both are mentee/mentor only). | Universities: campus summits, white-label alumni mentoring. Companies: employee upskilling, EdTech API integrations. Needs pricing, contracts and scope. | Built as design |
| N2 | Hero copy and buttons | — | Subtitle is copied from the Events page; buttons are copied from Become a Mentor ("Become a Mentor" / "See what you would earn"). Neither fits a B2B page. | Open — suggest a B2B subtitle and "Contact Sales" / "Book a Demo" |
| N3 | Contact Sales | — | Button with no destination designed. | Links to `/contact` (planned, 404s for now). Needs a contact form or sales email. |
| N4 | "For Universities" footer link | — | Footer has separate "For Universities" and "For Enterprise" links; one page covers both. | "For Universities" → `/enterprise#universities`; "For Enterprise" → `/enterprise`. |

