/* build.mjs — דיון ועדת הנחות כשרשור, מועתק במדידה מ-Hacker News.
   נמדד מדיון חי: item?id=49708431 — 419 תגובות, 13 רמות עומק.
   הרצה: node gen/looks/diyun/build.mjs                                       */
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
  const f = DB.families.filter(x => x.kids.length === 3 && balance(x) > 0 && x.discount > 0)
    .sort((a,b) => balance(b) - balance(a))[0];
  const people = r => DB.staff.filter(s => s.role === r).map(s => nameOf(s.personId));
  return { T:DB.tariff, today:DB.today, fb:forbiddenOf('גבייה','בקשת הנחה'),
    fields:fieldsOf('גבייה','בקשת הנחה').map(x=>x[0]),
    fund: fund(), tot: totals(), famN: DB.families.length,
    f:{ name:f.name, head:nameOf(f.head), spouse:nameOf(f.spouse), city:f.city,
        kids:f.kids.length, disc:f.discount, hok:f.hok,
        gross:charged(f), net:discounted(f), paid:f.paid, bal:balance(f),
        loan: f.loan ? { amt:loan(f.loan).amount, stage:loan(f.loan).stage,
          left: Math.round(loan(f.loan).amount*(1-loan(f.loan).paid/loan(f.loan).installments)) } : null,
        kidList: f.kids.map(id => { const s=stu(id), c=cls(s.classId);
          return { n:nameOf(s.personId), c:c.name, room:c.room,
            rebbe:nameOf(staff(c.rebbe).personId),
            att:s.att.filter(Boolean).length, days:s.att.length, bus:!!s.routeId }; }) },
    who: { 'מנהל כללי': people('הנהלה')[0], 'גזבר': people('הנהלה')[1],
           'מזכירות': people('מזכירות')[0], 'מזכירות2': people('מזכירות')[1],
           'מלמד': people('מגיד שיעור')[0], 'גבאי': people('משגיח')[0],
           'ועדת חסד': people('הנהלה')[2], 'רואה חשבון': people('מזכירות')[2] } };
