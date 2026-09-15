/* person.mjs — הפעם רק אתרים ש**עמוד-האדם הוא המוצר עצמו**.
   לא רשימות של מוצרים, לא ערוצי-וידאו, לא מלונות. אדם.
   נבחרו כאלה שהפרופיל שלהם ציבורי — כי אצלם הוא אמור להיות ציבורי.
   הרצה: node gen/looks/people/person.mjs */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { EXTRACT } from '../measure/extract.mjs';

const here = dirname(fileURLToPath(import.meta.url));
mkdirSync(join(here, 'person'), { recursive: true });

const P = [
  { id: 'linkedin', name: 'LinkedIn', users: '1 מיליארד', core: 'זהות תעסוקתית',
    url: 'https://www.linkedin.com/in/williamhgates/', y: 0 },
  { id: 'stackoverflow', name: 'Stack Overflow', users: '100 מיליון', core: 'מוניטין מקצועי',
    url: 'https://stackoverflow.com/users/22656/jon-skeet', y: 0 },
  { id: 'behance', name: 'Behance', users: '50 מיליון', core: 'תיק-עבודות',
    url: 'https://www.behance.net/adobe', y: 0 },
  { id: 'dribbble', name: 'Dribbble', users: '20 מיליון', core: 'תיק-עבודות',
    url: 'https://dribbble.com/shots', y: 200 },
  { id: 'goodreads', name: 'Goodreads', users: '150 מיליון', core: 'עמוד-מחבר',
    url: 'https://www.goodreads.com/author/show/1244.Haruki_Murakami', y: 0 },
  { id: 'findagrave', name: 'Find a Grave', users: '40 מיליון', core: 'רשומת-אדם שנפטר',
    url: 'https://www.findagrave.com/memorial/1075/albert-einstein', y: 0 },
  { id: 'wikitree', name: 'WikiTree', users: '1 מיליון', core: 'אדם + קרובים',
    url: 'https://www.wikitree.com/wiki/Einstein-16', y: 0 },
  { id: 'geni', name: 'Geni', users: '15 מיליון', core: 'אדם + עץ',
    url: 'https://www.geni.com/people/Albert-Einstein/6000000004004195331', y: 0 },
  { id: 'myheritage', name: 'MyHeritage', users: '100 מיליון', core: 'אדם + משפחה · עברית',
    url: 'https://www.myheritage.co.il/names/albert_einstein', y: 0 },
  { id: 'lastfm', name: 'Last.fm', users: '60 מיליון', core: 'פרופיל-משתמש',
    url: 'https://www.last.fm/user/RJ', y: 0 },
  { id: 'letterboxd', name: 'Letterboxd', users: '17 מיליון', core: 'פרופיל-חבר',
    url: 'https://letterboxd.com/davidehrlich/', y: 0 },
  { id: 'twitch', name: 'Twitch', users: '240 מיליון', core: 'עמוד-יוצר',
    url: 'https://www.twitch.tv/directory', y: 200 },
];

const b = await chromium.launch();
const out = [];
for (const s of P) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  try {
    await p.goto(s.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await p.waitForTimeout(3600);
    for (const t of ['Accept', 'Accept all', 'Accept All', 'Accept all cookies', 'I agree', 'Got it', 'Allow all', 'Continue', 'אישור']) {
      const x = p.locator(`button:has-text("${t}")`).first();
      if (await x.count() && await x.isVisible().catch(() => false)) { await x.click().catch(() => { }); await p.waitForTimeout(900); break; }
    }
    if (s.y) { await p.evaluate(y => window.scrollTo(0, y), s.y); await p.waitForTimeout(1100); }
    const m = await p.evaluate(EXTRACT);
    await p.screenshot({ path: join(here, 'person', s.id + '.png') });
    out.push({ ...s, m });
    if (m.elements < 60) { console.log(`✗ ${s.name.padEnd(16)} ${m.elements} אלמנטים — חסום`); continue; }
    console.log(`✓ ${s.name.padEnd(16)} ${String(m.elements).padStart(5)} אל׳ · גוף ${m.body.size}/${m.body.lh} · רקע ${m.body.bg} · דיו ${m.palette.ink.slice(0, 2).map(x => x.v).join(' ')} · r ${m.radii.slice(0, 3).map(x => x.v).join(' ')}`);
  } catch (e) { console.log(`✗ ${s.name.padEnd(16)} ${String(e.message).slice(0, 42)}`); out.push({ ...s, err: String(e.message).slice(0, 42) }); }
  await p.close();
}
await b.close();
writeFileSync(join(here, 'person.json'), JSON.stringify(out, null, 1));
