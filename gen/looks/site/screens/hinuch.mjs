/* חינוך — מערכת-שעות אמיתית. רשת ימים×שעות, שיעורים שנפרשים על משבצות, וקו «עכשיו».
   המבנה הייחודי: לוח-זמנים דו-ממדי. אין רשימה, אין כרטיסים, אין פאנל-צד. */
import { navDrawer } from '../base.mjs';

const SLOTS = [
  ['08:00', '08:45'], ['08:50', '09:35'], ['09:40', '10:25'],
  ['10:25', '10:45'], ['10:45', '11:30'], ['11:35', '12:20'],
  ['12:20', '13:45'], ['13:45', '14:30'], ['14:35', '15:20'],
];
const DAYS = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳'];

/* [שורה, פריסה, מקצוע, מלמד, צבע] — שורה 1 = 08:00 */
const WEEK = {
  'ז׳': [
    [[1, 2, 'גמרא · בבא מציעא', 'ר׳ א. ויס', 1], [3, 1, 'חומש ורש״י', 'ר׳ ד. לוי', 3], [4, 1, 'הפסקה', '', 0], [5, 1, 'הלכה', 'ר׳ י. פריד', 2], [6, 1, 'חשבון', 'מר ג. שפירא', 6], [7, 1, 'מנחה וסעודה', '', 0], [8, 2, 'סדר עיון', 'ר׳ א. ויס', 1]],
    [[1, 2, 'גמרא · בבא מציעא', 'ר׳ א. ויס', 1], [3, 1, 'משנה ברורה', 'ר׳ י. פריד', 2], [4, 1, 'הפסקה', '', 0], [5, 2, 'לשון וכתיבה', 'מר ג. שפירא', 6], [7, 1, 'מנחה וסעודה', '', 0], [8, 1, 'מוסר', 'ר׳ מ. פרידמן', 4], [9, 1, 'סדר חברותא', '', 1]],
    [[1, 2, 'גמרא · בבא מציעא', 'ר׳ א. ויס', 1], [3, 1, 'חומש ורש״י', 'ר׳ ד. לוי', 3], [4, 1, 'הפסקה', '', 0], [5, 1, 'מבחן שבועי', 'ר׳ א. ויס', 5], [6, 1, 'חשבון', 'מר ג. שפירא', 6], [7, 1, 'מנחה וסעודה', '', 0], [8, 2, 'סדר עיון', 'ר׳ א. ויס', 1]],
    [[1, 2, 'גמרא · בבא מציעא', 'ר׳ א. ויס', 1], [3, 1, 'הלכה', 'ר׳ י. פריד', 2], [4, 1, 'הפסקה', '', 0], [5, 1, 'נביא', 'ר׳ ד. לוי', 3], [6, 1, 'מדעים', 'מר ג. שפירא', 6], [7, 1, 'מנחה וסעודה', '', 0], [8, 2, 'סדר עיון', 'ר׳ א. ויס', 1]],
    [[1, 2, 'גמרא · בבא מציעא', 'ר׳ א. ויס', 1], [3, 1, 'חומש ורש״י', 'ר׳ ד. לוי', 3], [4, 1, 'הפסקה', '', 0], [5, 2, 'חזרה כללית', 'ר׳ א. ויס', 1], [7, 1, 'מנחה וסעודה', '', 0], [8, 1, 'שיחה', 'ר׳ מ. פרידמן', 4]],
    [[1, 2, 'פרשת השבוע', 'ר׳ ד. לוי', 3], [3, 1, 'הכנה לשבת', 'ר׳ מ. פרידמן', 4], [4, 1, 'הפסקה', '', 0], [5, 1, 'סיום שבועי', '', 2]],
  ],
};
const ATT = [['אברמסון י.', 1, 1, 1, 1, 1], ['בלוי ש.', 1, 1, 0, 1, 1], ['גולדשטיין מ.', 1, 1, 1, 1, 1],
['דויטש א.', 0, 0, 1, 1, 1], ['הירש נ.', 1, 1, 1, 0, 1], ['וקסלר ד.', 1, 1, 1, 1, 1],
['זילבר ח.', 1, 0, 1, 1, 0], ['חשין ב.', 1, 1, 1, 1, 1], ['טננבוים ע.', 1, 1, 1, 1, 1],
['יעקובוביץ ש.', 0, 1, 1, 1, 1], ['כהנא ר.', 1, 1, 1, 1, 1], ['לנדאו פ.', 1, 1, 1, 1, 1]];

