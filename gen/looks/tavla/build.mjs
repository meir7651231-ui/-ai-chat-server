/* build.mjs — מסך אנשים כטבלה דינמית, מועתק במדידה מ-Atlassian Design System.
   נמדד מ-atlassian.design/components/dynamic-table/examples (7,552 אלמנטים,
   11 טבלאות, 14 מצבים מתועדים).
   הרצה: node gen/looks/tavla/build.mjs                                       */
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
  const rows = DB.people.map(p => {
    let tie = '', sub = '';
    if (p.kind === 'עובד') { const s = DB.staff.find(x => x.personId === p.id);
      tie = s ? s.role : ''; sub = s && s.absent ? 'ב' + s.absent : (s ? s.since : ''); }
    else if (p.kind === 'תלמיד') { const s = DB.students.find(x => x.personId === p.id);
      const c = s && cls(s.classId); tie = c ? c.name : ''; sub = c ? c.room : ''; }
    else if (p.kind === 'הורה') { const f = DB.families.find(x => x.head === p.id || x.spouse === p.id);
      tie = f ? f.name : ''; sub = f ? f.kids.length + ' ילדים' : ''; }
    else if (p.kind === 'תורם') { const d = DB.donors.find(x => x.personId === p.id);
      tie = d ? (d.anon ? 'בעילום שם' : 'תורם') : ''; sub = d ? d.city : ''; }
    return { id:p.id, name:p.first + ' ' + p.last, kind:p.kind, city:p.city, tie, sub };
  });
  return { rows, forb: forbiddenOf('אנשים','משפחה'), today: DB.today,
    kinds: [...new Set(DB.people.map(p=>p.kind))] };
`)(SPEC);

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
const KIND_ORDER = ['עובד', 'הורה', 'תלמיד', 'תורם'];

const html = `<!doctype html>
<html lang="he" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>אנשים — ${D.rows.length} רשומות</title>
<meta name="description" content="מסך אנשים כטבלה דינמית, מועתק במדידה ממערכת-העיצוב של Atlassian.">
<style>
/* אין קישור לגופן — Atlassian Sans נטול אותיות עבריות. */
*{box-sizing:border-box}html,body{overflow-x:hidden}
:root{
 /* ===== נמדד מ-atlassian.design ===== */
 --bg:#ffffff;--ink:#292a2e;--mut:#505258;--link:#1868db;
 --rule:rgba(11,18,14,.14);        /* קו-הכותרת, 2px */
 --hair:rgba(11,18,14,.08);
 --hov:#f4f5f7;--sunk:#f1f2f4;--sel:#e9f2fe;
 --bad:#ae2e24;--ok:#216e4e;
 --rowH:48px;--thH:32px;   /* +2 הגבול = 34 הנמדד */
 --fs:14px;--lh:20px;--thFs:12px;--thLh:16px;--thW:653}
