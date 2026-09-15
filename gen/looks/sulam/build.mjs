/* build.mjs — עץ האחריות של המוסד בסולם-עמודות, מועתק במדידה מ-WikiTree.
   נמדד מ-wikitree.com/wiki/Washington-11 (2,602 אלמנטים · פרופיל מתועד מלא).
   הרצה: node gen/looks/sulam/build.mjs                                       */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const app = join(here, '..', 'app');
const raw = JSON.parse(readFileSync(join(here, '..', '..', 'mosad.data.json'), 'utf8'));
const SPEC = { roles: raw.roles.map(r => typeof r === 'string' ? r : r.name),
  depts: raw.departments.map(d => ({ n: d.n || d.name, e: (d.entities || []).map(e => ({ n: e.name, st: e.stages || [], fb: e.forbidden || [], mo: e.moment || '', f: (e.fields || []).map(f => [f.name, f.shape || '', f.required ? 1 : 0]) })) })) };
const src = readFileSync(join(app, 'src', '01-store.js'), 'utf8');

/* ארבעת התחומים — קיבוץ של התפקידים שכבר במחסן, לא המצאה */
const DOMAIN = { 'חינוך': ['מגיד שיעור', 'מלמד', 'משגיח'], 'מנהלה': ['הנהלה', 'מזכירות'],
  'משק': ['מטבח', 'אחזקה'], 'תפעול': ['נהג'] };

const D = new Function('SPEC', 'DOMAIN', src + `
  build();
  const dom = r => Object.keys(DOMAIN).find(d => DOMAIN[d].includes(r)) || 'אחר';
  const people = DB.staff.map(s => {
    const c = DB.classes.find(x => x.rebbe === s.id);
    const r = DB.routes.find(x => x.driver === s.id);
    return { id:s.id, name:nameOf(s.personId), role:s.role, dom:dom(s.role),
      absent:s.absent, since:s.since,
      sub: s.sub ? nameOf(staff(s.sub).personId) : null,
      unit: c ? { kind:'כיתה', name:c.name, room:c.room,
                  n:DB.students.filter(x=>x.classId===c.id).length,
                  here:DB.students.filter(x=>x.classId===c.id&&x.att[0]).length }
          : r ? { kind:'מסלול', name:r.name, room:r.stops.length+' עמדות',
                  n:r.stops.reduce((a,x)=>a+x.riders.length,0), here:null }
          : null };
  });
  const roles = [...new Set(DB.staff.map(s=>s.role))].map(r => ({
    name:r, dom:dom(r), n:DB.staff.filter(s=>s.role===r).length,
    out:DB.staff.filter(s=>s.role===r&&s.absent).length }));
  const doms = Object.keys(DOMAIN).map(d => ({ name:d,
    roles:roles.filter(r=>r.dom===d).length,
    n:DB.staff.filter(s=>dom(s.role)===d).length,
    out:DB.staff.filter(s=>dom(s.role)===d&&s.absent).length }));
  return { people, roles, doms, today:DB.today,
    tot:{ staff:DB.staff.length, stud:DB.students.length, fams:DB.families.length,
      classes:DB.classes.length, routes:DB.routes.length,
      out:DB.staff.filter(s=>s.absent).length,
      here:DB.students.filter(s=>s.att[0]).length } };
`)(SPEC, DOMAIN);

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
const ORDER = ['חינוך', 'מנהלה', 'משק', 'תפעול'];
const units = D.people.filter(p => p.unit);
/* סדר שורות אחד לעמודות 4 ו-5: מחזיקי-יחידה תחילה, ואז השאר. */
const ROW = ORDER.flatMap(d => {
  const g = D.people.filter(p => p.dom === d);
  return [...g.filter(p => p.unit), ...g.filter(p => !p.unit)];
});

