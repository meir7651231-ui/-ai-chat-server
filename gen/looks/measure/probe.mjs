/* probe.mjs — מדידה עמוקה של חמשת האתרים המקוריים.
   לא זיכרון ולא עין: נטען כל אתר בדפדפן ונשלפים ממנו הערכים המחושבים בפועל —
   פלטה לפי שטח, טיפוגרפיה לפי תפקיד, כפתורים, כרטיסים, רדיוסים, צללים ומרווחים.
   פלט: measured.json (עם מקור ותאריך) + סיכום למסך.
   הרצה: node gen/looks/measure/probe.mjs                                        */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { EXTRACT } from './extract.mjs';

const here = dirname(fileURLToPath(import.meta.url));
mkdirSync(join(here, 'shots'), { recursive: true });

const SITES = [
  /* לכל אתר נמדדות כמה כתובות ציבוריות — עמוד-שיווק, עמוד-מוצר ועמוד-מערכת/תיעוד —
     כדי שאוצר-המילים הנמדד יכסה גם רכיבים שאינם על עמוד-הבית (עיגולים · טפסים · טבלאות). */
  { id: 'raycast', name: 'Raycast', urls: ['https://www.raycast.com/', 'https://www.raycast.com/store', 'https://www.raycast.com/pro', 'https://manual.raycast.com/'] },
  { id: 'spotify', name: 'Spotify', urls: ['https://open.spotify.com/', 'https://www.spotify.com/', 'https://open.spotify.com/search', 'https://www.spotify.com/us/premium/'] },
  { id: 'duolingo', name: 'Duolingo', urls: ['https://www.duolingo.com/', 'https://design.duolingo.com/', 'https://blog.duolingo.com/', 'https://www.duolingo.com/courses'] },
  { id: 'wise', name: 'Wise', urls: ['https://wise.com/', 'https://wise.com/gb/pricing/', 'https://wise.com/help/'] },
  { id: 'monzo', name: 'Monzo', urls: ['https://monzo.com/', 'https://monzo.com/current-account/', 'https://monzo.com/blog/'] },
];


const b = await chromium.launch();
const out = { measuredAt: new Date().toISOString().slice(0, 16), sites: {} };
for (const s of SITES) {
  for (const url of s.urls) {
    const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
    try {
      await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 40000 });
      await p.waitForTimeout(3500);
      /* קבלת-עוגיות: רק כפתור, לעולם לא קישור (הלקח מהסבב הקודם) */
      for (const t of ['Accept', 'Accept all', 'I agree', 'Got it', 'Allow all', 'Accept cookies', 'Alle akzeptieren']) {
        const btn = p.locator(`button:has-text("${t}")`).first();
        if (await btn.count() && await btn.isVisible().catch(() => false)) { await btn.click().catch(() => { }); await p.waitForTimeout(900); break; }
      }
      const data = await p.evaluate(EXTRACT);
      const key = s.id + '·' + url.replace(/https?:\/\/|\/$/g, '').replace(/\//g, '-');
      out.sites[key] = { site: s.name, url, ...data };
      await p.screenshot({ path: join(here, 'shots', key.replace(/[^\w-]/g, '_') + '.png') });
      console.log('✓ ' + key.padEnd(34) + data.elements + ' אלמנטים · ' + data.body.family +
        ' · רקע ' + data.body.bg + ' · ' + data.buttons.length + ' חתימות-כפתור');
    } catch (e) {
      console.log('✗ ' + url + ' — ' + String(e.message).slice(0, 80));
    }
    await p.close();
  }
}
await b.close();
writeFileSync(join(here, 'measured.json'), JSON.stringify(out, null, 1));
console.log('\nnמדידות נשמרו ב-gen/looks/measure/measured.json');
