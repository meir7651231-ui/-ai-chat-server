/* צוות — גאנט של יום אחד. ציר-שעות אופקי, פס לכל עובד, ועקומת-כיסוי מתחת.
   המבנה הייחודי: זמן זורם לרוחב (ימינה←שמאלה), לא רשת ולא רשימה. */
import { navDrawer, ltr } from '../base.mjs';

const H0 = 6, H1 = 22, COLS = (H1 - H0) * 2;           // חריץ = חצי שעה
const t2c = t => Math.min(COLS + 2, Math.max(2, (+t.slice(0, 2) - H0) * 2 + (+t.slice(3) >= 30 ? 1 : 0) + 2));  // גזירה לגבולות היום — משמרת שמתחילה ב-05:30 לא נכנסת לעמודת-השמות

/* [שם, תפקיד, צבע, [[מ,עד,תווית]…], מצב] */
const STAFF = [
  ['ר׳ אליהו ויס', 'מגיד שיעור ז׳', 1, [['08:00', '12:20', 'סדר א׳'], ['13:45', '16:10', 'סדר ב׳']], ''],
  ['ר׳ דוד לוי', 'מלמד ג׳', 3, [['08:00', '12:20', 'סדר א׳'], ['13:45', '15:20', 'חזרה']], ''],
  ['ר׳ יצחק פריד', 'משגיח', 2, [['06:20', '09:00', 'שחרית'], ['12:20', '13:45', 'סעודה'], ['19:00', '21:30', 'סדר ערב']], ''],
  ['ר׳ מנחם פרידמן', 'גבאי', 4, [['06:00', '10:00', 'מניינים'], ['16:00', '20:00', 'מנחה/מעריב']], ''],
  ['זלמן כץ', 'מטבח', 6, [['05:30', '14:00', 'בוקר וצהריים'], ['17:00', '20:00', 'ערב']], ''],
  ['חנה גולד', 'מזכירות', 5, [['08:00', '15:00', 'משרד']], ''],
  ['גרשון אדלר', 'נהג קו 4', 3, [['07:00', '08:30', 'איסוף'], ['16:00', '17:30', 'פיזור']], ''],
  ['שרה ויסבלט', 'ציוד', 5, [], 'חופשה'],
  ['ברוך נוימן', 'אחזקה', 2, [], 'מחלה'],
  ['מרדכי שטרן', 'מחליף · אחזקה', 6, [['08:00', '16:00', 'במקום ב. נוימן']], 'מחליף'],
];

/* כיסוי לפי חריץ — נספר מהפסים עצמם, לא נכתב ביד */
const COVER = Array.from({ length: COLS }, (_, i) => {
  const c = i + 2;
  return STAFF.reduce((n, s) => n + (s[3].some(([a, b]) => c >= t2c(a) && c < t2c(b)) ? 1 : 0), 0);
});

