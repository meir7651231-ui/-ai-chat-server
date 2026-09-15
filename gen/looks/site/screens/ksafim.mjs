/* כספים — דוח מודפס. גיליון-נייר ממורכז על שולחן אפור, גופן-ספר, סעיפים ממוספרים,
   טבלה עם עמודת-ניצול מצוירת, תרשים לפי חודשים עבריים, ושורות-חתימה.
   המבנה הייחודי: מסמך. לא ממשק — משהו שמדפיסים ומגישים לוועד. */
import { navDrawer, money, ltr } from '../base.mjs';

const MONTHS = ['תשרי', 'חשון', 'כסלו', 'טבת', 'שבט', 'אדר', 'ניסן', 'אייר', 'סיון', 'תמוז', 'אב', 'אלול'];
const PLAN = [179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179, 179];
const REAL = [164, 188, 201, 176, 169, 233, 212, 158, 171, 149, 192, 0];

/* [סעיף, תקציב, בפועל] — אלפי ₪ */
const LINES = [
  ['שכר מלמדים וצוות חינוכי', 1180, 1094],
  ['מטבח וסעודות', 312, 341],
  ['הסעות', 196, 188],
  ['אחזקת מבנה וחשמל', 168, 203],
  ['ספרים וציוד לימודי', 84, 71],
  ['פנימייה', 126, 118],
  ['משרד, ביטוח ורואה חשבון', 64, 59],
  ['בית המדרש ואירועים', 20, 39],
];