export default {
  id: 'hinuch',
  name: 'חינוך',
  title: 'חינוך — מוסד',
  desc: 'מערכת השעות של הכיתה, עם קו הזמן הנוכחי ומפת נוכחות שבועית.',
  css: `
.bar{display:flex;gap:var(--s3);align-items:center;flex-wrap:wrap;padding:var(--s3) var(--s4);
 border-block-end:1px solid var(--hair);background:var(--card);position:sticky;top:0;z-index:30}
.bar h1{font-size:19px;white-space:nowrap}
.seg{display:flex;gap:2px;background:var(--sunk);border-radius:999px;padding:3px}
.seg button{border:0;background:none;border-radius:999px;padding:6px 13px;font-size:13.5px;color:var(--mut);min-height:34px}
.seg button[aria-pressed=true]{background:var(--card);color:var(--ink);font-weight:700;box-shadow:0 1px 2px var(--hair)}
.bar .sp{flex:1}
.wk{display:flex;align-items:center;gap:var(--s2);font-size:13px;color:var(--mut)}
.wk button{border:1px solid var(--hair);background:var(--card);border-radius:8px;width:32px;height:32px;line-height:1}

main{padding:var(--s4);max-width:1240px;margin-inline:auto}

.tt{display:grid;grid-template-columns:62px repeat(6,minmax(84px,1fr));gap:4px;position:relative;
 overflow-x:auto;padding-bottom:var(--s2)}
.tt .dh{position:sticky;top:57px;background:var(--bg);padding:var(--s2) 0 6px;text-align:center;
 font-size:13px;font-weight:700;z-index:12}
.tt .dh small{display:block;font-weight:400;font-size:11px;color:var(--mut)}
.tt .dh[data-today=y]{color:var(--acc)}
.tt .th{grid-column:1;display:flex;flex-direction:column;justify-content:center;align-items:flex-end;
 padding-inline-end:var(--s2);font:500 11px Heebo;color:var(--mut);font-variant-numeric:tabular-nums;border-block-start:1px solid var(--hair)}
.cell{border-radius:10px;padding:8px 9px;font-size:12.5px;display:flex;flex-direction:column;gap:2px;
 border:1px solid transparent;overflow:hidden}
.cell b{font-size:13px;font-weight:700;line-height:1.25}
.cell span{font-size:11px;color:var(--mut)}
.cell.c0{background:var(--sunk);color:var(--mut);align-items:center;justify-content:center;font-size:11.5px}
.cell.c1{background:var(--c1-soft);color:var(--c1);border-color:var(--c1-soft)}
.cell.c2{background:var(--c2-soft);color:var(--c2);border-color:var(--c2-soft)}
.cell.c3{background:var(--c3-soft);color:var(--c3);border-color:var(--c3-soft)}
.cell.c4{background:var(--c4-soft);color:var(--c4);border-color:var(--c4-soft)}
.cell.c5{background:var(--c5-soft);color:var(--c5);border-color:var(--c5-soft)}
.cell.c6{background:var(--c6-soft);color:var(--c6);border-color:var(--c6-soft)}
.cell span{color:inherit;opacity:.78}
.now{position:absolute;inset-inline:0;height:2px;background:var(--acc);z-index:11;pointer-events:none}
.now::after{content:'עכשיו';position:absolute;inset-inline-end:2px;top:-9px;background:var(--acc);color:var(--on-acc);
 font:700 9.5px Heebo;border-radius:999px;padding:1px 6px}

.legend{display:flex;gap:var(--s3);flex-wrap:wrap;margin-top:var(--s4);font-size:12.5px;color:var(--mut)}
.legend i{display:inline-block;width:10px;height:10px;border-radius:3px;margin-inline-end:5px;vertical-align:-1px}

.att{margin-top:var(--s6)}
.att h2{font-size:17px;margin-bottom:var(--s1)}
.att p.s{font-size:13px;color:var(--mut);margin-bottom:var(--s3)}
table{border-collapse:separate;border-spacing:0;width:100%;font-size:13.5px}
th,td{color:var(--ink);text-align:start;padding:7px var(--s2);border-block-end:1px solid var(--hair);white-space:nowrap}
thead th{position:sticky;top:57px;background:var(--bg);font-size:11.5px;color:var(--mut);font-weight:600;z-index:8}
tbody th{font-weight:600}
td.m{text-align:center;width:52px}
.mk{display:inline-grid;place-items:center;width:22px;height:22px;border-radius:7px;font:800 11px Heebo}
.mk.y{background:var(--ok-soft);color:var(--ok)}
.mk.n{background:var(--err-soft);color:var(--err)}
tfoot td{font-weight:700;border-block-end:0}

@media(max-width:700px){.tt{grid-template-columns:52px repeat(6,minmax(76px,1fr))}.bar h1{font-size:17px}}
@media print{.bar .seg,.wk,.nav{display:none!important}.tt{overflow:visible}.now{display:none}}
`,
  body: `
<header class="bar">
  <h1>חינוך</h1>
  <div class="seg" role="group" aria-label="כיתה">
    ${['ג׳', 'ד׳', 'ה׳', 'ו׳', 'ז׳', 'ח׳'].map(k => `<button aria-pressed="${k === 'ז׳'}">${k}</button>`).join('')}
  </div>
  <span class="sp"></span>
  <div class="wk"><button aria-label="שבוע קודם">›</button><span>שבוע פרשת בראשית · תשפ״ז</span><button aria-label="שבוע הבא">‹</button></div>
  ${navDrawer('hinuch')}
</header>

<main id="main">
  <h2 class="sr">מערכת שעות כיתה ז׳</h2>
  <div class="tt" id="tt">
    <div class="dh" style="grid-column:1"></div>
    ${DAYS.map((d, i) => `<div class="dh" data-today="${i === 2 ? 'y' : 'n'}" style="grid-column:${i + 2}">יום ${d}<small>${i === 2 ? 'היום' : ['ג׳ תשרי', 'ד׳ תשרי', 'ה׳ תשרי', 'ו׳ תשרי', 'ז׳ תשרי', 'ח׳ תשרי'][i]}</small></div>`).join('')}
    ${SLOTS.map((s, r) => `<div class="th" style="grid-row:${r + 2}">${s[0]}<br>${s[1]}</div>`).join('')}
    ${DAYS.map((d, di) => (WEEK['ז׳'][di] || []).map(([r, sp, sub, tea, c]) =>
    `<div class="cell c${c}" style="grid-column:${di + 2};grid-row:${r + 1}/span ${sp}">${c ? `<b>${sub}</b>${tea ? `<span>${tea}</span>` : ''}` : sub}</div>`).join('')).join('')}
    <div class="now" id="nowline" hidden></div>
  </div>

  <p class="legend">
    <span><i style="background:var(--c1)"></i>גמרא וסדר</span>
    <span><i style="background:var(--c2)"></i>הלכה</span>
    <span><i style="background:var(--c3)"></i>חומש ונביא</span>
    <span><i style="background:var(--c4)"></i>מוסר ושיחה</span>
    <span><i style="background:var(--c5)"></i>מבחן</span>
    <span><i style="background:var(--c6)"></i>לימודי חול</span>
  </p>

  <section class="att">
    <h2>נוכחות השבוע · כיתה ז׳</h2>
    <p class="s">12 תלמידים · 5 ימים · כל ריבוע הוא יום לימודים אחד.</p>
    <div style="overflow-x:auto">
    <table>
      <caption class="sr">נוכחות תלמידי כיתה ז׳ בימים א׳ עד ה׳</caption>
      <thead><tr><th scope="col">תלמיד</th>${DAYS.slice(0, 5).map(d => `<th scope="col" class="m">${d}</th>`).join('')}<th scope="col" class="m">%</th></tr></thead>
      <tbody>
        ${ATT.map(row => {
      const days = row.slice(1);
      const pct = Math.round(days.reduce((a, b) => a + b, 0) / days.length * 100);
      return `<tr><th scope="row">${row[0]}</th>${days.map(v => `<td class="m"><span class="mk ${v ? 'y' : 'n'}">${v ? '✓' : '✗'}</span></td>`).join('')}<td class="m num">${pct}%</td></tr>`;
    }).join('')}
      </tbody>
      <tfoot><tr><td>סך הכל</td>${[10, 10, 11, 11, 11].map(v => `<td class="m num">${v}/12</td>`).join('')}<td class="m num">89%</td></tr></tfoot>
    </table>
    </div>
  </section>
</main>`,
  js: `
/* קו «עכשיו» — נמתח על השורה שבה נמצאת השעה, ורק אם היום הוא יום לימודים */
(function(){
 const SLOTS=${JSON.stringify(SLOTS)};
 const tt=document.getElementById('tt'), line=document.getElementById('nowline');
 const mins=s=>+s.slice(0,2)*60+ +s.slice(3);
 function place(){
  const d=new Date(), now=d.getHours()*60+d.getMinutes();
  let i=SLOTS.findIndex(s=>now>=mins(s[0])&&now<mins(s[1]));
  if(i<0){line.hidden=true;return;}
  const th=tt.querySelectorAll('.th')[i]; if(!th){line.hidden=true;return;}
  const r=th.getBoundingClientRect(), t=tt.getBoundingClientRect();
  const f=(now-mins(SLOTS[i][0]))/(mins(SLOTS[i][1])-mins(SLOTS[i][0]));
  line.style.top=Math.round(r.top-t.top+tt.scrollTop+r.height*f)+'px';
  line.hidden=false;
 }
 place(); addEventListener('resize',place); setInterval(place,60000);
})();
document.querySelectorAll('.seg button').forEach(b=>b.onclick=()=>{
 document.querySelectorAll('.seg button').forEach(x=>x.setAttribute('aria-pressed','false'));
 b.setAttribute('aria-pressed','true');
});
`,
};