export default {
  id: 'tzevet',
  name: 'צוות',
  title: 'צוות — מוסד',
  desc: 'מי נמצא היום ומתי: גאנט של יום אחד עם עקומת כיסוי.',
  css: `
.hd{display:flex;gap:var(--s3);align-items:center;flex-wrap:wrap;padding:var(--s4);max-width:1240px;margin-inline:auto}
.hd h1{font-size:21px}
.hd .sp{flex:1}
.kpi{display:flex;gap:var(--s4);flex-wrap:wrap;padding:0 var(--s4) var(--s4);max-width:1240px;margin-inline:auto}
.kpi div{display:flex;flex-direction:column}
.kpi b{font:800 24px Heebo;font-variant-numeric:tabular-nums;line-height:1.1}
.kpi span{font-size:12.5px;color:var(--mut)}
.kpi .warn b{color:var(--warn)}
.kpi .err b{color:var(--err)}

.scroll{overflow-x:auto;padding:0 var(--s4) var(--s5);max-width:1240px;margin-inline:auto}
.gantt{display:grid;grid-template-columns:148px repeat(${COLS},minmax(15px,1fr));align-items:center;
 min-width:760px;row-gap:5px}
.gantt .hh{grid-row:1;font:500 10.5px Heebo;color:var(--mut);text-align:center;font-variant-numeric:tabular-nums;
 border-inline-start:1px solid var(--hair);padding-bottom:5px}
.gantt .nm{grid-column:1;position:sticky;inset-inline-start:0;background:var(--bg);z-index:5;
 padding-inline-end:var(--s3);display:flex;flex-direction:column;min-height:34px;justify-content:center}
.gantt .nm b{font-size:13.5px;font-weight:600;white-space:nowrap}
.gantt .nm span{font-size:11.5px;color:var(--mut);white-space:nowrap}
.lane{grid-column:2/-1;height:32px;border-radius:8px;background:var(--sunk);position:relative;z-index:1}
.bar{height:32px;border-radius:8px;display:flex;align-items:center;padding-inline:9px;font-size:11.5px;
 font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;z-index:2;position:relative}
.bar.b1{background:var(--c1-soft);color:var(--c1)}
.bar.b2{background:var(--c2-soft);color:var(--c2)}
.bar.b3{background:var(--c3-soft);color:var(--c3)}
.bar.b4{background:var(--c4-soft);color:var(--c4)}
.bar.b5{background:var(--c5-soft);color:var(--c5)}
.bar.b6{background:var(--c6-soft);color:var(--c6)}
.off{grid-column:2/-1;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;
 font-size:12px;font-weight:600;color:var(--mut);background:repeating-linear-gradient(-45deg,var(--sunk),var(--sunk) 6px,var(--raise) 6px,var(--raise) 12px)}
.nowl{grid-row:2/-1;width:2px;background:var(--acc);justify-self:center;z-index:4;position:relative}
.nowl::before{content:'';position:absolute;top:-5px;inset-inline-start:-3px;width:8px;height:8px;border-radius:50%;background:var(--acc)}

.cover{grid-column:2/-1;display:flex;align-items:flex-end;gap:1px;height:46px;margin-top:var(--s3)}
.cover i{flex:1;background:var(--acc-soft);border-radius:2px 2px 0 0}
.cover i.thin{background:var(--warn-soft)}
.cover i.none{background:var(--err-soft);min-height:2px}
.clab{grid-column:1;font-size:12px;color:var(--mut);margin-top:var(--s3);align-self:end;padding-inline-end:var(--s3)}

.legend{display:flex;gap:var(--s4);flex-wrap:wrap;font-size:12.5px;color:var(--mut);
 max-width:1240px;margin-inline:auto;padding:0 var(--s4) var(--s6)}
.legend i{display:inline-block;width:14px;height:10px;border-radius:3px;margin-inline-end:6px;vertical-align:-1px}
.hatch{background:repeating-linear-gradient(-45deg,var(--sunk),var(--sunk) 3px,var(--raise) 3px,var(--raise) 6px)}

@media(max-width:700px){.gantt{grid-template-columns:110px repeat(${COLS},minmax(13px,1fr))}}
@media print{.scroll{overflow:visible}.nowl{display:none}}
`,
  body: `
<header class="hd">
  <h1>צוות</h1>
  <p style="font-size:13.5px;color:var(--mut)">יום שלישי ד׳ תשרי · ${ltr('06:00')}–${ltr('22:00')} · נתוני דוגמה</p>
  <span class="sp"></span>
  ${navDrawer('tzevet')}
</header>

<section class="kpi" aria-label="מצב היום">
  <div><b>41</b><span>נוכחים מתוך 44</span></div>
  <div class="warn"><b>2</b><span>חסרים · שובץ מחליף</span></div>
  <div class="err"><b>1</b><span>חסר · בלי מחליף</span></div>
  <div><b class="num">${ltr('06:00')}</b><span>הכיסוי הדק ביותר</span></div>
</section>

<main id="main" class="scroll">
  <h2 class="sr">גאנט משמרות ליום שלישי</h2>
  <div class="gantt">
    ${Array.from({ length: (H1 - H0) }, (_, i) => `<div class="hh" style="grid-column:${i * 2 + 2}/span 2">${String(H0 + i).padStart(2, '0')}</div>`).join('')}
    ${STAFF.map((s, r) => {
    const row = r + 2;
    const nm = `<div class="nm" style="grid-row:${row}"><b>${s[0]}</b><span>${s[1]}</span></div>`;
    if (!s[3].length) return nm + `<div class="off" style="grid-row:${row}">${s[4]} · לא במשמרת</div>`;
    return nm + `<div class="lane" style="grid-row:${row}"></div>` + s[3].map(([a, b, lab]) =>
      `<div class="bar b${s[2]}" style="grid-row:${row};grid-column:${t2c(a)}/${t2c(b)}">${lab} · ${ltr(a + '–' + b)}</div>`).join('');
  }).join('')}
    <div class="nowl" id="nowl" style="grid-column:${t2c('13:45')}" aria-hidden="true"></div>
    <div class="clab">כיסוי</div>
    <div class="cover" role="img" aria-label="עקומת כיסוי: בין 1 ל-7 אנשי צוות בו-זמנית לאורך היום">
      ${COVER.map(v => `<i class="${v === 0 ? 'none' : v <= 2 ? 'thin' : ''}" style="height:${Math.max(4, v / 7 * 100)}%"></i>`).join('')}
    </div>
  </div>
</main>

<p class="legend">
  <span><i style="background:var(--acc-soft)"></i>כיסוי תקין</span>
  <span><i style="background:var(--warn-soft)"></i>כיסוי דק (≤2)</span>
  <span><i class="hatch"></i>חופשה או מחלה</span>
  <span>הקו הכחול = השעה הנוכחית (מופיע בין ${ltr('06:00')} ל-${ltr('22:00')}).</span>
</p>`,
  js: `
/* הקו הנוכחי זז לחריץ של השעה עכשיו; מחוץ ל-06:00–22:00 הוא נעלם */
(function(){
 const n=document.getElementById('nowl'), d=new Date(), h=d.getHours()+d.getMinutes()/60;
 if(h<${H0}||h>=${H1}){n.hidden=true;return;}
 n.style.gridColumn=String(Math.round((h-${H0})*2)+2);
})();
`,
};
