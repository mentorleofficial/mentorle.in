# CLAUDE.md — mentorle.in

Guidance for Claude Code (and any developer) working in this repository.

@AGENTS.md

## What this is

The public, **mentee-facing** Mentorle website (mentorle.in): marketing pages plus, later, the mentee flows (find a mentor, booking, membership, account). The mentor and admin panel is a separate app (`../Mentorle-Version2`). "Become a Mentor" always links out to `https://platform.mentorle.in/become-a-mentor`.

Operator: AltioraEdtech Learning (OPC) Pvt. Ltd. (legal details live in `src/data/site.ts`).

**Current scope: frontend only.** No backend, auth or payments yet. Content is static, in typed data files.

## Stack

- Next.js 16 (App Router, `cacheComponents` + `partialPrefetching` on, Turbopack), React 19, TypeScript
- Tailwind CSS v4 — CSS-first config in `src/app/globals.css` (`@theme`), no `tailwind.config.js`
- GSAP 3 + `@gsap/react` (animations, ScrollTrigger), Lenis (smooth scroll)
- Font: **Manrope only**, via `next/font/google` in `src/app/layout.tsx`

## Commands

```bash
npm run dev     # dev server
npm run lint    # ESLint — must pass
npm run build   # production build — must pass
npm start       # serve the production build
```

There's no test suite yet. Verify UI changes by building, running the app and checking screenshots at multiple widths (see the checklist below).

## Where things are

```
src/app/                  routes (layout.tsx, page.tsx per route), globals.css (design tokens)
src/components/layout/    SiteHeader, SiteFooter (shared by every page)
src/components/ui/        reusable primitives: ButtonLink, SectionHeader, ArrowControls, ProgressiveBlur, ScrollRevealText
src/components/motion/    ScrollAnimations (data-attribute animation runner), SmoothScroll (Lenis), CountUp
src/components/<page>/    page-specific sections (e.g. components/home/)
src/data/site.ts          nav, footer columns, social links, company/legal info, external URLs
src/data/<page>.ts        all copy, image paths and image sizes for that page
public/<page>/            assets for that page (e.g. public/homepage/)
docs/DESIGN-SYSTEM.md     colours, type scale, spacing, components, motion, responsive rules, gotchas
docs/SPEC-VS-DESIGN.md    running list of differences between the spec documents and the Figma
context-files/            (gitignored, local only) spec PDFs, IMPLEMENTATION-CONTEXT.md, Figma PNG exports
```

## Standing rules

1. **Read `docs/DESIGN-SYSTEM.md` before building or changing any UI.** Reuse its tokens, type scale, spacing and components. Every page must look like it belongs with the homepage. If a new page introduces a genuinely new pattern, add it to the design system doc in the same change.
2. **Figma wins over the spec documents.** When the design and the specs (`context-files/*.pdf`, `IMPLEMENTATION-CONTEXT.md`) disagree, build what the design shows, then **add a row to `docs/SPEC-VS-DESIGN.md`**. The user takes that file to their senior for decisions.
3. **Match the design precisely.** Measure from the Figma export (see the workflow below); don't eyeball sizes. Card/image sizes, font sizes, letter-spacing and colours have all been verified against the design. Keep it that way.
4. **`rem` units only** for sizes (px ÷ 16), so the layout scales on large screens. See DESIGN-SYSTEM §1.
5. **Copy goes in `src/data/*.ts`**, never hard-coded in components. Mark placeholder copy with a comment and log it in `SPEC-VS-DESIGN.md`.
6. **Animations through the motion system** (`data-hero`, `data-animate`, `data-parallax`, `CountUp`), not ad-hoc libraries. Respect reduced motion.
7. **Don't add visual hacks the design doesn't have** (extra gradients, vignettes, shading, decorative icons) without asking. The user has rejected these before.
8. The footer's **Grievance Officer block is legally required** (DPDP Act). Never remove it.
9. Only commit when the user asks.

## Building a new page — workflow

1. **Find the design** in `context-files/figma/<page>/`. Only Home, Find a Mentor, Mentorle Plus and Speaker Hub exist so far; other pages are still being designed, so ask before building one with no design.
2. **Slice the export to read it at full size.** The PNGs are 2880px wide (a 1440 frame at 2×), too tall to view whole. With PyMuPDF (`import pymupdf`), open the PNG, then `page.get_pixmap(clip=Rect(...))` in ~720-design-px tall bands. 1 design px = 2 image px. Sample exact colours with `pixmap.pixel(x, y)`.
3. **Measure, then map to the design system.** Most values will already exist in DESIGN-SYSTEM. Measure any new text by comparing its rendered width/height against the export.
4. **Move assets** for the page into `public/<page>/` (keep `context-files/` as the untouched source). Check images for baked-in text.
5. **Write `src/data/<page>.ts`**, then sections in `src/components/<page>/`, composed in `src/app/<route>/page.tsx`. Sections are server components; only interactive parts are `"use client"`.
6. **Add motion** with data attributes (headers already animate via `SectionHeader`).
7. **Verify:** `npm run lint` and `npm run build` pass. Run the production build and screenshot at **375, 768, 1024, 1440, 1728, 1920** wide: no horizontal scroll, nothing hidden after scrolling, no console errors. Compare the 1440 render section by section against the Figma.
8. **Update `docs/SPEC-VS-DESIGN.md`** (and DESIGN-SYSTEM if you added a pattern).

## Routes (planned)

Built: `/`. Linked but not built yet (they 404 for now): `/mentors`, `/pricing`, `/community`, `/about`, `/events`, `/speaker-hub`, `/universities`, `/enterprise`, `/community-guidelines`, `/privacy`, `/terms`, `/login`, `/signup`. Keep these paths when building the pages, since nav and footer links already point at them (`src/data/site.ts`).