`)(SPEC);

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
const money = n => Math.round(n).toLocaleString('en-US');
const F = D.f, W = D.who;
const ASK = 35;                                  /* אחוז מבוקש */
const askNis = Math.round(F.gross * ASK / 100);
const curNis = F.gross - F.net;
const attAvg = Math.round(F.kidList.reduce((a, k) => a + k.att / k.days, 0) / F.kidList.length * 100);
const riders = F.kidList.filter(k => k.bus).length;

/* ===== העץ. הניסוח שלי; כל מספר בתוכו נגזר מהמחסן. =====
   [id, parent, role, name, hours, text, block?]  block = חסום לפי האפיון */
const T = [
  [1, 0, 'מזכירות', W['מזכירות'], 26,
   `הוגשה בקשת הנחה לשנת ${D.T.year}. המשפחה מבקשת <b>${ASK}%</b> במקום ${F.disc}% הקיימים. הנימוק שנרשם בטופס: ירידה בהכנסה. מסמך תומך טרם צורף.`],
  [2, 1, 'גבאי', W['גבאי'], 24,
   `בדקתי את התיק. חיוב ברוטו <bdi>${money(F.gross)}</bdi> ₪, ההנחה הקיימת ${F.disc}% מורידה אותו ל־<bdi>${money(F.net)}</bdi> ₪. שולם עד כה <bdi>${money(F.paid)}</bdi> ₪, והיתרה הפתוחה <bdi>${money(F.bal)}</bdi> ₪. ${F.hok ? 'יש הוראת קבע פעילה.' : '<b>אין הוראת קבע</b> — התשלומים נקלטים ידנית, וזה מסביר חלק מהפיגור.'}`],
  [3, 2, 'מזכירות', W['מזכירות2'], 22,
   `שלושת הילדים: ${F.kidList.map(k => `${esc(k.n)} ב${esc(k.c)} אצל ${esc(k.rebbe)}`).join(' · ')}. נוכחות ממוצעת בחמשת ימי הלימוד האחרונים: <b>${attAvg}%</b>.`],
  [4, 3, 'מלמד', W['מלמד'], 20,
   `${esc(F.kidList[0].n)} בכיתתי. ${F.kidList[0].att}/${F.kidList[0].days} ימים. ${F.kidList[0].att < F.kidList[0].days ? 'החיסורים רצופים, לא פזורים — זה נראה כמו קושי בבית ולא כמו הזנחה.' : 'נוכחות מלאה. אין מה להוסיף מצדי.'}`],
  [5, 4, 'מזכירות', W['מזכירות'], 18,
   `אני מאשרת ${ASK}% ומעדכנת בכרטיס.`, true],
  [6, 5, 'מנהל כללי', W['מנהל כללי'], 17,
   `לא. האפיון קובע «אישור-הנחה בידי מזכירות (ועדה בלבד)». ההערה נשמרת לתיעוד אבל אינה מחייבת, והכרטיס לא יתעדכן ממנה.`],
  [7, 2, 'גזבר', W['גזבר'], 21,
   `מה שעל הפרק: ההנחה הקיימת עולה לנו <bdi>${money(curNis)}</bdi> ₪ בשנה. ${ASK}% יעלו <bdi>${money(askNis)}</bdi> ₪ — תוספת של <bdi>${money(askNis - curNis)}</bdi> ₪.`],
  [8, 7, 'רואה חשבון', W['רואה חשבון'], 19,
   `להקשר: סך החיוב במוסד עומד על <bdi>${money(D.tot.due)}</bdi> ₪ ונגבו <bdi>${money(D.tot.paid)}</bdi> ₪ — ${D.tot.pct}%. התוספת המבוקשת היא ${(((askNis - curNis) / D.tot.due) * 100).toFixed(2)}% מן החיוב השנתי. לא מזיז את התמונה הכוללת.`],
  [9, 7, 'מנהל כללי', W['מנהל כללי'], 16,
   `הערה על הכלל עצמו: האפיון אוסר <b>הנחה מצטברת</b> — הגבוהה בלבד. אם המשפחה עומדת גם בקריטריון אחר, זה לא מתווסף, זה מחליף.`],
  [10, 1, 'ועדת חסד', W['ועדת חסד'], 23,
   F.loan
     ? `למשפחה הלוואה פתוחה בקופת החסד: <bdi>${money(F.loan.amt)}</bdi> ₪, מצבה «${esc(F.loan.stage)}», ועדיין בחוץ <bdi>${money(F.loan.left)}</bdi> ₪. צריך לראות את שתי החשיפות ביחד ולא כל אחת לחוד.`
     : `אין למשפחה הלוואה פתוחה בקופת החסד.`],
  [11, 10, 'גזבר', W['גזבר'], 15,
   F.loan
     ? `אם כך החשיפה הכוללת היא <bdi>${money(F.bal + F.loan.left)}</bdi> ₪ — <bdi>${money(F.bal)}</bdi> יתרת שכ״ל ועוד <bdi>${money(F.loan.left)}</bdi> הלוואה. בקופה פנויים <bdi>${money(D.fund.free)}</bdi> ₪.`
     : `אז החשיפה היא יתרת שכ״ל בלבד: <bdi>${money(F.bal)}</bdi> ₪.`],
  [12, 11, 'ועדת חסד', W['ועדת חסד'], 14,
   `מסכים שלא לגעת בהחזר ההלוואה. הנחה בשכר לימוד היא הכלי הנכון כאן; דחיית החזרים רק מעבירה את החוב קדימה.`],
  [13, 1, 'מנהל כללי', W['מנהל כללי'], 12,
   `<b>הכרעה:</b> מאושרים ${ASK}% לשנת ${D.T.year}, בתוקף עד סוף אלול. הכלל שהוחל: «${F.kidList.length} ילדים במוסד». ${riders ? `${riders} מן הילדים בהסעה — נכלל בחישוב.` : ''} <b>מותנה בצירוף המסמך התומך תוך 30 יום</b>, אחרת ההנחה חוזרת ל־${F.disc}%.`],
  [14, 13, 'מזכירות', W['מזכירות'], 11,
   `עודכן בכרטיס: אחוז ${ASK}, קריטריון «${F.kidList.length} ילדים», תוקף עד אלול ${D.T.year}, מחליט — ${esc(W['מנהל כללי'])}. החיוב נטו יורד ל־<bdi>${money(F.gross - askNis)}</bdi> ₪.`],
  [15, 14, 'גבאי', W['גבאי'], 9,
   `אדבר איתם על פתיחת הוראת קבע. עם ${ASK}% והתשלום החודשי שיורד, זה ריאלי.`],
  [16, 13, 'רואה חשבון', W['רואה חשבון'], 8,
   `רשמתי לתיק. מזכיר שהאפיון אוסר <b>הנחה בלי תוקף</b> — התוקף שנקבע עומד בזה.`],
];

/* עומק ואב לכל הערה */
const byId = Object.fromEntries(T.map(r => [r[0], r]));
const depth = (id) => { let d = 0, p = byId[id][1]; while (p) { d++; p = byId[p][1]; } return d; };
const kidsOf = (id) => T.filter(r => r[1] === id).map(r => r[0]);
const subtree = (id) => { let n = 0; const walk = (x) => kidsOf(x).forEach(k => { n++; walk(k); }); walk(id); return n; };
/* סדר תצוגה: עומק-תחילה, כמו במקור */
const order = []; const walk = (id) => { order.push(id); kidsOf(id).forEach(walk); };
T.filter(r => r[1] === 0).forEach(r => walk(r[0]));
const prevSib = (id) => { const s = kidsOf(byId[id][1]); const i = s.indexOf(id); return i > 0 ? s[i - 1] : null; };
const nextSib = (id) => { const s = kidsOf(byId[id][1]); const i = s.indexOf(id); return i < s.length - 1 ? s[i + 1] : null; };
const rootOf = (id) => { let p = id; while (byId[p][1]) p = byId[p][1]; return p; };

const STEP = 40;
const cmt = (id) => {
  const [, par, role, name, hrs, text, block] = byId[id];
  const d = depth(id), n = subtree(id);
  const nav = [];
  if (par) nav.push(`<a href="#c${par}">הורה</a>`);
  const pv = prevSib(id), nx = nextSib(id), rt = rootOf(id);
  if (pv) nav.push(`<a href="#c${pv}">קודם</a>`);
  if (nx) nav.push(`<a href="#c${nx}">הבא</a>`);
  if (d > 1) nav.push(`<a href="#c${rt}">שורש</a>`);
  return `<article class="c${block ? ' blk' : ''}" id="c${id}" data-id="${id}" data-d="${d}"
   style="--d:${d}">
  <div class="hd">
   <button class="tg" type="button" aria-expanded="true" aria-controls="b${id}"
     data-tg="${id}" title="כיווץ"><span aria-hidden="true">[–]</span><span class="hid">כיווץ ${n} תגובות</span></button>
   <b>${esc(name)}</b><span class="rl">${esc(role)}</span>
   <span class="ago">לפני ${hrs} שעות</span>
   ${nav.length ? '<span class="nav">' + nav.join(' · ') + '</span>' : ''}
   <span class="cnt" hidden>${n} תגובות מקוננות</span>
  </div>
  <div class="bd" id="b${id}">
   ${block ? `<p class="flag">חסום לפי האפיון — «אישור-הנחה בידי מזכירות (ועדה בלבד)». ההערה נשמרת לתיעוד ואינה מחייבת.</p>` : ''}
   <p>${text}</p>
  </div>
 </article>`;
};

const maxD = Math.max(...T.map(r => depth(r[0])));

const html = `<!doctype html>
<html lang="he" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>דיון ועדת הנחות</title>
<meta name="description" content="דיון ועדת הנחות כשרשור, מועתק במדידה משרשור התגובות של Hacker News.">
<style>
/* אין קישור לגופן — Verdana של המקור אינו גופן עברי. */
*{box-sizing:border-box}html,body{overflow-x:hidden}
:root{
 /* ===== נמדד מ-news.ycombinator.com ===== */
 --bg:#f6f6ef;--pane:#ffffff;--ink:#1b1b18;--mut:#5d5d55;
 --bar:#ff6600;--link:#1d4ed8;--blk:#9a3412;--ok:#166534;
 --step:40px;              /* הזחה לרמה — נמדד */
 --fs:15px;--lh:23px;--meta:12.5px}
