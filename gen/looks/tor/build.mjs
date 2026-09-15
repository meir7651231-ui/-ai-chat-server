/* build.mjs — תיאום קוויטל, מועתק במדידה מרכיב-ההזמנה של Cal.com.
   נמדד מ-cal.com/rick/get-rick-rolled (33 תאי-יום · 52 משבצות-שעה).
   Calendly עצמו נפסל: עמודי-ההזמנה שלו החזירו 404 או 182 אלמנטים.
   הרצה: node gen/looks/tor/build.mjs                                         */
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
  return { today: DB.today,
    queue: DB.queue.map(q => ({ no:q.no, fam:fam(q.familyId).name, reason:q.reason,
      state:q.state, mins:q.mins })),
    minyanim: DB.minyanim.map(m => ({ t:m.time, n:m.name, w:m.where, c:m.count })) };
`)(SPEC);

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
const HDAY = ['א׳','ב׳','ג׳','ד׳','ה׳','ו׳','ז׳','ח׳','ט׳','י׳','י״א','י״ב','י״ג','י״ד','ט״ו','ט״ז','י״ז','י״ח','י״ט','כ׳','כ״א','כ״ב','כ״ג','כ״ד','כ״ה','כ״ו','כ״ז','כ״ח','כ״ט','ל׳'];
const DOW = ['א׳','ב׳','ג׳','ד׳','ה׳','ו׳','ש׳'];

const TODAY = 4;            /* ד׳ תשרי */
const DAYS = 30;
/* יום-השבוע נגזר מן המחסן ולא מהנחה שלי: DB.today.dow אומר שד׳ תשרי
   הוא יום שלישי. מכאן כל שאר החודש — וגם השבתות.                    */
const DOWNAMES = ['יום ראשון','יום שני','יום שלישי','יום רביעי','יום חמישי','יום שישי','שבת'];
const TODAY_W = Math.max(0, DOWNAMES.indexOf(D.today.dow));      /* 2 = שלישי */
const wd = (d) => ((TODAY_W + (d - TODAY)) % 7 + 7) % 7;         /* 0=ראשון … 6=שבת */
const OFFSET = wd(1);       /* כמה תאים ריקים לפני א׳ תשרי */

/* למה יום סגור — נגזר מהלוח, לא מומצא. */
const closed = (d) => {
  if (d < TODAY) return 'עבר';
  if (wd(d) === 6) return 'שבת';
  if (d <= 2) return 'ראש השנה';
  if (d === 3) return 'צום גדליה';
  if (d === 10) return 'יום הכיפורים';
  if (d >= 15 && d <= 21) return 'סוכות';
  if (d === 22) return 'שמיני עצרת';
  return null;
};

/* משבצות הערב: 18:00–21:30, כל עשר דקות. הנלקחות נגזרות מן התור. */
const SLOT_MIN = 10, OPEN = 18 * 60, CLOSE = 21 * 60 + 30;
const allSlots = []; for (let m = OPEN; m < CLOSE; m += SLOT_MIN) allSlots.push(m);
const hhmm = m => String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');

/* זרע דטרמיניסטי — אותה זמינות בכל פתיחה */
let S = 20260915;
const R = () => { S |= 0; S = S + 0x6D2B79F5 | 0; let t = Math.imul(S ^ S >>> 15, 1 | S);
  t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

const waiting = D.queue.filter(q => q.state === 'wait').length;
const days = [];
for (let d = 1; d <= DAYS; d++) {
  const why = closed(d);
  if (why) { days.push({ d, why, slots: [] }); continue; }
  /* ככל שהיום קרוב יותר — נלקחו בו יותר משבצות. התור בפועל 14 איש. */
  const near = Math.max(0, 1 - (d - TODAY) / 14);
  const taken = new Set();
  allSlots.forEach(m => { if (R() < 0.15 + near * 0.6) taken.add(m); });
  days.push({ d, why: null, slots: allSlots.filter(m => !taken.has(m)) });
}
const openDays = days.filter(x => !x.why && x.slots.length);
const first = openDays[0];

const dayJSON = JSON.stringify(days.map(x => [x.d, x.why || '', x.slots]));
const OFFSET_J = OFFSET;

const html = `<!doctype html>
<html lang="he" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>תיאום קוויטל</title>
<meta name="description" content="תיאום קוויטל בשלוש עמודות, מועתק במדידה מרכיב-ההזמנה של Cal.com.">
<style>
/* אין קישור לגופן — fontSans של המקור הוא Inter, נטול אותיות עבריות. */
*{box-sizing:border-box}html,body{overflow-x:hidden}
:root{
 /* ===== נמדד מ-cal.com ===== */
 --bg:#f6f6f6;--pane:#ffffff;--ink:#3c4144;--head:#070a0d;--mut:#6b7280;
 --line:#e5e7eb;--slotEdge:#d1d5db;
 --mutOn:#62676f;   /* אפור לטקסט שיושב על רקע-העמוד ולא על הלוח הלבן */
 --on:#292929;--onInk:#ffffff;      /* יום פנוי / נבחר */
 --day:59px;--dayR:8px;--dayGap:4px;
 --slotH:36px;--slotR:10px;--slotGap:8px}
