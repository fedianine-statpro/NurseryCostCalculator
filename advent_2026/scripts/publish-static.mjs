import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const dist = path.join(root, "dist");
// Only replace generated bundles. User photographs and source files are preserved.
const assets = path.join(root, "assets");
await mkdir(assets, { recursive: true });
for (const name of await readdir(assets)) {
  if (/^index-[\w-]+\.(js|css)$/.test(name)) {
    await rm(path.join(assets, name));
  }
}
await cp(path.join(dist, "assets"), assets, { recursive: true });
await cp(path.join(dist, "images"), path.join(root, "images"), { recursive: true });
await writeFile(path.join(root, "index.html"), await readFile(path.join(dist, "index.html")));
console.log("GitHub Pages files refreshed: index.html, assets/, images/. Commit these with source changes.");
