/* grab2.mjs — הפעם עמודי-המוצר עצמם, ולא מסך-השיווק: גלילה עד האזור שבו
   מופיע צילום-הממשק האמיתי, כדי לראות איך הם עושים «אנשים».
   הרצה: node gen/looks/people/grab2.mjs */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const here = dirname(fileURLToPath(import.meta.url));
mkdirSync(join(here, 'shots'), { recursive: true });

const PAGES = [
  { id: 'attio-people', url: 'https://attio.com/platform/data-model', y: 900 },
  { id: 'linear-list', url: 'https://linear.app/features', y: 1400 },
  { id: 'hubspot-contacts', url: 'https://www.hubspot.com/products/crm/contact-management', y: 800 },
  { id: 'intercom-profile', url: 'https://www.intercom.com/inbox', y: 900 },
  { id: 'airtable-record', url: 'https://www.airtable.com/platform/app-building', y: 1000 },
  { id: 'folk-contacts', url: 'https://www.folk.app/features/contact-management', y: 700 },
  { id: 'stripe-customers', url: 'https://docs.stripe.com/dashboard/basics', y: 700 },
  { id: 'notion-db', url: 'https://www.notion.com/product/database', y: 900 },
  { id: 'clay-people', url: 'https://www.clay.com/product', y: 900 },
  { id: 'myheritage-tree', url: 'https://www.myheritage.co.il/family-tree', y: 600 },
];

const b = await chromium.launch();
const out = [];
for (const s of PAGES) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    await p.goto(s.url, { waitUntil: 'domcontentloaded', timeout: 40000 });
    await p.waitForTimeout(2800);
    for (const t of ['Accept', 'Accept all', 'I agree', 'Got it', 'Allow all', 'Continue', 'אישור']) {
      const btn = p.locator(`button:has-text("${t}")`).first();
      if (await btn.count() && await btn.isVisible().catch(() => false)) { await btn.click().catch(() => { }); await p.waitForTimeout(700); break; }
    }
    await p.evaluate(y => window.scrollTo(0, y), s.y);
    await p.waitForTimeout(1600);
    await p.screenshot({ path: join(here, 'shots', s.id + '.png') });
    const title = await p.title();
    out.push({ ...s, title: title.slice(0, 60), ok: true });
    console.log('✓ ' + s.id.padEnd(20) + title.slice(0, 55));
  } catch (e) {
    out.push({ ...s, ok: false, err: String(e.message).slice(0, 60) });
    console.log('✗ ' + s.id.padEnd(20) + String(e.message).slice(0, 55));
  }
  await p.close();
}
await b.close();
writeFileSync(join(here, 'pages.json'), JSON.stringify(out, null, 1));
