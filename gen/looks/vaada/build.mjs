/* build.mjs — ועדת ההלוואות, מועתקת במדידה מתעלת-הפסיקה של Stack Overflow.
   נמדד מעמוד-שאלה חי (9,739 אלמנטים, 25 תשובות, תשובה מקובלת קיימת).
   הרצה: node gen/looks/vaada/build.mjs                                       */
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
  const F = fund();
  const GIVEN = ['ניתן','בהחזר','באיחור','נפרע'];
  const rows = DB.loans.map(l => {
    const f = fam(l.familyId);
    /* המספר בתעלה = הסכום שעל הפרק. לבקשה פתוחה — מה שביקשה;
       להלוואה חיה — מה שעוד בחוץ. נגזר, לא נכתב.                */
    const out = GIVEN.includes(l.stage)
      ? Math.round(l.amount * (1 - l.paid / l.installments))
      : l.amount;
    return { id:l.id, stage:l.stage, amount:l.amount, on:out,
      g:l.guarantors, inst:l.installments, paid:l.paid, late:l.late, days:l.days,
      purpose:l.purpose, decided: ['אושר'].concat(GIVEN).includes(l.stage),
      fam:f.name, city:f.city, kids:f.kids.length, hok:f.hok, bal:balance(f),
      head:nameOf(f.head), phone:f.phone };
  });
  return { rows, F, today:DB.today, stages:stagesOf('חסד','הלוואה'),
    forb:forbiddenOf('חסד','הלוואה'), famN:DB.families.length };
`)(SPEC);

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
const money = n => Math.round(n).toLocaleString('en-US');
const ini = n => n.replace('משפחת ', '').slice(0, 2);

/* כלל-הסידור של Stack Overflow, מילה במילה: המקובלת עולה לראש
   בלי קשר למספר שלה; השאר יורדות לפי המספר.                        */
/* מה שעל השולחן היום: בקשות שטרם ניתנו. ההלוואות הרצות אינן "תשובות
   לשאלה של היום" — הן חשיפה קיימת, ומקומן בכותרת.                      */
const ON_TABLE = ['בקשה', 'ועדה', 'אושר'];
const table = D.rows.filter(r => ON_TABLE.includes(r.stage))
  .sort((a, b) => (b.decided - a.decided) || (b.on - a.on));
const live = D.rows.filter(r => !ON_TABLE.includes(r.stage)).sort((a, b) => b.on - a.on);
const open = table.filter(r => !r.decided);
const SUB = { 'בקשה':'טרם נדונה', 'ועדה':'על שולחן הוועדה', 'אושר':'אושרה, טרם ניתנה',
  'ניתן':'ניתנה', 'בהחזר':'בהחזר שוטף', 'באיחור':'בפיגור החזר', 'נפרע':'נפרעה במלואה' };

/* התעלה. רוחב 57, טור ממורכז — בדיוק כמו במקור.
   מה שהוסר במכוון: חצי ההצבעה. אין כאן קהל, ואין מצביעים על בקשה
   של משפחה. נשארו שתי הרשויות שכן קיימות — המספר והחותמת.          */
const gutter = (r) => `<div class="gut">
 <bdi class="num" title="הסכום שעל הפרק">${money(r.on)}</bdi>
 <span class="cur" aria-hidden="true">₪</span>
 ${r.decided
   ? `<span class="acc" title="הוועדה אישרה"><svg viewBox="0 0 36 36" aria-hidden="true"><path d="M6 18.5l3-3 6 6 12-12 3 3-15 15z"/></svg><span class="hid">אושרה בוועדה</span></span>`
   : `<span class="pend" aria-hidden="true"></span><span class="hid">טרם אושרה</span>`}
 <span class="gr${r.g < 2 ? ' bad' : ''}">ערבים <bdi>${r.g}/2</bdi></span>