@media(prefers-color-scheme:dark){:root:not([data-theme=light]){
 --bg:#1f1f21;--ink:#e6e6e8;--mut:#a9abb2;--link:#7fb0f5;
 --rule:rgba(255,255,255,.18);--hair:rgba(255,255,255,.10);
 --hov:#2b2c2f;--sunk:#2b2c2f;--sel:#1d2c40;
 --bad:#f87168;--ok:#5fc08a}}
:root[data-theme=dark]{
 --bg:#1f1f21;--ink:#e6e6e8;--mut:#a9abb2;--link:#7fb0f5;
 --rule:rgba(255,255,255,.18);--hair:rgba(255,255,255,.10);
 --hov:#2b2c2f;--sunk:#2b2c2f;--sel:#1d2c40;
 --bad:#f87168;--ok:#5fc08a}
body{margin:0;background:var(--bg);color:var(--ink);
 font:400 var(--fs)/var(--lh) system-ui,sans-serif}
h1,h2{margin:0}p{margin:0}bdi{unicode-bidi:isolate}
button{font:inherit;cursor:pointer;color:inherit}
a{color:var(--link);text-decoration:underline;text-underline-offset:2px}
:focus-visible{outline:2px solid var(--link);outline-offset:2px;border-radius:3px}
.hid{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}

.wrap{max-width:1180px;margin:0 auto;padding:24px 20px 70px}
h1{font:600 24px/30px system-ui,sans-serif}
.lede{color:var(--mut);margin-top:6px;max-width:70ch}

.bar{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:20px 0 12px}
.fld{height:32px;border:1px solid var(--rule);border-radius:6px;background:var(--bg);
 color:var(--ink);padding:0 10px;font:400 var(--fs)/var(--lh) system-ui,sans-serif}
.fld:hover{background:var(--hov)}
select.fld{padding-inline-end:26px}
.btn{height:32px;border:1px solid var(--rule);border-radius:6px;background:var(--bg);
 padding:0 12px;font:400 var(--fs)/1 system-ui,sans-serif}
.btn:hover{background:var(--hov)}
.count{margin-inline-start:auto;color:var(--mut);font-variant-numeric:tabular-nums}

/* ---------- הטבלה ---------- */
.holder{position:relative;min-height:200px}
table{width:100%;border-collapse:separate;border-spacing:0;table-layout:auto}
thead th{font:var(--thW) var(--thFs)/var(--thLh) system-ui,sans-serif;color:var(--mut);
 text-align:start;height:var(--thH);padding:4px 0 4px 8px;
 border-bottom:2px solid var(--rule);white-space:nowrap;background:var(--bg)}
thead th:last-child{padding-inline-end:0}
th.srt{padding:0}
th.srt button{display:flex;align-items:center;gap:4px;width:100%;height:var(--thH);
 background:0;border:0;padding:4px 0 4px 8px;font:inherit;color:inherit;text-align:start}
th.srt button:hover{background:var(--hov)}
th.srt .ar{opacity:0;font-size:10px;line-height:1}
th.srt[aria-sort] .ar{opacity:1}
tbody td{font:400 var(--fs)/var(--lh) system-ui,sans-serif;color:var(--ink);
 height:var(--rowH);padding:4px 0 4px 8px;vertical-align:middle;
 border:0}                       /* נמדד: אין קו בין שורות. הגובה מפריד. */
tbody td:last-child{padding-inline-end:0}
tbody tr:hover td{background:var(--hov)}
.nm{display:flex;align-items:center;gap:8px;min-width:0}
.av{width:36px;height:36px;flex:none;border-radius:50%;background:var(--sunk);
 color:var(--mut);display:grid;place-items:center;font:600 12px/1 system-ui,sans-serif}
.nm b{font-weight:400}
.nm a{color:var(--link)}
.sub{display:block;color:var(--mut);font-size:12px;line-height:16px}
.tag{display:inline-block;background:var(--sunk);color:var(--mut);border-radius:3px;
 padding:1px 6px;font:600 11px/16px system-ui,sans-serif}
td.act{text-align:end;white-space:nowrap}
.leave{height:28px;border:1px solid var(--rule);border-radius:6px;background:var(--bg);
 padding:0 10px;font:400 13px/1 system-ui,sans-serif;color:var(--mut)}
.leave:hover{background:var(--hov);color:var(--bad);border-color:var(--bad)}

/* מצב טעינה — נמדד: התוכן נשאר ויורד ל-20% שקיפות, לא מוחלף בשלד */
.holder.load tbody,.holder.load thead{opacity:.2;pointer-events:none}
.spin{display:none;position:absolute;inset-block-start:90px;inset-inline-start:50%;
 width:28px;height:28px;margin-inline-start:-14px;border-radius:50%;
 border:3px solid var(--hair);border-top-color:var(--link);animation:sp .8s linear infinite}
.holder.load .spin{display:block}
@keyframes sp{to{transform:rotate(360deg)}}
@media(prefers-reduced-motion:reduce){.spin{animation-duration:2.4s}}

.empty{display:none;padding:52px 20px;text-align:center;color:var(--mut)}
.empty b{display:block;color:var(--ink);font:600 16px/24px system-ui,sans-serif;margin-bottom:6px}
.holder.none .empty{display:block}
.holder.none table{display:none}

/* עימוד */
.pg{display:flex;justify-content:center;align-items:center;gap:4px;margin-top:18px;flex-wrap:wrap}
.pg button{min-width:32px;height:32px;border:0;border-radius:6px;background:0;color:var(--mut);
 font:400 var(--fs)/1 system-ui,sans-serif;font-variant-numeric:tabular-nums}
.pg button:hover:not(:disabled){background:var(--hov)}
.pg button[aria-current=page]{background:var(--sel);color:var(--link);font-weight:600}
.pg button:disabled{opacity:.35;cursor:default}
.pg .gap{color:var(--mut);padding:0 2px}

.say{margin-top:22px;padding-top:16px;border-top:1px solid var(--hair);
 color:var(--mut);font-size:13px;line-height:20px;max-width:76ch}
.say b{color:var(--ink)}
@media(max-width:760px){
 .holder{overflow-x:auto}
 table{min-width:720px}}
</style></head><body>
<div class="wrap">

<h1>אנשים</h1>
<p class="lede">${D.rows.length} רשומות — ${KIND_ORDER.map(k => `${D.rows.filter(r => r.kind === k).length} ${k}`).join(' · ')}. ${esc(D.today.dow)}, ${esc(D.today.hd)} ${esc(D.today.hy)}.</p>

<div class="bar">
 <label class="hid" for="q">חיפוש</label>
 <input class="fld" id="q" type="search" placeholder="חיפוש שם או עיר…" style="min-width:230px">
 <label class="hid" for="k">סוג</label>
 <select class="fld" id="k"><option value="">כל הסוגים</option>
  ${KIND_ORDER.map(k => `<option>${esc(k)}</option>`).join('')}</select>
 <button class="btn" id="showLeft" type="button" aria-pressed="false">הצגת מי שעזב</button>
 <button class="btn" id="load" type="button">הדגמת טעינה</button>
 <span class="count" id="cnt"></span>
</div>

<div class="holder" id="holder">
 <div class="spin" role="status" aria-live="polite"><span class="hid">טוען</span></div>
 <table>
  <thead><tr>
   <th class="srt" data-s="name" style="width:38%"><button type="button">שם<span class="ar">▾</span></button></th>
   <th class="srt" data-s="kind"><button type="button">סוג<span class="ar">▾</span></button></th>
   <th class="srt" data-s="city"><button type="button">עיר<span class="ar">▾</span></button></th>
   <th>שיוך</th>
   <th style="text-align:end">פעולה</th>
  </tr></thead>
  <tbody id="tb"></tbody>
 </table>
 <div class="empty">
  <b>אין רשומות מתאימות</b>
  אף אדם לא עונה על החיפוש והסינון שבחרת. נסה לנקות את החיפוש או לבחור סוג אחר.
 </div>
</div>

<nav class="pg" id="pg" aria-label="עימוד"></nav>

<p class="say">הטבלה מועתקת במדידה מ-Atlassian: שורה בגובה <bdi>48</bdi>, כותרת במשקל <bdi>653</bdi> בגודל <bdi>12/16</bdi> מעל קו <bdi>2px</bdi>, תא ב־<bdi>14/20</bdi>, וריפוד <bdi>4/8/4/0</bdi>. <b>אין קו בין השורות</b> — נמדד <bdi dir="ltr">border: 0px none</bdi>, והגובה לבדו מפריד. <b>הכותרת קטנה וחיוורת מהנתונים</b> בכוונה, כדי שמה שתראה יהיה השורות. <b>ובטעינה</b> הטבלה אינה מוחלפת בשלד אלא יורדת ל־<bdi>20%</bdi> שקיפות, כדי שלא תאבד את המקום שלך. <b>סטייה מחויבת:</b> האפיון שלך אוסר מחיקה — «מחיקה (רק «עזבה» עם תאריך)». לכן הפעולה היא <b>סימון «עזב»</b> עם תאריך, הרשומה נשמרת, והיא רק יוצאת מהתצוגה המסוננת. המיקוד עובר לשורה הבאה — זה המצב ה-14 והאחרון שאטלסיאן מתעדת, ובלעדיו המקלדת קופצת לראש העמוד.</p>

</div>
<script>
(function(){
 var ROWS=${JSON.stringify(D.rows.map(r => [r.id, r.name, r.kind, r.city, r.tie, r.sub]))};
 var R=ROWS.map(function(a){return {id:a[0],name:a[1],kind:a[2],city:a[3],tie:a[4],sub:a[5],left:null};});
 var PER=25, page=1, sortKey='name', sortDir=1, showLeft=false;
 var tb=document.getElementById('tb'), pg=document.getElementById('pg'),
     cnt=document.getElementById('cnt'), holder=document.getElementById('holder'),
     q=document.getElementById('q'), kf=document.getElementById('k');
 var HD='${esc(D.today.hd)} ${esc(D.today.hy)}';
 function ini(n){return n.split(' ').map(function(w){return w[0];}).join('').slice(0,2);}
 function esc(s){return String(s).replace(/[&<>"]/g,function(c){
   return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
 function view(){
  var t=q.value.trim(), k=kf.value;
  return R.filter(function(r){
   if(r.left&&!showLeft)return false;
   if(k&&r.kind!==k)return false;
   if(t&&r.name.indexOf(t)<0&&r.city.indexOf(t)<0&&String(r.tie).indexOf(t)<0)return false;
   return true;})
   .sort(function(a,b){var x=a[sortKey],y=b[sortKey];
    return (x>y?1:x<y?-1:0)*sortDir;});
 }
 function draw(keepPage){
  var v=view(), pages=Math.max(1,Math.ceil(v.length/PER));
  if(!keepPage)page=Math.min(page,pages);
  if(page<1)page=1;
  var slice=v.slice((page-1)*PER,page*PER);
  holder.classList.toggle('none',v.length===0);
  cnt.textContent=v.length?(v.length.toLocaleString('en-US')+' רשומות · עמוד '+page+' מתוך '+pages):'0 רשומות';
  tb.innerHTML=slice.map(function(r){
   return '<tr data-id="'+r.id+'">'+
    '<td><span class="nm"><span class="av" aria-hidden="true">'+esc(ini(r.name))+'</span>'+
     '<span><a href="#">'+esc(r.name)+'</a>'+
     (r.left?'<span class="sub">עזב · '+esc(r.left)+'</span>':(r.sub?'<span class="sub">'+esc(r.sub)+'</span>':''))+
     '</span></span></td>'+
    '<td><span class="tag">'+esc(r.kind)+'</span></td>'+
    '<td>'+esc(r.city)+'</td>'+
    '<td>'+esc(r.tie||'—')+'</td>'+
    '<td class="act">'+(r.left?'<span class="sub">ארכיון</span>':
      '<button class="leave" type="button" data-go="'+r.id+'">סימון «עזב»</button>')+'</td>'+
   '</tr>';}).join('');
  // עימוד עם קיצור, כמו במקור
  var out=['<button type="button" id="prev"'+(page===1?' disabled':'')+' aria-label="הקודם">‹</button>'];
  var set={1:1,2:1}; set[pages]=1; set[pages-1]=1;
  for(var i=page-1;i<=page+1;i++)if(i>=1&&i<=pages)set[i]=1;
  var last=0;
  Object.keys(set).map(Number).filter(function(n){return n>=1&&n<=pages;})
   .sort(function(a,b){return a-b;}).forEach(function(n){
    if(last&&n>last+1)out.push('<span class="gap">…</span>');
    out.push('<button type="button" data-p="'+n+'"'+(n===page?' aria-current="page"':'')+'>'+n+'</button>');
    last=n;});
  out.push('<button type="button" id="next"'+(page===pages?' disabled':'')+' aria-label="הבא">›</button>');
  pg.innerHTML=out.join('');
 }
 /* ---- המצב ה-14: המיקוד אחרי שהשורה יוצאת מהתצוגה ---- */
 function leave(id,btn){
  var tr=btn.closest('tr');
  /* המיקום נקרא לפני הציור מחדש. אחריו השורה מנותקת מה-DOM
     ו-indexOf מחזיר -1 — וזה בדיוק הכשל שהמצב הזה נועד למנוע. */
  var idx=Array.prototype.indexOf.call(tb.children,tr);
  R.find(function(x){return x.id===id;}).left=HD;
  draw(true);
  var rows=tb.children, target=null;
  if(rows.length){
   /* אותו מקום; ואם זו הייתה האחרונה — זו שלפניה */
   var pick=rows[Math.min(idx<0?0:idx,rows.length-1)];
   target=pick&&pick.querySelector('.leave');
   /* אם באותו מקום כבר יושבת רשומה מסומנת (אין לה כפתור) —
      מחפשים אחורה ואז קדימה את הכפתור הקרוב ביותר. */
   if(!target){
    for(var i=Math.min(idx<0?0:idx,rows.length-1);i>=0&&!target;i--)
     target=rows[i].querySelector('.leave');
    for(var j=Math.min(idx<0?0:idx,rows.length-1);j<rows.length&&!target;j++)
     target=rows[j].querySelector('.leave');
   }
  }
  (target||q).focus();
 }
 document.addEventListener('click',function(e){
  var s=e.target.closest('th.srt');
  if(s){var k=s.dataset.s;
   if(sortKey===k)sortDir=-sortDir;else{sortKey=k;sortDir=1;}
   document.querySelectorAll('th.srt').forEach(function(x){x.removeAttribute('aria-sort');});
   s.setAttribute('aria-sort',sortDir>0?'ascending':'descending');
   s.querySelector('.ar').textContent=sortDir>0?'▾':'▴';
   page=1;draw();return;}
  var g=e.target.closest('[data-go]');
  if(g){leave(g.dataset.go,g);return;}
  var b=e.target.closest('#pg button');
  if(b&&!b.disabled){
   if(b.id==='prev')page--; else if(b.id==='next')page++; else page=+b.dataset.p;
   draw(true);window.scrollTo({top:0,behavior:'smooth'});}
 });
 q.addEventListener('input',function(){page=1;draw();});
 kf.addEventListener('change',function(){page=1;draw();});
 document.getElementById('showLeft').addEventListener('click',function(){
  showLeft=!showLeft;this.setAttribute('aria-pressed',String(showLeft));
  this.textContent=showLeft?'הסתרת מי שעזב':'הצגת מי שעזב';page=1;draw();});
 document.getElementById('load').addEventListener('click',function(){
  holder.classList.add('load');
  setTimeout(function(){holder.classList.remove('load');},1600);});
 document.querySelector('th.srt').setAttribute('aria-sort','ascending');
 document.querySelector('th.srt .ar').textContent='▾';
 draw();
})();
</script>
</body></html>`;

writeFileSync(join(here, 'tavla.html'), html);
console.log('tavla.html · ' + D.rows.length + ' רשומות · ' +
  KIND_ORDER.map(k => k + ' ' + D.rows.filter(r => r.kind === k).length).join(' · ') +
  ' · עמודים ' + Math.ceil(D.rows.length / 25));
