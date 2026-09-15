/* תרומות — עמוד-מגבית. כותרת-ענק בגופן-ספר, מד-חום עם אבני-דרך, קיר-תורמים חי ולוח-שגרירים.
   המבנה הייחודי: עריכתי — עמודה רחבה אחת שמספרת סיפור מלמעלה למטה. */
import { navDrawer, money, ltr } from '../base.mjs';

const GOAL = 2400000, RAISED = 1704000;
const MILES = [[25, 'יסודות'], [50, 'שלד'], [75, 'גג'], [100, 'סיום']];
const WALL = [
  ['משפחת רוט', 'אנטוורפן', 180000, 'לפני 4 דק׳'],
  ['בעילום שם', '', 50000, 'לפני 19 דק׳'],
  ['משפחת ברגר', 'ירושלים', 36000, 'לפני 52 דק׳'],
  ['ר׳ ש. אונגר', 'בני ברק', 25000, 'לפני שעה'],
  ['משפחת גרין', 'לונדון', 18000, 'לפני 3 שעות'],
  ['בעילום שם', '', 10000, 'לפני 4 שעות'],
  ['משפחת כהן', 'ביתר עילית', 5400, 'אתמול'],
  ['ר׳ י. מלר', 'ירושלים', 3600, 'אתמול'],
];
const AMB = [
  ['ר׳ טוביה רוט', 620000, 700000, 41],
  ['ר׳ שלמה אונגר', 388000, 500000, 33],
  ['משפחת ברגר', 214000, 250000, 26],
  ['ר׳ יוסף מלר', 151000, 200000, 19],
  ['ר׳ נפתלי הורוביץ', 96000, 150000, 12],
];