export default {
  id: 'ksafim',
  name: 'כספים',
  title: 'כספים — מוסד',
  desc: 'דוח תקציב מול ביצוע לשנת תשפ״ו, ערוך להדפסה ולהגשה לוועד.',
  fonts: ['Frank+Ruhl+Libre:wght@500;700'],
  css: `
body{background:var(--raise)}
.deskbar{max-width:860px;margin-inline:auto;padding:var(--s3) var(--s4);display:flex;align-items:center;gap:var(--s3)}
.deskbar .sp{flex:1}
.deskbar button{border:1px solid var(--hair);background:var(--card);border-radius:var(--rs);padding:8px 13px;font-size:13px;min-height:38px}

.sheet{max-width:860px;margin:0 auto var(--s7);background:var(--card);border:1px solid var(--hair);
 padding:var(--s7) clamp(20px,5vw,56px);box-shadow:0 8px 28px rgba(0,0,0,.09);
 font-family:'Frank Ruhl Libre',Heebo,serif}
.mast{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--s4);
 border-block-end:2px solid var(--ink);padding-block-end:var(--s3);flex-wrap:wrap}
.mast h1{font:700 26px 'Frank Ruhl Libre',Heebo,serif;line-height:1.2}
.mast .who{font-size:12.5px;color:var(--mut);line-height:1.7;text-align:end;font-family:Heebo,sans-serif}
.stamp{display:inline-block;border:1px solid var(--c3);color:var(--c3);border-radius:6px;
 padding:2px 9px;font:700 11px Heebo;letter-spacing:.04em}

h2.num{font:700 16px 'Frank Ruhl Libre',Heebo,serif;margin:var(--s6) 0 var(--s2);
 display:flex;align-items:baseline;gap:var(--s2)}
h2.num i{font-style:normal;font:700 12px Heebo;color:var(--mut);border:1px solid var(--hair);
 border-radius:5px;padding:1px 7px}
p.body{font-size:14.5px;line-height:1.75;max-width:60ch}

table{width:100%;border-collapse:separate;border-spacing:0;font-family:Heebo,sans-serif;font-size:13.5px;margin-top:var(--s3)}
caption{text-align:start;font-size:12.5px;color:var(--mut);padding-bottom:var(--s2)}
th,td{color:var(--ink);text-align:start;padding:8px 10px;border-block-end:1px solid var(--hair)}
thead th{font-size:11.5px;color:var(--mut);font-weight:600;border-block-end:1px solid var(--ink)}
td.n,th.n{text-align:end;font-variant-numeric:tabular-nums;white-space:nowrap}
td.use{width:132px}
.usebar{height:8px;border-radius:999px;background:var(--sunk);position:relative;overflow:hidden}
.usebar i{position:absolute;inset-block:0;inset-inline-start:0;background:var(--c2);border-radius:999px}
.usebar i.over{background:var(--err)}
.usetxt{font-size:11px;color:var(--mut);margin-top:3px;font-variant-numeric:tabular-nums}
tfoot td{font-weight:700;border-block-start:1px solid var(--ink);border-block-end:0;padding-top:10px}
.over{color:var(--err)}

figure{margin:var(--s4) 0 0}
figure svg{width:100%;height:auto;display:block}
figcaption{font-family:Heebo,sans-serif;font-size:12px;color:var(--mut);margin-top:var(--s2)}
.chart text{font:400 9.5px Heebo;fill:var(--mut)}
.chart .gl{stroke:var(--hair);stroke-width:1}
.chart .axis{stroke:var(--ink);stroke-width:1}
.key{display:flex;gap:var(--s4);font-family:Heebo,sans-serif;font-size:12px;color:var(--mut);margin-top:var(--s2)}
.key i{display:inline-block;width:12px;height:10px;border-radius:2px;margin-inline-end:5px}

.sign{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:var(--s5);
 margin-top:var(--s7);padding-block-start:var(--s5);border-block-start:1px solid var(--hair)}
.sign div{font-family:Heebo,sans-serif;font-size:12.5px;color:var(--mut)}
.sign b{display:block;border-block-end:1px solid var(--ink);height:36px;margin-bottom:6px}
.foot{font-family:Heebo,sans-serif;font-size:11.5px;color:var(--mut);margin-top:var(--s5);text-align:center}

@media print{
 body{background:#fff}.deskbar{display:none!important}
 .sheet{box-shadow:none;border:0;max-width:none;padding:0;margin:0}
 h2.num{break-after:avoid}table{break-inside:auto}tr{break-inside:avoid}
}
`,
  body: `
<div class="deskbar">
  <span style="font-size:13px;color:var(--mut)">גיליון להדפסה · נתוני דוגמה</span>
  <span class="sp"></span>
  <button onclick="window.print()">הדפסה</button>
  ${navDrawer('ksafim')}
</div>

<main id="main" class="sheet">
  <header class="mast">
    <div>
      <h1>דוח תקציב מול ביצוע</h1>
      <p style="font-family:Heebo,sans-serif;font-size:13px;color:var(--mut);margin-top:4px">
        שנת הלימודים תשפ״ו · נכון ל-ד׳ תשרי תשפ״ז · <span class="stamp">טיוטה לוועד</span></p>
    </div>
    <p class="who">עמותת המוסד (ע״ר)<br>מספר עמותה ${ltr('58-0000000')}<br>מגיש: בנימין שטרן, גזבר</p>
  </header>

  <h2 class="num"><i>1</i>תמצית</h2>
  <p class="body">התקציב המאושר לשנת תשפ״ו עמד על ${money(2150000)}. הביצוע בפועל, אחד-עשר חודשים,
     עומד על ${money(2113000)} — ${Math.round(2113 / 2150 * 100)}% מהתקציב. שני סעיפים חרגו:
     אחזקת מבנה וחשמל (${money(203000)} מול ${money(168000)}) ובית המדרש ואירועים, שניהם בעקבות
     עבודות האולם. סעיף הספרים נוצל בחסר ומוצע להעביר ממנו ${money(13000)} לאחזקה.</p>

  <h2 class="num"><i>2</i>ביצוע לפי סעיף</h2>
  <table>
    <caption>באלפי ₪ · עמודת הניצול מציירת את היחס בין הביצוע לתקציב</caption>
    <thead><tr><th scope="col">סעיף</th><th scope="col" class="n">תקציב</th><th scope="col" class="n">בפועל</th>
      <th scope="col" class="n">יתרה</th><th scope="col" class="use">ניצול</th></tr></thead>
    <tbody>
      ${LINES.map(([n, b, a]) => {
    const pct = Math.round(a / b * 100), over = a > b;
    return `<tr><th scope="row" style="font-weight:400">${n}</th>
        <td class="n">${b.toLocaleString('he-IL')}</td>
        <td class="n${over ? ' over' : ''}">${a.toLocaleString('he-IL')}</td>
        <td class="n${over ? ' over' : ''}">${(b - a).toLocaleString('he-IL')}</td>
        <td class="use"><div class="usebar"><i class="${over ? 'over' : ''}" style="width:${Math.min(100, pct)}%"></i></div>
          <div class="usetxt">${pct}%</div></td></tr>`;
  }).join('')}
    </tbody>
    <tfoot><tr><td>סך הכל</td><td class="n">2,150</td><td class="n">2,113</td><td class="n">37</td><td class="use">98%</td></tr></tfoot>
  </table>

  <h2 class="num"><i>3</i>הוצאה חודשית מול התכנון</h2>
  <figure>
    <svg viewBox="0 0 640 220" class="chart" role="img"
         aria-label="הוצאה חודשית: התכנון 179 אלף בכל חודש; הביצוע נע בין 149 אלף בתמוז ל-233 אלף באדר; אלול טרם נסגר">
      ${[0, 60, 120, 180, 240].map(v => `<g><line class="gl" x1="42" y1="${180 - v / 240 * 150}" x2="632" y2="${180 - v / 240 * 150}"></line>
         <text x="36" y="${180 - v / 240 * 150 + 3}" text-anchor="end">${v}</text></g>`).join('')}
      <line class="axis" x1="42" y1="180" x2="632" y2="180"></line>
      ${MONTHS.map((m, i) => {
    const x = 632 - 12 - i * 49;
    const hp = PLAN[i] / 240 * 150, hr = REAL[i] / 240 * 150;
    return `<rect x="${x - 34}" y="${180 - hp}" width="16" height="${hp}" fill="var(--sunk)" rx="2"></rect>
        ${REAL[i] ? `<rect x="${x - 17}" y="${180 - hr}" width="16" height="${hr}" fill="var(--c${REAL[i] > PLAN[i] ? 5 : 2})" rx="2"></rect>` : ''}
        <text x="${x - 18}" y="196" text-anchor="middle">${m}</text>`;
  }).join('')}
      <text x="636" y="24" text-anchor="end" style="font-size:10px">אלפי ₪</text>
    </svg>
    <figcaption>אדר וניסן נושאים את עבודות האולם; אלול טרם נסגר ולכן אין לו עמודת ביצוע.</figcaption>
  </figure>
  <p class="key"><span><i style="background:var(--sunk)"></i>תכנון</span>
     <span><i style="background:var(--c2)"></i>ביצוע בתוך התכנון</span>
     <span><i style="background:var(--c5)"></i>ביצוע מעל התכנון</span></p>

  <h2 class="num"><i>4</i>להכרעת הוועד</h2>
  <p class="body">א. העברה תקציבית של ${money(13000)} מסעיף הספרים לאחזקה.
     ב. חידוש ביטוח האולם — פג בעוד שישה ימים; שלוש הצעות מצורפות.
     ג. אישור מסגרת ${money(240000)} לשנת תשפ״ז לסעיף בית המדרש, לאחר החריגה השנה.</p>

  <div class="sign">
    <div><b></b>בנימין שטרן · גזבר</div>
    <div><b></b>יוסף מלר · מנהל</div>
    <div><b></b>יו״ר הוועד</div>
  </div>
  <p class="foot">הדוח הופק מהמערכת · כל הסכומים באלפי ₪ אלא אם צוין אחרת · עמוד 1 מתוך 1</p>
</main>`,
};
