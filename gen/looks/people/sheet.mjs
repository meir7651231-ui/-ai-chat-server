/* sheet.mjs — גיליון-בחירה ממוספר: מי בעולם עושה כל פעולה של «אנשים». */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const here = dirname(fileURLToPath(import.meta.url));

const OPS = [
  { n: 1, op: 'ספר של אלפי רשומות + סינון מיידי', who: 'Linear', id: 'linear', why: 'הרשימה נשארת מיידית גם ב-10,000 פריטים; סינון מצטבר בשורת-מסננים, לא בטופס' },
  { n: 2, op: 'ניווט-מקלדת וחיפוש-על', who: 'Linear · Raycast', id: 'linear', why: '‏Ctrl K פותח הכל; חץ-חץ-Enter מספיק לכל פעולה בלי עכבר' },
  { n: 3, op: 'פאנל-הצצה בלי לעזוב את הרשימה', who: 'Attio', id: 'attio', why: 'לחיצה על שורה פותחת מגירה מימין; הרשימה נשארת במקום' },
  { n: 4, op: 'רשומת-אדם עם כסף והיסטוריה', who: 'Stripe', id: 'stripe', why: 'לקוח = יתרה + כל התנועות + כל הניסיונות, בעמוד אחד' },
  { n: 5, op: 'ציר-זמן של כל מה שקרה עם האדם', who: 'Intercom', id: 'intercom', why: 'שיחות, אירועים ותכונות על אותו ציר; רואים «מה היה איתו» בשנייה' },
  { n: 6, op: 'קשרים בין רשומות (משפחה→ילדים→כיתה)', who: 'Airtable · Notion', id: 'airtable', why: 'שדה-קישור אמיתי: הילד הוא רשומה, לא טקסט; לחיצה עוברת אליו' },
  { n: 7, op: 'קבוצות, תוויות ותצוגות שמורות', who: 'Notion · folk', id: 'notion', why: 'אותו מסד, כמה תצוגות שמורות — «בפיגור», «בלי הו״ק», «תורמים»' },
  { n: 8, op: 'איחוד כפולים — אותו אדם בשני שמות', who: 'HubSpot', id: 'hubspot', why: 'מזהה חשד, מראה שתי הרשומות זו מול זו, ומאחד עם החזר' },
  { n: 9, op: 'העשרה וזיהוי-ישויות', who: 'Clay', id: 'clay', why: 'משלים פרטים חסרים ממקורות אחרים ומסמן ביטחון' },
  { n: 10, op: 'עץ-משפחה ויחסי-קרבה', who: 'MyHeritage', id: 'myheritage', why: 'עברית מלאה, RTL אמיתי, ועץ שמתפקד גם ב-12 ילדים למשפחה' },
  { n: 11, op: 'ספר-אנשים ציבורי עם אינדקס שם', who: 'WikiTree', id: 'wikitree-index', why: '8,165 «כהן» עם אינדקס, שמות-קרובים ותורמים — הפונקציה נכונה, העיצוב ישן' },
  { n: 12, op: 'כרטיס-אדם קצר בתוך זרימה', who: 'Slack', id: 'slack', why: 'ריחוף על שם ⇒ כרטיס עם תפקיד, שעה מקומית ופעולה — בלי לעזוב' },
];

const b64 = (id) => { const p = join(here, 'shots', id + '.png'); return existsSync(p) ? 'data:image/png;base64,' + readFileSync(p).toString('base64') : ''; };

const html = `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>אנשים — מי בעולם עושה את זה</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700;800&display=swap">
<style>*{box-sizing:border-box}body{margin:0;background:#0f0f0e;color:#f2f0eb;font:400 16px/1.5 Heebo,Arial,sans-serif;padding:26px}
h1{font-size:30px;font-weight:800;margin:0 0 6px}p.lead{color:#a9a498;max-width:80ch;margin:0 0 24px}
.grid{max-width:1600px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:18px}
figure{margin:0;background:#1a1a17;border:1px solid #2f2f2a;border-radius:14px;overflow:hidden;display:flex;flex-direction:column}
.win{height:230px;overflow:hidden;background:#fff;position:relative}
.win img{width:100%;display:block}
.num{position:absolute;inset-inline-start:10px;top:10px;width:38px;height:38px;border-radius:999px;background:#9fe870;color:#163300;
 display:grid;place-items:center;font:800 18px Heebo;box-shadow:0 4px 14px rgb(0 0 0/.45)}
figcaption{padding:14px;display:grid;gap:5px}
figcaption b{font-size:17px}
figcaption .who{font-size:13px;color:#9fe870;font-weight:700}
figcaption .why{font-size:13.5px;color:#a9a498}
.miss{height:230px;display:grid;place-items:center;background:#26261f;color:#a9a498;font-size:13px}
</style></head><body>
<h1>«אנשים» — מי בעולם עושה כל פעולה</h1>
<p class="lead">‏12 פעולות שהמסך «אנשים» צריך, וליד כל אחת המוצר שהוא הרפרנס העולמי שלה.
הצילומים אמיתיים, נלקחו מהאתרים החיים היום. <b>תגיד לי מספרים — ואני לוקח רק אותם.</b></p>
<div class="grid">
${OPS.map(o => { const img = b64(o.id); return `<figure>
  <div class="win"><span class="num">${o.n}</span>${img ? `<img src="${img}" alt="${o.who}">` : '<div class="miss">אין צילום ציבורי — דורש חשבון</div>'}</div>
  <figcaption><b>${o.op}</b><span class="who">${o.who}</span><span class="why">${o.why}</span></figcaption></figure>`; }).join('\n')}
</div></body></html>`;
writeFileSync(join(here, 'index.html'), html);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
await p.goto('file://' + join(here, 'index.html'));
await p.waitForTimeout(1200);
await p.screenshot({ path: join(here, 'sheet.png'), fullPage: true });
await b.close();
console.log('גיליון-הבחירה: gen/looks/people/index.html · sheet.png');