export default {
  id: 'trumot',
  name: 'תרומות',
  title: 'תרומות — מוסד',
  desc: 'עמוד המגבית: מד ההתקדמות, קיר התורמים ולוח השגרירים.',
  fonts: ['Frank+Ruhl+Libre:wght@500;700;900'],
  css: `
.page{max-width:920px;margin-inline:auto;padding:var(--s4) var(--s4) var(--s7)}
.top{display:flex;align-items:center;gap:var(--s3);margin-bottom:var(--s6)}
.top .sp{flex:1}
.eyebrow{font-size:12.5px;letter-spacing:.08em;color:var(--c5);font-weight:700}

h1.hero{font:900 clamp(32px,7vw,56px)/1.05 'Frank Ruhl Libre',Heebo,serif;margin:var(--s2) 0 var(--s3)}
p.lede{font:500 clamp(16px,2.4vw,19px)/1.55 'Frank Ruhl Libre',Heebo,serif;color:var(--mut);max-width:34em}

.meter{margin:var(--s6) 0 var(--s5)}
.meter .nums{display:flex;align-items:baseline;gap:var(--s3);flex-wrap:wrap;margin-bottom:var(--s3)}
.meter .now{font:800 clamp(30px,6vw,44px)/1 Heebo;font-variant-numeric:tabular-nums}
.meter .goal{font-size:15px;color:var(--mut)}
.meter .pct{margin-inline-start:auto;font:800 17px Heebo;color:var(--c5)}
.track{position:relative;height:26px;border-radius:999px;background:var(--sunk);overflow:hidden}
.fill{position:absolute;inset-block:0;inset-inline-start:0;background:var(--c5);border-radius:999px}
.flags{position:relative;height:34px;margin-top:6px}
.flag{position:absolute;transform:translateX(calc(var(--dir) * -50%));text-align:center;font-size:11.5px;color:var(--mut);white-space:nowrap}
.flag b{display:block;font-size:12px;color:var(--ink)}
.flag.done b{color:var(--c5)}

.two{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:var(--s6);margin-top:var(--s7)}
h2.sec{font:700 22px 'Frank Ruhl Libre',Heebo,serif;margin-bottom:var(--s1)}
p.sub{font-size:13px;color:var(--mut);margin-bottom:var(--s3)}

.wall li{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:var(--s2) var(--s3);
 padding:var(--s3) 0;border-block-end:1px solid var(--hair)}
.wall .who{font-weight:600;font-size:15px}
.wall .where{font-size:12.5px;color:var(--mut)}
.wall .amt{font:800 16px Heebo;font-variant-numeric:tabular-nums;text-align:end;align-self:center}
.wall .ago{font-size:11.5px;color:var(--mut);text-align:end}
.wall li:first-child .amt{color:var(--c5)}

.amb li{padding:var(--s3) 0;border-block-end:1px solid var(--hair)}
.amb .r1{display:flex;align-items:baseline;gap:var(--s2)}
.amb .rank{font:800 12px Heebo;color:var(--mut);width:18px}
.amb .nm{font-weight:600;font-size:14.5px;flex:1}
.amb .sum{font:700 13.5px Heebo;font-variant-numeric:tabular-nums}
.amb .t{height:6px;border-radius:999px;background:var(--sunk);margin-top:7px;position:relative;overflow:hidden}
.amb .t i{position:absolute;inset-block:0;inset-inline-start:0;background:var(--c4);border-radius:999px}
.amb .of{font-size:11.5px;color:var(--mut);margin-top:5px;display:flex;justify-content:space-between}

.more{margin-top:var(--s7);border-block-start:1px solid var(--hair);padding-block-start:var(--s4)}
.more ul{display:flex;gap:var(--s5);flex-wrap:wrap;font-size:13.5px}
.more a{color:var(--acc);text-decoration:none}
.more a:hover{text-decoration:underline}
.more span{color:var(--mut);font-size:12.5px;display:block}

.cta{display:flex;gap:var(--s2);flex-wrap:wrap;margin-top:var(--s5)}
.cta button{border-radius:999px;padding:11px 20px;font-size:14.5px;font-weight:600;border:1px solid var(--hair);background:var(--card);min-height:44px}
.cta button.pri{background:var(--c5);border-color:var(--c5);color:var(--on-acc)}

@media(max-width:760px){.two{grid-template-columns:1fr;gap:var(--s6)}}
@media print{.cta,.nav{display:none!important}.two{grid-template-columns:1fr}}
`,
  body: `
<div class="page">
<header class="top">
  <span class="eyebrow">מגבית פעילה</span>
  <span class="sp"></span>
  ${navDrawer('trumot')}
</header>

<main id="main">
  <h1 class="hero">בניין בית המדרש — מגבית תשפ״ז</h1>
  <p class="lede">אולם אחד, ארבע קומות, ו-412 תלמידים שממתינים למקום קבוע.
     כל שקל נרשם על שם התורם בפנקס הבניין, וכל אבן-דרך נפתחת רק כשהקודמת נסגרה.</p>

  <section class="meter" aria-label="התקדמות המגבית">
    <div class="nums">
      <span class="now">${money(RAISED)}</span>
      <span class="goal">מתוך ${money(GOAL)}</span>
      <span class="pct">${Math.round(RAISED / GOAL * 100)}%</span>
    </div>
    <div class="track" role="img" aria-label="נאספו ${Math.round(RAISED / GOAL * 100)} אחוז מהיעד">
      <div class="fill" style="width:${(RAISED / GOAL * 100).toFixed(1)}%"></div>
    </div>
    <div class="flags">
      ${MILES.map(([p, n]) => `<span class="flag ${RAISED / GOAL * 100 >= p ? 'done' : ''}" style="inset-inline-start:${p}%"><b>${n}</b>${p}%</span>`).join('')}
    </div>
    <div class="cta">
      <button class="pri">רישום תרומה</button>
      <button>שליחת קישור לתורם</button>
      <button>הפקת קבלה 46א׳</button>
    </div>
  </section>

  <div class="two">
    <section class="wall">
      <h2 class="sec">קיר התורמים</h2>
      <p class="sub">8 התרומות האחרונות · מתעדכן עם כל רישום</p>
      <ul>
        ${WALL.map(([n, c, a, t]) => `<li>
          <span><span class="who">${n}</span>${c ? `<br><span class="where">${c}</span>` : ''}</span>
          <span class="amt">${money(a)}</span>
          <span class="ago">${t}</span></li>`).join('')}
      </ul>
    </section>

    <section class="amb">
      <h2 class="sec">שגרירים</h2>
      <p class="sub">כל שגריר והיעד האישי שלו</p>
      <ul>
        ${AMB.map(([n, got, goal, share], i) => `<li>
          <div class="r1"><span class="rank">${i + 1}</span><span class="nm">${n}</span><span class="sum">${money(got)}</span></div>
          <div class="t"><i style="width:${Math.round(got / goal * 100)}%"></i></div>
          <div class="of"><span>${Math.round(got / goal * 100)}% מהיעד האישי (${money(goal)})</span><span>${share}% מהמגבית</span></div></li>`).join('')}
      </ul>
    </section>
  </div>

  <section class="more">
    <h2 class="sec">מגביות נוספות</h2>
    <ul>
      <li><a href="#" onclick="return false">קמחא דפסחא</a><span>נסגרה · ${money(214000)}</span></li>
      <li><a href="#" onclick="return false">דינר תשפ״ו</a><span>נסגר · ${money(1120000)}</span></li>
      <li><a href="#" onclick="return false">הנצחות בית המדרש</a><span>פתוחה · 26 הנצחות</span></li>
    </ul>
  </section>
</main>
</div>`,
};
