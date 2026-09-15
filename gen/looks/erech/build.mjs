/* build.mjs — תיק משפחה בצורת ערך, מועתק במדידה מוויקיפדיה העברית.
   נמדד מ-he.wikipedia.org/wiki/החתם_סופר (2,168 אלמנטים · dir=rtl · תיבת-מידע).
   הרצה: node gen/looks/erech/build.mjs                                       */
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
  /* משפחה עם סיפור: ילדים במוסד, הלוואה, הסעה, והנחה. לא הראשונה ברשימה. */
  const hasPay = {}; DB.payments.forEach(p => hasPay[p.familyId] = (hasPay[p.familyId]||0)+1);
  const cand = DB.families.filter(f => f.kids.length >= 3 && f.loan && f.discount > 0 && hasPay[f.id]);
  const f = cand.sort((a,b) => (hasPay[b.id]-hasPay[a.id]) || (b.kids.length - a.kids.length))[0]
         || DB.families.filter(f => f.kids.length >= 3 && f.loan)[0] || DB.families[0];
  const kids = f.kids.map(id => { const s = stu(id), c = cls(s.classId);
    return { name:nameOf(s.personId), cls:c.name, room:c.room,
      rebbe:nameOf(staff(c.rebbe).personId), absent:staff(c.rebbe).absent,
      att:s.att.filter(Boolean).length, days:s.att.length,
      route: s.routeId ? route(s.routeId).name : null,
      stop: s.routeId != null && s.stopIdx != null ? route(s.routeId).stops[s.stopIdx].name : null,
      time: s.routeId != null && s.stopIdx != null ? route(s.routeId).stops[s.stopIdx].time : null }; });
  const l = f.loan ? loan(f.loan) : null;
  const pays = DB.payments.filter(p => p.familyId === f.id);
  const yz = DB.yahrzeits.filter(z => z.familyId === f.id);
  return { t:DB.tariff, today:DB.today, hmonths:DB.hmonths,
    f:{ name:f.name, head:nameOf(f.head), spouse:nameOf(f.spouse), city:f.city,
        phone:f.phone, kids:f.kids.length, discount:f.discount, hok:f.hok,
        paid:f.paid, due:discounted(f), gross:charged(f), bal:balance(f) },
    kids, yz,
    loan: l ? { amount:l.amount, purpose:l.purpose, stage:l.stage, inst:l.installments,
        paid:l.paid, g:l.guarantors, left: Math.round(l.amount*(1-l.paid/l.installments)) } : null,
    pays: pays.map(p => ({ a:p.amount, m:p.method, ago:p.ago })),
    fundFree: fund().free, famN: DB.families.length, studN: DB.students.length };
