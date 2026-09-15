/* design.mjs — עיצוב בלבד.
   המסכים הכי נצפים בעולם שמציגים **אדם ורשימה** — ונפתחים בלי חשבון.
   נמדד באותו מכשיר שמדד את חמשת האתרים: פלטה לפי שטח, טיפוגרפיה לפי
   תפקיד, רדיוסים, מרווחים, ריפודים, צללים, כרטיסים.
   הרצה: node gen/looks/people/design.mjs */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { EXTRACT } from '../measure/extract.mjs';

const here = dirname(fileURLToPath(import.meta.url));
mkdirSync(join(here, 'design'), { recursive: true });

const P = [
  { id: 'youtube', name: 'YouTube · ערוץ', users: '2.5 מיליארד', url: 'https://www.youtube.com/@NASA', y: 0,
    what: 'עמוד-ישות: כותרת · טאבים · רשת פריטים' },
  { id: 'instagram', name: 'Instagram · פרופיל', users: '2 מיליארד', url: 'https://www.instagram.com/nasa/', y: 0,
    what: 'פרופיל: אווטר · מונים · רשת' },
  { id: 'spotify-artist', name: 'Spotify · אמן', users: '600 מיליון', url: 'https://open.spotify.com/artist/4gzpq5DPGxSnKTe4SA8HAU', y: 0,
    what: 'עמוד-ישות עם רשימה ממוספרת' },
  { id: 'wikipedia-he', name: 'ויקיפדיה · אדם', users: '1.5 מיליארד', url: 'https://he.wikipedia.org/wiki/%D7%94%D7%A8%D7%91_%D7%A2%D7%95%D7%91%D7%93%D7%99%D7%94_%D7%99%D7%95%D7%A1%D7%A3', y: 0,
    what: 'תיבת-מידע + טקסט · RTL אמיתי' },
  { id: 'amazon-list', name: 'Amazon · תוצאות', users: '310 מיליון', url: 'https://www.amazon.com/s?k=notebook', y: 300,
    what: 'רשימה בצפיפות גבוהה עם מסננים' },
  { id: 'booking', name: 'Booking · תוצאות', users: '400 מיליון', url: 'https://www.booking.com/searchresults.html?ss=Jerusalem', y: 400,
    what: 'רשימה-ופרטים בקנה-מידה' },
  { id: 'airbnb-list', name: 'Airbnb · תוצאות', users: '150 מיליון', url: 'https://www.airbnb.com/s/Jerusalem/homes', y: 200,
    what: 'רשת כרטיסים עם תמונה' },
  { id: 'x-profile', name: 'X · פרופיל', users: '600 מיליון', url: 'https://x.com/nasa', y: 0,
    what: 'פרופיל + הזנה' },
  { id: 'reddit-user', name: 'Reddit · משתמש', users: '500 מיליון', url: 'https://www.reddit.com/user/spez/', y: 0,
    what: 'עמוד-אדם עם רשימת-פעילות' },
  { id: 'linkedin-p', name: 'LinkedIn · פרופיל', users: '1 מיליארד', url: 'https://www.linkedin.com/in/williamhgates/', y: 200,
    what: 'הפרופיל התעסוקתי הקנוני' },
];

const b = await chromium.launch();
const out = [];
for (const s of P) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  try {
    await p.goto(s.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await p.waitForTimeout(3600);
    for (const t of ['Accept', 'Accept all', 'Accept All', 'Accept all cookies', 'I agree', 'Got it', 'Allow all', 'Reject all']) {
      const x = p.locator(`button:has-text("${t}")`).first();
      if (await x.count() && await x.isVisible().catch(() => false)) { await x.click().catch(() => { }); await p.waitForTimeout(900); break; }
    }
    if (s.y) { await p.evaluate(y => window.scrollTo(0, y), s.y); await p.waitForTimeout(1200); }
    const m = await p.evaluate(EXTRACT);
    await p.screenshot({ path: join(here, 'design', s.id + '.png') });
    out.push({ ...s, m });
    const bg = m.palette.bg.slice(0, 3).map(x => x.v).join(' ');
    const rad = m.radii.slice(0, 4).map(x => x.v).join(' ');
    const gap = m.gaps.slice(0, 4).map(x => x.v).join(' ');
    console.log(`✓ ${s.name.padEnd(22)} ${String(m.elements).padStart(5)} אל׳ · ${m.body.size}px/${m.body.lh} · משטחים ${bg} · r ${rad} · gap ${gap}`);
  } catch (e) { console.log(`✗ ${s.name.padEnd(22)} ${String(e.message).slice(0, 45)}`); out.push({ ...s, err: String(e.message).slice(0, 45) }); }
  await p.close();
}
await b.close();
writeFileSync(join(here, 'design.json'), JSON.stringify(out, null, 1));
