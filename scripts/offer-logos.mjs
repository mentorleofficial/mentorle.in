// Fetches each offer's logo from the brand's own site (its `site` in src/data/offers.ts) into
// public/offers/logos/<slug>.svg|webp and writes the file name into the offer's `logo`.
// Order of preference: an SVG icon, then the largest PNG icon / apple-touch-icon (web manifest icons included), then
// Google's favicon service at 256px. Rasters are trimmed to a 128px square WebP. Anything under 48px is rejected
// (the card would show a blurry logo), and the offer falls back to its lettered tile.
//
//   npm run offers:logos              all offers that have no logo yet
//   npm run offers:logos -- --all     refetch every logo
//   npm run offers:logos -- notion    just these slugs
//
// LOGO_SOURCES overrides the source for brands whose site icon isn't their logo (set after reviewing the results).

import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const DATA = join(ROOT, "src", "data", "offers.ts");
const OUT = join(ROOT, "public", "offers", "logos");
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";
const MIN = 48;

// "si:<slug>" draws that Simple Icons logo (CC0, dev dependency) in its brand colour; "raster:<url>" renders an SVG to
// WebP and trims the empty space around it.
const LOGO_SOURCES = {
  "github-copilot": "si:githubcopilot", // the site icon is GitHub's, not Copilot's
  unity: "si:unity", // site icon is white-on-transparent
  sketch: "si:sketch", // site icon switches colour with dark mode
  tower: "si:tower",
  overleaf: "si:overleaf", // tiny favicon
  carto: "si:carto",
  deepnote: "si:deepnote",
  clerk: "si:clerk",
  arduino: "si:arduino",
  ansys: "si:ansys",
  "microsoft-azure-for-students": "https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg",
  nptel: "https://nptel.ac.in/_app/immutable/assets/logo-m.CNHeS_sM.jpg",
  avid: "https://cdn.avid.com/avidcom/images/shared/avid-logo-mobile.svg",
  "cisco-networking-academy": "si:cisco", // the site icon is a tiny wordmark
  "tech-domains": "https://gettech.b-cdn.net/new-website/img/favicon.png",
  pageclip: "https://d2qlddhczasafd.cloudfront.net/favicon.png",
  "name-com": "https://www.google.com/s2/favicons?domain=name.com&sz=256",
  requestly: "raster:https://requestly.com/img/brand/requestly-icon.svg", // icon sits in a large empty canvas
};

// Simple Icons logo as a standalone SVG in its brand colour (pure black and white become the site's ink).
function simpleIcon(slug) {
  const data = JSON.parse(readFileSync(join(ROOT, "node_modules", "simple-icons", "data", "simple-icons.json"), "utf8"));
  const icons = Array.isArray(data) ? data : data.icons;
  const slugOf = (title) => title.toLowerCase().replace(/\+/g, "plus").replace(/\./g, "dot").replace(/&/g, "and").normalize("NFD").replace(/[^a-z0-9]/g, "");
  const icon = icons.find((entry) => (entry.slug ?? slugOf(entry.title)) === slug);
  if (!icon) throw new Error(`no Simple Icon "${slug}"`);
  const path = readFileSync(join(ROOT, "node_modules", "simple-icons", "icons", `${slug}.svg`), "utf8").match(/<path d="([^"]+)"/)[1];
  const fill = ["000000", "FFFFFF"].includes(icon.hex.toUpperCase()) ? "#2B2B2B" : `#${icon.hex}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="${fill}" d="${path}"/></svg>
`;
}

// .ico files: use the largest PNG image inside (modern favicons embed PNGs; old BMP-only ones are skipped).
function pngFromIco(bytes) {
  if (bytes.readUInt16LE(0) !== 0 || bytes.readUInt16LE(2) !== 1) return null;
  let best = null;
  for (let i = 0; i < bytes.readUInt16LE(4); i++) {
    const entry = 6 + i * 16;
    const size = bytes.readUInt32LE(entry + 8);
    const offset = bytes.readUInt32LE(entry + 12);
    const image = bytes.subarray(offset, offset + size);
    const width = bytes[entry] || 256;
    if (image.subarray(0, 4).toString("hex") === "89504e47" && (!best || width > best.width)) best = { width, image };
  }
  return best?.image ?? null;
}

const args = process.argv.slice(2);
const all = args.includes("--all");
const only = args.filter((arg) => !arg.startsWith("--"));

let source = readFileSync(DATA, "utf8");
const offers = [...source.matchAll(/\{ slug: "([^"]+)"[^\n]*?site: "([^"]+)"[^\n]*\}/g)].map((match) => ({
  slug: match[1],
  site: match[2],
  logo: match[0].match(/logo: "([^"]+)"/)?.[1],
}));
const todo = offers.filter((offer) => (only.length ? only.includes(offer.slug) : all || !offer.logo));