</div>`;

const card = (r) => `<article class="post${r.decided ? ' ok' : ''}">
 ${gutter(r)}
 <div class="body">
  <h3><a href="#">${esc(r.fam)} — ${esc(r.purpose)}</a></h3>
  <p class="line">${esc(SUB[r.stage] || r.stage)} · נפתחה לפני ${r.days} ימים · ${r.inst} תשלומים${r.paid ? `, שולמו ${r.paid}` : ''}${r.late ? ` · <b class="warn">${r.late} חודשי פיגור</b>` : ''}</p>
  ${r.g < 2 ? `<p class="rule">חסר ערב — האפיון אוסר מתן הלוואה בלי שני ערבים. הבקשה לא תעבור לשלב הבא.</p>` : ''}
  <div class="tags">
   <span class="tag">${esc(r.stage)}</span>
   <span class="tag">${esc(r.city)}</span>
   <span class="tag">${r.kids} ילדים</span>
   ${r.hok ? '<span class="tag">הוראת קבע</span>' : ''}
   ${r.bal > 0 ? `<span class="tag">יתרת שכ״ל <bdi>${money(r.bal)}</bdi></span>` : ''}
  </div>
  <div class="who">
   <span class="av" aria-hidden="true">${esc(ini(r.fam))}</span>
   <span class="wt"><a href="#">${esc(r.head)}</a><em><bdi>${esc(r.phone)}</bdi></em></span>
   <span class="rep" title="מתוך הקופה">סכום מקורי <bdi>${money(r.amount)}</bdi> ₪</span>
  </div>
 </div>
</article>`;

const html = `<!doctype html>
<html lang="he" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>ועדת ההלוואות</title>
<meta name="description" content="תיק ועדת ההלוואות, עם תעלת-פסיקה מועתקת במדידה מ-Stack Overflow.">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600;700&display=swap">
<style>
*{box-sizing:border-box}html,body{overflow-x:hidden}
:root{
 /* ===== נמדד מעמוד-שאלה חי ב-stackoverflow.com ===== */
 --bg:#ffffff;--ink:#0c0d0e;--mut:#636b74;--line:#d6d9dc;--hair:#e3e6e8;
 --chip:#f1f2f3;--chipInk:#3b4045;--cta:#1b75d0;--ok:#18864b;--bad:#b4232c;
 --ctaBg:#1b75d0;   /* כפתור נושא-לבן — לא מתבהר בכהה, בשונה מ--cta של הקישורים */
 --gut:57px;--btn:41px;--ico:18px;
 --fs:13px;--lh:17px;--numF:700 19px/24.85px}
/* ===== הערכה הכהה נגזרה על ידי, לא נמדדה: סטאק-אוברפלו מתעלם
        מ-prefers-color-scheme למשתמש לא-מחובר ונשאר לבן.       ===== */
