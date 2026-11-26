// Checks every claim link in src/data/offers.ts: dead links (404/410, DNS errors) fail the run, links that now
// redirect to a different page are listed for review, and sites that block automated requests (401/403/429) are
// listed to check in a browser. Run it monthly, then update OFFERS_CHECKED_AT once the list is reviewed.
//
//   npm run offers:check

import { readFileSync } from "node:fs";
import { join } from "node:path";

const source = readFileSync(join(process.cwd(), "src", "data", "offers.ts"), "utf8");
const entries = [...source.matchAll(/brand: "([^"]+)"[^}]*?claimUrl: "([^"]+)"/g)].map(([, brand, url]) => ({ brand, url }));
const urls = [...new Map(entries.map((entry) => [entry.url, entries.filter((other) => other.url === entry.url).map((other) => other.brand)])).entries()];

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";
const strip = (url) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/[/?#]+$/, "").toLowerCase();

const check = async ([url, brands]) => {
  try {
    const response = await fetch(url, { redirect: "follow", headers: { "User-Agent": UA, "Accept-Language": "en-IN,en;q=0.9" }, signal: AbortSignal.timeout(20000) });
    const moved = strip(response.url) !== strip(url);
    return { url, brands, status: response.status, final: moved ? response.url : null };
  } catch (error) {
    return { url, brands, status: 0, error: error.cause?.code ?? error.name };
  }
};

const results = [];
for (let i = 0; i < urls.length; i += 8) results.push(...(await Promise.all(urls.slice(i, i + 8).map(check))));

const dead = results.filter((r) => r.status === 0 || r.status === 404 || r.status === 410 || r.status >= 500);
const blocked = results.filter((r) => [401, 403, 429].includes(r.status));
const moved = results.filter((r) => r.final && !dead.includes(r) && !blocked.includes(r));
const label = (r) => `${r.brands.join(", ")}\n    ${r.url}`;

console.log(`Checked ${results.length} links for ${entries.length} offers.`);
if (moved.length) console.log(`\nRedirected (check the offer still exists there):\n${moved.map((r) => `  ${label(r)}\n    → ${r.final}`).join("\n")}`);
if (blocked.length) console.log(`\nBlocked automated checks (open in a browser):\n${blocked.map((r) => `  [${r.status}] ${label(r)}`).join("\n")}`);
if (dead.length) {
  console.error(`\nDead links (fix or remove the offer):\n${dead.map((r) => `  [${r.status || r.error}] ${label(r)}`).join("\n")}`);
  process.exit(1);
}
console.log("\nNo dead links.");
