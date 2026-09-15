/* bestsheet.mjs — גיליון-בחירה: האתרים הכי טובים בעולם לאנשים. */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const here = dirname(fileURLToPath(import.meta.url));

const L = [
  { n: 1, id: 'pco', name: 'Planning Center People', tier: 'אותה בעיה בדיוק',
    what: 'רשומת-אדם של קהילה: פרטים · **ילדים** · נוכחות · תרומות · הערות · תאריכים חשובים', note: '78,000 קהילות' },
  { n: 2, id: 'breeze', name: 'Breeze', tier: 'אותה בעיה בדיוק',
    what: 'ספר-משפחות של קהילה, גרסה קלילה — הכל במסך אחד', note: 'הקל ביותר בקטגוריה' },
  { n: 3, id: 'wikipedia', name: 'ויקיפדיה', tier: 'עמוד-האדם הקנוני',
    what: 'תיבת-המידע: כל העובדות על אדם בפאנל אחד — **ובעברית RTL אמיתית**', note: 'הסטנדרט העולמי' },
  { n: 4, id: 'linkedin', name: 'LinkedIn', tier: 'עמוד-האדם הקנוני',
    what: 'מסד-האנשים הגדול בעולם; הפרופיל הוא ההגדרה של «מי זה»', note: 'מיליארד פרופילים' },
  { n: 5, id: 'myheritage', name: 'MyHeritage', tier: 'קשרי-משפחה',
    what: 'ספר-שמות בעברית מלאה על אלפי רשומות — RTL על דאטה אמיתית', note: 'ישראלי' },
  { n: 6, id: 'geni', name: 'Geni', tier: 'קשרי-משפחה',
    what: 'הורים · בני-זוג · ילדים כ**רשומות מקושרות**, לא כטקסט', note: 'עץ שיתופי' },
  { n: 7, id: 'airbnb-host', name: 'Airbnb', tier: 'אמון',
    what: 'פרופיל-אמון: מי אומת · מה אומרים עליו · כמה זמן הוא כאן', note: 'העיצוב הכי נקי בקבוצה' },
  { n: 8, id: 'bamboohr', name: 'BambooHR', tier: 'רשומת-עובד',
    what: 'תפקיד · משמרות · היעדרות · מחליף — זה בדיוק המסך «צוות» שלך', note: '' },
];

const b64 = (id) => { const p = join(here, 'best', id + '.png'); return existsSync(p) ? 'data:image/png;base64,' + readFileSync(p).toString('base64') : ''; };
const md = (s) => s.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');

const html = `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>אנשים — הכי טובים בעולם</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700;800&display=swap">
<style>*{box-sizing:border-box}body{margin:0;background:#0f0f0e;color:#f2f0eb;font:400 16px/1.55 Heebo,Arial,sans-serif;padding:26px}
h1{font-size:30px;font-weight:800;margin:0 0 6px}p.lead{color:#a9a498;max-width:82ch;margin:0 0 10px}
p.rule{color:#9fe870;max-width:82ch;margin:0 0 24px;font-weight:700}
.grid{max-width:1600px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(420px,1fr));gap:18px}
figure{margin:0;background:#1a1a17;border:1px solid #2f2f2a;border-radius:14px;overflow:hidden;display:flex;flex-direction:column}
.win{height:270px;overflow:hidden;background:#fff;position:relative}
.win img{width:100%;display:block}
.num{position:absolute;inset-inline-start:10px;top:10px;width:40px;height:40px;border-radius:999px;background:#9fe870;color:#163300;
 display:grid;place-items:center;font:800 19px Heebo;box-shadow:0 4px 14px rgb(0 0 0/.5)}
.tier{position:absolute;inset-inline-end:10px;top:10px;background:#0f0f0e;color:#f2f0eb;border-radius:999px;padding:5px 12px;font:700 12px Heebo}
figcaption{padding:14px;display:grid;gap:5px}
figcaption b.nm{font-size:18px}
figcaption .what{font-size:14px;color:#d6d2c7}
figcaption .note{font-size:12.5px;color:#a9a498}
.miss{height:270px;display:grid;place-items:center;background:#26261f;color:#a9a498;font-size:13px;text-align:center;padding:20px}
</style></head><body>
<h1>אנשים — הכי טובים בעולם</h1>
<p class="lead">כמו שלגבייה לקחנו את מי שהליבה שלו כסף.</p>
<p class="rule">הכלל שהוביל את הבחירה: מוצרים שבהם <b>עמוד-האדם הוא המוצר עצמו</b> — ולכן הם גם היחידים שהממשק שלהם נראה בלי חשבון.</p>
<div class="grid">
${L.map(o => { const img = b64(o.id); return `<figure>
  <div class="win"><span class="num">${o.n}</span><span class="tier">${o.tier}</span>
   ${img ? `<img src="${img}" alt="${o.name}">` : '<div class="miss">לא נפתח מהסביבה הזו</div>'}</div>
  <figcaption><b class="nm">${o.name}</b><span class="what">${md(o.what)}</span>${o.note ? `<span class="note">${o.note}</span>` : ''}</figcaption></figure>`; }).join('\n')}
</div></body></html>`;
writeFileSync(join(here, 'best.html'), html);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
await p.goto('file://' + join(here, 'best.html'));
await p.waitForTimeout(1200);
await p.screenshot({ path: join(here, 'best-sheet.png'), fullPage: true });
await b.close();
console.log('gen/looks/people/best.html · best-sheet.png');
