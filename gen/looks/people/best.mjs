/* best.mjs — האתרים הכי טובים בעולם לאנשים, כמו ש-Wise ו-Monzo הם לכסף.
   הכלל שהוביל את הבחירה: מוצרים שבהם **עמוד-האדם הוא המוצר עצמו** — ולכן
   הם גם היחידים שהממשק שלהם נראה בלי חשבון.
   הרצה: node gen/looks/people/best.mjs */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const here = dirname(fileURLToPath(import.meta.url));
mkdirSync(join(here, 'best'), { recursive: true });

const P = [
  { id: 'github', name: 'GitHub', url: 'https://github.com/torvalds', y: 0,
    why: 'עמוד-אדם: זהות · פעילות לאורך שנים · שיוכים · מספרים — הכל בלי גלילה' },
  { id: 'imdb', name: 'IMDb', url: 'https://www.imdb.com/name/nm0000138/', y: 200,
    why: 'אדם אחד עם מאות רשומות מקושרות, מסודרות לפי תפקיד ושנה' },
  { id: 'wikipedia', name: 'Wikipedia', url: 'https://he.wikipedia.org/wiki/%D7%94%D7%A8%D7%91_%D7%A2%D7%95%D7%91%D7%93%D7%99%D7%94_%D7%99%D7%95%D7%A1%D7%A3', y: 0,
    why: 'תיבת-המידע: הפאנל הקנוני של «כל העובדות על אדם» — ובעברית RTL' },
  { id: 'linkedin', name: 'LinkedIn', url: 'https://www.linkedin.com/in/williamhgates/', y: 300,
    why: 'מסד-האנשים הגדול בעולם; הפרופיל הוא הסטנדרט של «מי זה»' },
  { id: 'airbnb-host', name: 'Airbnb', url: 'https://www.airbnb.com/users/show/1', y: 200,
    why: 'פרופיל-אמון: מי אומת, מה אומרים עליו, כמה זמן הוא כאן' },
  { id: 'geni', name: 'Geni', url: 'https://www.geni.com/people/Moses-Maimonides/6000000002357242123', y: 200,
    why: 'קשרי-משפחה: הורים · בני-זוג · ילדים כרשומות, לא כטקסט' },
  { id: 'myheritage', name: 'MyHeritage', url: 'https://www.myheritage.co.il/names/moshe_cohen', y: 300,
    why: 'ספר-שמות בעברית מלאה — RTL אמיתי על אלפי רשומות' },
  { id: 'pco', name: 'Planning Center People', url: 'https://www.planningcenter.com/people', y: 700,
    why: 'בדיוק הבעיה שלך: קהילה · משפחות · ילדים · נוכחות · תרומות' },
  { id: 'breeze', name: 'Breeze', url: 'https://www.breezechms.com/', y: 600,
    why: 'אותה בעיה, גרסה קלילה: ספר-משפחות של קהילה' },
  { id: 'bamboohr', name: 'BambooHR', url: 'https://www.bamboohr.com/', y: 700,
    why: 'רשומת-עובד: תפקיד · משמרות · היעדרות — זה «צוות» שלך' },
];

const b = await chromium.launch();
const out = [];
for (const s of P) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 }, locale: 'he-IL' });
  try {
    await p.goto(s.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await p.waitForTimeout(3200);
    for (const t of ['Accept', 'Accept all', 'I agree', 'Got it', 'Allow all', 'OK', 'אישור', 'קבל הכל']) {
      const btn = p.locator(`button:has-text("${t}")`).first();
      if (await btn.count() && await btn.isVisible().catch(() => false)) { await btn.click().catch(() => { }); await p.waitForTimeout(700); break; }
    }
    if (s.y) { await p.evaluate(y => window.scrollTo(0, y), s.y); await p.waitForTimeout(1300); }
    const gated = await p.evaluate(() => /sign in|log in|join now|הרשמה|התחברות/i.test(document.body.innerText.slice(0, 1200)));
    await p.screenshot({ path: join(here, 'best', s.id + '.png') });
    out.push({ ...s, gated, title: (await p.title()).slice(0, 55) });
    console.log(`✓ ${s.name.padEnd(24)} ${gated ? 'חלקית-חסום' : 'פתוח'} · ${(await p.title()).slice(0, 45)}`);
  } catch (e) { console.log(`✗ ${s.name} — ${String(e.message).slice(0, 50)}`); out.push({ ...s, err: String(e.message).slice(0, 50) }); }
  await p.close();
}
await b.close();
writeFileSync(join(here, 'best.json'), JSON.stringify(out, null, 1));
