/* בית — מוזאיקת-בנטו. אריחים בגדלים שונים, כל אחד עם מדידה חיה משלו.
   המבנה הייחודי: אין סרגל, אין טבלה, אין מדפים — רשת של 12 עמודות ואריחים שנפרשים עליה. */
import { navDrawer, money, ltr } from '../base.mjs';

const PULSE = [
  ['06:20', 'שחרית · מניין א׳', 'ok'],
  ['08:00', 'סדר א׳ · 4 שיעורים', 'ok'],
  ['13:45', 'מנחה גדולה', 'now'],
  ['16:10', 'הסעות · 6 קווים יוצאים', 'next'],
  ['20:30', 'סדר ערב · מבחן שבועי כיתה ז׳', 'next'],
];

const SPARK = [31, 28, 44, 39, 52, 48, 61, 58, 73, 69, 84, 92];

export default {
  id: 'bait',
  name: 'בית',
  title: 'בית — מוסד',
  desc: 'דף הפתיחה של המוסד: אריח לכל אגף עם המדידה החיה שלו.',
  fonts: ['Suez+One'],
  css: `
.wrap{max-width:1240px;margin-inline:auto;padding:var(--s4) var(--s4) var(--s7)}
.top{display:flex;align-items:center;gap:var(--s4);flex-wrap:wrap;margin-bottom:var(--s5)}
.mark{font:400 26px/1 'Suez One',Heebo,serif;letter-spacing:-.5px}
.top .when{font-size:13.5px;color:var(--mut);flex:1;min-width:140px}
.top .when b{color:var(--ink);font-weight:600}

.bento{display:grid;grid-template-columns:repeat(12,1fr);gap:var(--s3)}
.tile{grid-column:span 3;background:var(--card);border:1px solid var(--hair);border-radius:var(--r);
 padding:var(--s4);text-decoration:none;color:inherit;display:flex;flex-direction:column;gap:var(--s2);min-height:132px}
.tile:hover{border-color:var(--acc)}
.tile .cap{font-size:12.5px;color:var(--mut);display:flex;align-items:center;gap:6px}
.tile .big{font:800 30px/1 Heebo;font-variant-numeric:tabular-nums}
.tile .sub{font-size:12.5px;color:var(--mut);margin-top:auto}
.w6{grid-column:span 6}.w4{grid-column:span 4}.w5{grid-column:span 5}.w8{grid-column:span 8}
.h2x{min-height:288px}

/* אריח-הדופק: ציר-יום אנכי */
.pulse{gap:var(--s3)}
.pulse h2{font-size:17px}
.pulse ol{display:grid;gap:2px;margin-top:var(--s1)}
.pulse li{display:grid;grid-template-columns:52px 12px minmax(0,1fr);align-items:center;gap:var(--s3);
 padding:9px 0;border-block-end:1px solid var(--hair);font-size:14px}
.pulse li:last-child{border-block-end:0}
.pulse time{font-size:13px;color:var(--mut);font-variant-numeric:tabular-nums}
.dot{width:10px;height:10px;border-radius:50%;background:var(--raise)}
.pulse .now .dot{background:var(--acc);box-shadow:0 0 0 4px var(--acc-soft)}
.pulse .now{font-weight:700}
.pulse .ok .dot{background:var(--ok)}
.pulse .now time{color:var(--acc);font-weight:700}

.ring{display:grid;place-items:center;position:relative}
.ring .mid{position:absolute;text-align:center}
.ring .mid b{font:800 22px Heebo;font-variant-numeric:tabular-nums;display:block}
.ring .mid span{font-size:11.5px;color:var(--mut)}

.bars{display:flex;align-items:flex-end;gap:3px;height:56px;margin-top:auto}
.bars i{flex:1;background:var(--acc-soft);border-radius:3px 3px 0 0;position:relative}
.bars i.low{background:var(--err-soft)}
.bars i b{position:absolute;inset-inline:0;bottom:calc(100% + 3px);text-align:center;font:700 9.5px Heebo;color:var(--mut)}

.faces{display:flex;margin-top:auto}
.faces span{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;font:700 11px Heebo;
 border:2px solid var(--card);margin-inline-start:-8px}
.faces span:first-child{margin-inline-start:0}

.alerts{gap:0}
.alerts li{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:var(--s3);align-items:center;
 padding:10px 0;border-block-end:1px solid var(--hair);font-size:13.5px}
.alerts li:last-child{border-block-end:0}
.alerts .sev{width:8px;height:8px;border-radius:50%}
.alerts .s1{background:var(--err)}.alerts .s2{background:var(--warn)}.alerts .s3{background:var(--faint)}
.alerts a{color:var(--acc);font-size:12.5px;text-decoration:none;white-space:nowrap}
.alerts a:hover{text-decoration:underline}

.grid12{display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:var(--s2)}
.grid12 a{display:flex;flex-direction:column;gap:2px;padding:11px var(--s3);border-radius:var(--rs);
 background:var(--sunk);text-decoration:none;color:inherit;font-size:13.5px;font-weight:600}
.grid12 a:hover{background:var(--acc-soft);color:var(--acc)}
.grid12 a span{font-size:11.5px;font-weight:400;color:var(--mut)}
.grid12 a:hover span{color:inherit}

footer.foot{margin-top:var(--s6);font-size:12.5px;color:var(--mut);display:flex;gap:var(--s3);flex-wrap:wrap}

@media(max-width:1000px){.tile{grid-column:span 6}.w8,.w6,.w5,.w4{grid-column:span 6}}
@media(max-width:620px){.tile,.w8,.w6,.w5,.w4{grid-column:1/-1}.h2x{min-height:0}}
@media print{.bento{display:block}.tile{break-inside:avoid;margin-bottom:8px}}
`,
  body: `
<div class="wrap">
<header class="top">
  <h1 class="mark">מוסד</h1>
  <p class="when"><b>ד׳ תשרי תשפ״ז</b> · יום שלישי · נתוני דוגמה</p>
  ${navDrawer('bait')}
</header>

<main id="main" class="bento">

  <a class="tile w5 h2x pulse" href="medrash.html">
    <h2>עכשיו במוסד</h2>
    <ol>${PULSE.map(([t, txt, st]) => `<li class="${st}"><time>${ltr(t)}</time><span class="dot" aria-hidden="true"></span><span>${txt}</span></li>`).join('')}</ol>
    <p class="sub">הלוח המלא בבית המדרש ←</p>
  </a>

  <a class="tile w4" href="gviya.html">
    <span class="cap">גבייה · שכר לימוד</span>
    <div class="ring">
      <svg width="104" height="104" viewBox="0 0 104 104" role="img" aria-label="נגבו 68 אחוז מהיעד השנתי">
        <circle cx="52" cy="52" r="44" fill="none" stroke="var(--sunk)" stroke-width="12"></circle>
        <circle cx="52" cy="52" r="44" fill="none" stroke="var(--c2)" stroke-width="12" stroke-linecap="round"
                stroke-dasharray="188 277" transform="rotate(-90 52 52)"></circle>
      </svg>
      <span class="mid"><b>68%</b><span>מהיעד</span></span>
    </div>
    <p class="sub">${money(482300)} נגבו · ${money(226900)} פתוחים</p>
  </a>

  <a class="tile w3" href="tzevet.html">
    <span class="cap">צוות · נוכחות היום</span>
    <div class="big">41<span style="font-size:17px;color:var(--mut)">/44</span></div>
    <div class="faces" aria-hidden="true">
      <span style="background:var(--c1-soft);color:var(--c1)">אב</span>
      <span style="background:var(--c3-soft);color:var(--c3)">שט</span>
      <span style="background:var(--c4-soft);color:var(--c4)">מל</span>
      <span style="background:var(--c2-soft);color:var(--c2)">+38</span>
    </div>
    <p class="sub">3 חסרים · 2 מחליפים שובצו</p>
  </a>

  <a class="tile w4" href="trumot.html">
    <span class="cap">תרומות · 12 חודשים</span>
    <svg viewBox="0 0 220 64" width="100%" height="64" preserveAspectRatio="none" role="img"
         aria-label="תרומות עלו מ-31 אלף לחודש ל-92 אלף בשנה האחרונה">
      <polyline fill="none" stroke="var(--c5)" stroke-width="2.5" stroke-linejoin="round" points="${SPARK.map((v, i) => (i * 20) + ',' + (62 - v * 0.6)).join(' ')}"></polyline>
      <circle cx="220" cy="${62 - 92 * 0.6}" r="3.5" fill="var(--c5)"></circle>
    </svg>
    <p class="sub">החודש ${money(92000)} · פי 3 מאלול אשתקד</p>
  </a>

  <a class="tile w5" href="hinuch.html">
    <span class="cap">חינוך · נוכחות לפי כיתה</span>
    <div class="bars" role="img" aria-label="נוכחות: ג 96, ד 94, ה 91, ו 88, ז 71, ח 93 אחוז">
      ${[96, 94, 91, 88, 71, 93].map((v, i) => `<i class="${v < 80 ? 'low' : ''}" style="height:${v}%"><b>${v}</b></i>`).join('')}
    </div>
    <p class="sub">כיתה ז׳ — 71% · שלישי ברציפות</p>
  </a>

  <div class="tile w3">
    <span class="cap">חסד · גמ״ח הלוואות</span>
    <div class="big">${money(38520)}</div>
    <p class="sub">8 בקשות ממתינות לוועדה</p>
  </div>

  <div class="tile w4 alerts">
    <h2 style="font-size:15px">דורש הכרעה</h2>
    <ul>
      <li><span class="sev s1" aria-hidden="true"></span><span>ביטוח האולם פג בעוד 6 ימים</span><a href="ksafim.html">כספים</a></li>
      <li><span class="sev s2" aria-hidden="true"></span><span>37 משפחות בפיגור מעל חודשיים</span><a href="gviya.html">גבייה</a></li>
      <li><span class="sev s2" aria-hidden="true"></span><span>קו הסעה 4 בלי נהג למחר</span><a href="tifol.html">תפעול</a></li>
      <li><span class="sev s3" aria-hidden="true"></span><span>12 קוויטלך לא נענו</span><a href="hatzer.html">החצר</a></li>
    </ul>
  </div>

  <div class="tile w8">
    <span class="cap">כל האגפים</span>
    <div class="grid12">
      <a href="anashim.html">אנשים<span>1,904 רשומות</span></a>
      <a href="hinuch.html">חינוך<span>412 תלמידים</span></a>
      <a href="tzevet.html">צוות<span>44 עובדים</span></a>
      <a href="gviya.html">גבייה<span>68% מהיעד</span></a>
      <a href="trumot.html">תרומות<span>3 מגביות</span></a>
      <a href="ksafim.html">כספים<span>תקציב תשפ״ז</span></a>
      <a href="medrash.html">בית המדרש<span>9 מניינים</span></a>
      <a href="hatzer.html">החצר<span>14 בתור</span></a>
      <a href="hesed.html">חסד<span>26 הלוואות</span></a>
      <a href="tifol.html">תפעול<span>6 קווים</span></a>
      <a href="shiduch.html">שידוכים<span>31 הצעות</span></a>
      <a href="tikshor.html">תקשורת<span>עלון ג׳</span></a>
    </div>
  </div>

</main>

<footer class="foot">
  <span>המסך הזה הוא מוזאיקה — אף מסך אחר באתר לא בנוי ככה.</span>
  <span>·</span><span>כל מספר כאן הוא נתון דוגמה.</span>
</footer>
</div>`,
};
