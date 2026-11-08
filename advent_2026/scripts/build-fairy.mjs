import sharp from "sharp";
import { fileURLToPath } from "node:url";
const sheet = fileURLToPath(
  new URL("../artwork/fairy-wingbeats.png", import.meta.url),
);
const dest = fileURLToPath(new URL("../public/images/world/", import.meta.url));
const { width, height } = await sharp(sheet).metadata();
const frames = [];
for (let i = 0; i < 8; i++) {
  const left = Math.round(((i % 4) * width) / 4),
    top = Math.round((Math.floor(i / 4) * height) / 2);
  const right = Math.round((((i % 4) + 1) * width) / 4),
    bottom = Math.round(((Math.floor(i / 4) + 1) * height) / 2);
  frames.push(
    await sharp(sheet)
      .extract({ left, top, width: right - left, height: bottom - top })
      .resize(320, 320)
      .png()
      .toBuffer(),
  );
}
await sharp(frames, { join: { animated: true } })
  .gif({ loop: 0, delay: Array(8).fill(50), dither: 0.4 })
  .toFile(dest + "winter-fairy-flying.gif");
await sharp(frames[0])
  .webp({ quality: 90 })
  .toFile(dest + "winter-fairy-rest.webp");
console.log(
  await sharp(dest + "winter-fairy-flying.gif", { animated: true }).metadata(),
);
