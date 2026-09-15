/* שידוכים — מסך-השוואה. שני צדדים זה מול זה, ובאמצע רק מה שבאמת נבדק.
   המבנה הייחודי: עימות של שתי עמודות סביב ציר. גם הרגישות מטופלת: פרטים נפתחים בלחיצה, לא מוצגים מאליהם. */
import { navDrawer, ltr } from '../base.mjs';

const SIDE_A = { n: 'ב.', fam: 'משפחת ויס', age: 21, city: 'בית שמש', learn: 'ישיבת המוסד · שיעור ג׳', father: 'ר׳ אליהו ויס · מגיד שיעור', note: 'מתמיד, מבוקש בחברותא' };
const SIDE_B = { n: 'ר.', fam: 'משפחת אדלר', age: 19, city: 'מודיעין עילית', learn: 'סמינר · שנה ב׳', father: 'ר׳ גרשון אדלר · נהג קו 4', note: 'מלמדת בגן, מבקשת בעל לומד' };

/* [קריטריון, צד א׳, צד ב׳, התאמה] */
const MATCH = [
  ['חוג', 'חסידי · אותה חצר', 'חסידי · אותה חצר', 'yes'],
  ['לימוד אחרי החתונה', 'כולל 5 שנים', 'מבקשת לומד', 'yes'],
  ['מגורים', 'ירושלים או בית שמש', 'מודיעין עילית או ירושלים', 'part'],
  ['גיל', '21', '19', 'yes'],
  ['השכלה', 'ישיבה', 'סמינר + הוראה', 'yes'],
  ['תמיכת ההורים', 'דירה בחלקים', 'דירה בחלקים', 'yes'],
  ['בריאות', 'נבדק', 'נבדק', 'yes'],
  ['מכרים משותפים', 'ר׳ נ. הורוביץ', 'ר׳ נ. הורוביץ', 'yes'],
];

const PIPE = [
  ['הצעה נבדקת', 4], ['בירורים', 7], ['הוצע לצדדים', 5],
  ['פגישה ראשונה', 3], ['ממתין לתשובה', 6], ['נסגר בשמחה', 6],
];

