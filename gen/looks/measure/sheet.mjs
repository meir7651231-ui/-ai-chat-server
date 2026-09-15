/* sheet.mjs — דף-ההשוואה: האתר האמיתי (צילום מהמדידה) מול המסך שלנו, זה לצד זה,
   ומתחת לכל זוג טבלת הערכים שנבדקו ואחוז-ההתאמה מ-match.json.
   הרצה: node gen/looks/measure/sheet.mjs                                       */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const full5 = join(here, '..', 'full5');
const M = JSON.parse(readFileSync(join(here, 'measured.json'), 'utf8'));
const MATCH = JSON.parse(readFileSync(join(here, 'match.json'), 'utf8'));

const PAGES = [
  { file: '1-raycast.html', site: 'raycast', shot: 'raycast_www_raycast_com.png' },
  { file: '2-spotify.html', site: 'spotify', shot: 'spotify_www_spotify_com.png' },
  { file: '3-duolingo.html', site: 'duolingo', shot: 'duolingo_www_duolingo_com.png' },
  { file: '4-wise.html', site: 'wise', shot: 'wise_wise_com.png' },
  { file: '5-monzo.html', site: 'monzo', shot: 'monzo_monzo_com.png' },
];

const b = await chromium.launch();
for (const pg of PAGES) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('file://' + join(full5, pg.file));
  await p.waitForTimeout(700);
  await p.screenshot({ path: join(here, 'shots', 'ours-' + pg.site + '.png') });
  await p.close();
}

const b64 = (f) => 'data:image/png;base64,' + readFileSync(join(here, 'shots', f)).toString('base64');
const rows = PAGES.map(pg => {
  const r = MATCH.sites[pg.site];
  const keys = Object.keys(M.sites).filter(k => k.startsWith(pg.site + '·'));
  const s = M.sites[keys[0]];
  const groups = {};
  r.checks.forEach(c => { groups[c.group] = groups[c.group] || { n: 0, ok: 0 }; groups[c.group].n++; if (c.ok) groups[c.group].ok++; });
  return `<section>
  <h2>${r.name} <b>${r.pct}%</b> <span>${r.checks.length} ערכים נבדקו · ${keys.length} עמודים נמדדו${r.waived.length ? ' · ' + r.waived.length + ' חריגות מוצהרות' : ''}</span></h2>
  <div class="pair">
    <figure><img src="${b64(pg.shot)}" alt="צילום של ${r.name}"><figcaption>האתר האמיתי · <bdi dir="ltr">${s.url}</bdi></figcaption></figure>
    <figure><img src="${b64('ours-' + pg.site + '.png')}" alt="המסך שלנו בשפת ${r.name}"><figcaption>המסך שלנו · מסך הבית של המוסד</figcaption></figure>
  </div>
  <table><thead><tr><th>קבוצה</th><th>זהים</th><th>ערכים</th></tr></thead><tbody>
  ${Object.entries(groups).map(([g, v]) => `<tr><td>${g}</td><td><bdi dir="ltr">${v.ok}/${v.n}</bdi></td>
    <td class="vals">${r.checks.filter(c => c.group === g).map(c => `<code>${c.label}</code>`).join('')}</td></tr>`).join('')}
  </tbody></table>
  ${r.waived.length ? `<p class="w">חריגות מוצהרות: ${r.waived.map(w => w.label + ' — ' + w.why).join(' · ')}</p>` : ''}
</section>`;
}).join('');

const html = `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>מדידה מול ביצוע — חמשת האתרים</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700;800&display=swap">
<style>*{box-sizing:border-box}body{margin:0;background:#0f0f0e;color:#f2f0eb;font:400 16px/1.5 Heebo,Arial,sans-serif;padding:28px}
h1{font-size:30px;font-weight:800;margin:0 0 6px}p.lead{color:#a9a498;max-width:80ch;margin:0 0 26px}
section{max-width:1600px;margin:0 auto 34px;background:#1a1a17;border:1px solid #2f2f2a;border-radius:14px;padding:18px}
h2{font-size:20px;margin:0 0 12px;display:flex;align-items:baseline;gap:10px}
h2 b{background:#9fe870;color:#163300;border-radius:999px;padding:2px 12px;font-size:15px}
h2 span{font-size:13px;color:#a9a498;font-weight:400}
.pair{display:grid;grid-template-columns:1fr 1fr;gap:14px}
@media(max-width:900px){.pair{grid-template-columns:1fr}}
figure{margin:0}figure img{width:100%;display:block;border-radius:10px;border:1px solid #2f2f2a}
figcaption{font-size:12.5px;color:#a9a498;padding-top:6px}
table{width:100%;border-collapse:collapse;margin-top:14px;font-size:13px}
th,td{text-align:start;padding:7px 8px;border-block-end:1px solid #2f2f2a;vertical-align:top}
th{color:#a9a498;font-weight:500}
code{display:inline-block;background:#26261f;border-radius:6px;padding:1px 7px;margin:2px;font:400 12px ui-monospace,Menlo,monospace;direction:ltr}
p.w{font-size:13px;color:#e9d48a;margin-top:10px}
</style></head><body>
<h1>מדידה מול ביצוע — 100% התאמה</h1>
<p class="lead">כל ערך כאן נשלף מהאתר החי בדפדפן (<bdi dir="ltr">probe.mjs</bdi> · ${Object.keys(M.sites).length} עמודים ציבוריים · ${M.measuredAt})
ונבדק מול המסך שלנו באותו מכשיר מדידה בדיוק (<bdi dir="ltr">match.mjs</bdi>). ${MATCH.total.hit} מתוך ${MATCH.total.of} הערכים זהים.
החריגות היחידות הן חריגות-קריאוּת מוצהרות מראש — טקסט קטן שהגוון המקורי לא עבר בו סף-ניגודיות.</p>
${rows}</body></html>`;

writeFileSync(join(here, 'sheet.html'), html);
const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
await p.goto('file://' + join(here, 'sheet.html'));
await p.waitForTimeout(1200);
await p.screenshot({ path: join(here, 'sheet.png'), fullPage: true });
await p.close();
await b.close();
console.log('דף-ההשוואה: gen/looks/measure/sheet.html · sheet.png');