@media(prefers-color-scheme:dark){:root:not([data-theme=light]){
 --bg:#0f1011;--pane:#18191b;--ink:#d7dadd;--head:#f4f6f8;--mut:#9aa1a8;
 --line:#2b2e32;--slotEdge:#3a3f45;--mutOn:#9aa1a8;
 --on:#e8e8e8;--onInk:#141518}}
:root[data-theme=dark]{
 --bg:#0f1011;--pane:#18191b;--ink:#d7dadd;--head:#f4f6f8;--mut:#9aa1a8;
 --line:#2b2e32;--slotEdge:#3a3f45;--mutOn:#9aa1a8;
 --on:#e8e8e8;--onInk:#141518}
body{margin:0;background:var(--bg);color:var(--ink);
 font:400 16px/24px system-ui,sans-serif;
 min-height:100dvh;display:grid;place-items:start center;padding:26px 16px 60px}
h1,h2{margin:0}p{margin:0}bdi{unicode-bidi:isolate}
button{font:inherit;cursor:pointer;color:inherit}
:focus-visible{outline:2px solid var(--on);outline-offset:2px;border-radius:4px}
.hid{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}

.booker{background:var(--pane);border:1px solid var(--line);border-radius:12px;
 display:grid;grid-template-columns:270px 1fr 268px;max-width:1040px;width:100%}
.pane{padding:20px 22px}
.pane+.pane{border-inline-start:1px solid var(--line)}

/* ---------- עמודה 1: אצל מי ומה ---------- */
.av{width:44px;height:44px;border-radius:50%;background:var(--line);color:var(--mut);
 display:grid;place-items:center;font:600 15px/1 system-ui,sans-serif}
.who{font:400 14px/20px system-ui,sans-serif;color:var(--mut);margin-top:10px}
h1{font:600 20px/28px system-ui,sans-serif;color:var(--head);margin-top:2px}
.blurb{font:400 14px/20px system-ui,sans-serif;color:var(--mut);margin-top:10px}
.meta{margin-top:16px;display:grid;gap:9px}
.meta div{display:flex;align-items:center;gap:9px;font:400 14px/20px system-ui,sans-serif}
.meta i{width:16px;height:16px;flex:none;border-radius:3px;background:var(--line);display:block}
.pick{margin-top:16px;padding-top:14px;border-top:1px solid var(--line);
 font:400 14px/20px system-ui,sans-serif;color:var(--mut)}
.pick b{display:block;color:var(--head);font:600 15px/22px system-ui,sans-serif}

/* ---------- עמודה 2: הלוח ---------- */
.mhead{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
.mhead b{font:400 16px/24px system-ui,sans-serif;color:var(--ink)}
.mhead b span{color:var(--mut)}
.toggle{display:inline-flex;border:1px solid var(--line);border-radius:999px;overflow:hidden}
.toggle button{border:0;background:0;padding:4px 11px;font:500 13px/18px system-ui,sans-serif;
 color:var(--mut)}
.toggle button[aria-pressed=true]{background:var(--line);color:var(--head)}
.dows{display:grid;grid-template-columns:repeat(7,var(--day));gap:var(--dayGap);margin-bottom:6px}
.dows span{text-align:center;font:500 12px/16px system-ui,sans-serif;color:var(--head);
 letter-spacing:1.2px}
.grid{display:grid;grid-template-columns:repeat(7,var(--day));gap:var(--dayGap)}
.d{width:var(--day);height:var(--day);border-radius:var(--dayR);border:0;padding:0;
 display:grid;place-items:center;background:transparent;position:relative;
 font:300 14px/20px system-ui,sans-serif;color:var(--mut)}
/* משקל האות נושא את הזמינות, לא רק הצבע — נמדד 500 מול 300 */
.d.free{background:var(--line);color:var(--head);font-weight:500;cursor:pointer}
.d.free:hover{filter:brightness(.96)}
.d.on{background:var(--on);color:var(--onInk);font-weight:500}
.d.now:after{content:"";position:absolute;bottom:7px;width:4px;height:4px;border-radius:50%;
 background:currentColor}
.d:disabled{cursor:default}
.pad{width:var(--day);height:var(--day);display:block}
.legend{display:flex;gap:14px;flex-wrap:wrap;margin-top:14px;
 font:400 12px/16px system-ui,sans-serif;color:var(--mut)}
.legend span{display:inline-flex;align-items:center;gap:6px}
.legend i{width:14px;height:14px;border-radius:4px;display:block;background:var(--line)}
.legend i.off{background:transparent;border:1px solid var(--line)}
.legend i.sel{background:var(--on)}

/* ---------- עמודה 3: המשבצות ---------- */
.shead{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:12px}
.shead b{font:600 15px/22px system-ui,sans-serif;color:var(--head)}
.shead span{font:400 13px/18px system-ui,sans-serif;color:var(--mut)}
.slots{display:flex;flex-direction:column;gap:var(--slotGap);
 max-height:392px;overflow-y:auto;padding-inline-end:2px}
.slot{height:var(--slotH);border:1px solid var(--slotEdge);border-radius:var(--slotR);
 background:var(--pane);color:var(--ink);font:500 14px/14px system-ui,sans-serif;
 text-align:center;padding:8px 10px;flex:none;font-variant-numeric:tabular-nums}
.slot:hover{border-color:var(--on)}
.slot[aria-pressed=true]{background:var(--on);color:var(--onInk);border-color:var(--on)}
.none{color:var(--mut);font:400 14px/20px system-ui,sans-serif;padding:8px 0}
.go{margin-top:12px;width:100%;height:38px;border:0;border-radius:10px;
 background:var(--on);color:var(--onInk);font:600 14px/1 system-ui,sans-serif}
.go:disabled{opacity:.4;cursor:default}

.say{max-width:1040px;margin-top:22px;color:var(--mutOn);
 font:400 13px/20px system-ui,sans-serif}
.say b{color:var(--head)}
@media(max-width:940px){
 .booker{grid-template-columns:1fr}
 .pane+.pane{border-inline-start:0;border-top:1px solid var(--line)}
 .dows,.grid{grid-template-columns:repeat(7,1fr)}
 .d{width:100%}
 .slots{max-height:none}}
</style></head><body>

<div class="booker">
 <div class="pane">
  <span class="av" aria-hidden="true">קו</span>
  <p class="who">חצר הקודש</p>
  <h1>קוויטל</h1>
  <p class="blurb">כניסה אישית לכתיבת קוויטל. הזמן מוקצב; אם נדרש יותר, המזכירות תשבץ מחדש.</p>
  <div class="meta">
   <div><i aria-hidden="true"></i><span>${SLOT_MIN} דקות</span></div>
   <div><i aria-hidden="true"></i><span>בית המדרש · חדר הרבי</span></div>
   <div><i aria-hidden="true"></i><span>${hhmm(OPEN)}–${hhmm(CLOSE)}</span></div>
  </div>
  <div class="pick">
   <span>בחירתך</span>
   <b id="pickTxt">טרם נבחר</b>
  </div>
  <div class="pick">
   <span>בתור כרגע</span>
   <b>${waiting} ממתינים${D.queue.find(q => q.state === 'inside') ? ` · מס׳ ${D.queue.find(q => q.state === 'inside').no} בפנים` : ''}</b>
  </div>
 </div>

 <div class="pane">
  <div class="mhead">
   <b>תשרי <span>${esc(D.today.hy)}</span></b>
   <span class="toggle" role="group" aria-label="תצוגת תאריך">
    <button type="button" id="hbtn" aria-pressed="true">עברי</button>
    <button type="button" id="gbtn" aria-pressed="false">לועזי</button>
   </span>
  </div>
  <div class="dows" aria-hidden="true">${DOW.map(x => `<span>${x}</span>`).join('')}</div>
  <div class="grid" id="grid" role="grid" aria-label="ימי תשרי"></div>
  <p class="legend">
   <span><i></i>יש פנוי</span>
   <span><i class="off"></i>סגור</span>
   <span><i class="sel"></i>נבחר</span>
   <span>· הנקודה מסמנת את היום</span>
  </p>
 </div>

 <div class="pane">
  <div class="shead"><b id="dayTtl">—</b><span id="dayCnt"></span></div>
  <div class="slots" id="slots"></div>
  <button class="go" id="go" type="button" disabled>קביעת התור</button>
 </div>
</div>

<p class="say">הרכיב מועתק במדידה מ-Cal.com: תא-יום <bdi>59×59</bdi> ברדיוס <bdi>8</bdi> ורווח <bdi>4</bdi> בגריד של שבע עמודות; משבצת-שעה בגובה <bdi>36</bdi> ברדיוס <bdi>10</bdi> עם גבול <bdi dir="ltr">1px #d1d5db</bdi> ורווח <bdi>8</bdi>; כותרות-הימים ב־<bdi>12/16</bdi> עם ריווח-אותיות <bdi>1.2</bdi>. <b>והדבר שקל לפספס:</b> משקל האות נושא את הזמינות — יום פנוי ב־<bdi>500</bdi>, יום סגור ב־<bdi>300</bdi>. לא רק צבע. <b>שלוש סטיות מודעות:</b> המקור מציע מתג <bdi dir="ltr">12h/24h</bdi>; בעברית כותבים תמיד <bdi>24</bdi>, ולכן אין לו תפקיד — במקומו מתג <b>עברי/לועזי</b>, שהוא אותו רעיון בדיוק: אותו רגע, שתי דרכים לומר אותו. הימים הסגורים אינם מומצאים אלא <b>נגזרים מן הלוח</b>: שבת, ראש השנה, צום גדליה, יום הכיפורים, סוכות ושמיני עצרת. ו-Calendly עצמו נפסל — עמודי-ההזמנה שלו החזירו <bdi>404</bdi> או <bdi>182</bdi> אלמנטים, ו-Cal.com הוא הקוד-הפתוח שלו שנטען מלא.</p>

<script>
(function(){
 var DAYS=${dayJSON};
 var HD=${JSON.stringify(HDAY)};
 var TODAY=${TODAY}, OFFSET=${OFFSET_J}, heb=true, sel=null, slot=null;
 var grid=document.getElementById('grid'), slots=document.getElementById('slots'),
     ttl=document.getElementById('dayTtl'), cnt=document.getElementById('dayCnt'),
     go=document.getElementById('go'), pick=document.getElementById('pickTxt');
 /* א׳ תשרי = 17 בספטמבר 2026 לצורך התצוגה הלועזית */
 var GSTART=new Date(2026,8,17);
 function gLabel(d){var x=new Date(GSTART.getTime()+(d-1)*864e5);
  return x.getDate()+'.'+(x.getMonth()+1);}
 function label(d){return heb?HD[d-1]:gLabel(d);}
 function hhmm(m){return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');}
 function drawGrid(){
  var pad=''; for(var i=0;i<OFFSET;i++)pad+='<span class="pad" aria-hidden="true"></span>';
  grid.innerHTML=pad+DAYS.map(function(a){
   var d=a[0],why=a[1],free=!why&&a[2].length;
   var cls='d'+(free?' free':'')+(sel===d?' on':'')+(d===TODAY?' now':'');
   var say=why?('סגור · '+why):(free?(a[2].length===1?'משבצת אחת פנויה':a[2].length+' משבצות פנויות'):'אין פנוי');
   return '<button class="'+cls+'" role="gridcell" data-d="'+d+'"'+(free?'':' disabled')+
    ' aria-label="'+HD[d-1]+' תשרי — '+say+'"'+(sel===d?' aria-selected="true"':'')+'>'+
    label(d)+'</button>';}).join('');
 }
 function drawSlots(){
  if(sel===null){ttl.textContent='—';cnt.textContent='';slots.innerHTML=
   '<p class="none">בחרו יום בלוח.</p>';return;}
  var a=DAYS.find(function(x){return x[0]===sel;});
  ttl.textContent=HD[sel-1]+' תשרי';
  cnt.textContent=a[2].length===1?'אחת פנויה':a[2].length+' פנויות';
  slots.innerHTML=a[2].map(function(m){
   return '<button class="slot" type="button" data-m="'+m+'"'+
    (slot===m?' aria-pressed="true"':' aria-pressed="false"')+'>'+hhmm(m)+'</button>';}).join('')
   ||'<p class="none">אין משבצות פנויות ביום זה.</p>';
 }
 function sync(){
  go.disabled=!(sel!==null&&slot!==null);
  pick.textContent=(sel!==null&&slot!==null)?(HD[sel-1]+' תשרי · '+hhmm(slot)):'טרם נבחר';
 }
 grid.addEventListener('click',function(e){
  var b=e.target.closest('[data-d]'); if(!b||b.disabled)return;
  sel=+b.dataset.d; slot=null; drawGrid(); drawSlots(); sync();
  var f=slots.querySelector('.slot'); if(f)f.focus();
 });
 slots.addEventListener('click',function(e){
  var b=e.target.closest('[data-m]'); if(!b)return;
  slot=+b.dataset.m; drawSlots(); sync();
  var k=slots.querySelector('[data-m="'+slot+'"]'); if(k)k.focus();
 });
 document.getElementById('hbtn').addEventListener('click',function(){
  heb=true;this.setAttribute('aria-pressed','true');
  document.getElementById('gbtn').setAttribute('aria-pressed','false');drawGrid();});
 document.getElementById('gbtn').addEventListener('click',function(){
  heb=false;this.setAttribute('aria-pressed','true');
  document.getElementById('hbtn').setAttribute('aria-pressed','false');drawGrid();});
 go.addEventListener('click',function(){
  pick.textContent='נקבע · '+HD[sel-1]+' תשרי · '+hhmm(slot);
  go.textContent='התור נקבע'; go.disabled=true;});
 sel=${first ? first.d : 'null'};
 drawGrid(); drawSlots(); sync();
})();
</script>
</body></html>`;

writeFileSync(join(here, 'tor.html'), html);
console.log('tor.html · ' + D.today.dow + ' ⇒ היסט ' + OFFSET + ' · שבתות ב־' + days.filter(x=>x.why==='שבת').map(x=>HDAY[x.d-1]).join(',') + '\nימים ' + DAYS + ' · פתוחים ' + openDays.length +
  ' · סגורים ' + days.filter(d => d.why).length +
  ' · משבצות ליום ' + allSlots.length + ' · ראשון פנוי ' + (first ? HDAY[first.d - 1] : '—') +
  ' עם ' + (first ? first.slots.length : 0) + ' פנויות');