export default {
  id: 'shiduch',
  name: 'שידוכים',
  title: 'שידוכים — מוסד',
  desc: 'כרטיס ההצעה: שני צדדים זה מול זה, עם מה שנבדק ומה שעוד פתוח.',
  css: `
.hd{display:flex;align-items:center;gap:var(--s3);flex-wrap:wrap;padding:var(--s4);max-width:1000px;margin-inline:auto}
.hd h1{font-size:20px}.hd .sp{flex:1}
.lock{font-size:12px;color:var(--mut);border:1px solid var(--hair);border-radius:999px;padding:4px 11px}
main{max-width:1000px;margin-inline:auto;padding:0 var(--s4) var(--s7)}

.duel{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);gap:var(--s3);align-items:stretch}
.side{background:var(--card);border:1px solid var(--hair);border-radius:var(--r);padding:var(--s4)}
.side .ini{width:54px;height:54px;border-radius:50%;display:grid;place-items:center;font:700 20px Heebo;margin-bottom:var(--s3)}
.side.a .ini{background:var(--c1-soft);color:var(--c1)}
.side.b .ini{background:var(--c4-soft);color:var(--c4)}
.side h2{font-size:17px}
.side .fam{font-size:13px;color:var(--mut);margin-bottom:var(--s3)}
.side dl{display:grid;gap:5px;font-size:13.5px}
.side dl div{display:flex;justify-content:space-between;gap:var(--s3)}
.side dt{color:var(--mut)}.side dd{margin:0;text-align:end}
.side .note{margin-top:var(--s3);padding-top:var(--s3);border-block-start:1px solid var(--hair);font-size:13px;color:var(--mut)}

.axis{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--s2);padding:0 var(--s1)}
.axis .ring{width:74px;height:74px;display:grid;place-items:center;position:relative}
.axis .ring b{position:absolute;font:800 18px Heebo}
.axis .lbl{font-size:11.5px;color:var(--mut);text-align:center;max-width:90px}
.axis .line{flex:1;width:2px;background:var(--hair);min-height:20px}

.crit{margin-top:var(--s5);background:var(--card);border:1px solid var(--hair);border-radius:var(--r);overflow:hidden}
.crit h2{font-size:15px;padding:var(--s3) var(--s4);border-block-end:1px solid var(--hair)}
.crit .row{display:grid;grid-template-columns:minmax(0,1fr) 34px minmax(0,1fr);gap:var(--s3);align-items:center;
 padding:11px var(--s4);border-block-end:1px solid var(--hair);font-size:13.5px}
.crit .row:last-child{border-block-end:0}
.crit .k{font-size:11.5px;color:var(--mut);grid-column:1/-1;margin-bottom:-6px}
.crit .m{display:grid;place-items:center;width:26px;height:26px;border-radius:50%;font:800 12px Heebo;justify-self:center}
.crit .yes{background:var(--ok-soft);color:var(--ok)}
.crit .part{background:var(--warn-soft);color:var(--warn)}
.crit .b{text-align:end}

.private{margin-top:var(--s5)}
.private summary{cursor:pointer;font-size:13.5px;color:var(--acc);list-style:none;display:inline-flex;gap:6px;align-items:center;min-height:40px}
.private summary::before{content:'🔒'}
.private .box{background:var(--sunk);border-radius:12px;padding:var(--s4);margin-top:var(--s2);font-size:13.5px;line-height:1.7}

.acts{display:flex;gap:var(--s2);flex-wrap:wrap;margin-top:var(--s5)}
.acts button{border:1px solid var(--hair);background:var(--card);border-radius:var(--rs);padding:10px 16px;font-size:14px;min-height:44px}
.acts button.pri{background:var(--acc);border-color:var(--acc);color:var(--on-acc);font-weight:600}

.pipe{margin-top:var(--s7)}
.pipe h2{font-size:16px;margin-bottom:var(--s3)}
.pipe ol{display:flex;gap:2px;flex-wrap:wrap}
.pipe li{flex:1 1 118px;background:var(--sunk);border-radius:10px;padding:11px var(--s3)}
.pipe b{display:block;font:800 20px Heebo;font-variant-numeric:tabular-nums}
.pipe span{font-size:12px;color:var(--mut)}
.pipe li:last-child{background:var(--ok-soft)}
.pipe li:last-child b{color:var(--ok)}

@media(max-width:760px){.duel{grid-template-columns:1fr}.axis{flex-direction:row}.axis .line{display:none}}
@media print{.acts,.nav{display:none!important}.private[open] .box{border:1px solid #ccc}}
`,
  body: `
<header class="hd">
  <h1>שידוכים</h1>
  <span class="sp"></span>
  <span class="lock">גישה: רכז השידוכים בלבד · נתוני דוגמה</span>
  ${navDrawer('shiduch')}
</header>

<main id="main">
  <div class="duel">
    <section class="side a">
      <div class="ini">${SIDE_A.n}</div>
      <h2>בחור · ${SIDE_A.n}</h2>
      <p class="fam">${SIDE_A.fam}</p>
      <dl>
        <div><dt>גיל</dt><dd class="num">${SIDE_A.age}</dd></div>
        <div><dt>עיר</dt><dd>${SIDE_A.city}</dd></div>
        <div><dt>לומד ב</dt><dd>${SIDE_A.learn}</dd></div>
        <div><dt>אב</dt><dd>${SIDE_A.father}</dd></div>
      </dl>
      <p class="note">${SIDE_A.note}</p>
    </section>

    <div class="axis">
      <span class="line"></span>
      <div class="ring">
        <svg width="74" height="74" viewBox="0 0 74 74" role="img" aria-label="התאמה 88 אחוז — שבעה קריטריונים מתוך שמונה">
          <circle cx="37" cy="37" r="30" fill="none" stroke="var(--sunk)" stroke-width="7"></circle>
          <circle cx="37" cy="37" r="30" fill="none" stroke="var(--ok)" stroke-width="7" stroke-linecap="round"
                  stroke-dasharray="166 189" transform="rotate(-90 37 37)"></circle>
        </svg>
        <b>88%</b>
      </div>
      <span class="lbl">7 מתוך 8 נקודות נבדקו והתאימו</span>
      <span class="line"></span>
    </div>

    <section class="side b">
      <div class="ini">${SIDE_B.n}</div>
      <h2>בחורה · ${SIDE_B.n}</h2>
      <p class="fam">${SIDE_B.fam}</p>
      <dl>
        <div><dt>גיל</dt><dd class="num">${SIDE_B.age}</dd></div>
        <div><dt>עיר</dt><dd>${SIDE_B.city}</dd></div>
        <div><dt>לומדת ב</dt><dd>${SIDE_B.learn}</dd></div>
        <div><dt>אב</dt><dd>${SIDE_B.father}</dd></div>
      </dl>
      <p class="note">${SIDE_B.note}</p>
    </section>
  </div>

  <section class="crit">
    <h2>מה נבדק</h2>
    ${MATCH.map(([k, a, b, m]) => `<div class="row"><span class="k">${k}</span>
      <span>${a}</span><span class="m ${m}" aria-label="${m === 'yes' ? 'מתאים' : 'חלקית'}">${m === 'yes' ? '✓' : '≈'}</span><span class="b">${b}</span></div>`).join('')}
  </section>

  <details class="private">
    <summary>פרטים סגורים · נפתחים בלחיצה ונרשמים ביומן</summary>
    <div class="box">
      שם מלא, טלפונים ושמות המכרים מוצגים רק לרכז, ורק אחרי פתיחה מפורשת.
      כל פתיחה נרשמת עם שעה ומשתמש. הצעה שנסגרה — הפרטים ננעלים בחזרה תוך 30 יום.
    </div>
  </details>

  <div class="acts">
    <button class="pri">הצעה לצדדים</button>
    <button>העברה לבירורים</button>
    <button>קביעת פגישה</button>
    <button>סגירה · לא מתאים</button>
  </div>

  <section class="pipe">
    <h2>כל ההצעות</h2>
    <ol>
      ${PIPE.map(([n, c]) => `<li><b>${c}</b><span>${n}</span></li>`).join('')}
    </ol>
  </section>
</main>`,
};
