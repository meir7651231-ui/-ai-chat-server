/* החצר — לוח-תור. המסך היחיד באתר שכהה מלידה: הוא נועד לתלייה על קיר בחדר-ההמתנה.
   המבנה הייחודי: תצוגת-ענק. מספר אחד גדול, תור מתחתיו, ושדה-קליטה קטן בצד. */
import { navDrawer, ltr } from '../base.mjs';

const QUEUE = [
  [47, 'משפחת ברגר', 'קוויטל · ברכה לרפואה', 'now', '4 דק׳'],
  [48, 'ר׳ שלמה אונגר', 'עניין הוועד', 'next', '~6 דק׳'],
  [49, 'משפחת רוזן', 'קוויטל', '', '~11 דק׳'],
  [50, 'ר׳ יוסף מלר', 'דוח תקציב', '', '~17 דק׳'],
  [51, 'משפחת גרין', 'שידוך', '', '~22 דק׳'],
  [52, 'ר׳ נפתלי הורוביץ', 'קוויטל', '', '~28 דק׳'],
];

export default {
  id: 'hatzer',
  name: 'החצר',
  title: 'החצר — מוסד',
  desc: 'לוח התור של קבלת הקהל, בתצוגה שנקראת מרחוק.',
  fonts: ['Suez+One'],
  css: `
/* המסך הזה מחזיק צבע משלו בשתי הערכות — הוא לוח-קיר, לא דף-ממשק */
body{background:#0e1113;color:#f2efe9}
.board{max-width:1200px;margin-inline:auto;padding:var(--s4) var(--s4) var(--s6)}
.top{display:flex;align-items:center;gap:var(--s3);flex-wrap:wrap;margin-bottom:var(--s5)}
.top h1{font:400 22px 'Suez One',Heebo,serif}
.top .sp{flex:1}
.top .meta{font-size:13px;color:#b9b2a6}
.nav>summary{background:#1a1f22;border-color:#333a3e;color:#f2efe9}
.nav .sheet{background:#1a1f22;border-color:#333a3e}
.nav .sheet a{color:#f2efe9}
.nav .sheet a:hover{background:#242a2e}
.nav .sheet a[aria-current=page]{background:#243447;color:#9dc0ff}

.stage{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1fr);gap:var(--s5);align-items:stretch}
.nowcard{background:#161b1e;border:1px solid #2a3135;border-radius:22px;padding:var(--s6) var(--s5);
 display:flex;flex-direction:column;justify-content:center;gap:var(--s3);min-height:300px}
.nowcard .cap{font-size:14px;color:#b9b2a6;letter-spacing:.06em}
.nowcard .n{font:400 clamp(70px,16vw,132px)/.9 'Suez One',Heebo,serif;color:#ffd489;font-variant-numeric:tabular-nums}
.nowcard .who{font-size:clamp(20px,3.4vw,30px);font-weight:700}
.nowcard .why{font-size:15px;color:#b9b2a6}
.nowcard .since{font-size:13px;color:#b9b2a6;margin-top:var(--s2)}

.side{display:flex;flex-direction:column;gap:var(--s3)}
.stat{background:#161b1e;border:1px solid #2a3135;border-radius:16px;padding:var(--s4);flex:1;
 display:flex;flex-direction:column;justify-content:center}
.stat b{font:800 32px Heebo;font-variant-numeric:tabular-nums;line-height:1.1}
.stat span{font-size:13px;color:#b9b2a6}

.queue{margin-top:var(--s5)}
.queue h2{font-size:15px;color:#b9b2a6;font-weight:400;margin-bottom:var(--s2)}
.queue li{display:grid;grid-template-columns:64px minmax(0,1fr) auto;gap:var(--s4);align-items:center;
 padding:var(--s3) var(--s4);border-radius:14px;background:#161b1e;border:1px solid #2a3135;margin-bottom:8px}
.queue .num{font:400 26px 'Suez One',Heebo,serif;font-variant-numeric:tabular-nums;color:#b9b2a6;text-align:center}
.queue .nm{font-size:16px;font-weight:600}
.queue .rs{font-size:12.5px;color:#b9b2a6}
.queue .eta{font-size:13px;color:#b9b2a6;white-space:nowrap;font-variant-numeric:tabular-nums}
.queue .next{border-color:#4a5f2e;background:#182015}
.queue .next .num{color:#c7e08a}
.queue .now{border-color:#6b5220;background:#221b10}
.queue .now .num{color:#ffd489}

.intake{margin-top:var(--s6);background:#161b1e;border:1px solid #2a3135;border-radius:16px;padding:var(--s4);
 display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:var(--s3);align-items:end}
.intake label{display:flex;flex-direction:column;gap:5px;font-size:12.5px;color:#b9b2a6}
.intake input,.intake select{background:#0e1113;border:1px solid #333a3e;border-radius:10px;
 padding:11px var(--s3);color:#f2efe9;font-size:14.5px;min-height:44px;outline:0}
.intake input:focus,.intake select:focus{border-color:#9dc0ff}
.intake button{background:#ffd489;color:#1a1408;border:0;border-radius:10px;padding:12px var(--s4);
 font-size:15px;font-weight:700;min-height:46px}
.hint{font-size:12.5px;color:#b9b2a6;margin-top:var(--s3)}
:focus-visible{outline:2px solid #9dc0ff;outline-offset:2px}

@media(max-width:820px){.stage{grid-template-columns:1fr}.side{flex-direction:row}}
@media print{body{background:#fff;color:#000}.intake,.nav{display:none!important}
 .nowcard,.stat,.queue li{background:#fff;border-color:#999;color:#000}
 .nowcard .n,.queue .num{color:#000}}
`,
  body: `
<div class="board">
<header class="top">
  <h1>קבלת קהל</h1>
  <span class="sp"></span>
  <span class="meta">ד׳ תשרי תשפ״ז · ${ltr('13:48')} · נתוני דוגמה</span>
  ${navDrawer('hatzer')}
</header>

<main id="main">
  <div class="stage">
    <section class="nowcard" aria-live="polite">
      <span class="cap">נכנס עכשיו</span>
      <span class="n num">${ltr('47')}</span>
      <span class="who">משפחת ברגר</span>
      <span class="why">קוויטל · ברכה לרפואה</span>
      <span class="since">בפנים 4 דקות · ממוצע היום ${ltr('5:20')} דקות</span>
    </section>
    <div class="side">
      <div class="stat"><b>14</b><span>ממתינים</span></div>
      <div class="stat"><b>כ-${ltr('72')} דק׳</b><span>המתנה צפויה לאחרון</span></div>
      <div class="stat"><b>31</b><span>נכנסו היום</span></div>
    </div>
  </div>

  <section class="queue">
    <h2>הבאים בתור</h2>
    <ul>
      ${QUEUE.filter(q => q[3] !== 'now').map(([n, who, why, st, eta]) => `<li class="${st}">
        <span class="num">${ltr(String(n))}</span>
        <span><span class="nm">${who}</span><br><span class="rs">${why}</span></span>
        <span class="eta">${eta}</span></li>`).join('')}
    </ul>
  </section>

  <form class="intake" onsubmit="return false">
    <label>שם<input id="in-name" placeholder="שם המבקש" autocomplete="off"></label>
    <label>עניין<select id="in-kind"><option>קוויטל</option><option>שידוך</option><option>עניין הוועד</option><option>אחר</option></select></label>
    <label>טלפון<input id="in-tel" inputmode="tel" placeholder="050-000-0000" autocomplete="off"></label>
    <button id="add">הוספה לתור</button>
  </form>
  <p class="hint">המספר הבא יינתן אוטומטית. מי שלא נכנס תוך שעתיים עובר למחר, בלי למחוק.</p>
</main>
</div>`,
  js: `
/* הוספה לתור: מספר עוקב אמיתי, בלי לדרוס את מי שכבר בפנים */
let last=${QUEUE[QUEUE.length - 1][0]};
document.getElementById('add').onclick=()=>{
 const n=document.getElementById('in-name').value.trim(); if(!n)return;
 const kind=document.getElementById('in-kind').value;
 last++;
 const li=document.createElement('li');
 li.innerHTML='<span class="num">'+last+'</span><span><span class="nm">'+n+
  '</span><br><span class="rs">'+kind+'</span></span><span class="eta">~'+((last-47)*5+2)+' דק׳</span>';
 document.querySelector('.queue ul').appendChild(li);
 document.getElementById('in-name').value='';
 document.getElementById('in-name').focus();
};
`,
};