const get = async (url, accept = "*/*") => {
  const response = await fetch(url, { redirect: "follow", headers: { "User-Agent": UA, Accept: accept }, signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`${response.status}`);
  return response;
};

const attr = (tag, name) => tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']+)["']`, "i"))?.[1];

// Icon candidates from the page's <link> tags and web manifest, best first.
async function candidates(site) {
  const list = [];
  let base = site;
  try {
    const page = await get(site, "text/html");
    base = page.url;
    const html = await page.text();
    for (const tag of html.match(/<link\b[^>]*>/gi) ?? []) {
      const rel = (attr(tag, "rel") ?? "").toLowerCase();
      const href = attr(tag, "href");
      if (!href || !/(^|\s)(icon|apple-touch-icon|apple-touch-icon-precomposed|shortcut icon)(\s|$)/.test(rel) || rel.includes("mask-icon")) continue;
      const url = new URL(href, base).href;
      const svg = /\.svg(\?|$)/i.test(url) || (attr(tag, "type") ?? "").includes("svg");
      const size = Math.max(0, ...(attr(tag, "sizes") ?? "").split(/\s+/).map((s) => parseInt(s, 10) || 0));
      list.push({ url, score: svg ? 10000 : rel.includes("apple-touch-icon") ? Math.max(size, 180) : size || 32 });
    }
    const manifest = html.match(/<link\b[^>]*rel=["']manifest["'][^>]*>/i)?.[0];
    if (manifest && attr(manifest, "href")) {
      try {
        const url = new URL(attr(manifest, "href"), base).href;
        const json = await (await get(url, "application/json")).json();
        for (const icon of json.icons ?? []) {
          const size = Math.max(0, ...(icon.sizes ?? "").split(/\s+/).map((s) => parseInt(s, 10) || 0));
          list.push({ url: new URL(icon.src, url).href, score: /svg/.test(icon.type ?? icon.src) ? 9000 : size });
        }
      } catch {}
    }
  } catch {}
  const origin = new URL(base).origin;
  list.push({ url: `${origin}/apple-touch-icon.png`, score: 150 });
  list.sort((a, b) => b.score - a.score);
  list.push({ url: `https://www.google.com/s2/favicons?domain=${new URL(base).hostname}&sz=256`, score: 0 });
  return [...new Map(list.map((item) => [item.url, item])).values()];
}

async function save(slug, url) {
  if (url.startsWith("si:")) {
    writeFileSync(join(OUT, `${slug}.svg`), simpleIcon(url.slice(3)));
    return `${slug}.svg`;
  }
  const raster = url.startsWith("raster:");
  const response = await get(raster ? url.slice(7) : url, "image/*");
  const type = raster ? "" : (response.headers.get("content-type") ?? "");
  const bytes = Buffer.from(await response.arrayBuffer());
  const text = bytes.subarray(0, 600).toString("utf8");
  if (!raster && (type.includes("svg") || /<svg[\s>]/i.test(text))) {
    // <img> never runs scripts, but strip anything active anyway before it lands in public/.
    const svg = bytes.toString("utf8").replace(/<script[\s\S]*?<\/script>/gi, "").replace(/\son\w+="[^"]*"/gi, "");
    if (!/<svg[\s>]/i.test(svg)) throw new Error("not svg");
    writeFileSync(join(OUT, `${slug}.svg`), svg);
    return `${slug}.svg`;
  }
  const image = sharp(pngFromIco(bytes) ?? bytes, { density: 384 });
  const meta = await image.metadata();
  if (!meta.width || meta.width < MIN) throw new Error(`too small (${meta.width}px)`);
  await image.trim({ threshold: 1 }).resize(128, 128, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).webp({ quality: 90 }).toFile(join(OUT, `${slug}.webp`));
  return `${slug}.webp`;
}

mkdirSync(OUT, { recursive: true });
const results = {};
const failed = [];
await Promise.all(
  todo.map(async (offer, index) => {
    await new Promise((resolve) => setTimeout(resolve, (index % 12) * 150));
    const list = LOGO_SOURCES[offer.slug] ? [{ url: LOGO_SOURCES[offer.slug] }] : await candidates(offer.site);
    for (const { url } of list) {
      try {
        for (const ext of ["svg", "webp"]) if (existsSync(join(OUT, `${offer.slug}.${ext}`))) rmSync(join(OUT, `${offer.slug}.${ext}`));
        results[offer.slug] = { file: await save(offer.slug, url), url };
        return;
      } catch {}
    }
    failed.push(offer.slug);
  }),
);

// Write `logo` into each offer line: drop any old value, then add the new one after `site`.
for (const [slug, { file }] of Object.entries(results)) {
  source = source.replace(new RegExp(`\\{ slug: "${slug}"[^\\n]*\\}`), (line) =>
    line.replace(/, logo: "[^"]*"/g, "").replace(/(site: "[^"]+")/, `$1, logo: "${file}"`),
  );
}
for (const slug of failed) source = source.replace(new RegExp(`\\{ slug: "${slug}"[^\\n]*\\}`), (line) => line.replace(/, logo: "[^"]*"/g, ""));
writeFileSync(DATA, source);

// Remove files no offer points at any more.
const used = new Set([...source.matchAll(/logo: "([^"]+)"/g)].map((match) => match[1]));
for (const file of readdirSync(OUT)) if (!used.has(file)) rmSync(join(OUT, file));

for (const [slug, { file, url }] of Object.entries(results).sort()) console.log(`${slug.padEnd(40)} ${file.padEnd(46)} ${url.slice(0, 90)}`);
console.log(`\n${Object.keys(results).length} logos saved${failed.length ? `; no usable logo for: ${failed.join(", ")}` : ""}`);
