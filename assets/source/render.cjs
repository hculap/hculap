// Renders every element with an id in assets.html to ../<id>.png at 2x, transparent outside the element.
// Usage: node render.cjs   (set PLAYWRIGHT=/path/to/node_modules/playwright if it is not installed here)
const path = require('path');
const { chromium } = require(process.env.PLAYWRIGHT || 'playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 2, viewport: { width: 1400, height: 1200 } });
  await page.goto('file://' + path.join(__dirname, 'assets.html'));
  await page.evaluate(() => document.fonts.ready);
  const ids = await page.$$eval('[id]', (els) => els.map((e) => e.id));
  for (const id of ids) {
    const out = path.join(__dirname, '..', id + '.png');
    await page.locator('#' + id).screenshot({ path: out, omitBackground: true });
    console.log(out);
  }
  await browser.close();
})();
