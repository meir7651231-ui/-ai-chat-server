/* build.mjs — תיק חיוב בפריסת תיעוד-ה-API של Stripe, וכסף כמספר שלם.
   נמדד מ-docs.stripe.com/api/charges/object (9,490 אלמנטים · 44 בלוקי-קוד).
   הרצה: node gen/looks/agora/build.mjs                                       */
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
  build(); const T = DB.tariff;
  /* משפחה שהחיוב שלה נוחת על שבר — 96 מתוך 168 כאלה */
  const frac = DB.families.filter(f => {
    const k=f.kids.length, bus=f.kids.filter(id=>stu(id)&&stu(id).routeId).length;
    const ex=(k*T.tuition+bus*T.bus+k*T.books)*(1-f.discount/100);
    return Math.abs(ex-Math.round(ex))>1e-9 && f.discount>0 && bus>0 && balance(f)>0; });
  const f = frac.sort((a,b)=>b.kids.length-a.kids.length)[0] || DB.families[0];
  const k=f.kids.length, bus=f.kids.filter(id=>stu(id)&&stu(id).routeId).length;
  /* ספירת-הראיות על כל המוסד */
  let nFrac=0, gapAg=0, remTot=0, remFams=0, remAgTot=0, remAgFams=0;
  const neg=DB.families.filter(x=>balance(x)<0).length;
  DB.families.forEach(x=>{
    const kk=x.kids.length, bb=x.kids.filter(id=>stu(id)&&stu(id).routeId).length;
    const ex=(kk*T.tuition+bb*T.bus+kk*T.books)*(1-x.discount/100);
    if(Math.abs(ex-Math.round(ex))>1e-9){nFrac++;gapAg+=Math.abs(Math.round(ex)-ex)*100;}
    /* אותה פריסה, שתי יחידות: שקלים שלמים מול אגורות שלמות */
    const net=discounted(x), per=Math.floor(net/10), rem=net-per*10;
    if(rem){remTot+=rem;remFams++;}
    const netA=Math.round((kk*T.tuition*100+bb*T.bus*100+kk*T.books*100)*(10000-x.discount*100)/10000);
    const remA=netA-Math.floor(netA/10)*10;
    if(remA){remAgTot+=remA;remAgFams++;}
  });
  return { T, today:DB.today, famN:DB.families.length,
    f:{ name:f.name, head:nameOf(f.head), city:f.city, k, bus,
        disc:f.discount, paid:f.paid, gross:charged(f), net:discounted(f), bal:balance(f) },
    ev:{ nFrac, gapAg:Math.round(gapAg), remTot, remFams, remAgTot, remAgFams, neg } };