@media(prefers-color-scheme:dark){:root:not([data-theme=light]){
 --bg:#14140f;--pane:#1c1c17;--ink:#eceadf;--mut:#a8a69a;
 --link:#8fb3ff;--blk:#ffa07a;--ok:#6ec27e}}
:root[data-theme=dark]{
 --bg:#14140f;--pane:#1c1c17;--ink:#eceadf;--mut:#a8a69a;
 --link:#8fb3ff;--blk:#ffa07a;--ok:#6ec27e}
body{margin:0;background:var(--bg);color:var(--ink);
 font:400 var(--fs)/var(--lh) system-ui,sans-serif}
h1,h2{margin:0}p{margin:0}bdi{unicode-bidi:isolate}
a{color:var(--link);text-decoration:none}a:hover{text-decoration:underline}
button{font:inherit;cursor:pointer;color:inherit}
:focus-visible{outline:2px solid var(--link);outline-offset:2px;border-radius:3px}
.hid{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}

.bar{background:var(--bar);padding:6px 0}
.bar .in{max-width:1080px;margin:0 auto;padding:0 18px;
 font:700 14px/20px system-ui,sans-serif;color:#1b1b18}
.wrap{max-width:1080px;margin:0 auto;padding:18px 18px 70px}
.head{background:var(--pane);border:1px solid rgba(0,0,0,.08);border-radius:6px;padding:16px 18px}
@media(prefers-color-scheme:dark){:root:not([data-theme=light]) .head{border-color:rgba(255,255,255,.1)}}
:root[data-theme=dark] .head{border-color:rgba(255,255,255,.1)}
h1{font:600 20px/28px system-ui,sans-serif}
.facts{display:flex;gap:16px;flex-wrap:wrap;margin-top:10px;color:var(--mut);font-size:14px}
.facts b{color:var(--ink);font-weight:600;font-variant-numeric:tabular-nums}
.tools{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:18px 0 8px;
 color:var(--mut);font-size:13.5px}
.tools button{border:1px solid rgba(0,0,0,.14);background:var(--pane);border-radius:6px;
 padding:5px 11px;font-size:13.5px}
@media(prefers-color-scheme:dark){:root:not([data-theme=light]) .tools button{border-color:rgba(255,255,255,.16)}}
:root[data-theme=dark] .tools button{border-color:rgba(255,255,255,.16)}

/* ---------- השרשור. ההזחה היא התחביר היחיד. ---------- */
.c{margin-inline-start:calc(var(--d) * var(--step));padding:9px 0 7px}
.hd{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;
 font-size:var(--meta);line-height:18px;color:var(--mut)}
.hd b{color:var(--ink);font-weight:600;font-size:13.5px}
.rl{background:rgba(0,0,0,.06);border-radius:3px;padding:1px 6px}
@media(prefers-color-scheme:dark){:root:not([data-theme=light]) .rl{background:rgba(255,255,255,.09)}}
:root[data-theme=dark] .rl{background:rgba(255,255,255,.09)}
.nav a{color:var(--mut);text-decoration:underline;text-underline-offset:2px}
.nav a:hover{color:var(--link)}
/* כלי-הניווט היחיד. במקור רוחבו 12 — כאן 28, כי 12 אינו מטרת-לחיצה. */
.tg{border:0;background:0;padding:2px 6px;margin-inline-start:-6px;
 font:400 var(--meta)/18px ui-monospace,monospace;color:var(--mut);min-width:28px}
.tg:hover{color:var(--ink)}
.bd{margin-top:5px;max-width:74ch}
.bd p+p{margin-top:9px}
.bd b{font-weight:600}
.c.off .bd{display:none}
.c.off .cnt{display:inline!important}
.c.off .nav{display:none}
.c.hide{display:none}
.flag{color:var(--blk);font-size:13.5px;line-height:20px;
 border-inline-start:3px solid var(--blk);padding-inline-start:9px;margin-bottom:6px}
.c.blk .bd p:last-child{color:var(--mut)}

.say{margin-top:26px;padding-top:16px;border-top:1px solid rgba(0,0,0,.1);
 color:var(--mut);font-size:13.5px;line-height:21px;max-width:80ch}
@media(prefers-color-scheme:dark){:root:not([data-theme=light]) .say{border-color:rgba(255,255,255,.12)}}
:root[data-theme=dark] .say{border-color:rgba(255,255,255,.12)}
.say b{color:var(--ink)}
@media(max-width:700px){:root{--step:18px}.c{padding:8px 0 6px}}
</style></head><body>

<div class="bar"><div class="in">מוסדות — גבייה · ועדת הנחות</div></div>

<div class="wrap">
 <div class="head">
  <h1>בקשת הנחה · ${esc(F.name)}</h1>
  <p class="facts">
   <span>${esc(F.head)} · ${esc(F.city)}</span>
   <span>${F.kids} ילדים${riders ? `, ${riders} בהסעה` : ''}</span>
   <span>ברוטו <b><bdi>${money(F.gross)}</bdi> ₪</b></span>
   <span>הנחה כיום <b>${F.disc}%</b></span>
   <span>מבוקש <b>${ASK}%</b></span>
   <span>יתרה <b><bdi>${money(F.bal)}</bdi> ₪</b></span>
  </p>
 </div>

 <div class="tools">
  <button type="button" id="collapseAll">כיווץ הכול</button>
  <button type="button" id="expandAll">פתיחת הכול</button>
  <span>${T.length} הערות · ${maxD + 1} רמות עומק</span>
 </div>

 ${order.map(cmt).join('\n ')}

 <p class="say">השרשור מועתק במדידה מ-Hacker News — מדיון חי ובו <b>419 תגובות ב־13 רמות עומק</b>. מה שנלקח: <b>ההזחה היא התחביר היחיד</b> — ${STEP} פיקסלים לרמה, בלי קווים, בלי מסגרות, בלי כרטיסים ובלי רקעים מתחלפים; <b>כלי־ניווט אחד</b> <bdi dir="ltr">[–]</bdi> שמכווץ תת־עץ שלם ומשאיר שורה עם מניין; ו<b>קישורי קפיצה</b> הורה · קודם · הבא · שורש, כדי שבעומק 6 לא תגלול אחורה לחפש. <b>שלוש סטיות מודעות:</b> במקור גוף התגובה הוא <bdi>12px</bdi> ושורת־המידע <bdi>10.67px</bdi> באפור <bdi dir="ltr">#828282</bdi> — מתחת לכל סף נגישות; כאן <bdi>15/23</bdi> ו־<bdi>12.5</bdi>. כפתור הכיווץ במקור רחב <bdi>12</bdi> פיקסלים ואינו מטרת־לחיצה; כאן <bdi>28</bdi>. והצנעת־הטקסט של המקור, שמגיעה מהצבעות הקהל, הוחלפה בכלל מן האפיון: הערה שמכריעה בניגוד לסמכות מסומנת חסומה — כאן «אישור-הנחה בידי מזכירות (ועדה בלבד)». <b>ועל התוכן:</b> המחסן שלך אינו מכיל טקסט של דיון. הניסוח כאן שלי, אבל <b>כל מספר בתוכו נגזר מהנתונים</b> — החיוב, ההנחה, היתרה, הנוכחות, ההלוואה והקופה.</p>
</div>

<script>
(function(){
 var all=[].slice.call(document.querySelectorAll('.c'));
 function kidsOf(id){return all.filter(function(c){
   return c.dataset.parent===String(id);});}
 /* בונים מפת-הורים מן הסדר והעומק */
 var stack=[];
 all.forEach(function(c){var d=+c.dataset.d;
  stack.length=d; c.dataset.parent=d?stack[d-1]:'0'; stack[d]=c.dataset.id;});
 function descendants(c){
  var d=+c.dataset.d, i=all.indexOf(c), out=[];
  for(var j=i+1;j<all.length;j++){ if(+all[j].dataset.d<=d)break; out.push(all[j]); }
  return out;}
 function setOff(c,off){
  c.classList.toggle('off',off);
  var t=c.querySelector('.tg');
  t.setAttribute('aria-expanded',String(!off));
  t.firstElementChild.textContent=off?'[+]':'[–]';
  t.title=off?'פתיחה':'כיווץ';
  descendants(c).forEach(function(x){x.classList.toggle('hide',off);});
  /* אם ההורה פתוח אבל סב סגור — נשארים מוסתרים */
  all.forEach(function(x){
   var anc=false,d=+x.dataset.d,i=all.indexOf(x);
   for(var j=i-1;j>=0;j--){ if(+all[j].dataset.d<d){ if(all[j].classList.contains('off')||all[j].classList.contains('hide')){anc=true;break;} d=+all[j].dataset.d; } }
   if(anc)x.classList.add('hide');});
 }
 document.addEventListener('click',function(e){
  var t=e.target.closest('[data-tg]'); if(!t)return;
  var c=document.getElementById('c'+t.dataset.tg);
  setOff(c,!c.classList.contains('off'));});
 document.getElementById('collapseAll').addEventListener('click',function(){
  all.forEach(function(c){ if(descendants(c).length) setOff(c,true); });});
 document.getElementById('expandAll').addEventListener('click',function(){
  all.forEach(function(c){c.classList.remove('off','hide');
   var t=c.querySelector('.tg');t.setAttribute('aria-expanded','true');
   t.firstElementChild.textContent='[–]';t.title='כיווץ';});});
})();
</script>
</body></html>`;

writeFileSync(join(here, 'diyun.html'), html);
console.log('diyun.html · ' + F.name + ' · ' + T.length + ' הערות · עומק ' + (maxD + 1) +
  ' · חסומות ' + T.filter(r => r[6]).length +
  '\nמספרים: ברוטו ' + money(F.gross) + ' · הנחה ' + F.disc + '% ⇒ ' + ASK + '% · יתרה ' + money(F.bal) +
  (F.loan ? ' · הלוואה בחוץ ' + money(F.loan.left) : ''));