`)(SPEC);

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
const money = n => Math.round(n).toLocaleString('en-US');
const F = D.f;

/* ההערות — כל מספר בערך נושא הפניה למקור שלו במערכת.
   זו המשמעת של ויקיפדיה, מיושמת על נתונים: אין טענה בלי מקור. */
const NOTES = [];
const ref = (src) => { let i = NOTES.indexOf(src); if (i < 0) { NOTES.push(src); i = NOTES.length - 1; }
  return `<sup class="ref"><a href="#n${i + 1}" id="r${i + 1}">[${i + 1}]</a></sup>`; };

const T_TARIF = `תעריפון ${D.t.year}: שכר לימוד ${money(D.t.tuition)} ₪, הסעה ${money(D.t.bus)} ₪, ספרים ${money(D.t.books)} ₪ לילד.`;
const T_ATT = 'לוח הנוכחות — חמישה ימי לימוד אחרונים.';
const T_PAID = 'סך התשלומים בכרטיס המשפחה לשנת הלימודים.';
const T_PAY = 'רשומות קליטה אחרונות. אינן הפנקס המלא ואינן מסתכמות לסך שבכרטיס.';
const T_LOAN = 'קופת החסד — תיק ההלוואה.';
const T_ROUTE = 'לוח ההסעות — עמדות ושעות.';
const T_DISC = 'כלל ההנחה שהוחל. האפיון מתיר את הגבוהה בלבד, לא מצטבר.';

const attAvg = Math.round(D.kids.reduce((a, k) => a + k.att / k.days, 0) / D.kids.length * 100);
const riders = D.kids.filter(k => k.route);
const hDate = `${D.today.hd} ${D.today.hy}`;

/* שורות תיבת-המידע */
const rows = [
  ['ראש המשפחה', esc(F.head)],
  ['רעייתו', esc(F.spouse)],
  ['מקום מגורים', esc(F.city)],
  ['טלפון', `<bdi dir="ltr">${esc(F.phone)}</bdi>`],
  ['ילדים במוסד', `${F.kids}${ref(T_ATT)}`],
  ['שנת לימודים', `${esc(D.t.year)} <span class="sub">(${hDate})</span>`],
  ['חיוב ברוטו', `<bdi>${money(F.gross)}</bdi> ₪${ref(T_TARIF)}`],
  ['הנחה', `${F.discount}%${ref(T_DISC)}`],
  ['חיוב נטו', `<bdi>${money(F.due)}</bdi> ₪`],
  ['שולם', `<bdi>${money(F.paid)}</bdi> ₪${ref(T_PAY)}`],
  ['יתרה', `<b class="${F.bal > 0 ? 'owe' : 'clear'}"><bdi>${money(F.bal)}</bdi> ₪</b>`],
  ['הוראת קבע', F.hok ? 'קיימת' : 'אין'],
];
if (D.loan) rows.push(['הלוואה', `<bdi>${money(D.loan.amount)}</bdi> ₪ · ${esc(D.loan.purpose)}${ref(T_LOAN)}`]);

const html = `<!doctype html>
<html lang="he" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(F.name)} — תיק</title>
<meta name="description" content="תיק משפחה בצורת ערך אנציקלופדי, מועתק במדידה מוויקיפדיה העברית.">
<style>
/* ===== אין קישור לגופן. זו המדידה, לא השמטה: ויקיפדיה העברית
        מצהירה font-family: sans-serif ומשאירה לקורא לבחור.
        חמשת המסכים הקודמים טענו גופן-רשת לטיני. כאן לא.        ===== */
*{box-sizing:border-box}html,body{overflow-x:hidden}
:root{
 /* ===== נמדד מ-he.wikipedia.org ===== */
 --bg:#f8f9fa;--pane:#ffffff;--ink:#202122;--head:#101418;
 --box:#f9f9f9;--boxEdge:#aaaaaa;--cap:#55b1e1;--capInk:#000000;
 --rule:#a2a9b1;--link:#3366cc;--red:#bf3c2c;--mut:#54595d;
 --fs:16px;--lh:26px;--box-fs:15.2px;--box-lh:21.28px;--boxW:304px;--col:872px;--measure:660px}
/* ===== הערכה הכהה נגזרה על ידי ולא נמדדה: ויקיפדיה מתעלמת
        מ-prefers-color-scheme למי שאינו מחובר ונשארת בהירה.   ===== */
