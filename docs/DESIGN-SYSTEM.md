# Mentorle design system

The single source of truth for how pages on mentorle.in look, move and scale. Every value here was **measured from the Figma export** (`../mentorle-context/mentorle.in/figma/homepage/homepage.png`, a 1440px frame exported at 2×) and is already implemented in code. When building a new page, reuse these values and components before inventing new ones. If a new Figma page needs something that isn't here, add it to this file in the same change.

- Code tokens live in `src/app/globals.css` (`@theme`). This doc explains how to use them.
- Font: **Manrope** everywhere. It's loaded once in `src/app/layout.tsx` via `next/font/google` and exposed as Tailwind's `font-sans`. Never add another font.

---

## 1. Units and scaling

- **Use `rem` for every size** (text, spacing, widths, heights). Convert Figma px ÷ 16: `130px → 8.125rem`, `37px → 2.3125rem`. Don't write `px` in Tailwind arbitrary values. The only exceptions are 1px hairline borders (`border`) and blur radii (`backdrop-blur-[6px]`), which shouldn't scale.
- **The layout scales above 1440px.** The root font-size is 16px up to 1440px wide, then grows smoothly to a 24px cap (`clamp(16px, 0.5vw + 8.8px, 24px)` in `globals.css`). Because everything is rem-based, the whole page scales proportionally on MacBooks (1512–1728 CSS px) and large monitors. Anything written in px won't scale and will look small there.
- **Breakpoints** are Tailwind defaults: `sm` 640, `md` 768, `lg` 1024, `xl` 1280. The Figma frame is desktop-only at 1440, so mobile and tablet layouts are derived (see §7).
- When checking a MacBook in DevTools, use **1512×982 at DPR 2**, not 3024×1964 (that's device pixels).

## 2. Colour tokens

| Token (Tailwind) | Hex | Use |
|---|---|---|
| `brand` | `#E8501B` | Primary CTAs (`See All Events…`, `Find Your Mentor`, `See Plus Pricing`), arrow controls, the orange highlight in headings ("Punjab's #1") |
| `brand-dark` | `#B6370A` | Domain marquee band, brand button hover |
| `ink` | `#2B2B2B` | All primary text on light backgrounds, dark sections (How it works, footer) |
| `ink-soft` | `#686868` | Secondary text on light cards: event detail labels, notes, speaker links, bullets |
| `muted` | `#808080` | Stat numbers, "The Hard Way" card, quote marks, pixel icons |
| `subtle` | `#AAAAAA` | Not-yet-revealed words in the scroll-reveal paragraph |
| `surface` | `#F3F3F3` | Grey section backgrounds, partner strip, dot colour |
| `line` | `#D5D5D5` | Card borders, stat dividers |
| `success` | `#2FAA2F` | Check icons ("The Mentorle Way") |
| `badge` | `#00FF00` | The star in mentor experience badges |
| — | `#CBCBCB` | Mentorle Plus benefit card borders (only place it's used) |

Secondary text on light backgrounds uses `text-ink/85`. On dark backgrounds use `text-white/90` for body, `text-white/75` for footer links, and `border-white/15` for dividers.

## 3. Typography

All Manrope. Weights: **400** (body, eyebrows, buttons), **500 `font-medium`** (all headings and titles), **700** only for the bold part of the mentor badge. Letter-spacing is **normal** unless listed below. The design doesn't use tight tracking on titles.

| Role | Mobile | Desktop (md/lg+) | Weight | Extras | Example |
|---|---|---|---|---|---|
| Hero / banner headline | `text-[2.125rem]` (34) | `md:text-5xl` (48) | 500 | `leading-[1.18]`, `tracking-[-0.01em]` | "Fast-track your growth with Industry Insiders" |
| Section eyebrow | `text-xl` (20) | `md:text-2xl` (24) | 400 | `tracking-[-0.02em]` | "Live Gatherings" |
| Section title | `text-[1.625rem]` (26) | `md:text-[2rem]` (32) | 500 | `leading-tight` | "Upcoming Events & Summits" |
| Statement paragraph | `text-2xl` (24) | `md:text-[2rem]` (32) | 500 | `leading-[1.45]` | "Mentorle connects you with…" |
| Stat number | `text-[clamp(3.5rem,8.3vw,7.5rem)]` (~120 at 1440) | — | 500 | `tracking-[-0.02em]`, `text-muted`, `tabular-nums` | "1,200+" |
| Card title (large) | `text-xl` (20) | `lg:text-2xl` (24) | 500 | — | "Arjun Malhotra", "The Hard Way", "2 Free Sessions" |
| Accordion title (dark) | `text-2xl` | `md:text-[1.75rem]` → `lg:text-[2rem]` | 500 | — | "Find Your Insider" |
| Quote text | `text-base`/`text-lg` | `lg:text-xl` (20) | 400 | `leading-[1.35]` | Testimonials |
| Body / descriptions | `text-base` (16) | `text-base` | 400 | `leading-snug` | Section descriptions, card copy |
| Small / meta | `text-sm` (14) | `lg:text-base` where roles need it | 400 | — | Mentor role, badge, buttons |
| Nav links | `text-[0.9375rem]` (15) | — | 400 | — | Header nav |
| Footer column heading | `text-xl` | — | 500 | — | "Platform" |
| Footer links | `text-lg` | `md:text-xl` | 400 | `text-white/75` | "Find a Mentor" |
| Footer legal rows | `text-base` | `md:text-lg` → `xl:text-xl` | 400/500 | — | Company, CIN, grievance, © |

## 4. Layout and spacing

**Container.** Always wrap content in the `container-page` utility. It's a max content width of `83.75rem` (1340px) plus the side gutter, centred. Gutter is `--gutter`: **1rem** (<768), **2rem** (≥768), **3.125rem** (≥1280, = the Figma's 50px). Full-bleed elements (hero, marquee strip, stat row, carousels) sit outside the container. Use `var(--gutter)` when something must align with the container edge.

**Section rhythm.**

| What | Value |
|---|---|
| Section vertical padding | `py-16 md:py-24 lg:py-[8.125rem]` (64 / 96 / **130px**) |
| Section header → content | `mt-12 md:mt-16` (48 / 64) — carousels use `md:mt-20 lg:mt-[6.25rem]` (100) |
| Grid gap between cards | `gap-5` (**20px**) |
| Content → bottom CTA | `mt-12 md:mt-16` |
| Hero height | `h-svh`, `min-h-[37.5rem]`, `md:min-h-[45rem]`, `md:max-h-[50rem]` (800) |
| Partner strip | `mt-5` below hero, height `4.5rem` (72) |

**Section backgrounds alternate** between `bg-dots` (white with a 1.5rem/24px dot grid in `surface`) and `bg-surface` (flat grey). Dark sections use `bg-ink`. Homepage order for reference: dots → dots → surface → dots → (image banner) → dots → ink → dots → surface → dots → footer (ink).

**Grids.** The desktop grid is 3 columns of `27.0625rem` (433px) with 20px gaps (433×3 + 40 = 1340). Two-up layouts are `md:grid-cols-2`. Section headers use `md:grid-cols-[1fr_minmax(0,22rem)] lg:grid-cols-[1fr_25.625rem]`: the right column (description + optional CTA) starts at x=980 in the Figma.

**Cards.**
- Square corners. **No border radius** anywhere except the mentor experience badge (`rounded-[0.4rem]`).
- 1px `border-line` on white (`bg-white`), or `border-[#cbcbcb]` on grey sections.
- Padding: `p-5 lg:p-6` for quote/benefit cards, `p-6 md:px-8 md:py-9` for comparison cards, `p-3` for image+text bento cards (image inset 12px).
- Image aspect ratios from the design: mentor photo `433/377`, bento image `433/336`, bento tile `433/360`, success-story photo `299/353`, events carousel card `57.375rem × 33.25rem` (918×532, inactive 486 tall).

**Buttons** (`ButtonLink` / `buttonClasses` in `src/components/ui/ButtonLink.tsx`): height `2.3125rem` (37), `px-[1.125rem]`, `text-sm`, weight 400, square, 1px border.

| Variant | Look | Used for |
|---|---|---|
| `brand` | Orange fill, white text | Primary CTA on light backgrounds |
| `light` | White fill, ink text | Primary CTA on photos/dark ("Explore Mentorle Plus", "I'm new here ?") |
| `ghost` | `bg-black/20`, white text, `border-white/30` | Secondary CTA on photos ("Find a Mentor", "Login") |
| `dark` | Ink fill | Available; not yet used on the homepage |

Pairs on photos are always `ghost` + `light`, 8px apart (`gap-2`), centred.

## 5. Reusable components

| Component | File | Notes |
|---|---|---|
| `SiteHeader` | `components/layout/SiteHeader.tsx` | Frosted bar over the hero: `bg-black/20` + `backdrop-blur-[6px]` (tuned to match Figma — don't increase). Collapses below `lg`. |
| `SiteFooter` | `components/layout/SiteFooter.tsx` | Identical on every Figma page. Includes the **legally required Grievance Officer block** — never remove. At ≥1440px (`min-[90rem]:`): columns start at x=50 / 647 / 865 / 1130; between `xl` and 1440 the columns size to their content so nothing overflows (`grid-cols-[37.3125rem_1fr]`, then `[13.625rem_16.5625rem_1fr]`); top band 131px above / 53px below; legal band 48px padding; copyright band 47px. Measured on the Find a Mentor export. |
| `SectionHeader` | `components/ui/SectionHeader.tsx` | Eyebrow + title (left), description + optional `action` (right). Use for every section intro. Titles honour line breaks from the data (`whitespace-pre-line`). `aside` sets the right column from lg: `default` 410px, `wide` 433px, `narrow` 261px. |
| `ButtonLink` / `buttonClasses` | `components/ui/ButtonLink.tsx` | All CTAs. Pass `external` for off-site links. |
| `ArrowControls` | `components/ui/ArrowControls.tsx` | Orange prev/next pair. `size="sm"` (41px) in small frames, `md` (69×66) for carousels. The left arrow is drawn faded by design. |
| `ProgressiveBlur` | `components/ui/ProgressiveBlur.tsx` | Frosted bottom fade for text over photos (events cards). See the gotcha in §8. |
| `ScrollRevealText` | `components/ui/ScrollRevealText.tsx` | Large paragraph whose words turn from grey to ink on scroll. |
| `CountUp` | `components/motion/CountUp.tsx` | Animated numbers (0 → target), used only for the homepage stats (the pricing page shows static prices, per the product owner) with `prefix` (e.g. `₹`), `suffix`, `decimals`, and `as` (`dd` default, `p`, `span`). Screen readers get the final value through visually hidden text. |
| `MentorCard` | `components/mentors/MentorCard.tsx` | Photo + rounded experience badge + name/role. Takes a `Mentor` from `src/data/mentors.ts`, an optional `href` (default `/mentors`), an optional `action` (rendered 18px under the role and layered above the card's stretched link so it stays clickable) and `bordered` (1px `border-line` on the info box, used on `bg-dots` sections). Used on Home, Find a Mentor and Speaker Hub. |
| `HeroSlideshow` | `components/home/HeroSlideshow.tsx` | Homepage hero background slideshow (GSAP). Backgrounds are blurred (`blur-[0.625rem]` on a `data-hero-blur` wrapper, oversized so soft edges fall outside); the card's thumbnails are sharp. Every `hero.autoplayMs` (2.1s, counted after each transition ends) the next image expands out of the bottom-right card to fill the hero, blurring as it grows (clip-path from the card's box, image settling from 1.12 scale), while the old image recedes (scale 1.08, brightness 0.55) and the card's preview slides left. The left arrow reverses it (the image shrinks back into the card and sharpens). Below md the image wipes in from the right; reduced motion fades. Hover/focus on the card pauses. Card `thumb` files are separate so they never share a URL with the full-screen (LCP) slide. Hero copy: 48px title with a line break from the data (`whitespace-pre-line`), 15px subtitle at `white/85`. |
| `PageHero` | `components/ui/PageHero.tsx` | Hero for inner pages: full-bleed photo, 48px title, optional 14px subtitle (`text-white/85`, max width 28rem), `ghost` + `light` CTA pair. 720px tall on desktop (`md:h-[45rem]`), text block starts 112px down. `overlayOpacity` defaults to 0 (the hero images ship pre-darkened). Per-design knobs: `subtitleSize` (`sm` 14px on Find a Mentor, `base` 16px on Mentorle Plus) and `contentOffset` (text block top, default `md:pt-[7rem]`; Mentorle Plus and Speaker Hub use `md:pt-[3.75rem]`). Title max width 50rem. |
| `PlusBenefits` | `components/home/PlusBenefits.tsx` | Three Plus benefit cards (264px tall at desktop) under a `SectionHeader`. Props: `eyebrow`, `title`, `description`, `action` (pass `null` for no CTA, which also widens the header→cards gap to 76px). Section padding 130 top / 163 bottom. Used on Home and Mentorle Plus. |
| `PlanCard` / `PricingPlans` | `components/pricing/` | Pricing cards; see the pricing pattern below. `PricingPlans` takes an optional `header` (a `SectionHeader` above the cards), `className` for padding and `background` (`dots` on the pricing page, `surface` on the homepage). On grey, `PlanCard onSurface` drops the white fill and uses `#cbcbcb` borders (the featured card keeps its brand border). |
| `IconCard` / `IconCardSection` | `components/ui/IconCard.tsx`, `components/ui/IconCardSection.tsx` | Pixel-icon card (icon top, title + description pinned to the bottom). Icons keep their own size (1px = 1 design px; 80% below lg), vertically centred in a 69px slot, so short icons aren't stretched. `IconCardSection` = `SectionHeader` + a 3- or 4-column grid; props `background` (surface / ink / dots), `action` (button under the description), `padding`, `headerAside`. Used on Become a Mentor, the homepage ("What would you like help with?") and Events ("How it works"). Plus benefits use their own copy of this layout. |
`. Used by `IconCardSection` on Become a Mentor; Plus benefits use their own copy of this layout. |
| `SectionHeader` `tone` | `components/ui/SectionHeader.tsx` | `tone="dark"` for headers on `bg-ink` sections (white title, `white/90` description). |
| `HowItWorks` | `components/home/HowItWorks.tsx` | Dark pixel-icon accordion. Props `steps` and `ariaLabel` (defaults: homepage steps). Also used on Become a Mentor for badges / privacy / ranking. Autoplays: the open point's line is a progress bar across the full row width (faint `white/15` track, `white/80` fill) that fills over `autoplayMs` (default 2.5s), then the next point opens, wrapping. It pauses while a mouse hovers the section, while it's off-screen, and on keyboard focus inside it (`:focus-visible` only, so a mouse click doesn't leave it paused once the pointer leaves); clicking a point switches and restarts the bar. No autoplay with reduced motion. |
| `MentorBanner` | `components/home/MentorBanner.tsx` | Full-bleed blurred-photo banner with title + ghost/light CTAs. Props `title`, `primaryCta`, `secondaryCta` (each may be `external`). Same height everywhere (`min-h-[26.25rem] md:min-h-[34.6875rem]`, per the product owner). Homepage default; Become a Mentor uses it as its closing banner. |
| `MentorDirectory` | `components/mentors/MentorDirectory.tsx` | Filter tabs + search + mentor grid + empty state. See the filter-bar pattern below. |
| `MaskIcon` | `components/ui/MaskIcon.tsx` | Paints a single-colour SVG with `currentColor` via CSS mask, so one icon file works on light and dark backgrounds. |
| `useCarouselLoop` | `components/home/useCarouselLoop.ts` | Clones slides so carousels can loop seamlessly (see §6). |

**Filter bar pattern** (Find a Mentor; reuse for any filterable list such as events or speakers):
- Tabs and inputs share the button height `2.3125rem` (37px), `text-sm` and square corners, with a `border-[#dadada]` hairline on `bg-surface`.
- Active tab is `bg-ink text-white`; inactive tabs are transparent with ink text and a 1rem icon. Tabs sit 12px apart (`gap-3`).
- The search box is `29.5625rem` (473px) wide at `lg`, right-aligned, with a 16px magnifier at left 18px and placeholder text at `ink/70`.
- The bar sits directly under the section top padding (130px); the grid follows `mt-16` (64px) below.
- Below `lg` the tabs scroll horizontally (`no-scrollbar`, bleeding to the screen edges) and the search box takes a full-width row underneath.
- Filtering announces the result count in a visually hidden `aria-live` region. New results fade and rise in (0.6s, 0.06s stagger). The empty state is a muted line plus a "Clear filters" link.

**Pricing card pattern** (Mentorle Plus):
- **Grid:** the standard 3 × 433px grid. Below `lg` the cards stack in one centred column (max 34rem).
- **Featured plan:** a 42px `bg-brand` banner ("Most Popular", 15px, 24px left padding) sits on top, and the card gets a `border-brand` border with no top border. Non-featured cards get `lg:pt-[2.625rem]` so all cards start level, and all three stretch to equal height.
- **Card content** (24px padding):
  - title `text-2xl`, tagline `text-base`;
  - price at 84px at 1440 (`xl:text-[clamp(4.5rem,5.85vw,5.25rem)]`, `lg` 52px, mobile 60px), weight 500, `ink` for the featured plan and `muted` for the others, followed by the period in `text-base`;
  - a note line (always reserves 24px so features align across cards);
  - features `text-base`, 10px apart, with a check / star (bold row) / cross (muted row) icon;
  - a full-width button pinned to the bottom (`dark` or `brand`).
- **Terms line:** centred `text-base` 48px below the cards, with the key phrase in `font-semibold`.
- **Section:** `bg-dots`, 136px top padding (the banner sits 136px below the hero) and 130px bottom.

**Request tile pattern** (Speaker Hub "Don't see who you need?"): fills a grid cell next to cards (full width on tablet, `md:col-span-2 lg:col-span-1`). Orange gradient (`bg-brand` plus a soft radial highlight, #E8521E → ~#ED8059), centred white text: 32px heading (1.35 line height), 16px body (max 19.75rem), `light` button 24px below. Content sits slightly below centre (`pt-11`).

**Opportunity row pattern** (Events & Summits, `components/events/OpportunityFeed.tsx`): a full-width row card (`border-[#cbcbcb]`, 24px padding, 25px gap between rows) with a `#ea7146` source chip (37px tall) + categories, a 24px title, and a meta line of pixel icons (`OpportunityIcons.tsx`: people, pin, wallet) at 18px. A dark button (min-width 7.5rem) sits right-aligned, stacking under the content on phones. It uses the same filter bar (tabs + search, `aria-live` count, empty state) as Find a Mentor.

**Gatherings carousel with CTAs** (`GatheringsCarousel`): events may carry `date`, `audience` (a non-clickable ghost-style tag) and `cta` (a light button, rendered only on the active slide so hidden slides have no tab stops). When any event has a `cta`, the carousel is taller on phones (26rem active) and the bottom blur covers more of the card.

**Offer list pattern** (Enterprise, `components/enterprise/EnterpriseOffers.tsx`): a two-column list (50/50 below `xl`; `xl:grid-cols-[46.9375rem_1fr]`, i.e. the second column starts at x=800) of audience headings (32px) and offers (20px icon + 24px title + 16px description, max 17.25rem). Every cell draws a hairline divider that runs edge to edge of the viewport; rows are ~181px. Columns stack on phones. A brand CTA sits 64px below.

**PageHero `subtitleWidth`**: overrides the subtitle max width (Events and Enterprise use `max-w-[35rem]` so the subtitle wraps in two lines as designed; both use `contentOffset="md:pt-[6.25rem]"`).

**Feature split rows** (Community, `components/community/FeatureSplit.tsx`): alternating image/text rows from `lg`. The image sits inset 18px in its half (aspect 684/412); the text half (24px eyebrow, 32px title, 16px body, brand button 24px below) is vertically centred with 48px inner padding. A hairline runs down the centre and full width under each row. Below `lg` rows stack (image on top, inset 32px on tablet). Row content is capped at `max-w-[90rem]` and centred so ultra-wide screens keep the design's image/text balance; the hairlines stay edge to edge. Animations: `data-animate="image"` on the photo, `stagger` on the text.

**Dark pillar strip** (Community, `CommunityPillars.tsx`): `bg-ink`, four centred columns (32px title, 16px body at `white/90`, max 16.25rem), 2 columns on tablet, stacked on phones.

**Auth modal** (`components/auth/`, copy in `src/data/auth.ts`): a fixed overlay (`bg-black/45 backdrop-blur-xl`) over the current page with a white, square card (max 551px, 50px top padding, ✕ at top right). Title 32px medium, subtitle 16px, a 330px form column (`formColumn`), 36px fields with a `line` border, a full-width 37px brand button, and a 14px switch link underneath. `AuthModal` picks the flow (`LoginFlow`, `SignupFlow`, `ForgotPasswordFlow`); each flow renders one `AuthStep` at a time. `AuthStep` fades in (`auth-step-in`) and focuses its first field. The card fades/scales in (`auth-backdrop-in` / `auth-card-in`), traps focus, locks scroll, and closes on Esc, ✕ or an outside click. The card is centred with `m-auto`, so a tall step scrolls inside the overlay on phones.
- **Signed-in visitors:** login, signup and forgot-password never render for someone already signed in (e.g. an event button that links to `/signup`). `AuthDialog` renders nothing and sends them on: to the onboarding modal if their profile isn't finished, otherwise back to the page. Once a form inside the modal has been submitted, signing in is the flow's own doing and the dialog keeps showing.
- **Links between auth screens:** use `AuthLink` (replace navigation inside the modal, full navigation on direct pages, carries `?redirect=`).
- **After a session exists:** call `finish()` from `useAuthModal()`.
- **Routing:** `app/@auth/(.)login`, `(.)signup` and `(.)forgot-password` intercept soft navigations and render into the layout's `auth` slot. `@auth/default.tsx`, `@auth/page.tsx` and `@auth/[...catchAll]` return null; the catch-all is what closes the modal when a flow navigates elsewhere (e.g. to `/onboarding`). `app/login`, `app/signup` and `app/forgot-password` handle direct visits (homepage + modal).
- **Testing:** with `cacheComponents`, closed modals stay in the DOM inside a hidden `<Activity>`, so tests must check visibility, not presence.

**Form primitives** (`components/forms/`), shared by auth and onboarding:
- **`TextField`, `PasswordField` (show/hide), `TextAreaField` (counter).** Label hidden + placeholder inside auth cards (per Figma), visible 14px medium label elsewhere. 12px `brand-dark` errors, 12px `muted` hints.
- **`PhoneField`** (country select showing "IN +91", value `"+91 9876543210"` like the platform).
- **`DateField`** (Day / Month / Year selects; validates when focus leaves the group).
- **`OtpInput`** (one real input drawn as square boxes, so paste and one-time-code autofill work).
- **`Checkbox`** (square, brand when checked).
- **`ChipInput`** (tags as `bg-ink` chips, suggestions as outlined pills).
- **`FormAlert`** (error: brand outline on `brand/5`; info: `bg-surface`).
- **`SubmitButton`** (full-width brand, spinner when loading).
- **`outlineButtonClasses`** (ink outline on white, for secondary actions).

Form state uses `useZodForm` (`src/lib/forms/`). Errors show after blur or submit; server errors stay until the field changes. Schemas live in `src/lib/auth/schema.ts`, ported from the platform.

**Onboarding steps** (`components/onboarding/OnboardingFlow.tsx`): the 6-step wizard runs **inside the auth modal**, so signup → verify → You're in! → onboarding is one continuous card.
- **Routes:** `/onboarding` is intercepted like `/login` (`@auth/(.)onboarding`); a direct visit opens it over the homepage.
- **Progress:** a 4px brand bar along the card's top edge (on `surface`), with a 12px uppercase "Step x of 6" above the usual 32px title + subtitle.
- **Fields:** they span the full card width, with visible labels (unlike the login/signup placeholders) because they need "(optional)" and counters.
- **Footer:** Back (outline) + Continue (brand, fills the row), with a "Save & exit" text link below; it saves a draft and closes. ✕, Esc and an outside click also save what was typed (the wizard saves in its effect cleanup, which runs whenever the modal closes or Next hides it).
- **Review step:** stacked label + Edit, value rows.
- **Reopening:** gets a fresh flow. `AuthDialog` re-keys the flow when the hidden `<Activity>` cleans up, so no stale state survives; drafts come back from the saved profile.

**Signed-in header** (`components/layout/AccountMenu.tsx`, state from `useAuth()` in `src/lib/auth/AuthProvider.tsx`, which wraps the layout):
- **Desktop:** the left buttons become a square brand avatar (initials or photo) + first name + chevron, opening a white menu (email, then Complete your profile / Find a mentor, then Log out).
- **Mobile:** the menu panel shows the same items.
- **First render:** the static HTML can't know who is signed in, so the account area stays transparent (`opacity-0`) until the session is read after hydration, then fades in. Signed-in users never see Login flash before their avatar.

**Event detail** (`/events/<slug>`, `components/event-detail/`, data in `src/data/event-details.ts`):
- **Hero (`EventHero`):** left-aligned, 520px tall on desktop, no overlay (the exported background is already blurred and dark). It holds a 15px breadcrumb with a back arrow, then a 36px status chip (`bg-[#fff0ea]`, brand text, check icon when completed) with the event kind beside it. Below those come the 48px title, a 20px subtitle and a 16px "Hosted by" line at `white/85`.
- **Layout:** a 2-column grid (`minmax(0,1fr)` + 25.875rem at xl, 22rem at lg, 40px gap, 72px between rows) on `bg-dots`. Row 1 is the cover + "Event details" card; row 2 is the content + speaker/highlights stack (28px gap). Below lg everything stacks in that order.
- **Cover card (`EventCover`):** generated from data, not an image. `bg-ink`, 40px padding, at least 448px tall. Top row: "MENTORLE" (16px semibold) and the host (14px `white/80`). Then a 48 × 3 brand rule, the title in caps (46px, line height 52px, max 28rem), an 18px subtitle at `white/80`, and a bottom row with the journey icons (`/event-detail/vector-*.svg` + `arrow.svg`) and the date/time (14px, right-aligned).
- **"Event details" card:** `bg-surface`, `border-[#cbcbcb]`, 28px padding, 24px title. Each row has a 20px icon, a 14px `ink-soft` label and a 16px value. A divider follows, then the registration action (brand "Register Now", or a disabled `bg-[#e3e3e3]` "Registration closed" with a lock icon) and a 14px `ink-soft` note.
- **Content:** 32px section headings, 16px body with 29px line height, and a `line` divider. "What You'll Learn" is a check-list on a `surface` panel (60px rows, `#cbcbcb` dividers inset 24px, brand check icons). "Prerequisites" uses 4px `ink-soft` square bullets.
- **Sidebar cards:**
  - **Guest Speaker:** white with a `line` border. A 72px initials avatar on `surface` (or a photo), the 24px name, the 16px role, then a divider and 14px links.
  - **Event Highlights:** a `surface` panel with brand ↗ icons and 16px items at 26px line height.
- **Registration (`RegisterAction`, client):** upcoming events with `registration` set show the event's own button label (brand, 48px). Signed out, it links to `/signup?redirect=/events/<slug>`; with an unfinished profile, to `/onboarding?redirect=…`; signed in and onboarded, it registers in place (spinner "Registering…"). Registered shows a `bg-[#fff0ea]` brand "✓ You're registered" bar and a note with "Cancel registration". The note under the button explains the next step or the deadline. The server render is always the signed-out state; registration state is read from storage with `useSyncExternalStore`, so there's no hydration mismatch.
- **Dates:** formatted by `src/lib/dates.ts`, always in IST ("October 13, 2025 · 11:00 AM IST").
- **Route:** prerendered for every slug. The page reads `params` inside `<Suspense>` (Cache Components' instant-navigation rule).

**Gathering card time/date** (`GatheringsCarousel`, `when` in the data): bottom-right of the active card, a clock row and a calendar row (15px, `MaskIcon` of the event-detail icons painted white), right-aligned, 6px apart. Hidden below 640px.

**Opportunity cards** (Events, `OpportunityFeed`): 3 columns at lg, 2 at sm. Photo (aspect 433/311) then a 14px gap of section grey, then a white details block (16px padding) with the source chip, categories, 24px title, details row (18px) and the dark button 20px below, bottom-aligned across a row.

**Partner feature block** (Events, `ProPassPartner`): on `bg-dots`, copy left and illustration right: stacked below lg, two equal columns at lg (tablets in landscape), the design's fixed 645px illustration column from xl. 24px eyebrow, 32px two-line title at 44px line height, 16px description (max 26.25rem), a compact 34px brand button (16px text), three feature points (20px line icon, 17px title, 12px note) and a 12px fine-print line 68px below. The text block sits ~24px below the illustration's centre.

**Numbered format cards** (Become a Mentor, `WaysToMentor`): 4 columns at lg, 2 at sm, on `bg-surface`. Same border and hover as `IconCard`. A 36px medium number and a 20px format label on one row, then the 24px title and 16px description pinned to the bottom (min height 298px at lg).

**FAQ accordion** (Become a Mentor, `MentorFaq`): bordered (`#cbcbcb`) rows 16px apart on `bg-surface`; 20px medium question with a "+" that rotates into "×" when open; 16px answer. One open at a time (the first by default). Opening animates with a `grid-template-rows` transition, no JS measuring.

**Mentor profile** (`/mentors/<slug>`, `components/mentor-details/`, data in `src/data/mentor-details.ts` shaped exactly like the platform's mentor record + offerings; `mentorView` derives display values):
- **Top:** a dark band behind the transparent header (no hero image), then a white two-column hero with the text vertically centred against the card: optional 14px orange uppercase tagline (generated from the first three expertise tags, only when each is ≤ 18 characters), 88px name (`tracking-[-0.04em]`), 22px headline (fallback "Role at Organization"), 15px muted role line, a 56px brand "Book a Session →" button and 56px outlined LinkedIn / Portfolio buttons (each only if its URL exists). Right: a 348px card with the photo (aspect 348/288) or **initials on `bg-ink`** when there's no photo, over a `#f0f0f0` panel with the years (48px) and the organization (13px uppercase).
- **Sections:** separated by full-width `line` hairlines, 76px padding. Each opens with the orange uppercase eyebrow and a 48px title (line breaks from the copy). Body text is 18px muted at 30px line height. Order: About, Sessions (`bg-surface`), Expertise, Experience, banner. No Core Services, no Education.
- **Sessions:** every offering as a white `line`-bordered card in 2 columns (an odd last card spans both): 26px title, 16px muted description, Duration and Price (13px label / 16px value), and a brand Book button pinned to the bottom. No offerings → a one-line "hasn't published sessions yet".
- **Experience:** platform `experiences` (company, title, location, YYYY-MM dates formatted "Aug 2025 – Present"), 24px title, 16px company, 18px muted description.
- **Sparse profiles:** every block except the hero and Sessions hides when its data is empty; nothing is invented.
- **Responsive hero:** phones stack the photo card first, then the text. Tablets (md–lg) keep text and card side by side with a 240px card, 52px name, 16px headline and compact 44px buttons (compact until xl) so the three buttons stay on one row; from lg the type grows back to 72px, and to the design's 88px at xl.

**Pages** follow `hero → content section(s) on bg-surface/bg-dots → footer`. Speaker Hub is `PageHero` + one `bg-dots` section (2 speaker cards + request tile) + footer. Find a Mentor is `PageHero` + one `bg-surface` section + footer. Mentorle Plus is `PageHero` + `PricingPlans` (`bg-dots`) + `PlusBenefits` (`bg-surface`) + footer.

Content lives in typed data files: `src/data/site.ts` (nav, footer, company/legal info, external URLs), `src/data/mentors.ts` (the `Mentor` model, shaped like the future API record, plus domain filters; the homepage's featured mentors come from here too) and `src/data/<page>.ts` (page copy, image paths and sizes). Components never hard-code copy. Placeholder copy gets a one-line comment in the data file and an entry in `docs/SPEC-VS-DESIGN.md`.

## 6. Motion system (GSAP + Lenis)

Animations are declared with data attributes and run by `components/motion/ScrollAnimations.tsx` (mounted once in the layout), so page sections can stay server components.

| Attribute | Effect | Use for |
|---|---|---|
| `data-hero="0..n"` | On load: fade up in order of `n` | Above-the-fold hero items (header bar = 0) |
| `data-animate="fade-up"` | Fade + rise when scrolled into view | Single blocks |
| `data-animate="stagger"` | Children fade up one after another | Card grids, section headers (already built into `SectionHeader`) |
| `data-animate="image"` | Clip-path reveal + slow zoom-out of the inner image | Standalone photos |
| `data-animate="rise"` | Rise only, no opacity change | Blocks that contain `backdrop-filter` (see §8) |
| `data-animate="words"` | Word colour scrub (set by `ScrollRevealText`) | — |
| `data-parallax="n"` | Scroll-linked vertical drift of ±n% | Full-bleed background images (wrapper must overscan, e.g. `-top-[15%] -bottom-[15%]`) |

Other motion rules:
- **Smooth scrolling** is Lenis (`components/motion/SmoothScroll.tsx`), driven by GSAP's ticker so ScrollTrigger stays in sync. Don't add CSS `scroll-behavior: smooth`.
- **Carousels loop** and autoplay (5–6s), pause on hover/focus/touch, and support swipe and arrow keys. Pattern: clone slides with `useCarouselLoop`, stack them in one grid cell, and position each by its offset from the active slide with `gsap.to(x)`. A slide that wraps from one end to the other is `gsap.set` while off-screen. See `GatheringsCarousel.tsx` (centred) and `SuccessStoriesCarousel.tsx` (left-aligned; on wide screens the previous card peeks in on the left).
- **Hover states**: images zoom to `scale-105` over 700ms; cards lift `-translate-y-1` and darken their border; arrow icons nudge 4px. All buttons get `cursor: pointer` globally.
- Durations: entrances 1–1.2s `power3.out`; carousel moves 0.9s `power3.inOut`; hovers 300–700ms.
- **Reduced motion** is respected everywhere: GSAP work sits inside `gsap.matchMedia("(prefers-reduced-motion: no-preference)")`, Lenis disables itself, and CSS fallbacks (`motion-reduce:`) show final states.

## 7. Responsive rules

- Build desktop to the Figma at 1440, then derive tablet and phone:
  - 3-column card grids stay 3 columns from `md` (shrink text one step: `text-xl`/`text-sm`), and stack below `md`.
  - Bento layouts go 2 columns at `md`, the design's 3 columns at `lg`.
  - Section headers stack below `md`.
  - The footer goes side by side only at `xl`.
  - Carousel arrows that overlap card text on desktop move below the cards below `lg`.
- **Verify every page at 375, 768, 1024, 1440, 1728 and 1920** with no horizontal scroll (`scrollWidth === clientWidth`). Flex children containing marquees or long rows need `min-w-0`.

## 8. Gotchas we've already hit

1. **`backdrop-filter` is switched off while any ancestor's opacity, filter, clip-path or mask is animating.** The blur pops in late. Animate the blurred element itself (the header bar has `data-hero` on the bar, not its wrapper), or use `data-animate="rise"` for containers.
2. **Never change React-rendered text from the global animation script.** It caused hydration error #418, React re-rendered the section, and content stayed hidden. Text that animates (counters) gets its own client component (`CountUp`).
3. **`cacheComponents` is on** (Next 16). Don't call `new Date()`/`Date.now()` in server components during prerender; use constants (see `company.copyrightYear`).
4. **Next 16 `<Image>`**: use `preload`, not the deprecated `priority`. Give `sizes` in rem/vw.
5. **Pre-hydration hiding**: an inline script adds `.js-motion` to `<html>`, which hides animated elements until GSAP takes over; GSAP then removes the class. New `data-animate` types must be added to that CSS rule in `globals.css`. That rule also carries a **CSS-only failsafe** (`motion-failsafe`, 2.5s): if the animation JS is slow or never runs (slow device, blocked or failed script), the content reveals itself instead of leaving only the hero image on screen. If the failsafe has already fired, `ScrollAnimations` skips the hero intro so it doesn't flash. Don't remove it.
6. **Hero photo**: the current hero is a 1280×720 frame from the video with both heads at the top edge. It's anchored `md:object-top` so foreheads sit slightly behind the navbar. Don't add dark gradients, vignettes or duplicated blurred copies to work around cropping (all tried and rejected).
7. Raster assets are WebP (run `npm run images`, see the `optimize-assets` skill). Use the pixel sizes the script prints for `width`/`height` in data files.
8. Exported Figma images can have text baked in. Check assets before overlaying real text, and ask for a clean export rather than blurring over it or trying to erase the text (both were tried on the mentor banner and looked wrong).
9. **GSAP must not touch an element before React hydrates it.** Inline styles written early cause a "tree hydrated but some attributes didn't match" error on every page. `ScrollAnimations` waits until every animated element is hydrated (3s fallback); component-level `useGSAP` is already safe because it runs after its own hydration.
10. **Next's LCP warning tracks images by URL.** If the same image appears twice (the logo in the header and footer), *every* copy must be `loading="eager"`, or the lazy copy re-triggers the warning. Use `loading="eager"` for above-the-fold images; `preload` is only for hero backgrounds.
11. **Links to unbuilt pages log 404s in production**, because Next prefetches every visible link. All `Link`s pass `prefetch={prefetchFor(href)}` (`src/lib/routes.ts`); add each new page to `BUILT_ROUTES`.
12. **`loading="eager"` images get a preload hint in `<head>` (React 19).** If an eager image isn't visible within a few seconds (e.g. inactive slides in a carousel thumbnail), the browser logs "preloaded but not used". Use eager only for images on screen at load; an on-screen lazy image still loads immediately.
13. **Never gate a one-off animation on a "skip the first run" ref.** In development React runs effects twice on mount, so the second run slips past the flag. That fired Find a Mentor's filter animation on page load, where it fought the scroll fade-in (the cards flashed visible, vanished, then faded in). Compare against the previous values instead (see `MentorDirectory.tsx`).
14. **Client components that read the URL (`usePathname`, `useParams`, `useSearchParams`) must sit inside `<Suspense>` once the app has dynamic routes.** On `/events/[slug]` the pathname is "URL data", and Cache Components errors in dev ("encountered URL data during prerendering"). `ScrollAnimations` in the root layout is wrapped for this; pages read `params` inside `<Suspense>` too.
15. **Never use `once: true` on ScrollTriggers; use `toggleActions: PLAY_ONCE` (exported from `ScrollAnimations.tsx`).** A `once` trigger kills itself, and if that happens while ScrollTrigger is refreshing (animations set up while the page is already scrolled, e.g. during Fast Refresh), the trigger list shrinks mid-loop and GSAP throws "Cannot read properties of undefined (reading 'end')". `PLAY_ONCE` plays once and never reverses, the same visible behaviour.
16. **`useGSAP` doesn't run a callback's returned cleanup when its dependencies change** (only on unmount). A tween created per state (like HowItWorks' progress bar) must kill the previous one at the top of the callback, or old tweens keep running: tapping several points on a touch screen left every line filling and advancing the list.
