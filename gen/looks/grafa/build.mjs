/* build.mjs — תקציב מול ביצוע כגרף, מועתק במדידה מ-Our World in Data.
   נמדד מ-ourworldindata.org/grapher/life-expectancy (4,350 אלמנטים).
   הרצה: node gen/looks/grafa/build.mjs                                       */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const app = join(here, '..', 'app');
const raw = JSON.parse(readFileSync(join(here, '..', '..', 'mosad.data.json'), 'utf8'));
const SPEC = { roles: raw.roles.map(r => typeof r === 'string' ? r : r.name),
  depts: raw.departments.map(d => ({ n: d.n || d.name, e: (d.entities || []).map(e => ({ n: e.name, st: e.stages || [], fb: e.forbidden || [], mo: e.moment || '', f: (e.fields || []).map(f => [f.name, f.shape || '', f.required ? 1 : 0]) })) })) };
const src = readFileSync(join(app, 'src', '01-store.js'), 'utf8');

const D = new Function('SPEC', src + `
  build();
  return { months: DB.hmonths, today: DB.today,
    budget: DB.budget.map(b => ({ name:b.name, plan:b.plan, months:b.months, actual:budgetActual(b) })),
    tot: budgetTotals() };
`)(SPEC);

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));

/* ===== צבעי-הסדרה. שישה, כולם נמדדו מהעמוד החי. ===== */
const PAL = ['#9a5129', '#00847e', '#a2559c', '#4c6a9c', '#c4523e', '#18470f'];

/* ניגודיות אמיתית — הקו נשאר בצבע הנמדד, התווית מוכהה עד שהיא עוברת 4.5 */
const lum = (h) => { const c = [1, 3, 5].map(i => parseInt(h.substr(i, 2), 16) / 255)
  .map(v => v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
  return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]; };
const cr = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
const mixHex = (h, t, k) => '#' + [1, 3, 5].map(i => {
  const a = parseInt(h.substr(i, 2), 16), b = parseInt(t.substr(i, 2), 16);
  return Math.round(a + (b - a) * k).toString(16).padStart(2, '0'); }).join('');
const readable = (h, bg, target = 4.5) => { let k = 0;
  while (k <= 1 && cr(mixHex(h, bg === '#ffffff' ? '#000000' : '#ffffff', k), bg) < target) k += 0.04;
  return mixHex(h, bg === '#ffffff' ? '#000000' : '#ffffff', Math.min(k, 1)); };
const INK_L = PAL.map(c => readable(c, '#ffffff'));
const INK_D = PAL.map(c => readable(c, '#1b1c1e'));

/* שש הקטגוריות הגדולות; שתי הקטנות מצטרפות ל«אחר» —
   שמונה תוויות בקצה אחד מתנגשות, ושש הוא בדיוק מה שהמקור מציג. */
const sorted = [...D.budget].sort((a, b) => b.plan - a.plan);
const TOP = sorted.slice(0, 5);
const REST = sorted.slice(5);
const SERIES = [...TOP, { name: 'אחר', plan: REST.reduce((a, b) => a + b.plan, 0),
  months: D.months.map((_, i) => REST.reduce((a, b) => a + b.months[i], 0)),
  actual: REST.reduce((a, b) => a + b.actual, 0) }];

/* חודשים שכבר דווחו — אלול עדיין 0 בכל הקטגוריות */
const LAST = Math.max(...SERIES.map(s => { let k = 0; s.months.forEach((v, i) => { if (v > 0) k = i; }); return k; }));
const MON = D.months.slice(0, LAST + 1);
const cum = (arr) => { let t = 0; return arr.slice(0, LAST + 1).map(v => (t += v)); };
const CUM = SERIES.map(s => cum(s.months));
const MAXV = Math.max(...CUM.map(a => a[a.length - 1]));
const STEP = 300, TOPV = Math.ceil(MAXV / STEP) * STEP;

/* ===== גאומטריה. הזמן זורם שמאל→ימין גם בעברית: כך נוהג כל
   העיתונות הכלכלית בישראל, ומספרים וזמן הם LTR ממילא. ===== */