@media(prefers-color-scheme:dark){:root:not([data-theme=light]){
 --bg:#101418;--pane:#1b1f23;--ink:#eaecf0;--head:#f8f9fa;
 --box:#1b1f23;--boxEdge:#54595d;--rule:#54595d;
 --link:#88a9e8;--red:#ff8272;--mut:#a2a9b1}}
:root[data-theme=dark]{
 --bg:#101418;--pane:#1b1f23;--ink:#eaecf0;--head:#f8f9fa;
 --box:#1b1f23;--boxEdge:#54595d;--rule:#54595d;
 --link:#88a9e8;--red:#ff8272;--mut:#a2a9b1}
/* --cap נושא טקסט שחור ולכן אינו מוגדר מחדש בכהה — אסור לו להיכהות. */
body{margin:0;background:var(--bg);color:var(--ink);
 font:400 var(--fs)/var(--lh) sans-serif}
h1,h2,h3{margin:0;color:var(--head);font-weight:400}
p{margin:8px 0 16px}
a{color:var(--link);text-decoration:none}a:hover{text-decoration:underline}
a.new{color:var(--red)}
bdi{unicode-bidi:isolate}
:focus-visible{outline:2px solid var(--link);outline-offset:2px}

.top{background:var(--pane);border-bottom:1px solid var(--rule);padding:10px 0}
.top .in{max-width:1180px;margin:0 auto;padding:0 20px;display:flex;
 align-items:baseline;gap:10px;font-size:15px}
.top b{font-size:22px;font-weight:700}
.top span{color:var(--mut)}

.page{max-width:1180px;margin:0 auto;padding:22px 20px 70px;background:var(--pane);
 min-height:100vh}
h1{font:400 28.8px/39.6px sans-serif;padding-bottom:4px;border-bottom:1px solid var(--rule)}
.sub{color:var(--mut);font-size:.85em}
.lead{margin-top:14px}
h2{font:400 24px/33px sans-serif;padding-bottom:4.08px;border-bottom:1px solid var(--rule);
 margin:22px 0 6px}
h3{font:700 18px/26px sans-serif;margin:16px 0 4px}

/* ---------- תיבת-המידע: 304 · #f9f9f9 · גבול 1px #aaa ---------- */
.info{float:left;width:var(--boxW);margin:0 15.2px 7.6px 0;background:var(--box);
 border:1px solid var(--boxEdge);font:400 var(--box-fs)/var(--box-lh) sans-serif;
 border-collapse:collapse}
.info caption{background:var(--cap);color:var(--capInk);
 font:700 18.24px/21.28px sans-serif;padding:3px 6px;text-align:center}
.info th{font:700 var(--box-fs)/var(--box-lh) sans-serif;text-align:right;
 vertical-align:top;padding:4px 6px;width:96px;color:var(--ink)}
.info td{padding:4px 6px;text-align:center;vertical-align:top}
.info tr+tr th,.info tr+tr td{border-top:1px solid var(--boxEdge)}
.portrait{padding:10px 6px;text-align:center}
.mono{display:inline-grid;place-items:center;width:110px;height:110px;border-radius:50%;
 background:var(--cap);color:var(--capInk);font:700 34px/1 sans-serif}
.pcap{display:block;margin-top:6px;color:var(--mut);font-size:13px;line-height:18px}
.owe{color:var(--red)}.clear{color:inherit}

.body{max-width:var(--col)}      /* 872 — רוחב המכל, נמדד */
/* סטייה מודעת: ויקיפדיה נותנת לפסקאות שמתחת לתיבה לרוץ על כל 872 —
   93 תווים בשורה, מעבר לטווח הקריאה 45–75. הפסקה נקצצת ל-660.
   הטבלאות והתיבה נשארות על הרוחב שנמדד.                             */
.body>p{max-width:var(--measure)}
.ref{font-size:13.33px;vertical-align:super;line-height:0}
.ref a{text-decoration:none}
table.grid{border-collapse:collapse;margin:10px 0 18px;font-size:15px;width:100%;max-width:var(--col)}
.grid th,.grid td{border:1px solid var(--rule);padding:6px 9px;text-align:start;
 vertical-align:top}
.grid th{background:var(--box);font-weight:700}
.grid td.n{font-variant-numeric:tabular-nums;white-space:nowrap}
ul.notes{margin:8px 0 0;padding:0;list-style:none;font-size:14px;line-height:22px}
ul.notes li{margin-bottom:4px}
ul.notes .bk{color:var(--link)}
.clr{clear:both}
@media(max-width:900px){
 .info{float:none;width:100%;margin:0 0 16px}
 .page{padding:16px 16px 60px}
 table.grid{display:block;overflow-x:auto}}
@media(prefers-reduced-motion:reduce){*{transition:none!important}}
</style></head><body>

<div class="top"><div class="in">
 <b>מוסדות</b><span>תיק משפחה · ${esc(D.today.dow)}, ${hDate}</span>
</div></div>

<div class="page">
 <h1>${esc(F.name)}</h1>

 <table class="info">
  <caption>${esc(F.name)}</caption>
  <tr><td class="portrait" colspan="2">
   <span class="mono" aria-hidden="true">${esc(F.name.replace('משפחת ', '').slice(0, 2))}</span>
   <span class="pcap">${esc(F.head)} ו${esc(F.spouse)}, ${esc(F.city)}</span>
  </td></tr>
  ${rows.map(([k, v]) => `<tr><th scope="row">${k}</th><td>${v}</td></tr>`).join('\n  ')}
 </table>

 <div class="body">
 <p class="lead"><b>${esc(F.name)}</b> היא אחת מ־${D.famN} המשפחות הרשומות במוסד בשנת ${esc(D.t.year)}. בראשה ${esc(F.head)}, המתגורר ב${esc(F.city)} עם רעייתו ${esc(F.spouse)}. למשפחה ${F.kids} ילדים הלומדים במוסד${ref(T_ATT)}, ונוכחותם הממוצעת בחמשת ימי הלימוד האחרונים עומדת על ${attAvg}%${ref(T_ATT)}.</p>

 <h2>חיוב וגבייה</h2>
 <p>החיוב השנתי ברוטו עומד על <bdi>${money(F.gross)}</bdi> ₪, הנגזר מן התעריפון: ${money(D.t.tuition)} ₪ שכר לימוד לילד, ${money(D.t.books)} ₪ ספרים${riders.length ? `, ו־${money(D.t.bus)} ₪ הסעה עבור ${riders.length} מן הילדים` : ''}${ref(T_TARIF)}. למשפחה הנחה של ${F.discount}%, ולפיכך החיוב נטו הוא <bdi>${money(F.due)}</bdi> ₪${ref(T_DISC)}. עד כה שולמו <bdi>${money(F.paid)}</bdi> ₪${ref(T_PAID)}, ${F.bal > 0 ? `והיתרה הפתוחה עומדת על <b class="owe"><bdi>${money(F.bal)}</bdi> ₪</b>` : 'והחשבון מאוזן'}. ${F.hok ? 'למשפחה הוראת קבע פעילה.' : 'למשפחה אין הוראת קבע, והתשלומים נקלטים ידנית.'}</p>
 ${D.pays.length ? `<h3>${D.pays.length === 1 ? 'רשומת הקליטה האחרונה' : `${D.pays.length} רשומות הקליטה האחרונות`}${ref(T_PAY)}</h3>
 <table class="grid"><thead><tr><th>סכום</th><th>אמצעי</th><th>לפני</th></tr></thead><tbody>
 ${D.pays.map(p => `<tr><td class="n"><bdi>${money(p.a)}</bdi> ₪</td><td>${esc(p.m)}</td><td class="n">${p.ago} חודשים</td></tr>`).join('\n ')}
 </tbody></table>` : ''}

 <h2>הילדים</h2>
 <p>${D.kids.map(k => esc(k.name)).join(', ')} — ${D.kids.length} ילדים, הלומדים ב־${new Set(D.kids.map(k => k.cls)).size} כיתות${ref(T_ATT)}.</p>
 <table class="grid"><thead><tr><th>שם</th><th>כיתה</th><th>חדר</th><th>מגיד שיעור</th><th>נוכחות</th></tr></thead><tbody>
 ${D.kids.map(k => `<tr><td>${esc(k.name)}</td><td>${esc(k.cls)}</td><td>${esc(k.room)}</td>
  <td>${esc(k.rebbe)}${k.absent ? ` <span class="sub">(ב${esc(k.absent)})</span>` : ''}</td>
  <td class="n">${k.att}/${k.days}</td></tr>`).join('\n ')}
 </tbody></table>

 ${riders.length ? `<h2>הסעות</h2>
 <p>${riders.length} מילדי המשפחה נוסעים בהסעות המוסד${ref(T_ROUTE)}. ${riders.map(k => `${esc(k.name)} עולה ב${esc(k.stop)} בשעה <bdi dir="ltr">${k.time}</bdi> ב${esc(k.route)}`).join('; ')}.</p>` : ''}

 ${D.loan ? `<h2>קופת החסד</h2>
 <p>למשפחה הלוואה בסך <bdi>${money(D.loan.amount)}</bdi> ₪ שניתנה עבור ${esc(D.loan.purpose)}, בפריסה ל־${D.loan.inst} תשלומים${ref(T_LOAN)}. מצבה ${esc(D.loan.stage)}: שולמו ${D.loan.paid} תשלומים, ונותרו בחוץ <bdi>${money(D.loan.left)}</bdi> ₪. הבקשה נושאת ${D.loan.g} ערבים${D.loan.g < 2 ? ' — פחות משניים, ולפיכך היא חסומה לפי האפיון' : ''}. בקופה פנויים כיום <bdi>${money(D.fundFree)}</bdi> ₪${ref(T_LOAN)}.</p>` : ''}

 ${D.yz.length ? `<h2>ימי זיכרון</h2>
 <p>${D.yz.map(z => `${esc(z.name)} — ${esc(z.day)}`).join('; ')}.</p>` : ''}

 <h2>הערות שוליים</h2>
 <ul class="notes">
 ${NOTES.map((t, i) => `<li id="n${i + 1}"><a class="bk" href="#r${i + 1}" aria-label="חזרה להפניה ${i + 1}">↑</a> <b>${i + 1}.</b> ${esc(t)}</li>`).join('\n ')}
 </ul>

 <h2>על העמוד הזה</h2>
 <p>הערך מועתק במדידה מוויקיפדיה העברית: גוף ב־<bdi>16/26</bdi> בגופן־מערכת; כותרת ב־<bdi>28.8/39.6</bdi>; כותרות משנה ב־<bdi>24/33</bdi> עם קו תחתון <bdi>1px</bdi>; תיבת-מידע ברוחב <bdi>304</bdi> על רקע <bdi>#f9f9f9</bdi> בגבול <bdi>1px</bdi>, כותרות-שורה מודגשות וצמודות לתחילת השורה, ערכים ממורכזים. הטקסט מיושר לתחילת השורה בלבד, לא לשני הצדדים. <b>סטייה אחת מודעת:</b> בוויקיפדיה הפסקאות שמתחת לתיבה רצות על מלוא <bdi>872</bdi> הפיקסלים ומגיעות ל־<bdi>93</bdi> תווים בשורה — מעבר לטווח הקריאה הנוח, שהוא <bdi>45–75</bdi>. כאן הפסקה נקצצה ל־<bdi>660</bdi>, והטבלאות ותיבת־המידע נשארו על הרוחב שנמדד. <b>ואין כאן קישור לגופן</b> — ויקיפדיה העברית מצהירה <bdi dir="ltr">sans-serif</bdi> ומשאירה למערכת של הקורא לבחור את הגופן העברי, וזה הועתק כמו שהוא.</p>
 </div>
 <div class="clr"></div>
</div>
</body></html>`;

writeFileSync(join(here, 'erech.html'), html);
console.log('erech.html · ' + F.name + ' · ילדים ' + D.kids.length + ' · תשלומים ' + D.pays.length +
  ' · הפניות ' + NOTES.length + ' · נוכחות ' + attAvg + '%');
