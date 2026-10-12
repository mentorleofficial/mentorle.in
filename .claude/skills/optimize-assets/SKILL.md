---
name: optimize-assets
description: Convert new or updated raster images (PNG, JPG/JPEG) in public/ to WebP and update their references. Use whenever the user adds, replaces or mentions new assets/images/photos for a page, or before building a page whose assets are PNG/JPG.
---

# Optimize assets (PNG/JPG → WebP)

Every raster image served from `public/` must be WebP. Run this whenever the user adds or updates assets, before wiring them into a page.

## Steps

1. **Find what's new.** List raster files under `public/` (`*.png`, `*.jpg`, `*.jpeg`). Anything listed hasn't been converted yet.
2. **Look before converting.** Read each image: check for baked-in text, transparency that must survive, or anything unexpected, and mention it to the user.
3. **Convert:**
   ```bash
   npm run images                    # every PNG/JPG under public/
   npm run images -- public/<page>   # only one folder or file
   ```
   The script (`scripts/convert-to-webp.mjs`, using sharp):
   - writes `<name>.webp` next to the original: quality 82, max 2880px wide (2× the 1440 design), alpha preserved;
   - moves the original to `../mentorle-context/mentorle.in/originals/<same path>` (outside the repo, so git can't delete it), so nothing is lost;
   - rewrites `/path/name.png|jpg` → `/path/name.webp` in `src/`;
   - prints before/after sizes and the final pixel dimensions.
4. **Fix dimensions.** Update the `width`/`height` in `src/data/*.ts` to the pixel sizes the script printed, especially for any image that was downscaled.
5. **Verify.** `grep -rnE '\.(png|jpe?g)"' src` returns nothing. `npm run lint && npm run build` pass. Images still render on the page.
6. **Report** the size savings to the user in one line.

## Don't convert

- **SVGs** (icons, logos, `favicon.svg`): they're already vector.
- **Video** (`.mp4`): out of scope. Mention it if a large video is added.
- **Anything outside `public/`** (`../mentorle-context/mentorle.in/` is the untouched design source).