const W = 880, H = 440, ML = 72, MR = 196, MT = 14, MB = 38;
const PW = W - ML - MR, PH = H - MT - MB;
const X = i => ML + (MON.length === 1 ? 0 : i * PW / (MON.length - 1));
const Y = v => MT + PH - (v / TOPV) * PH;
const nis = n => n >= 1000 ? (n / 1000).toFixed(n % 1000 ? 1 : 0) + ' מ׳' : n + ' אלף';

const path = (a) => a.map((v, i) => (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(v).toFixed(1)).join(' ');

/* פיזור תוויות: כל תווית היא שתי שורות (שם 12 + סכום 11), ולכן
   הפער המזערי הוא 30 ולא 15. ב-15 הן נדרסות זו בזו.            */
const ends = CUM.map((a, i) => ({ i, y: Y(a[a.length - 1]), v: a[a.length - 1] }))
  .sort((a, b) => a.y - b.y);
const GAP = 30, TOP_Y = MT + 10, BOT_Y = MT + PH;
/* מעבר ראשון: דוחף למטה כדי לפתוח פערים. */
for (let i = 1; i < ends.length; i++)
  if (ends[i].y - ends[i - 1].y < GAP) ends[i].y = ends[i - 1].y + GAP;
/* מעבר שני: מי שחרג מלמטה נדחף למעלה — אבל נעצר בגבול העליון.
   הזזה אחידה של כולן דחפה את העליונה אל מחוץ למסגרת (y=-62). */
if (ends[ends.length - 1].y > BOT_Y) {
  ends[ends.length - 1].y = BOT_Y;
  for (let i = ends.length - 2; i >= 0; i--)
    if (ends[i + 1].y - ends[i].y < GAP) ends[i].y = Math.max(TOP_Y, ends[i + 1].y - GAP);
}
ends.forEach(e => { e.y = Math.max(TOP_Y, Math.min(BOT_Y, e.y)); });
const LabY = {}; ends.forEach(e => LabY[e.i] = e.y);

const ticks = []; for (let v = 0; v <= TOPV; v += STEP) ticks.push(v);

const svg = `<svg viewBox="0 0 ${W} ${H}" class="chart" role="img"
 aria-label="ביצוע מצטבר לפי סעיף, ${MON.length} חודשים">
 <title>ביצוע מצטבר לפי סעיף תקציבי</title>
 ${ticks.map(v => v === 0
   ? `<line x1="${ML}" y1="${Y(v)}" x2="${ML + PW}" y2="${Y(v)}" class="zero"/>`
   : `<line x1="${ML}" y1="${Y(v)}" x2="${ML + PW}" y2="${Y(v)}" class="grid"/>`).join('\n ')}
 ${ticks.map(v => `<text x="${ML - 8}" y="${Y(v) + 4}" class="tk" text-anchor="end">${v ? nis(v) : '0'} ₪</text>`).join('\n ')}
 ${MON.map((m, i) => (i % 2 === 0 || i === MON.length - 1)
   ? `<text x="${X(i)}" y="${MT + PH + 20}" class="tk" text-anchor="middle">${esc(m)}</text>` : '').join('\n ')}
 ${CUM.map(a => `<path d="${path(a)}" class="halo"/>`).join('\n ')}
 ${CUM.map((a, i) => `<path d="${path(a)}" class="ser" style="stroke:${PAL[i % PAL.length]}"/>`).join('\n ')}
 ${CUM.map((a, i) => `<circle cx="${X(a.length - 1)}" cy="${Y(a[a.length - 1])}" r="3"
   style="fill:${PAL[i % PAL.length]}"/>`).join('\n ')}
 ${SERIES.map((s, i) => `<text x="${ML + PW + 10}" y="${LabY[i] + 4}" class="lab lab${i}">${esc(s.name)}</text>
 <text x="${ML + PW + 10}" y="${LabY[i] + 18}" class="labv lab${i}">${nis(CUM[i][CUM[i].length - 1])} ₪</text>`).join('\n ')}
</svg>`;

const bars = SERIES.map((s, i) => {
  const a = s.actual, pl = s.plan, over = a > pl;
  const w = Math.max(a, pl) || 1;
  return `<div class="brow">
   <span class="bn">${esc(s.name)}</span>
   <span class="btrack">
    <span class="bplan" style="width:${(pl / w * 100).toFixed(1)}%"></span>
    <span class="bact lab${i}" style="width:${(a / w * 100).toFixed(1)}%"></span>
   </span>
   <span class="bv"><bdi>${nis(a)}</bdi> / <bdi>${nis(pl)}</bdi> ₪
    <b class="${over ? 'over' : 'under'}">${over ? '+' : '−'}${nis(Math.abs(a - pl))}</b></span>
  </div>`; }).join('\n');

const rows = SERIES.map((s, i) => `<tr><td>${esc(s.name)}</td>
 ${s.months.slice(0, LAST + 1).map(v => `<td class="n"><bdi>${v}</bdi></td>`).join('')}
 <td class="n"><b><bdi>${s.actual}</bdi></b></td><td class="n"><bdi>${s.plan}</bdi></td></tr>`).join('\n');

const html = `<!doctype html>
<html lang="he" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>תקציב מול ביצוע</title>
<meta name="description" content="תקציב מול ביצוע כגרף, מועתק במדידה מ-Our World in Data.">
<style>
/* אין קישור לגופן: Playfair ו-Lato של המקור נטולי אותיות עבריות.
   המבנה הועתק — כותרת בגופן-מסורתי וגוף בגופן-מסך — בגופני המערכת. */
*{box-sizing:border-box}html,body{overflow-x:hidden}
:root{
 /* ===== נמדד מ-ourworldindata.org ===== */
 --bg:#ffffff;--ink:#2d2e2d;--mut:#5b5b5b;--hair:#e4e4e4;
 --grid:#dddddd;--zero:#999999;      /* פנים מקווקו 4,4 · קו-אפס מלא */
 --halo:#ffffff;                      /* ההילה מתחת לכל קו */
 --over:#c4523e;--under:#18470f;
 --tk:12px}
@media(prefers-color-scheme:dark){:root:not([data-theme=light]){
 --bg:#1b1c1e;--ink:#eceded;--mut:#a7a9ab;--hair:#33353a;
 --grid:#3a3d42;--zero:#6d7075;--halo:#1b1c1e;
 --over:#f0836c;--under:#77c26a}}
:root[data-theme=dark]{
 --bg:#1b1c1e;--ink:#eceded;--mut:#a7a9ab;--hair:#33353a;
 --grid:#3a3d42;--zero:#6d7075;--halo:#1b1c1e;
 --over:#f0836c;--under:#77c26a}
/* צבע-הקו נשאר הנמדד; צבע-התווית מוכהה/מובהר עד שהוא עובר 4.5 */
${PAL.map((c, i) => `.lab${i}{color:${INK_L[i]}}`).join('\n')}
@media(prefers-color-scheme:dark){:root:not([data-theme=light]){
${PAL.map((c, i) => ` .lab${i}{color:${INK_D[i]}}`).join('\n')}}}
:root[data-theme=dark]{
${PAL.map((c, i) => ` .lab${i}{color:${INK_D[i]}}`).join('\n')}}

body{margin:0;background:var(--bg);color:var(--ink);
 font:400 15px/21px system-ui,sans-serif}
h1,h2{margin:0}p{margin:0}bdi{unicode-bidi:isolate}
button{font:inherit;cursor:pointer;color:inherit}
:focus-visible{outline:2px solid var(--zero);outline-offset:2px}

.wrap{max-width:1040px;margin:0 auto;padding:26px 20px 70px}
.card{border:1px solid var(--hair);padding:20px 22px 16px}
h1{font:600 25px/30px Georgia,"Frank Ruehl CLM","David Libre",serif;color:var(--ink)}
.sub{font-size:15px;line-height:19.3px;color:var(--mut);margin-top:6px;max-width:70ch}
.tabs{display:flex;gap:0;margin:16px 0 10px;border:1px solid var(--hair);
 width:max-content;border-radius:3px;overflow:hidden}
.tabs button{border:0;background:0;padding:7px 16px;font-size:14px;color:var(--mut);
 border-inline-start:1px solid var(--hair)}
.tabs button:first-child{border-inline-start:0}
.tabs button[aria-selected=true]{background:var(--hair);color:var(--ink);font-weight:600}

.chart{width:100%;height:auto;display:block}
.grid{stroke:var(--grid);stroke-width:1;stroke-dasharray:4 4}
.zero{stroke:var(--zero);stroke-width:1}
.tk{fill:var(--mut);font:400 var(--tk)/1 system-ui,sans-serif}
.halo{fill:none;stroke:var(--halo);stroke-width:2.5;stroke-linejoin:round;stroke-linecap:butt}
.ser{fill:none;stroke-width:1.5;stroke-linejoin:round;stroke-linecap:butt}
/* ב-SVG בתוך עמוד RTL, עוגן-ברירת-המחדל של טקסט עברי הוא קצהו
   הימני — והוא זורם שמאלה, אל תוך הציור. direction:ltr מיישר את
   התיבה לשמאל; המילים העבריות עצמן עדיין נקראות מימין לשמאל.  */
.lab,.labv{direction:ltr;text-anchor:start}
.lab{font:600 var(--tk)/1 system-ui,sans-serif;fill:currentColor}
.labv{font:400 11px/1 system-ui,sans-serif;fill:var(--mut)}
svg .lab0,svg .lab1,svg .lab2,svg .lab3,svg .lab4,svg .lab5{fill:currentColor}

.pane{display:none}.pane.on{display:block}

.brow{display:grid;grid-template-columns:190px minmax(0,1fr) 210px;gap:12px;
 align-items:center;padding:9px 0;border-bottom:1px solid var(--hair)}
.bn{font-size:14px}
.btrack{position:relative;height:20px;background:transparent}
.bplan{position:absolute;inset-block:0;inset-inline-start:0;background:var(--hair)}
.bact{position:absolute;inset-block:2px;inset-inline-start:0;background:currentColor;opacity:.85}
.bv{font-size:13px;color:var(--mut);font-variant-numeric:tabular-nums;text-align:end}
.bv b{font-weight:600}
.over{color:var(--over)}.under{color:var(--under)}

table{width:100%;border-collapse:collapse;font-size:13px;
 font-variant-numeric:tabular-nums;margin-top:4px}
th,td{padding:6px 7px;border-bottom:1px solid var(--hair);text-align:start;white-space:nowrap}
th{font:600 12px/16px system-ui,sans-serif;color:var(--mut);border-bottom:2px solid var(--zero)}
td.n{text-align:start}

.src{margin-top:14px;padding-top:12px;border-top:1px solid var(--hair);
 font-size:13px;line-height:19px;color:var(--mut)}
.src b{color:var(--ink);font-weight:600}
.say{margin-top:22px;color:var(--mut);font-size:13px;line-height:20px;max-width:78ch}
.say b{color:var(--ink)}
@media(max-width:720px){
 .brow{grid-template-columns:1fr;gap:4px}
 .bv{text-align:start}
 .tblwrap{overflow-x:auto}}
</style></head><body>
<div class="wrap"><div class="card">

<h1>תקציב מול ביצוע — ${esc(D.today.hy)}</h1>
<p class="sub"><b>ביצוע מצטבר</b> הוא סכום ההוצאה בפועל מתחילת השנה ועד סוף החודש המוצג, לכל סעיף בנפרד. הקו נעצר ב${esc(MON[MON.length - 1])} — אלול טרם דווח.</p>

<div class="tabs" role="tablist">
 <button role="tab" aria-selected="true" data-t="line" id="t1" aria-controls="p1">קו</button>
 <button role="tab" aria-selected="false" data-t="bar" id="t2" aria-controls="p2">עמודות</button>
 <button role="tab" aria-selected="false" data-t="tbl" id="t3" aria-controls="p3">טבלה</button>
</div>

<div class="pane on" id="p1" role="tabpanel" aria-labelledby="t1">
 ${svg}
</div>

<div class="pane" id="p2" role="tabpanel" aria-labelledby="t2">
 ${bars}
</div>

<div class="pane" id="p3" role="tabpanel" aria-labelledby="t3">
 <div class="tblwrap"><table>
  <thead><tr><th>סעיף</th>${MON.map(m => `<th>${esc(m)}</th>`).join('')}<th>ביצוע</th><th>תקציב</th></tr></thead>
  <tbody>${rows}</tbody>
 </table></div>
 <p class="src" style="border:0;padding:0;margin-top:8px">הסכומים באלפי ש״ח.</p>
</div>

<p class="src"><b>מקור הנתונים:</b> ספר התקציב ${esc(D.today.hy)} · דיווחי הביצוע החודשיים. סך התקציב <bdi>${nis(D.tot.plan)}</bdi> ₪, סך הביצוע <bdi>${nis(D.tot.actual)}</bdi> ₪.</p>

</div>

<p class="say">הגרף מועתק במדידה מ-Our World in Data: קווי-רשת פנימיים ב־<bdi dir="ltr">#dddddd</bdi> מקווקווים <bdi dir="ltr">4,4</bdi>, <b>וקו-האפס מלא וכהה יותר</b> ב־<bdi dir="ltr">#999999</bdi> — שני טיפולים שונים בכוונה. תוויות הצירים ב־<bdi>12px</bdi>, והיחידה חוזרת על <b>כל</b> סימן ולא פעם אחת בכותרת הציר. <b>אין תיבת-מקרא</b> — שם הסעיף יושב בקצה הקו שלו. <b>וכל קו מצויר פעמיים:</b> הילה ברוחב <bdi>2.5</bdi> בצבע הרקע, ומעליה הקו ברוחב <bdi>1.5</bdi> — כך שקווים שנחתכים נשארים קריאים. אומת במקור: שישה נתיבי-הילה מול שישה נתיבים צבעוניים. <b>שלוש סטיות מודעות:</b> שישה צבעי-הסדרה נמדדו, אבל צבע התווית לא — במקור הוא חזר <bdi dir="ltr">#000000</bdi> בעוד הצילום מראה תוויות צבעוניות, כנראה כי תפסתי את עותקי-ההילה; כאן התווית מוכהית מצבע-הקו עד שהיא עוברת <bdi>4.5</bdi>. שמונה הסעיפים צומצמו לשישה ו«אחר», כי שמונה תוויות בקצה אחד מתנגשות ושש הוא בדיוק מה שהמקור מציג. והזמן זורם שמאל→ימין גם כאן: כך נוהגת העיתונות הכלכלית בישראל, ומספרים וזמן הם LTR ממילא.</p>

</div>
<script>
(function(){
 var tabs=[].slice.call(document.querySelectorAll('[role=tab]'));
 var panes={line:'p1',bar:'p2',tbl:'p3'};
 tabs.forEach(function(b){b.addEventListener('click',function(){
  tabs.forEach(function(x){x.setAttribute('aria-selected','false');});
  b.setAttribute('aria-selected','true');
  Object.keys(panes).forEach(function(k){
   document.getElementById(panes[k]).classList.toggle('on',k===b.dataset.t);});
 });});
 document.querySelector('.tabs').addEventListener('keydown',function(e){
  var i=tabs.indexOf(document.activeElement); if(i<0)return;
  var n=e.key==='ArrowLeft'?i+1:e.key==='ArrowRight'?i-1:-1;   /* RTL */
  if(n<0||n>=tabs.length)return; e.preventDefault(); tabs[n].focus(); tabs[n].click();});
})();
</script>
</body></html>`;

writeFileSync(join(here, 'grafa.html'), html);
console.log('grafa.html · סדרות ' + SERIES.length + ' · חודשים ' + MON.length +
  ' · תקרה ' + TOPV + ' · תקציב ' + D.tot.plan + ' ביצוע ' + D.tot.actual +
  '\nניגודיות התוויות (בהיר): ' + PAL.map((c, i) => cr(INK_L[i], '#ffffff').toFixed(2)).join(' ') +
  '\nניגודיות התוויות (כהה):  ' + PAL.map((c, i) => cr(INK_D[i], '#1b1c1e').toFixed(2)).join(' '));