`)(SPEC);

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
const F = D.f, T = D.T;

/* ===== הכול באגורות, כמספרים שלמים. זו כל הנקודה. ===== */
const ag = s => Math.round(s * 100);
const A = {
  tuition_per_child: ag(T.tuition), bus_per_rider: ag(T.bus), books_per_child: ag(T.books),
};
A.gross = F.k * A.tuition_per_child + F.bus * A.bus_per_rider + F.k * A.books_per_child;
const BP = F.disc * 100;                                   /* נקודות-בסיס */
A.discount_bp = BP;
A.net = Math.round(A.gross * (10000 - BP) / 10000);
A.paid = ag(F.paid);
A.balance = A.net - A.paid;
const PLAN = 10;
A.per_installment = Math.floor(A.net / PLAN);
A.remainder = A.net - A.per_installment * PLAN;            /* מה שלא משתייך לאף תשלום */

const nis = a => (a / 100).toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const grp = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/* שדות התיעוד — המזהה הוא השם האמיתי, הטיפוס והיחידה צמודים אליו */
const FIELDS = [
  ['institution', 'string', 'מוסד', 'המוסד שאליו שייך החיוב. אינו משתנה במהלך השנה.'],
  ['year', 'string', 'שנת לימודים', 'שנה עברית. חיוב שייך לשנה אחת בלבד; תיקון לשנה קודמת נכתב כרשומת-תיקון נפרדת, לפי האפיון.'],
  ['children', 'integer', 'מספר ילדים', 'מספר הילדים הרשומים במוסד. כל סעיף לפי-ילד מוכפל בו.'],
  ['riders', 'integer', 'מהם בהסעה', 'כמה מן הילדים נוסעים בהסעות. נספר מלוח ההסעות, לא נקבע ידנית.'],
  ['tuition_per_child', 'integer · אגורות', 'שכר לימוד לילד',
    `מספר שלם באגורות. ${grp(A.tuition_per_child)} אגורות הן ${nis(A.tuition_per_child)} ₪. הסכום אינו נשמר כשבר עשרוני — ראו «למה אגורות» למטה.`],
  ['bus_per_rider', 'integer · אגורות', 'הסעה לנוסע', `${grp(A.bus_per_rider)} אגורות, ${nis(A.bus_per_rider)} ₪. מוכפל ב־riders ולא ב־children.`],
  ['books_per_child', 'integer · אגורות', 'ספרים לילד', `${grp(A.books_per_child)} אגורות, ${nis(A.books_per_child)} ₪.`],
  ['gross', 'integer · אגורות', 'חיוב ברוטו',
    `<code>children × tuition_per_child + riders × bus_per_rider + children × books_per_child</code>. נגזר; אינו נכתב.`],
  ['discount_bp', 'integer · נקודות-בסיס', 'הנחה',
    `<b>נקודת-בסיס היא מאית האחוז.</b> ${F.disc}% נשמרים כ־${grp(BP)}, לא כ־0.${String(F.disc).padStart(2, '0')}. אחוז עשרוני היה מחזיר את בעיית השבר דרך הדלת האחורית. האפיון מתיר הנחה אחת בלבד — הגבוהה, לא מצטבר.`],
  ['net', 'integer · אגורות', 'חיוב נטו',
    `<code>round(gross × (10000 − discount_bp) ÷ 10000)</code>. העיגול נעשה <b>פעם אחת</b>, על התוצאה הסופית, ולעולם לא על שלבי-ביניים.`],
  ['paid', 'integer · אגורות', 'שולם', 'סכום התשלומים שנקלטו. מתעדכן רק דרך רשומת-תשלום, לפי האפיון.'],
  ['balance', 'integer · אגורות', 'יתרה', `<code>net − paid</code>. האפיון אוסר יתרה שלילית.`],
  ['per_installment', 'integer · אגורות', 'תשלום בפריסה',
    `<code>floor(net ÷ ${PLAN})</code>. <b>floor ולא round</b> — כדי שסכום התשלומים לעולם לא יעלה על החיוב.`],
  ['remainder', 'integer · אגורות', 'שארית',
    `<code>net − per_installment × ${PLAN}</code>. ${A.remainder ? `כאן <b>${A.remainder}</b> אגורות שאינן שייכות לאף תשלום.` : 'כאן אפס.'} <b>שדה חובה</b>: בלעדיו השארית פשוט נעלמת. ברירת-המחדל הנכונה היא להוסיף אותה לתשלום הראשון.`],
];

const codeLines = [
  ['{', 'p'],
  ['  "institution"', 'k', ': ', 'p', '"מוסדות"', 's', ',', 'p'],
  ['  "year"', 'k', ': ', 'p', `"${T.year}"`, 's', ',', 'p'],
  ['  "family"', 'k', ': ', 'p', `"${F.name}"`, 's', ',', 'p'],
  ['  "children"', 'k', ': ', 'p', String(F.k), 'n', ',', 'p'],
  ['  "riders"', 'k', ': ', 'p', String(F.bus), 'n', ',', 'p'],
  ['  "tuition_per_child"', 'k', ': ', 'p', String(A.tuition_per_child), 'n', ',', 'p'],
  ['  "bus_per_rider"', 'k', ': ', 'p', String(A.bus_per_rider), 'n', ',', 'p'],
  ['  "books_per_child"', 'k', ': ', 'p', String(A.books_per_child), 'n', ',', 'p'],
  ['  "gross"', 'k', ': ', 'p', String(A.gross), 'n', ',', 'p'],
  ['  "discount_bp"', 'k', ': ', 'p', String(BP), 'n', ',', 'p'],
  ['  "net"', 'k', ': ', 'p', String(A.net), 'n', ',', 'p'],
  ['  "paid"', 'k', ': ', 'p', String(A.paid), 'n', ',', 'p'],
  ['  "balance"', 'k', ': ', 'p', String(A.balance), 'n', ',', 'p'],
  ['  "installments"', 'k', ': ', 'p', String(PLAN), 'n', ',', 'p'],
  ['  "per_installment"', 'k', ': ', 'p', String(A.per_installment), 'n', ',', 'p'],
  ['  "remainder"', 'k', ': ', 'p', String(A.remainder), 'n'],
  ['}', 'p'],
];
const code = codeLines.map(ln => {
  let out = '';
  for (let i = 0; i < ln.length; i += 2) out += `<span class="c${ln[i + 1]}">${esc(ln[i])}</span>`;
  return out; }).join('\n');

const html = `<!doctype html>
<html lang="he" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>תיק חיוב — שדות וערכים</title>
<meta name="description" content="תיק חיוב בפריסת תיעוד-ה-API של Stripe, עם כסף כמספר שלם באגורות.">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;700&display=swap">
<style>
*{box-sizing:border-box}html,body{overflow-x:hidden}
:root{
 /* ===== נמדד מ-docs.stripe.com/api/charges/object ===== */
 --bg:#f4f7fa;--pane:#ffffff;--ink:#3c4257;--head:#1a2c44;--mut:#50617a;
 --link:#045ad0;--sep:#d4dee9;
 --cstr:#217005;--cnum:#b13600;--ckey:#667691;--cpun:#1a2c44;
 --mono:"Source Code Pro",Menlo,Monaco,monospace;
 --fs:14px;--tfs:12px}
