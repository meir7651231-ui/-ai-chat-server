/* grab3.mjs — ממשקים אמיתיים שנפתחים בלי חשבון. אלה הראיה, לא עמוד-שיווק. */
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const here = dirname(fileURLToPath(import.meta.url));
mkdirSync(join(here, 'shots'), { recursive: true });

const PAGES = [
  { id: 'wikitree-person', url: 'https://www.wikitree.com/genealogy/Einstein-Family-Tree-8', y: 300 },
  { id: 'wikitree-index', url: 'https://www.wikitree.com/genealogy/Cohen', y: 300 },
  { id: 'geni-profile', url: 'https://www.geni.com/people/Albert-Einstein/6000000004004195331', y: 200 },
  { id: 'airtable-universe', url: 'https://www.airtable.com/universe', y: 600 },
  { id: 'linear-method', url: 'https://linear.app/method/introduction', y: 200 },
  { id: 'stripe-dash-docs', url: 'https://docs.stripe.com/payments/dashboard', y: 500 },
  { id: 'gov-uk-search', url: 'https://www.gov.uk/search/all?keywords=contact', y: 200 },
];
const b = await chromium.launch();
for (const s of PAGES) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    await p.goto(s.url, { waitUntil: 'domcontentloaded', timeout: 40000 });
    await p.waitForTimeout(3000);
    for (const t of ['Accept', 'Accept all', 'I agree', 'Got it', 'Allow all', 'Accept additional cookies']) {
      const btn = p.locator(`button:has-text("${t}")`).first();
      if (await btn.count() && await btn.isVisible().catch(() => false)) { await btn.click().catch(() => { }); await p.waitForTimeout(700); break; }
    }
    await p.evaluate(y => window.scrollTo(0, y), s.y);
    await p.waitForTimeout(1400);
    await p.screenshot({ path: join(here, 'shots', s.id + '.png') });
    console.log('✓ ' + s.id.padEnd(20) + (await p.title()).slice(0, 50));
  } catch (e) { console.log('✗ ' + s.id.padEnd(20) + String(e.message).slice(0, 50)); }
  await p.close();
}
await b.close();
