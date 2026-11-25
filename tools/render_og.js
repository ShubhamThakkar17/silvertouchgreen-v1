// Renders the social share card, a raster logo for structured data and the Apple touch icon.
// Usage (needs Playwright + Chromium): node tools/render_og.js
const path = require("path");
const { chromium } = require("playwright");

(async () => {
  const root = path.resolve(__dirname, "..");
  const mark = "file://" + path.join(root, "assets/img/brand/silver-touch-green-re-symbol-full-colour.svg");
  const browser = await chromium.launch();

  const og = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await og.goto("file://" + path.join(root, "tools/og/og.html"), { waitUntil: "networkidle" });
  await og.evaluate(() => document.fonts.ready);
  await og.screenshot({ path: path.join(root, "assets/img/og-image.png") });

  // Full-colour mark on white: the guidelines' version for light grounds
  async function markTile(size, markWidth, file) {
    const page = await browser.newPage({ viewport: { width: size, height: size } });
    await page.setContent(
      '<body style="margin:0;display:grid;place-items:center;width:' + size + "px;height:" + size + 'px;background:#fff">' +
      '<img src="' + mark + '" style="width:' + markWidth + 'px" /></body>'
    );
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(root, file) });
  }
  await markTile(512, 380, "assets/img/logo-512.png");
  await markTile(180, 140, "assets/img/apple-touch-icon.png");

  await browser.close();
  console.log("wrote assets/img/og-image.png, assets/img/logo-512.png and assets/img/apple-touch-icon.png");
})();
