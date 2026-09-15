/* build.mjs — ספר האפיון: המילים שלך כמקור, והמערכת כפירוש.
   מועתק במדידה מספריא (sefaria.org.il/Berakhot.2a?lang=bi).
   הרצה: node gen/looks/sefer/build.mjs                                       */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const appSrc = join(here, '..', 'app', 'src');
const raw = JSON.parse(readFileSync(join(here, '..', '..', 'mosad.data.json'), 'utf8'));

/* ===== האכיפה נמדדת מן הקוד, לא נטענת ===== */
const code = readdirSync(appSrc).filter(f => f.endsWith('.js'))
  .map(f => ({ f, t: readFileSync(join(appSrc, f), 'utf8') }));
const allCode = code.map(c => c.t).join('\n');
/* אילו זוגות מחלקה/ישות מוצגים דרך forbiddenOf */
const shown = new Set();
for (const m of allCode.matchAll(/forbiddenOf\(\s*'([^']+)'\s*,\s*'([^']+)'\s*\)/g))
  shown.add(m[1] + '|' + m[2]);
/* אילו כללים באמת חוסמים פעולה — קריאות ל-blocked(), ותנאי-חסימה מפורשים */
const enforced = new Map();
for (const c of code) {
  for (const m of c.t.matchAll(/blocked\(\s*forbiddenOf\(\s*'([^']+)'\s*,\s*'([^']+)'\s*\)\[(\d+)\]/g))
    enforced.set(m[1] + '|' + m[2] + '|' + m[3], c.f);
  for (const m of c.t.matchAll(/blocked\(\s*forbiddenOf\(\s*'([^']+)'\s*,\s*'([^']+)'\s*\)\[(\d+)\]\s*\|\|/g))
    enforced.set(m[1] + '|' + m[2] + '|' + m[3], c.f);
}
/* חסימות שנכתבו ביד — מזוהות לפי התנאי בקוד */
const HAND = [
  ['חסד', 'הלוואה', 'הלוואה בלי שני ערבים', /guarantors\s*<\s*2/, '22-views-c.js'],
  ['גבייה', 'חיוב', 'הנחות מצטברות (הגבוהה בלבד)', /1\s*-\s*f\.discount\s*\/\s*100/, '01-store.js'],
];
const handHit = HAND.filter(h => h[3].test(allCode));

const depts = raw.departments.map(d => ({
  n: d.n || d.name,
  ents: (d.entities || []).map(e => ({
    n: e.name, moment: e.moment || '',
    fields: (e.fields || []).map(f => ({ n: f.name, req: !!f.required, shape: f.shape || '' })),
    stages: e.stages || [], forbidden: e.forbidden || [],
  })),
}));

let ENTS = 0, FIELDS = 0, REQ = 0, FORB = 0, STAGES = 0;
depts.forEach(d => d.ents.forEach(e => { ENTS++; FIELDS += e.fields.length;
  REQ += e.fields.filter(f => f.req).length; FORB += e.forbidden.length; STAGES += e.stages.length; }));
/* הסיכום נספר מ-note() עצמו — אותו מקור שמייצר את התגים,
   כדי שהמספר בכותרת והתגים בגוף לא יוכלו לסתור זה את זה. */
const TALLY = { 'חוסם': 0, 'מוצג': 0, 'טרם': 0 };

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
const SHAPES = { text:'טקסט', number:'מספר', money:'סכום', date:'תאריך', id:'מזהה',
  bool:'כן/לא', ref:'הפניה', enum:'רשימה', file:'קובץ', phone:'טלפון' };

/* ===== הפירוש — נגזר, ולעולם לא מומצא ===== */
const note = (dept, ent, rule, idx) => {
  const key = dept + '|' + ent + '|' + idx;
  if (enforced.has(key)) return { s: 'חוסם', t: `נאכף בקוד — ${enforced.get(key)} קורא ל־blocked() עם הכלל הזה, והפעולה נעצרת.` };
  const h = handHit.find(x => x[0] === dept && x[1] === ent && rule.startsWith(x[2].slice(0, 12)));
  if (h) return { s: 'חוסם', t: `נאכף בקוד — ${h[4]} בודק את התנאי ישירות ומונע את המעבר.` };
  if (shown.has(dept + '|' + ent)) return { s: 'מוצג', t: 'מוצג למשתמש במסך תחת «מה אסור — מתוך האפיון», אך אין עדיין קוד שחוסם את הפעולה.' };
  return { s: 'טרם', t: 'אינו מופיע עדיין באף מסך ואין קוד שחוסם אותו. כתוב באפיון בלבד.' };
};

depts.forEach(d => d.ents.forEach(e => e.forbidden.forEach((r, i) => { TALLY[note(d.n, e.n, r, i).s]++; })));
const ENFORCED = TALLY['חוסם'], SHOWN = TALLY['מוצג'], NEITHER = TALLY['טרם'];

const entHtml = (d, e) => {
  const req = e.fields.filter(f => f.req);
  const shapes = [...new Set(e.fields.map(f => f.shape).filter(Boolean))];
  return `<section class="ent" id="e-${esc(d.n)}-${esc(e.n)}">
 <h3>${esc(e.n)}</h3>
 ${e.moment ? `<div class="seg">
   <p class="src">${esc(e.moment)}</p>
   <p class="com">הרגע שהישות הזאת משרתת, כפי שכתבת אותו. המערכת מחזיקה לה <b>${e.fields.length}</b> שדות${req.length ? `, מהם <b>${req.length}</b> חובה (${req.map(f => esc(f.n)).join(' · ')})` : ''}${e.stages.length ? `, ומסלול של <b>${e.stages.length}</b> שלבים: ${e.stages.map(esc).join(' ← ')}` : ', בלי מסלול שלבים'}.</p>
  </div>` : ''}
 ${e.forbidden.map((r, i) => { const n = note(d.n, e.n, r, i);
   return `<div class="seg">
   <p class="src forb"><span class="mk" aria-hidden="true">${i + 1}</span>${esc(r)}</p>
   <p class="com"><span class="st st-${n.s === 'חוסם' ? 'ok' : n.s === 'מוצג' ? 'mid' : 'no'}">${n.s}</span>${n.t}</p>
  </div>`; }).join('\n ')}
 ${!e.moment && !e.forbidden.length ? `<div class="seg"><p class="com">אין לישות זו איסורים או משפט-רגע באפיון. ${e.fields.length} שדות${e.stages.length ? `, ${e.stages.length} שלבים` : ''}.</p></div>` : ''}
</section>`;
};

const html = `<!doctype html>
<html lang="he" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>ספר האפיון</title>
<meta name="description" content="האפיון כמקור והמערכת כפירוש, בטיפוגרפיה מדודה מספריא.">
<style>
/* אין קישור לגופן — Cardo של המקור נטול אותיות עבריות, והעברית שם
   נופלת ממילא לגופן-המערכת. */
*{box-sizing:border-box}html,body{overflow-x:hidden}
:root{
 /* ===== נמדד מ-sefaria.org.il/Berakhot.2a?lang=bi ===== */
 --bg:#ffffff;--src:#000000;--com:#666666;--hair:#e0ddd5;--mut:#726c60;
 --ok:#1c6b3a;--mid:#8a5a00;--no:#8c2f2f;
 /* היחס 1.22 — נמדד גם בגודל וגם ברווח-השורה, ולא במקרה */
 --srcFs:26.84px;--srcLh:42.944px;
 --comFs:22px;--comLh:35.2px;
 --col:700px}
@media(prefers-color-scheme:dark){:root:not([data-theme=light]){
 --bg:#12110f;--src:#f2efe8;--com:#a8a296;--hair:#2e2b26;--mut:#8b857a;
 --ok:#6fc48c;--mid:#d8a54a;--no:#e88b8b}}
:root[data-theme=dark]{
 --bg:#12110f;--src:#f2efe8;--com:#a8a296;--hair:#2e2b26;--mut:#8b857a;
 --ok:#6fc48c;--mid:#d8a54a;--no:#e88b8b}
body{margin:0;background:var(--bg);color:var(--src);
 font:400 16px/24px system-ui,sans-serif}
h1,h2,h3{margin:0}p{margin:0}bdi{unicode-bidi:isolate}
button{font:inherit;cursor:pointer;color:inherit}
:focus-visible{outline:2px solid var(--com);outline-offset:3px}

.top{border-bottom:1px solid var(--hair);padding:14px 0;position:sticky;
 top:env(safe-area-inset-top,0px);background:var(--bg);z-index:5}
.top .in{max-width:1020px;margin:0 auto;padding:0 20px;display:flex;
 align-items:center;gap:14px;flex-wrap:wrap}
.top b{font:600 17px/24px system-ui,sans-serif}
.top .c{color:var(--mut);font-size:14px}
select{margin-inline-start:auto;font:400 15px/1 system-ui,sans-serif;
 border:1px solid var(--hair);border-radius:6px;padding:7px 10px;
 background:var(--bg);color:var(--src)}

.wrap{max-width:1020px;margin:0 auto;padding:26px 20px 80px}
h1{font:400 30px/40px system-ui,sans-serif;text-align:center}
.lede{color:var(--com);font-size:16px;line-height:25px;text-align:center;
 margin:10px auto 0;max-width:62ch}
.tot{display:flex;gap:18px;justify-content:center;flex-wrap:wrap;margin-top:16px;
 padding-bottom:18px;border-bottom:1px solid var(--hair);color:var(--mut);font-size:14px}
.tot b{color:var(--src);font-weight:600;font-variant-numeric:tabular-nums}

/* ---------- העמודה. מקור ופירוש באותו רוחב, זה מתחת לזה. ---------- */
.dept{display:none}.dept.on{display:block}
h2{font:400 24px/34px system-ui,sans-serif;text-align:center;margin:30px 0 4px}
.ent{max-width:var(--col);margin:26px auto 0}
h3{font:600 17px/26px system-ui,sans-serif;color:var(--mut);
 padding-bottom:5px;border-bottom:1px solid var(--hair)}
.seg{margin-top:20px}
/* המקור: גדול, שחור, וראשון */
.src{font:400 var(--srcFs)/var(--srcLh) system-ui,sans-serif;color:var(--src)}
.src.forb{position:relative;padding-inline-start:0}
.mk{position:absolute;inset-inline-end:calc(100% + 14px);top:10px;
 font:400 14px/1 system-ui,sans-serif;color:var(--mut);
 font-variant-numeric:tabular-nums}
/* הפירוש: קטן ב-22%, אפור, ומתחתיו — לא לצדו */
.com{font:400 var(--comFs)/var(--comLh) system-ui,sans-serif;color:var(--com);margin-top:2px}
.com b{color:var(--src);font-weight:600}
.st{display:inline-block;font:600 14px/20px system-ui,sans-serif;
 border-radius:4px;padding:1px 8px;margin-inline-end:8px;vertical-align:1px}
.st-ok{color:var(--ok);border:1px solid var(--ok)}
.st-mid{color:var(--mid);border:1px solid var(--mid)}
.st-no{color:var(--no);border:1px solid var(--no)}

.say{max-width:var(--col);margin:44px auto 0;padding-top:18px;
 border-top:1px solid var(--hair);color:var(--com);font-size:15px;line-height:24px}
.say b{color:var(--src)}
@media(max-width:760px){
 :root{--srcFs:21px;--srcLh:33.6px;--comFs:17.2px;--comLh:27.5px}
 .mk{position:static;display:block;margin-bottom:2px}}
</style></head><body>

<div class="top"><div class="in">
 <b>ספר האפיון</b>
 <span class="c">${ENTS} ישויות · ${FIELDS} שדות · ${FORB} איסורים</span>
 <label class="hid" for="pick">מחלקה</label>
 <select id="pick">${depts.map((d, i) => `<option value="${i}">${esc(d.n)} — ${d.ents.length} ישויות</option>`).join('')}</select>
</div></div>

<div class="wrap">
 <h1>המילים שלך, ומה המערכת עושה איתן</h1>
 <p class="lede">כל שורה שחורה היא ציטוט מדויק מן האפיון שכתבת. כל שורה אפורה מתחתיה נגזרה מן הקוד — לא מדעה שלי.</p>
 <p class="tot">
  <span>ישויות <b>${ENTS}</b></span>
  <span>שדות <b>${FIELDS}</b>, מהם חובה <b>${REQ}</b></span>
  <span>שלבים <b>${STAGES}</b></span>
  <span>איסורים <b>${FORB}</b></span>
  <span>מהם חוסמים בקוד <b>${ENFORCED}</b></span>
  <span>מוצגים בלבד <b>${SHOWN}</b></span>
  <span>רק באפיון <b>${NEITHER}</b></span>
 </p>

 ${depts.map((d, i) => `<div class="dept${i === 0 ? ' on' : ''}" data-i="${i}">
  <h2>${esc(d.n)}</h2>
  ${d.ents.map(e => entHtml(d, e)).join('\n  ')}
 </div>`).join('\n ')}

 <p class="say">הטיפוגרפיה מועתקת במדידה מספריא: המקור ב־<bdi>26.84/42.944</bdi> והפירוש ב־<bdi>22/35.2</bdi> — <b>יחס של 1.22 בגודל, ובדיוק אותו 1.22 ברווח-השורה</b>. עברית צריכה יותר מקום לגובה, ומי שמגדיל את הגופן ושוכח את הרווח הורס את זה. שניהם יושבים ב<b>אותה עמודה</b> ברוחב <bdi>${parseInt('700')}</bdi>, זה מתחת לזה ולא זה לצד זה — במקור נמדד <bdi dir="ltr">x=320, w=700</bdi> לשניהם. והמקור <b>שחור</b> בעוד הפירוש <b>אפור</b> (<bdi dir="ltr">#000000</bdi> מול <bdi dir="ltr">#666666</bdi>): ההיררכיה נאמרת בצבע. <b>ועל האכיפה:</b> «חוסם» ניתן רק היכן שיש בקוד קריאה ל-blocked() או תנאי חסימה מפורש; «מוצג» היכן שהכלל מופיע במסך דרך forbiddenOf אך אינו עוצר פעולה; «טרם» לכל השאר. הספירה נעשתה בזמן הבנייה על קבצי המקור של האפליקציה.</p>
</div>

<script>
(function(){
 var sel=document.getElementById('pick'), panes=[].slice.call(document.querySelectorAll('.dept'));
 sel.addEventListener('change',function(){
  panes.forEach(function(p){p.classList.toggle('on',p.dataset.i===sel.value);});
  window.scrollTo({top:0,behavior:'smooth'});});
})();
</script>
</body></html>`;

writeFileSync(join(here, 'sefer.html'), html);
console.log('sefer.html · ' + ENTS + ' ישויות · ' + FIELDS + ' שדות · ' + FORB + ' איסורים' +
  '\nאכיפה נמדדת: חוסמים ' + ENFORCED + ' · מוצגים ' + SHOWN + ' · רק באפיון ' + NEITHER +
  ' · סך ' + (ENFORCED + SHOWN + NEITHER) + ' (חייב להיות ' + FORB + ')' +
  '\nזוגות שמוצגים דרך forbiddenOf: ' + [...shown].join(', '));
