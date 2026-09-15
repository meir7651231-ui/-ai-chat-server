/* grab.mjs — צילום של האתרים בעולם שעושים «אנשים»: ספר-רשומות, סינון, פאנל-הצצה,
   רשומת-אדם עם כסף וקשרים. נטענים רק עמודים ציבוריים.
   הרצה: node gen/looks/people/grab.mjs */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const here = dirname(fileURLToPath(import.meta.url));
mkdirSync(join(here, 'shots'), { recursive: true });

const SITES = [
  { id: 'linear', name: 'Linear', url: 'https://linear.app/', does: 'רשימה ענקית עם סינון וניווט-מקלדת' },
  { id: 'attio', name: 'Attio', url: 'https://attio.com/', does: 'CRM שבנוי סביב «אנשים» וקשרים בין רשומות' },
  { id: 'intercom', name: 'Intercom', url: 'https://www.intercom.com/', does: 'פרופיל-אדם עם תכונות וציר-זמן' },
  { id: 'stripe', name: 'Stripe', url: 'https://stripe.com/', does: 'רשומת-לקוח עם כסף והיסטוריה' },
  { id: 'airtable', name: 'Airtable', url: 'https://www.airtable.com/', does: 'טבלה + רשומה מורחבת + רשומות מקושרות' },
  { id: 'notion', name: 'Notion', url: 'https://www.notion.com/', does: 'מסד עם תצוגות שמורות וקשרים' },
  { id: 'hubspot', name: 'HubSpot', url: 'https://www.hubspot.com/products/crm', does: 'איחוד כפולים ושיוך אנשי-קשר' },
  { id: 'slack', name: 'Slack', url: 'https://slack.com/', does: 'ספר-חברים וכרטיס-פרופיל' },
  { id: 'myheritage', name: 'MyHeritage', url: 'https://www.myheritage.co.il/', does: 'קשרי-משפחה ועץ — ועברית מלאה' },
  { id: 'geni', name: 'Geni', url: 'https://www.geni.com/', does: 'עץ-משפחה שיתופי' },
  { id: 'clay', name: 'Clay', url: 'https://www.clay.com/', does: 'העשרת-רשומות וזיהוי אותו אדם' },
  { id: 'folk', name: 'Folk', url: 'https://www.folk.app/', does: 'ספר-קשרים קליל עם קבוצות' },
];

const b = await chromium.launch();
const out = [];
for (const s of SITES) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  try {
    await p.goto(s.url, { waitUntil: 'domcontentloaded', timeout: 40000 });
    await p.waitForTimeout(3200);
    for (const t of ['Accept', 'Accept all', 'I agree', 'Got it', 'Allow all', 'Accept cookies', 'אישור', 'קבל הכל']) {
      const btn = p.locator(`button:has-text("${t}")`).first();
      if (await btn.count() && await btn.isVisible().catch(() => false)) { await btn.click().catch(() => { }); await p.waitForTimeout(800); break; }
    }
    const title = await p.title();
    await p.screenshot({ path: join(here, 'shots', s.id + '.png') });
    out.push({ ...s, title: title.slice(0, 70), ok: true });
    console.log('✓ ' + s.name.padEnd(12) + title.slice(0, 60));
  } catch (e) {
    out.push({ ...s, ok: false, err: String(e.message).slice(0, 70) });
    console.log('✗ ' + s.name.padEnd(12) + String(e.message).slice(0, 60));
  }
  await p.close();
}
await b.close();
writeFileSync(join(here, 'sites.json'), JSON.stringify(out, null, 1));
console.log('\nצילומים ב-gen/looks/people/shots');