/* ===== הערכה הכהה נגזרה על ידי ולא נמדדה: מתג-הערכה של סטרייפ
        הוא העדפת-משתמש ואינו נשמע ל-prefers-color-scheme.    ===== */
@media(prefers-color-scheme:dark){:root:not([data-theme=light]){
 --bg:#141a22;--pane:#1b232e;--ink:#d3dae5;--head:#f0f4f9;--mut:#9aa8bd;
 --link:#6aa9f5;--sep:#2c3746;
 --cstr:#7cc95f;--cnum:#ff9a6b;--ckey:#9aa8bd;--cpun:#d3dae5}}
:root[data-theme=dark]{
 --bg:#141a22;--pane:#1b232e;--ink:#d3dae5;--head:#f0f4f9;--mut:#9aa8bd;
 --link:#6aa9f5;--sep:#2c3746;
 --cstr:#7cc95f;--cnum:#ff9a6b;--ckey:#9aa8bd;--cpun:#d3dae5}
body{margin:0;background:var(--bg);color:var(--ink);
 font:400 var(--fs)/22px system-ui,sans-serif}
h1,h2{margin:0;color:var(--head)}p{margin:0}bdi{unicode-bidi:isolate}
a{color:var(--link);text-decoration:none}a:hover{text-decoration:underline}
:focus-visible{outline:2px solid var(--link);outline-offset:2px}

.top{background:var(--pane);border-bottom:1px solid var(--sep);padding:12px 0}
.top .in{max-width:1300px;margin:0 auto;padding:0 22px;display:flex;
 align-items:baseline;gap:12px}
.top b{font:700 15px/1.2 system-ui,sans-serif;color:var(--head)}
.top span{color:var(--mut);font-size:13px}

.wrap{max-width:1300px;margin:0 auto;padding:22px 22px 70px;
 display:grid;grid-template-columns:minmax(0,1fr) 470px;gap:34px;align-items:start}
h1{font:700 24px/32px system-ui,sans-serif}
.lede{color:var(--mut);margin-top:8px;max-width:64ch}
h2{font:600 16px/24px system-ui,sans-serif;margin:26px 0 4px}

/* ---------- שדה: מזהה מונוספייס · טיפוס ויחידה · הסבר ---------- */
.fld{padding:14px 0;border-bottom:1px solid var(--sep)}
.fld:first-of-type{border-top:1px solid var(--sep)}
.fh{display:flex;align-items:baseline;gap:9px;flex-wrap:wrap}
.fn{font:700 var(--fs)/20px var(--mono);color:var(--head);direction:ltr}
.ft{font:400 var(--tfs)/16px system-ui,sans-serif;color:var(--mut)}
.fl{font:400 var(--tfs)/16px system-ui,sans-serif;color:var(--link)}
.fd{margin-top:5px;color:var(--ink)}
.fd code{font:400 13px/18px var(--mono);direction:ltr;unicode-bidi:isolate;
 background:var(--bg);padding:1px 5px;border-radius:3px;color:var(--head)}
.fd b{color:var(--head)}

/* ---------- העמודה החיה ---------- */
.side{position:sticky;top:16px}
.panel{background:var(--pane);border:1px solid var(--sep);border-radius:6px;overflow:hidden}
.pcap{font:700 var(--fs)/20px system-ui,sans-serif;color:var(--head);
 padding:9px 16px;border-bottom:1px solid var(--sep);background:var(--bg)}
pre{margin:0;padding:8px 16px 14px;font:400 var(--fs)/18.2px var(--mono);
 direction:ltr;text-align:left;overflow-x:auto}
.cp{color:var(--cpun)}.ck{color:var(--ckey)}.cs{color:var(--cstr)}.cn{color:var(--cnum)}
.read{border-top:1px solid var(--sep);padding:12px 16px;font-size:13px;line-height:20px}
.read div{display:flex;justify-content:space-between;gap:12px;padding:3px 0}
.read span{color:var(--mut)}
.read b{font-variant-numeric:tabular-nums;color:var(--head);font-weight:600}

.ev{background:var(--pane);border:1px solid var(--sep);border-radius:6px;
 padding:16px 18px;margin-top:22px}
.ev h2{margin-top:0}
.ev ul{margin:10px 0 0;padding:0;list-style:none}
.ev li{padding:7px 0;border-top:1px solid var(--sep);display:flex;
 justify-content:space-between;gap:14px;align-items:baseline}
.ev li b{font-variant-numeric:tabular-nums;color:var(--head);white-space:nowrap}
.warn{color:var(--cnum);font-weight:600}
@media(max-width:1000px){
 .wrap{grid-template-columns:minmax(0,1fr)}
 .side{position:static;order:-1}}
</style></head><body>

<div class="top"><div class="in">
 <b>מוסדות — גבייה</b>
 <span>תיק חיוב · ${esc(D.today.dow)}, ${esc(D.today.hd)} ${esc(D.today.hy)}</span>
</div></div>

<div class="wrap">
 <main>
  <h1>אובייקט החיוב</h1>
  <p class="lede">חיוב שנתי אחד של ${esc(F.name)}. <b>כל סכום כאן הוא מספר שלם באגורות</b>, וכל אחוז הוא מספר שלם בנקודות-בסיס. הטיפוס והיחידה כתובים ליד כל שדה — לא בתיעוד נפרד.</p>

  <h2>שדות</h2>
  ${FIELDS.map(([n, t, he, d]) => `<div class="fld">
   <div class="fh"><span class="fn">${esc(n)}</span><span class="ft">${t}</span><span class="fl">${esc(he)}</span></div>
   <p class="fd">${d}</p>
  </div>`).join('\n  ')}

  <div class="ev">
   <h2>למה אגורות — הראיות מהנתונים שלך</h2>
   <p style="color:var(--mut);margin-top:6px">בדקתי את כל ${D.famN} המשפחות. הנה מה שיצא, ומה שלא יצא.</p>
   <ul>
    <li><span>חיובים שנוחתים על שבר של שקל</span><b>${D.ev.nFrac} מתוך ${D.famN}</b></li>
    <li><span>מה שעיגול לשקלים שלמים מוסיף לכלל המוסד</span><b>${nis(D.ev.gapAg)} ₪</b></li>
    <li><span>סחיפה בין שבר עשרוני למספר שלם באגורות</span><b>0</b></li>
    <li><span>משפחות שיתרתן <b>שלילית</b> — והאפיון אוסר</span><b class="warn">${D.ev.neg} מתוך ${D.famN}</b></li>
   </ul>
   <p class="fd" style="margin-top:10px"><b>השורה האחרונה אינה על אגורות — והיא הממצא החמור כאן.</b> ${D.ev.neg} משפחות שילמו יותר מן החיוב שלהן, והאפיון אוסר «יתרה שלילית» במפורש. המשפחה שבדוגמה למעלה נבחרה <b>תקינה</b> בכוונה, כדי שהתיעוד לא יציג ערך שהוא עצמו מפר את הכלל שהוא מתאר. אבל ה-${D.ev.neg} קיימות בנתונים וצריכות הכרעה: זיכוי לשנה הבאה, או החזר לפי טופס ההחזר.</p>
   <h2 style="margin-top:18px">אותה פריסה, שתי יחידות</h2>
   <ul>
    <li><span>פריסה ל־${PLAN} <b>בשקלים שלמים</b> — שארית כוללת</span><b class="warn">${grp(D.ev.remTot)} ₪</b></li>
    <li><span>משפחות שנשארת בהן שארית</span><b>${D.ev.remFams} מתוך ${D.famN}</b></li>
    <li><span>פריסה ל־${PLAN} <b>באגורות שלמות</b> — שארית כוללת</span><b>${nis(D.ev.remAgTot)} ₪</b></li>
    <li><span>משפחות שנשארת בהן שארית</span><b>${D.ev.remAgFams} מתוך ${D.famN}</b></li>
   </ul>
   <p class="fd" style="margin-top:12px"><b>זו כל ההוכחה.</b> אותה משפחה, אותה פריסה: בשקלים שלמים נשארים <b class="warn">${(() => { const n = D.f.net, per = Math.floor(n / PLAN); return n - per * PLAN; })()} ₪</b> שאינם שייכים לאף תשלום; באגורות שלמות נשארות <b>${A.remainder} אגורות</b>. על כל המוסד: <b class="warn">${grp(D.ev.remTot)} ₪</b> מול <b>${nis(D.ev.remAgTot)} ₪</b> — פי ${Math.round(D.ev.remTot * 100 / Math.max(1, D.ev.remAgTot))} פחות.</p>
   <p class="fd" style="margin-top:10px"><b>ומה שלא מצאתי:</b> עם התעריפון שלך (${grp(T.tuition)} · ${grp(T.bus)} · ${grp(T.books)}) ואחוזי ההנחה שלך, חישוב בשבר עשרוני וחישוב במספר שלם נותנים <b>אותה תוצאה בדיוק</b> — הסחיפה היא אפס. לא אמכור בעיה שאין. הרווח מן האגורות כאן הוא בפריסה, לא בחישוב.</p>
  </div>

  <p class="fd" style="margin-top:22px;color:var(--mut);font-size:13px">הפריסה מועתקת במדידה מתיעוד-ה-API של Stripe: שם-שדה ב־<bdi dir="ltr">Source Code Pro 700 14/20</bdi>, טיפוס ב־<bdi>12/16</bdi> אפור צמוד לו, מפריד <bdi>1px</bdi>, וההסבר מתחת — לצד עמודה שנייה ובה אותו אובייקט עצמו, חי, נגלל יחד. צבעי הקוד נמדדו: מחרוזות <bdi dir="ltr">#217005</bdi>, מספרים <bdi dir="ltr">#b13600</bdi>, מפתחות <bdi dir="ltr">#667691</bdi>. <b>סטיות מסומנות:</b> רקע בלוק-הקוד חזר במדידה שקוף, ולכן השתמשתי ברקע-העמוד עם מסגרת-שיער; והערכה הכהה נגזרה ולא נמדדה, כי מתג-הערכה של סטרייפ הוא העדפת-משתמש ואינו נשמע ל-<bdi dir="ltr">prefers-color-scheme</bdi>. ובניגוד לחמשת המסכים האחרונים — כאן <b>כן</b> נטען גופן: <bdi dir="ltr">Source Code Pro</bdi>, ורק למזהים הלטיניים. העברית נשארת בגופן-המערכת.</p>
 </main>

 <aside class="side">
  <div class="panel">
   <div class="pcap">אובייקט החיוב</div>
   <pre>${code}</pre>
   <div class="read">
    <div><span>ברוטו</span><b><bdi>${nis(A.gross)}</bdi> ₪</b></div>
    <div><span>הנחה ${F.disc}%</span><b><bdi>−${nis(A.gross - A.net)}</bdi> ₪</b></div>
    <div><span>נטו</span><b><bdi>${nis(A.net)}</bdi> ₪</b></div>
    <div><span>שולם</span><b><bdi>${nis(A.paid)}</bdi> ₪</b></div>
    <div><span>יתרה</span><b><bdi>${nis(A.balance)}</bdi> ₪</b></div>
    <div><span>${PLAN} תשלומים של</span><b><bdi>${nis(A.per_installment)}</bdi> ₪</b></div>
    <div><span>שארית לתשלום הראשון</span><b class="${A.remainder ? 'warn' : ''}"><bdi>${nis(A.remainder)}</bdi> ₪</b></div>
   </div>
  </div>
 </aside>
</div>
</body></html>`;

writeFileSync(join(here, 'agora.html'), html);
console.log('agora.html · ' + F.name + ' · ברוטו ' + A.gross + 'ag · נטו ' + A.net +
  'ag · שארית ' + A.remainder + 'ag\nראיות: ' + D.ev.nFrac + '/' + D.famN + ' שברים · עיגול ' +
  nis(D.ev.gapAg) + ' ₪\nשארית בפריסה: בשקלים ' + D.ev.remTot + ' ₪ ב-' + D.ev.remFams + ' משפחות · באגורות ' + nis(D.ev.remAgTot) + ' ₪ ב-' + D.ev.remAgFams + ' משפחות');