/* ✓ במקור = «מאומת». כאן = «במקומו היום». מצב אמיתי, לא תג-אמון. */
const ok = (on, why) => on
  ? `<span class="chk" title="במקומו היום" aria-hidden="true">✓</span><span class="hid">במקומו היום</span>`
  : `<span class="chk off" title="ב${esc(why || 'היעדרות')}" aria-hidden="true">–</span><span class="hid">נעדר · ב${esc(why || 'היעדרות')}</span>`;

const COLS = [
  { lab: 'המוסד', body: `<div class="card d0 wide">
     <b class="nm">מוסדות</b>
     <p class="ln">${D.tot.stud} תלמידים · ${D.tot.fams} משפחות</p>
     <p class="ln">${D.tot.staff} אנשי צוות, מהם ${D.tot.out} נעדרים היום</p>
     <p class="ln">${D.tot.classes} כיתות · ${D.tot.routes} מסלולי הסעה</p>
     <p class="ln sm">נוכחות היום: ${D.tot.here} מתוך ${D.tot.stud}</p>
    </div>` },
  { lab: 'תחומים', body: ORDER.map((d, i) => { const x = D.doms.find(y => y.name === d);
      return `<div class="card d${i + 1}"><b class="nm">${esc(x.name)}</b>
      <p class="ln">${x.n} אנשים ב־${x.roles} תפקידים</p>
      <p class="ln sm">${x.out ? x.out + ' נעדרים' : 'כולם במקומם'}</p></div>`; }).join('\n') },
  { lab: 'תפקידים', body: ORDER.flatMap((d, i) => D.roles.filter(r => r.dom === d)
      .map(r => `<div class="card d${i + 1} n2"><b class="nm">${esc(r.name)}</b>
      <p class="ln">${r.n} אנשים${r.out ? ` · ${r.out} נעדרים` : ''}</p></div>`)).join('\n') },
  { lab: 'הצוות', body: ROW.map(p => `<div class="card d${ORDER.indexOf(p.dom) + 1} n3"><b class="nm">${esc(p.name)}</b>${ok(!p.absent, p.absent)}
      <p class="ln sm">${esc(p.role)} · ${esc(p.since)}</p></div>`).join('\n') },
  /* עמודה 5 מיושרת שורה-מול-שורה לעמודה 4: מי שאינו מחזיק יחידה
     מקבל חלל ריק באותו גובה — בדיוק כמו אדם בלי הורים רשומים במקור.
     בלי זה הסמיכות החזותית מבטיחה קשר שאינו קיים.                    */
  { lab: 'באחריותם', body: ROW.map(p => {
      const i = ORDER.indexOf(p.dom);
      if (!p.unit) return `<div class="slot" aria-hidden="true"></div>`;
      return `<div class="card d${i + 1} n4 tie"><b class="nm">${esc(p.unit.name)}</b>
      <p class="ln sm"><bdi>${p.unit.n}</bdi>${p.unit.here != null ? ` · נוכחים <bdi>${p.unit.here}</bdi>` : ''} · ${esc(p.unit.room)}</p></div>`; }).join('\n') },
];

