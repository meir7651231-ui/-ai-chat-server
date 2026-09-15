/* בית המדרש — לוח-זמנים אנכי לצד מפת-מקומות מצוירת.
   המבנה הייחודי: תוכנית-חלל. לוחצים על מקום בציור ורואים של מי הוא. */
import { navDrawer, money, ltr } from '../base.mjs';

const DAY = [
  ['05:40', 'ותיקין', 'מניין א׳ · עזרה מזרחית', 'past'],
  ['06:20', 'שחרית · מניין ב׳', 'ר׳ יצחק פריד', 'past'],
  ['07:15', 'שחרית · מניין ג׳', 'הציבור', 'past'],
  ['08:00', 'שיעור דף היומי', 'ר׳ מנחם פרידמן · 24 לומדים', 'past'],
  ['13:45', 'מנחה גדולה', 'האולם הגדול', 'now'],
  ['16:30', 'שיעור הלכה', 'ר׳ יצחק פריד', 'next'],
  ['18:52', 'שקיעה', '', 'next'],
  ['19:10', 'מנחה ומעריב', 'מניין מרכזי', 'next'],
  ['20:30', 'סדר ערב', 'עד 22:00', 'next'],
];

const YAHR = [['ר׳ אברהם בן ר׳ יעקב', 'ד׳ תשרי', 'משפחת ברגר'],
['מרת חנה בת ר׳ משה', 'ה׳ תשרי', 'משפחת רוזן'],
['ר׳ נחום בן ר׳ זאב', 'ז׳ תשרי', 'משפחת אונגר']];

/* מפת-המקומות: 6 שורות × 12, 0=פנוי 1=קבוע 2=מושכר לשנה 3=שמור */
const ROWS = 6, COLS = 12;
const SEATS = Array.from({ length: ROWS }, (_, r) => Array.from({ length: COLS }, (_, c) => {
  const k = (r * COLS + c * 7) % 11;
  return c === 0 || c === COLS - 1 ? 3 : k < 5 ? 1 : k < 8 ? 2 : 0;
}));
const OWNER = ['פנוי', 'מקום קבוע', 'מושכר לשנה', 'שמור לאורחים'];

