import assert from "node:assert/strict";
import http from "node:http";
import { readFile, stat, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

// Serve the actual checked-in directory, with no Vite transforms or dist fallback.
const root = fileURLToPath(new URL("../", import.meta.url));
const mime = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
};
const prefixes = ["/advent_2026/", "/NurseryCostCalculator/advent_2026/"];
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    const prefix = prefixes.find((p) => url.pathname.startsWith(p));
    if (!prefix) throw new Error("Outside mount");
    const relative =
      decodeURIComponent(url.pathname.slice(prefix.length)) || "index.html";
    const target = path.resolve(root, relative);
    if (!target.startsWith(root) || !(await stat(target)).isFile())
      throw new Error("Not found");
    res.writeHead(200, {
      "Content-Type": mime[path.extname(target)] || "application/octet-stream",
    });
    res.end(await readFile(target));
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const browser = await chromium.launch();
try {
  const port = server.address().port;
  await mkdir(path.join(root, "test-results"), { recursive: true });
  for (const [i, prefix] of prefixes.entries()) {
    const context = await browser.newContext({
      timezoneId: "America/Los_Angeles",
      viewport: i ? { width: 390, height: 844 } : { width: 1440, height: 1000 },
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("response", (r) => {
      if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`);
    });
    await page.clock.install({ time: new Date("2026-11-30T23:59:30Z") });
    await page.goto(`http://127.0.0.1:${port}${prefix}`);
    await page.getByLabel("Your answer").fill("Фрэнк Гери");
    await page.getByRole("button", { name: "Reveal the magic" }).click();
    await page.locator(".clue").waitFor();
    await page.locator(".gift-photo").evaluate((img) => img.decode());
    assert.equal(await page.getByText("Development workshop").count(), 0);
    assert.equal(
      await page.getByRole("button", { name: /Open .* December/ }).count(),
      0,
    );
    await page.reload();
    await page.getByLabel("Your answer").waitFor();
    assert.equal(await page.locator(".clue").count(), 0);
    await page.clock.fastForward(31000);
    await page.getByLabel("Your answer").waitFor();
    assert.equal(await page.getByText("TODAY").count(), 1);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
    );
    await page.screenshot({
      path: path.join(
        root,
        `test-results/pages-${i ? "mobile" : "desktop"}.png`,
      ),
      fullPage: true,
    });
    await page.clock.setFixedTime(new Date("2026-12-11T12:00:00Z"));
    await page.clock.runFor(1100);
    await page
      .getByRole("button", { name: "Open 1 December", exact: true })
      .waitFor();
    assert.equal(
      await page.getByRole("button", { name: /Open .* December/ }).count(),
      10,
    );
    const textures = await page
      .locator(".door-leaf")
      .evaluateAll((doors) =>
        Array.from(
          new Set(
            doors
              .map(
                (d) =>
                  getComputedStyle(d).backgroundImage.match(
                    /url\(["']?(.*?)["']?\)/,
                  )?.[1],
              )
              .filter(Boolean),
          ),
        ),
      );
    assert.equal(textures.length, 6);
    for (const texture of textures)
      assert.equal((await page.request.get(texture)).status(), 200);
    assert.deepEqual(errors, []);
    await context.close();
    console.log(
      `PASS: static ${prefix}, assets, Cyrillic answer, preview reset on reload, London midnight, no development controls, no overflow or browser errors`,
    );
  }
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