const html = `<!doctype html>
<html lang="he" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>עץ האחריות</title>
<meta name="description" content="עץ האחריות של המוסד בסולם-עמודות, מועתק במדידה מ-WikiTree.">
<style>
/* אין קישור לגופן — Roboto של המקור נטול אותיות עבריות, וטעינתו
   לעמוד עברי לא הייתה עושה דבר מלבד נפילה שקטה לגופן המערכת. */
*{box-sizing:border-box}html{overflow-x:hidden}
:root{
 /* ===== נמדד מ-wikitree.com ===== */
 --bg:#fcfcfc;--pane:#ffffff;--ink:#393a3c;--mut:#6c6e72;--rule:#d7d8da;
 --link:#008000;                /* הירוק של WikiTree — קישורי-שם */
 --cardW:237px;--cardR:6px;--slot:56px;--fs:18px;--lh:27px;
 /* במקור: כחול=זכר, ורוד=נקבה. כאן הישות היא תפקיד, לא אדם —
    ולכן הגוון מסמן תחום. הקידוד לפי מין הוסר. */
 --d0:#eef1f6;--d1:#f2f1ff;--d2:#fff5e8;--d3:#eefaf2;--d4:#ffeeee;
 --e0:#c9d2e0;--e1:#cdc9f0;--e2:#efd4ae;--e3:#b6e0c8;--e4:#f0c3c3}
@media(prefers-color-scheme:dark){:root:not([data-theme=light]){
 --bg:#17181a;--pane:#1e2023;--ink:#e6e7e9;--mut:#a0a3a8;--rule:#3a3d41;
 --link:#5ec97f;
 --d0:#20252d;--d1:#24223a;--d2:#2e2519;--d3:#1a2e23;--d4:#2f1f1f;
 --e0:#3a4552;--e1:#413c66;--e2:#5b482a;--e3:#2c5a41;--e4:#5c3a3a}}
:root[data-theme=dark]{
 --bg:#17181a;--pane:#1e2023;--ink:#e6e7e9;--mut:#a0a3a8;--rule:#3a3d41;
 --link:#5ec97f;
 --d0:#20252d;--d1:#24223a;--d2:#2e2519;--d3:#1a2e23;--d4:#2f1f1f;
 --e0:#3a4552;--e1:#413c66;--e2:#5b482a;--e3:#2c5a41;--e4:#5c3a3a}
body{margin:0;background:var(--bg);color:var(--ink);
 font:400 var(--fs)/var(--lh) system-ui,sans-serif}
h1,h2{margin:0}p{margin:0}bdi{unicode-bidi:isolate}
.hid{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}

.top{background:var(--pane);border-bottom:1px solid var(--rule);padding:14px 0}
.top .in{max-width:1400px;margin:0 auto;padding:0 20px}
h1{font:700 40px/48px system-ui,sans-serif}
.cap{color:var(--mut);margin-top:4px;max-width:70ch}

.hold{max-width:1400px;margin:0 auto;padding:22px 20px 60px}
h2{font:700 28px/33.6px system-ui,sans-serif;margin-bottom:14px}

/* ---------- הסולם: דור = עמודה. נגלל לרוחב, לא נשבר. ---------- */
.lad{display:flex;gap:22px;align-items:flex-start;overflow-x:auto;
 padding-bottom:16px;scroll-snap-type:x proximity}
.colw{flex:none;scroll-snap-align:start}
/* תווית-עמודה: מודגשת עם קו תחתון. ריווח-אותיות של המקור הוסר —
   בעברית הוא פוגע בקריאוּת ואין בה אותיות רישיות להעצים.        */
.colw>h3{font:700 16px/24px system-ui,sans-serif;color:var(--ink);margin:0 0 10px;
 padding-bottom:5px;border-bottom:1px solid var(--rule)}
.col{display:flex;flex-direction:column;gap:12px}

.card{width:var(--cardW);border-radius:var(--cardR);padding:8px 10px 10px;
 font:400 16px/24px system-ui,sans-serif;position:relative;border:1px solid transparent}
.card.wide{width:290px}
.nm{display:block;font:700 16px/19.2px system-ui,sans-serif;color:var(--link)}
.ln{color:var(--ink);font-size:15px;line-height:21px}
.ln.sm{color:var(--mut);font-size:14px;line-height:20px}
/* הפירוט יורד עם המרחק — זה הלב של הרכיב, לא קישוט */
.card.n2{width:210px}
.card.n3{width:196px;padding:6px 10px 8px;height:var(--slot)}
.card.n4{width:178px;padding:6px 10px 8px;height:var(--slot)}
.slot{height:var(--slot)}
/* מוט-החיבור: קו מכרטיס-היחידה אל האדם שמחזיק אותה, באותה שורה */
.card.n4.tie:after{content:"";position:absolute;inset-inline-end:100%;
 top:50%;width:22px;border-top:1px solid var(--rule)}
.card.n3 .ln,.card.n4 .ln{font-size:13px;line-height:18px}
.d0{background:var(--d0);border-color:var(--e0)}
.d1{background:var(--d1);border-color:var(--e1)}
.d2{background:var(--d2);border-color:var(--e2)}
.d3{background:var(--d3);border-color:var(--e3)}
.d4{background:var(--d4);border-color:var(--e4)}
.chk{position:absolute;inset-inline-end:8px;top:6px;
 font:700 13px/1 system-ui,sans-serif;color:var(--link)}
.chk.off{color:var(--mut)}

.legend{display:flex;gap:18px;flex-wrap:wrap;margin:26px 0 0;
 padding-top:16px;border-top:1px solid var(--rule);color:var(--mut);font-size:15px}
.legend span{display:inline-flex;align-items:center;gap:7px}
.legend i{width:16px;height:16px;border-radius:4px;display:block;border:1px solid}
.note{margin-top:20px;color:var(--mut);font-size:15px;line-height:23px;max-width:74ch}
@media(max-width:700px){h1{font:700 30px/36px system-ui,sans-serif}
 h2{font:700 22px/28px system-ui,sans-serif}}
@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important}}
</style></head><body>

<header class="top"><div class="in">
 <h1>עץ האחריות</h1>
 <p class="cap">${esc(D.today.dow)} · ${esc(D.today.hd)} ${esc(D.today.hy)} — מי אחראי על מי, מהמוסד ועד הכיתה. כל דור הוא עמודה.</p>
</div></header>

<div class="hold">
 <h2>מוסדות ← ${units.length} יחידות</h2>
 <div class="lad" tabindex="0" role="region" aria-label="סולם האחריות, נגלל לרוחב">
  ${COLS.map(c => `<div class="colw"><h3>${esc(c.lab)}</h3><div class="col">
  ${c.body}
  </div></div>`).join('\n  ')}
 </div>

 <p class="legend">
  ${ORDER.map((d, i) => `<span><i class="d${i + 1}" style="border-color:var(--e${i + 1})"></i>${esc(d)}</span>`).join('\n  ')}
  <span><i class="d0" style="border-color:var(--e0)"></i>המוסד</span>
  <span><span class="chk" style="position:static">✓</span>במקומו היום</span>
  <span><span class="chk off" style="position:static">–</span>נעדר</span>
 </p>

 <p class="note">הסולם מועתק במדידה מ-WikiTree: כרטיס ברוחב <bdi>237</bdi> ורדיוס <bdi>6</bdi>, ריפוד <bdi>8/10/10</bdi>, גוף <bdi>16/24</bdi>, שם ב־<bdi>700 16/19.2</bdi> בירוק <bdi>#008000</bdi> — ותווית מודגשת עם קו תחתון מעל כל עמודה. הרעיון: <b>דור אינו ציור, הוא עמודה</b>. גרף מצויר נשבר בדור השלישי; עמודות נגללות לרוחב בלי גבול. ומה שקל לפספס — <b>הפירוט יורד עם המרחק</b>: כרטיס המוסד נושא ארבע שורות, כרטיס היחידה נושא שתיים. <b>שתי סטיות מודעות:</b> במקור הגוון מסמן מין (כחול/ורוד); כאן הישות היא תפקיד ולא אדם, ולכן הגוון מסמן תחום. ובמקור תוויות העמודות ברישיות ובריווח-אותיות; בעברית אין רישיות, וריווח-אותיות פוגע בקריאוּת — נשארו ההדגשה והקו בלבד.</p>
</div>
</body></html>`;

writeFileSync(join(here, 'sulam.html'), html);
console.log('sulam.html · תחומים ' + D.doms.length + ' · תפקידים ' + D.roles.length +
  ' · צוות ' + D.people.length + ' · יחידות ' + units.length +
  ' · סולם ' + [1, D.doms.length, D.roles.length, D.people.length, units.length].join('→'));
