import { mkdir, readdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
const BACKUP_DIR = path.join(ROOT, "context-files", "originals");
const SOURCE_DIRS = [path.join(ROOT, "src")];
const RASTER = /\.(png|jpe?g)$/i;
const MAX_WIDTH = 2880;
const QUALITY = 82;

async function walk(dir, match) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return walk(full, match);
      return match(full) ? [full] : [];
    }),
  );
  return files.flat();
}

async function collectTargets(args) {
  if (args.length === 0) return walk(PUBLIC_DIR, (file) => RASTER.test(file));
  const targets = [];
  for (const arg of args) {
    const full = path.resolve(ROOT, arg);
    const info = await stat(full);
    if (info.isDirectory()) targets.push(...(await walk(full, (file) => RASTER.test(file))));
    else if (RASTER.test(full)) targets.push(full);
  }
  return targets.filter((file) => file.startsWith(PUBLIC_DIR + path.sep));
}

const toUrl = (file) => "/" + path.relative(PUBLIC_DIR, file).split(path.sep).join("/");
const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`.padStart(9);

async function convert(file) {
  const output = file.replace(RASTER, ".webp");
  const before = (await stat(file)).size;
  const image = sharp(file, { limitInputPixels: false }).rotate();
  const { width } = await image.metadata();
  await image
    .resize({ width: Math.min(width ?? MAX_WIDTH, MAX_WIDTH), withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 6, smartSubsample: true })
    .toFile(output);
  const after = (await stat(output)).size;
  const meta = await sharp(output).metadata();

  const backup = path.join(BACKUP_DIR, path.relative(PUBLIC_DIR, file));
  await mkdir(path.dirname(backup), { recursive: true });
  await rename(file, backup);

  return { from: toUrl(file), to: toUrl(output), before, after, width: meta.width, height: meta.height };
}

async function rewriteReferences(results) {
  const sources = (await Promise.all(SOURCE_DIRS.map((dir) => walk(dir, (file) => /\.(tsx?|jsx?|css|mdx?)$/.test(file))))).flat();
  const changed = [];
  for (const file of sources) {
    const original = await readFile(file, "utf8");
    let updated = original;
    for (const { from, to } of results) updated = updated.split(from).join(to);
    if (updated !== original) {
      await writeFile(file, updated);
      changed.push(path.relative(ROOT, file));
    }
  }
  return changed;
}

const targets = await collectTargets(process.argv.slice(2));
if (targets.length === 0) {
  console.log("No PNG/JPG files to convert.");
  process.exit(0);
}

const results = [];
for (const file of targets) results.push(await convert(file));

console.log("Converted:");
for (const r of results) {
  const saved = Math.round((1 - r.after / r.before) * 100);
  console.log(`  ${kb(r.before)} → ${kb(r.after)}  (-${saved}%)  ${r.width}×${r.height}  ${r.to}`);
}
const totalBefore = results.reduce((sum, r) => sum + r.before, 0);
const totalAfter = results.reduce((sum, r) => sum + r.after, 0);
console.log(`Total: ${kb(totalBefore)} → ${kb(totalAfter)} (-${Math.round((1 - totalAfter / totalBefore) * 100)}%)`);
console.log(`Originals moved to ${path.relative(ROOT, BACKUP_DIR)}/ (gitignored).`);

const changed = await rewriteReferences(results);
console.log(changed.length ? `Updated references in:\n  ${changed.join("\n  ")}` : "No source references needed updating.");
console.log("Check width/height values in src/data for any image that was resized.");