export default {
  id: 'medrash',
  name: 'בית המדרש',
  title: 'בית המדרש — מוסד',
  desc: 'לוח הזמנים של היום לצד מפת המקומות של האולם.',
  css: `
.hd{display:flex;align-items:center;gap:var(--s3);padding:var(--s4);border-block-end:1px solid var(--hair)}
.hd h1{font-size:20px}.hd .sp{flex:1}
.hd .zman{font-size:12.5px;color:var(--mut);text-align:end;line-height:1.5}

.split{display:grid;grid-template-columns:minmax(0,300px) minmax(0,1fr);gap:0;align-items:start}
.day{padding:var(--s4);border-inline-end:1px solid var(--hair)}
.day h2{font-size:15px;margin-bottom:var(--s3)}
.day ol{position:relative;padding-inline-start:var(--s2)}
.day li{display:grid;grid-template-columns:48px 1fr;gap:var(--s3);padding:0 0 var(--s4);position:relative}
.day li::before{content:'';position:absolute;inset-inline-start:calc(48px + var(--s3) / 2 - 3.5px);top:6px;
 width:7px;height:7px;border-radius:50%;background:var(--raise)}
.day li::after{content:'';position:absolute;inset-inline-start:calc(48px + var(--s3) / 2 - 1px);top:14px;bottom:-2px;
 width:2px;background:var(--hair)}
.day li:last-child::after{display:none}
.day time{font:600 12.5px Heebo;color:var(--mut);font-variant-numeric:tabular-nums;padding-top:1px}
.day .t{font-size:14px;font-weight:600;padding-inline-start:var(--s4)}
.day .s{font-size:12px;color:var(--mut);padding-inline-start:var(--s4)}
.day .past{opacity:.55}
.day .now::before{background:var(--acc);box-shadow:0 0 0 4px var(--acc-soft)}
.day .now time{color:var(--acc)}
.day .now .t{font-weight:800}

.hall{padding:var(--s4)}
.hall h2{font-size:17px}
.hall p.s{font-size:13px;color:var(--mut);margin:2px 0 var(--s4)}
.plan{background:var(--card);border:1px solid var(--hair);border-radius:var(--r);padding:var(--s4);overflow-x:auto}
.aron{background:var(--c3-soft);color:var(--c3);border-radius:8px;text-align:center;font:700 12px Heebo;
 padding:7px;margin-bottom:var(--s3);min-width:320px}
.seats{display:grid;grid-template-columns:22px repeat(${COLS},1fr);gap:5px;min-width:320px}
.seats .rl{font:600 10px Heebo;color:var(--mut);display:grid;place-items:center}
.seat{aspect-ratio:1;border-radius:6px;border:1px solid var(--hair);background:var(--sunk);padding:0;
 font:700 9px Heebo;color:var(--mut);min-height:22px}
.seat.s1{background:var(--c1-soft);border-color:var(--c1-soft);color:var(--c1)}
.seat.s2{background:var(--c4-soft);border-color:var(--c4-soft);color:var(--c4)}
.seat.s3{background:repeating-linear-gradient(-45deg,var(--sunk),var(--sunk) 3px,var(--raise) 3px,var(--raise) 6px)}
.seat[aria-pressed=true]{outline:2px solid var(--acc);outline-offset:1px}
.bima{background:var(--sunk);border:1px dashed var(--hair);border-radius:8px;text-align:center;
 font:600 11px Heebo;color:var(--mut);padding:6px;margin-top:var(--s3);min-width:320px}

.seatinfo{display:flex;gap:var(--s3);align-items:center;flex-wrap:wrap;margin-top:var(--s4);
 background:var(--sunk);border-radius:12px;padding:var(--s3) var(--s4);min-height:64px}
.seatinfo b{font-size:15px}
.seatinfo span{font-size:13px;color:var(--mut)}
.seatinfo .sp{flex:1}
.seatinfo button{border:1px solid var(--hair);background:var(--card);border-radius:var(--rs);padding:8px 13px;font-size:13px;min-height:40px}

.key{display:flex;gap:var(--s4);flex-wrap:wrap;margin-top:var(--s3);font-size:12.5px;color:var(--mut)}
.key i{display:inline-block;width:12px;height:12px;border-radius:4px;margin-inline-end:6px;vertical-align:-2px;border:1px solid var(--hair)}

.yahr{margin-top:var(--s6)}
.yahr h2{font-size:16px;margin-bottom:var(--s2)}
.yahr li{display:flex;gap:var(--s3);align-items:baseline;padding:9px 0;border-block-end:1px solid var(--hair);font-size:13.5px}
.yahr li b{font-weight:600}
.yahr .d{color:var(--mut);font-size:12.5px}
.yahr .f{margin-inline-start:auto;color:var(--mut);font-size:12.5px}

@media(max-width:860px){.split{grid-template-columns:1fr}.day{border-inline-end:0;border-block-end:1px solid var(--hair)}}
@media print{.seatinfo button,.nav{display:none!important}}
`,
  body: `
<header class="hd">
  <h1>בית המדרש</h1>
  <span class="sp"></span>
  <p class="zman">ד׳ תשרי תשפ״ז · שקיעה ${ltr('18:52')}<br>צאת הכוכבים ${ltr('19:09')} · נתוני דוגמה</p>
  ${navDrawer('medrash')}
</header>

<div class="split">
  <section class="day">
    <h2>סדר היום</h2>
    <ol>
      ${DAY.map(([t, name, sub, st]) => `<li class="${st}"><time>${ltr(t)}</time>
        <span><span class="t">${name}</span>${sub ? `<br><span class="s">${sub}</span>` : ''}</span></li>`).join('')}
    </ol>
  </section>

  <main id="main" class="hall">
    <h2>מפת מקומות · האולם הגדול</h2>
    <p class="s">${ROWS * COLS} מקומות · לוחצים על מקום כדי לראות של מי הוא</p>

    <div class="plan">
      <div class="aron">ארון הקודש · מזרח</div>
      <div class="seats" id="seats">
        ${SEATS.map((row, r) => `<span class="rl">${['א', 'ב', 'ג', 'ד', 'ה', 'ו'][r]}</span>` +
    row.map((s, c) => `<button class="seat s${s}" data-r="${r}" data-c="${c}" data-s="${s}"
      aria-pressed="false" aria-label="שורה ${r + 1} מקום ${c + 1} · ${OWNER[s]}">${c + 1}</button>`).join('')).join('')}
      </div>
      <div class="bima">בימה</div>
    </div>

    <div class="seatinfo" id="info" aria-live="polite"></div>

    <p class="key">
      <span><i style="background:var(--c1-soft)"></i>מקום קבוע</span>
      <span><i style="background:var(--c4-soft)"></i>מושכר לשנה</span>
      <span><i style="background:var(--sunk)"></i>פנוי</span>
      <span><i class="s3" style="background:var(--raise)"></i>שמור לאורחים</span>
    </p>

    <section class="yahr">
      <h2>יארצייטים השבוע</h2>
      <ul>
        ${YAHR.map(([n, d, f]) => `<li><b>${n}</b><span class="d">${d}</span><span class="f">${f}</span></li>`).join('')}
      </ul>
    </section>
  </main>
</div>`,
  js: `
const OWNER=${JSON.stringify(OWNER)};
const NAMES=['משפחת ברגר','משפחת רוזן','ר׳ שלמה אונגר','משפחת ויס','ר׳ טוביה רוט','משפחת כהן','ר׳ יוסף מלר','משפחת גרין'];
const info=document.getElementById('info');
function show(b){
 const r=+b.dataset.r,c=+b.dataset.c,s=+b.dataset.s;
 const who=s===1||s===2?NAMES[(r*3+c)%NAMES.length]:'';
 const price=s===2?${JSON.stringify(money(2400))}:'';
 info.innerHTML='<b>שורה '+['א','ב','ג','ד','ה','ו'][r]+' · מקום '+(c+1)+'</b>'+
  '<span>'+OWNER[s]+(who?' · '+who:'')+(price?' · '+price+' לשנה':'')+'</span>'+
  '<span class="sp"></span>'+
  (s===0?'<button>שיוך מקום</button>':'<button>החלפת שיוך</button><button>הדפסת שלט</button>');
}
document.getElementById('seats').addEventListener('click',e=>{
 const b=e.target.closest('.seat'); if(!b)return;
 document.querySelectorAll('.seat').forEach(x=>x.setAttribute('aria-pressed','false'));
 b.setAttribute('aria-pressed','true'); show(b);
});
show(document.querySelector('.seat.s1'));
document.querySelector('.seat.s1').setAttribute('aria-pressed','true');
`,
};
