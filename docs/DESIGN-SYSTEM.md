# Mentorle design system

The single source of truth for how pages on mentorle.in look, move and scale. Every value here was **measured from the Figma export** (`context-files/figma/homepage/homepage.png`, a 1440px frame exported at 2×) and is already implemented in code. When building a new page, reuse these values and components before inventing new ones. If a new Figma page needs something that isn't here, add it to this file in the same change.

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
| `SiteFooter` | `components/layout/SiteFooter.tsx` | Identical on every Figma page. Includes the **legally required Grievance Officer block** — never remove. At `xl`: columns start at x=50 / 647 / 865 / 1130 (`grid-cols-[37.3125rem_1fr]`, then `[13.625rem_16.5625rem_1fr]`); top band 131px above / 53px below; legal band 48px padding; copyright band 47px. Measured on the Find a Mentor export. |
| `SectionHeader` | `components/ui/SectionHeader.tsx` | Eyebrow + title (left), description + optional `action` (right). Use for every section intro. |
| `ButtonLink` / `buttonClasses` | `components/ui/ButtonLink.tsx` | All CTAs. Pass `external` for off-site links. |
| `ArrowControls` | `components/ui/ArrowControls.tsx` | Orange prev/next pair. `size="sm"` (41px) in small frames, `md` (69×66) for carousels. The left arrow is drawn faded by design. |
| `ProgressiveBlur` | `components/ui/ProgressiveBlur.tsx` | Frosted bottom fade for text over photos (events cards). See the gotcha in §8. |
| `ScrollRevealText` | `components/ui/ScrollRevealText.tsx` | Large paragraph whose words turn from grey to ink on scroll. |
| `CountUp` | `components/motion/CountUp.tsx` | Animated numbers (0 → target) with suffix/decimals. |
| `MentorCard` | `components/mentors/MentorCard.tsx` | Photo + rounded experience badge + name/role. Takes a `Mentor` from `src/data/mentors.ts` and an optional `href` (default `/mentors`). Used on Home and Find a Mentor; reuse for Speaker Hub. |
| `PageHero` | `components/ui/PageHero.tsx` | Hero for inner pages: full-bleed photo, 48px title, optional 14px subtitle (`text-white/85`, max width 28rem), `ghost` + `light` CTA pair. 720px tall on desktop (`md:h-[45rem]`), text block starts 112px down. `overlayOpacity` defaults to 0 (the Find a Mentor image ships pre-darkened). |
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

**Pages** follow `hero → content section(s) on bg-surface/bg-dots → footer`. The Find a Mentor page is `PageHero` + one `bg-surface` section (`py-…-[8.125rem]`) + footer.

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
5. **Pre-hydration hiding**: an inline script adds `.js-motion` to `<html>`, which hides animated elements until GSAP takes over; GSAP then removes the class. New `data-animate` types must be added to that CSS rule in `globals.css`.
6. **Hero photo**: the current hero is a 1280×720 frame from the video with both heads at the top edge. It's anchored `md:object-top` so foreheads sit slightly behind the navbar. Don't add dark gradients, vignettes or duplicated blurred copies to work around cropping (all tried and rejected).
7. Raster assets are WebP (run `npm run images`, see the `optimize-assets` skill). Use the pixel sizes the script prints for `width`/`height` in data files.
8. Exported Figma images can have text baked in (`Your-experience-could-changes.png`). Check assets before overlaying real text.