@media(prefers-color-scheme:dark){:root:not([data-theme=light]){
 --bg:#16181a;--ink:#e7e9ea;--mut:#9aa4ad;--line:#3c4246;--hair:#2a2f33;
 --chip:#24292d;--chipInk:#c3cbd2;--cta:#4a9de8;--ok:#3fb96f;--bad:#ef7b83}}
:root[data-theme=dark]{
 --bg:#16181a;--ink:#e7e9ea;--mut:#9aa4ad;--line:#3c4246;--hair:#2a2f33;
 --chip:#24292d;--chipInk:#c3cbd2;--cta:#4a9de8;--ok:#3fb96f;--bad:#ef7b83}
body{margin:0;background:var(--bg);color:var(--ink);
 font:400 var(--fs)/var(--lh) Heebo,system-ui,Arial,sans-serif}
h1,h2,h3{margin:0}p{margin:0}bdi{unicode-bidi:isolate}
a{color:var(--cta);text-decoration:none}a:hover{text-decoration:underline}
button{font:inherit;cursor:pointer;color:inherit}
:focus-visible{outline:2px solid var(--cta);outline-offset:2px}
.hid{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}

.top{border-top:3px solid var(--ctaBg);border-bottom:1px solid var(--hair);background:var(--bg);
 display:flex;align-items:center;gap:14px;padding:10px 20px;
 position:sticky;top:env(safe-area-inset-top,0px);z-index:9}
.top b{font:700 15px/1.2 Heebo}
.top .mut{color:var(--mut)}
.btn{background:var(--ctaBg);color:#fff;border:0;border-radius:6px;height:38px;padding:0 14px;
 font:500 var(--fs)/1 Heebo;margin-inline-start:auto}

.wrap{max-width:1100px;margin:0 auto;padding:18px 20px 70px}
h1{font:400 27px/31.15px Heebo}
.meta{display:flex;gap:16px;flex-wrap:wrap;color:var(--mut);margin-top:10px;
 padding-bottom:14px;border-bottom:1px solid var(--hair)}
.meta b{color:var(--ink);font-weight:500}
.sorts{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin:22px 0 4px}
.sorts h2{font:400 19px/24px Heebo}
.sorts span{color:var(--mut)}

/* ---------- הרכיב: תעלה קבועת-רוחב לצד גוף חופשי-אורך ---------- */
.post{display:flex;gap:16px;align-items:flex-start;
 padding:16px 0;border-top:1px solid var(--hair)}
.gut{width:var(--gut);flex:none;display:flex;flex-direction:column;align-items:center;
 text-align:center;padding-top:2px}
.num{font:var(--numF) Heebo;color:var(--ink);font-variant-numeric:tabular-nums;
 letter-spacing:-.2px;white-space:nowrap}
.cur{font:400 11px/14px Heebo;color:var(--mut);margin-top:-2px}
/* ✓ — 36×36, בדיוק המידה שנמדדה */
.acc{margin-top:8px;line-height:0}
.acc svg{width:36px;height:36px;fill:var(--ok)}
.pend{margin-top:8px;width:var(--ico);height:var(--ico);border-radius:1000px;
 border:1px solid var(--line);display:block}
.gr{margin-top:8px;font:400 11px/15px Heebo;color:var(--mut);white-space:nowrap}
.gr.bad{color:var(--bad);font-weight:500}

.body{flex:1;min-width:0}
.body h3{font:400 17px/22px Heebo}
.line{color:var(--mut);margin-top:5px}
.warn{color:var(--bad);font-weight:500}
.rule{margin-top:7px;padding:7px 10px;border-inline-start:3px solid var(--bad);
 background:var(--chip);color:var(--chipInk);border-radius:0 4px 4px 0}
.tags{display:flex;gap:6px;flex-wrap:wrap;margin-top:9px}
.tag{background:var(--chip);color:var(--chipInk);border:1px solid var(--chip);
 border-radius:4px;padding:2px 6px;font:500 12px/18px Heebo}
.who{display:flex;align-items:center;gap:8px;margin-top:11px;flex-wrap:wrap}
.av{width:32px;height:32px;border-radius:4px;flex:none;background:var(--chip);
 color:var(--chipInk);display:grid;place-items:center;font:700 12px/1 Heebo}
.wt a{font:400 var(--fs)/var(--lh) Heebo}
.wt em{display:block;font-style:normal;color:var(--mut);font-size:12px;line-height:16px}
.rep{margin-inline-start:auto;font:500 12px/17px Heebo;color:var(--mut);
 font-variant-numeric:tabular-nums}

.h2{font:400 19px/24px Heebo;margin-top:34px}
.tbl{width:100%;border-collapse:collapse;margin-top:12px;font-variant-numeric:tabular-nums}
.tbl th{text-align:start;font:500 12px/18px Heebo;color:var(--mut);
 border-bottom:1px solid var(--line);padding:6px 8px}
.tbl td{padding:8px;border-bottom:1px solid var(--hair)}
.tbl .n{text-align:start;white-space:nowrap}
.tbl tr.lt td{background:var(--chip)}
.split{display:flex;align-items:center;gap:12px;margin:26px 0 0;color:var(--mut)}
.split:before,.split:after{content:"";height:1px;background:var(--hair);flex:1}
.note{margin-top:28px;padding-top:16px;border-top:1px solid var(--hair);
 color:var(--mut);max-width:74ch;line-height:20px}
@media(max-width:560px){
 .post{gap:12px}
 .gut{width:48px}
 .num{font:700 16px/21px Heebo}
 .acc svg{width:28px;height:28px}
 .rep{margin-inline-start:0;width:100%}}
@media(prefers-reduced-motion:reduce){*{transition:none!important}}
</style></head><body>

<header class="top">
 <b>מוסדות — קופת החסד</b>
 <span class="mut">${esc(D.today.dow)} · ${esc(D.today.hd)} ${esc(D.today.hy)}</span>
 <button class="btn" type="button">בקשה חדשה</button>
</header>

<div class="wrap">
 <h1>ועדת ההלוואות — ${table.length} בקשות על השולחן</h1>
 <p class="meta">
  <span>קופה <b><bdi>${money(D.F.cap)}</bdi> ₪</b></span>
  <span>בחוץ <b><bdi>${money(D.F.out)}</bdi> ₪</b></span>
  <span>פנוי <b><bdi>${money(D.F.free)}</bdi> ₪</b></span>
  <span>פעילות <b>${D.F.active}</b></span>
  <span>בפיגור <b>${D.F.late}</b></span>
 </p>

 <div class="sorts">
  <h2>${table.length} בקשות על השולחן</h2>
  <span>ממוינות: מאושרות תחילה, ואחריהן לפי הסכום שעל הפרק — כלל־הסידור של המקור</span>
 </div>

 ${table.filter(r => r.decided).map(card).join('\n')}
 <p class="split">${open.length} שטרם הוכרעו</p>
 ${table.filter(r => !r.decided).map(card).join('\n')}

 <h2 class="h2">${live.length} הלוואות רצות — חשיפת הקופה</h2>
 <p class="line">אינן על שולחן הוועדה. כאן בלי תעלה: אין מה להכריע בהן.</p>
 <table class="tbl"><thead><tr><th>משפחה</th><th>מטרה</th><th>מצב</th><th class="n">עוד בחוץ</th><th class="n">התקדמות</th></tr></thead><tbody>
 ${live.map(r => `<tr${r.late ? ' class="lt"' : ''}><td>${esc(r.fam)}</td><td>${esc(r.purpose)}</td>
  <td>${esc(SUB[r.stage] || r.stage)}${r.late ? ` · <b class="warn">${r.late} ח׳ פיגור</b>` : ''}</td>
  <td class="n"><bdi>${money(r.on)}</bdi> ₪</td><td class="n"><bdi>${r.paid}/${r.inst}</bdi></td></tr>`).join('\n')}
 </tbody></table>

 <p class="note">התעלה משמאל מועתקת במדידה מ-Stack Overflow: רוחב <bdi>57</bdi>, טור ממורכז, המספר ב־<bdi>700 19/24.85</bdi>, וה־✓ בגודל <bdi>36×36</bdi> בצבע <bdi>#18864b</bdi>. הרעיון הוא ששתי רשויות שונות חיות באותה עמודה בלי לדרוס זו את זו — המספר אומר <em>כמה כסף על הפרק</em>, החותמת אומרת <em>מה הוועדה החליטה</em>, והן לא מתמזגות לציון אחד. מה שהוסר במכוון: חצי ההצבעה. במקור יש קהל שמצביע; כאן אין קהל, ואין מצביעים על בקשה של משפחה.</p>
</div>
</body></html>`;

writeFileSync(join(here, 'vaada.html'), html);
console.log('vaada.html · על השולחן ' + table.length + ' · מאושרת ' + table.filter(r => r.decided).length +
  ' · טרם הוכרעו ' + open.length + ' · רצות ' + live.length + ' · טווח המספר ' + money(Math.min(...D.rows.map(r => r.on))) + '–' + money(Math.max(...D.rows.map(r => r.on))));
