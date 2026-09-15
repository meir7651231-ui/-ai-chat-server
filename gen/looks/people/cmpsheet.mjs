/* cmpsheet.mjs — הכפתור המלא מול המקור: שורה לכל אתר, ארבעה מצבים,
   המקור למעלה ושלנו מתחתיו — ולידם הערכים שנמדדו בפועל. */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const here = dirname(fileURLToPath(import.meta.url));
const M = JSON.parse(readFileSync(join(here, 'btn.json'), 'utf8'));

const ST = [['rest', 'מנוחה'], ['hover', 'ריחוף'], ['focus', 'מיקוד־מקלדת'], ['active', 'לחיצה']];
const S = [
  { id: 'govuk', name: 'GOV.UK', real: 'Save and continue', dark: false,
    key: 'צל 0 2px 0 מתחת · במיקוד הכפתור **הופך צהוב** · בלחיצה הצל הופך ל-inset והכפתור **יורד**' },
  { id: 'wise', name: 'Wise', real: 'Send money', dark: false,
    key: 'שלוש דרגות של אותו ירוק · **מעבר 0s** — בלי אנימציה · במיקוד קו 2px כהה' },
  { id: 'monzo', name: 'Monzo', real: 'View full results', dark: true,
    key: 'לא מחליף צבע — **משנה שקיפות** ל-80% · מעבר 0.2s ease · גלולה r500' },
  { id: 'stripe', name: 'Stripe', real: 'Contact sales', dark: false,
    key: 'נייבי #0a2540 · **פינה 4** — הקטנה בקבוצה · מעבר 0.2s ease-in-out' },
];
const b64 = f => { const p = join(here, 'cmp', f + '.png'); return existsSync(p) ? 'data:image/png;base64,' + readFileSync(p).toString('base64') : ''; };
const md = s => s.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
const val = (id) => {
  const m = M.find(x => x.id === id); if (!m) return '';
  const d = o => Object.keys(o || {}).length ? Object.entries(o).map(([k, v]) => `<code>${k}</code> ${v}`).join('<br>') : '<span class="no">לא משתנה</span>';
  return `<table><tbody>
   <tr><th>מנוחה</th><td><code>bg</code> ${m.rest.bg}<br><code>color</code> ${m.rest.color}<br><code>radius</code> ${m.rest.radius} · <code>h</code> ${m.rest.h}<br><code>shadow</code> ${m.rest.shadow}</td></tr>
   <tr><th>מעבר</th><td><code>${m.rest.transition}</code></td></tr>
   <tr><th>ריחוף</th><td>${d(m.hover)}</td></tr>
   <tr><th>מיקוד</th><td>${d(m.focus)}</td></tr>
   <tr><th>לחיצה</th><td>${d(m.active)}</td></tr></tbody></table>`;
};

const html = `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>הכפתור מול המקור</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700;800&display=swap">
<style>
*{box-sizing:border-box}html,body{overflow-x:hidden}
body{margin:0;background:#0f0f0e;color:#f2f0eb;font:400 16px/1.55 Heebo,Arial,sans-serif;padding:26px 20px 50px}
h1,h2{margin:0}p{margin:0}
h1{font-size:clamp(26px,4vw,36px);font-weight:800}
p.lead{color:#a9a498;max-width:82ch;margin-top:8px}p.lead b{color:#f2f0eb}
.w{max-width:1500px;margin:0 auto}
section{background:#1a1a17;border:1px solid #2f2f2a;border-radius:16px;padding:18px;margin-top:16px}
section>header{display:flex;align-items:baseline;gap:10px;margin-bottom:6px;flex-wrap:wrap}
section h2{font-size:21px;font-weight:800}
section .lab{font-size:13px;color:#a9a498}
.key{font-size:14px;color:#d6d2c7;margin-bottom:14px}
.cols{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
@media(max-width:1100px){.cols{grid-template-columns:repeat(2,1fr)}}
@media(max-width:620px){.cols{grid-template-columns:1fr}}
.col{display:grid;gap:8px}
.col .st{font-size:12.5px;color:#a9a498;text-align:center;font-weight:700}
.pair{display:grid;gap:6px}
.shot{border-radius:9px;overflow:hidden;border:1px solid #2f2f2a;background:#fff;position:relative;min-height:56px;display:grid;place-items:center}
.shot.d{background:#112231}
.shot img{width:100%;display:block}
.shot .who{position:absolute;inset-inline-start:6px;top:6px;font:700 10px Heebo;border-radius:999px;padding:2px 7px;background:#0f0f0ecc;color:#fff}
.shot .who.ours{background:#9fe870;color:#163300}
.miss{color:#8b8780;font-size:12px;padding:16px}
table{width:100%;border-collapse:collapse;margin-top:14px;font-size:12.5px}
th,td{text-align:start;padding:6px 8px;border-block-end:1px solid #2f2f2a;vertical-align:top}
th{color:#a9a498;font-weight:500;white-space:nowrap;width:78px}
code{background:#26261f;border-radius:5px;padding:1px 6px;font:400 11.5px ui-monospace,Menlo,monospace;direction:ltr;display:inline-block}
.no{color:#8b8780}
</style></head><body>
<div class="w">
<h1>הכפתור המלא — מול המקור</h1>
<p class="lead">בכל שורה: <b>המקור</b> (צילום מהאתר החי) ומתחתיו <b>שלנו</b>, באותם ארבעה מצבים.
שני הצדדים צולמו באותה שיטה בדיוק — אותו קוד מרחף, ממקד ולוחץ. הטבלה מציגה את הערכים <b>כפי שנמדדו</b> מהאתר.</p>
${S.map(s => `<section>
 <header><h2>${s.name}</h2><span class="lab">המקור: «${s.real}» · שלנו: «רישום תשלום ₪1,000»</span></header>
 <p class="key">${md(s.key)}</p>
 <div class="cols">
  ${ST.map(([k, he]) => `<div class="col"><span class="st">${he}</span>
    <div class="pair">
      <div class="shot${s.dark ? ' d' : ''}"><span class="who">מקור</span>${b64(s.id + '-real-' + k) ? `<img src="${b64(s.id + '-real-' + k)}" alt="${s.name} ${he} — מקור">` : '<span class="miss">אין</span>'}</div>
      <div class="shot${s.dark ? ' d' : ''}"><span class="who ours">שלנו</span>${b64(s.id + '-ours-' + k) ? `<img src="${b64(s.id + '-ours-' + k)}" alt="${s.name} ${he} — שלנו">` : '<span class="miss">אין</span>'}</div>
    </div></div>`).join('')}
 </div>
 ${val(s.id)}
</section>`).join('')}
</div></body></html>`;
writeFileSync(join(here, 'btn-compare.html'), html);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1560, height: 1000 } });
await p.goto('file://' + join(here, 'btn-compare.html'));
await p.waitForTimeout(1000);
await p.screenshot({ path: join(here, 'btn-compare.png'), fullPage: true });
await b.close();
console.log('gen/looks/people/btn-compare.html · btn-compare.png');
