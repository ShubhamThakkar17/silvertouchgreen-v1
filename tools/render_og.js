// Renders the social share card and a raster logo for structured data.
// Usage (needs Playwright + Chromium): node tools/render_og.js
const path = require("path");
const { chromium } = require("playwright");

(async () => {
  const root = path.resolve(__dirname, "..");
  const browser = await chromium.launch();
  const og = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await og.goto("file://" + path.join(root, "tools/og/og.html"), { waitUntil: "networkidle" });
  await og.evaluate(() => document.fonts.ready);
  await og.screenshot({ path: path.join(root, "assets/img/og-image.png") });

  const logo = await browser.newPage({ viewport: { width: 512, height: 512 } });
  await logo.setContent(
    '<body style="margin:0;display:grid;place-items:center;width:512px;height:512px;background:#fff">' +
    '<img src="file://' + path.join(root, "assets/img/logo-mark.svg") + '" style="width:340px" /></body>'
  );
  await logo.waitForTimeout(300);
  await logo.screenshot({ path: path.join(root, "assets/img/logo-512.png") });
  await browser.close();
  console.log("wrote assets/img/og-image.png and assets/img/logo-512.png");
})();
