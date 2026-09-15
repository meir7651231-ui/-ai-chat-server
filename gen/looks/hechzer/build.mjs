/* build.mjs — טופס החזר כספי, מועתק במדידה ממערכת-העיצוב של GOV.UK.
   שלושת הכללים החוסמים באים מהאפיון (גבייה / החזר כספי), לא מהדמיון.
   הרצה: node gen/looks/hechzer/build.mjs                                     */
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
  /* המשפחה עם הכי הרבה תשלומים — כדי שתהיה אמיתית בחירה של «תשלום מקורי» */
  const cnt = {}; DB.payments.forEach(p => cnt[p.familyId] = (cnt[p.familyId]||0)+1);
  const fid = Object.entries(cnt).sort((a,b)=>b[1]-a[1])[0][0];
  const f = fam(fid);
  /* מי רשם כל תשלום — נגזר מהצוות (מזכירות/הנהלה), כמו כל שאר העולם כאן */
  const clerks = DB.staff.filter(s => ['מזכירות','הנהלה'].includes(s.role)).map(s => nameOf(s.personId));
  const pays = DB.payments.filter(p => p.familyId === f.id)
    .map((p,i) => ({ id:'y'+i, amount:p.amount, method:p.method, ago:p.ago,
      by: clerks[i % clerks.length] }));
  return { fam:{ name:f.name, city:f.city, head:nameOf(f.head), kids:f.kids.length,
      due:discounted(f), paid:f.paid, bal:balance(f) },
    pays, clerks, today:DB.today,
    forb: forbiddenOf('גבייה','החזר כספי'),
    fields: fieldsOf('גבייה','החזר כספי').map(x=>x[0]) };
`)(SPEC);

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
const money = n => Math.round(n).toLocaleString('en-US');

/* המצב שהעמוד נפתח בו: שלוש השגיאות פעילות. זה הרכיב — אין טעם
   להראות טופס ריק כשמה שמדדנו הוא מה שקורה כשטועים.               */
const P0 = D.pays[0];

const html = `<!doctype html>
<html lang="he" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>החזר כספי למשפחה</title>
<meta name="description" content="טופס החזר כספי עם שחזור-משגיאה, מועתק במדידה ממערכת-העיצוב של GOV.UK.">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;700&display=swap">
<style>
*{box-sizing:border-box}html,body{overflow-x:hidden}
:root{
 /* ===== נמדד ממערכת-העיצוב החיה של GOV.UK ===== */
 --bg:#ffffff;--ink:#0b0c0c;--mut:#484949;
 --err:#ca3535;          /* גבול 5px בסיכום · 2px בשדה · טקסט 700 19/25 */
 --go:#0f7a52;--goEdge:#083d29;   /* הכפתור והצל המלא 0 2px 0 שמתחתיו */
 --focus:#ffdd00;        /* המיקוד הצהוב — הופך את הרכיב, לא מקיף אותו */
 --line:#b1b4b6;--blue:#1d70b8;
 --fs:19px;--lh:25px}
@media(prefers-color-scheme:dark){:root:not([data-theme=light]){
 --bg:#0b0c0c;--ink:#ffffff;--mut:#b1b4b6;--line:#6f777b;
 --err:#ff726f;--blue:#5aa8e8}}
:root[data-theme=dark]{--bg:#0b0c0c;--ink:#ffffff;--mut:#b1b4b6;--line:#6f777b;
 --err:#ff726f;--blue:#5aa8e8}
body{margin:0;background:var(--bg);color:var(--ink);
 font:400 var(--fs)/var(--lh) Heebo,arial,sans-serif}
h1,h2{margin:0}p{margin:0}bdi{unicode-bidi:isolate}
a{color:var(--blue);text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:1px}
/* המיקוד של GOV.UK: רקע צהוב + קו תחתון שחור מלא. לא טבעת. */
a:focus,button:focus,input:focus,select:focus{
 outline:3px solid transparent;background:var(--focus);color:#0b0c0c;
 box-shadow:0 -2px var(--focus),0 4px #0b0c0c;text-decoration:none}
.hid{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}

.brand{background:#0b0c0c;color:#fff;padding:10px 0}
.brand .in{max-width:960px;margin:0 auto;padding:0 15px;font:700 var(--fs)/var(--lh) Heebo}
.strip{height:10px;background:var(--blue)}
.wrap{max-width:960px;margin:0 auto;padding:30px 15px 80px}
.col{max-width:640px}

/* ---------- סיכום-השגיאות: גבול 5px, ריפוד 20, אפס רדיוס ---------- */
.sum{border:5px solid var(--err);padding:20px;margin-bottom:30px}
.sum h2{font:700 24px/30px Heebo;color:var(--ink);margin-bottom:15px}
.sum ul{margin:0;padding:0;list-style:none}
.sum li{margin-bottom:5px}
.sum a{color:var(--err);font:700 var(--fs)/var(--lh) Heebo;
 text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:1px}
.sum[hidden]{display:none}

h1{font:700 36px/40px Heebo;margin-bottom:8px}
.cap{color:var(--mut);margin-bottom:26px}
.who{border-inline-start:10px solid var(--line);padding:10px 15px;margin-bottom:30px}
.who b{display:block;font:700 var(--fs)/var(--lh) Heebo}
.who span{color:var(--mut)}

.grp{margin-bottom:30px;padding-inline-start:0}
.grp.bad{border-inline-start:5px solid var(--err);padding-inline-start:15px}
label,legend{display:block;font:700 var(--fs)/var(--lh) Heebo;margin-bottom:5px;padding:0}
fieldset{border:0;margin:0;padding:0}
.hint{color:var(--mut);margin-bottom:5px}
.msg{font:700 var(--fs)/var(--lh) Heebo;color:var(--err);margin-bottom:15px}
.msg[hidden]{display:none}
input[type=text],select{
 font:400 var(--fs)/var(--lh) Heebo;height:40px;padding:5px;border-radius:0;
 border:2px solid var(--ink);background:var(--bg);color:var(--ink);width:100%;max-width:400px}
.grp.bad input,.grp.bad select{border-color:var(--err)}
.prefix{display:flex;align-items:stretch;max-width:400px}
.prefix span{display:grid;place-items:center;padding:0 12px;border:2px solid var(--ink);
 border-inline-end:0;background:#f3f2f1;color:#0b0c0c;font:400 var(--fs)/1 Heebo}
.grp.bad .prefix span{border-color:var(--err)}
.radios{margin-top:10px}
.radio{display:flex;align-items:flex-start;gap:12px;padding:8px 0}
.radio input{width:32px;height:32px;flex:none;margin:0;accent-color:var(--ink)}
.radio label{font:400 var(--fs)/var(--lh) Heebo;margin:0;cursor:pointer}

/* ---------- הכפתור: אפס רדיוס, צל מלא 0 2px 0 ---------- */
.go{background:var(--go);color:#fff;border:2px solid transparent;border-radius:0;
 font:400 var(--fs)/19px Heebo;padding:8px 12px 7px;box-shadow:0 2px 0 var(--goEdge);
 margin-bottom:2px}
.go:hover{background:#0c6343}
.go:focus{background:var(--focus);color:#0b0c0c;box-shadow:0 2px 0 #0b0c0c}
.go:active{top:2px;position:relative;box-shadow:none}
.ok{border:5px solid var(--go);padding:20px;margin-bottom:30px}
.ok h2{font:700 24px/30px Heebo;margin-bottom:10px}
.ok[hidden]{display:none}
.note{margin-top:40px;padding-top:20px;border-top:1px solid var(--line);
 color:var(--mut);font-size:16px;line-height:22px;max-width:70ch}
@media(max-width:480px){h1{font:700 28px/32px Heebo}}
@media(prefers-reduced-motion:reduce){*{transition:none!important}}
</style></head><body>

<div class="brand"><div class="in">מוסדות — גבייה</div></div>
<div class="strip" aria-hidden="true"></div>

<div class="wrap"><div class="col">

 <div class="sum" id="sum" role="alert" tabindex="-1" aria-labelledby="sumT">
  <h2 id="sumT">יש בעיה</h2>
  <ul id="sumL"></ul>
 </div>

 <div class="ok" id="ok" hidden role="status" tabindex="-1">
  <h2>ההחזר נרשם</h2>
  <p id="okT"></p>
 </div>

 <h1>רישום החזר כספי</h1>
 <p class="cap">כסף שיוצא מהקופה. שלושת הכללים למטה הם של האפיון — הם חוסמים, לא מזהירים.</p>

 <div class="who">
  <b>${esc(D.fam.name)}</b>
  <span>${esc(D.fam.head)} · ${esc(D.fam.city)} · ${D.fam.kids} ילדים · שולם השנה <bdi>${money(D.fam.paid)}</bdi> ₪</span>
 </div>

 <form id="f" novalidate>

  <div class="grp" id="g1">
   <label for="orig">על איזה תשלום ההחזר?</label>
   <p class="hint" id="h1">אפשר להחזיר רק כנגד תשלום שנקלט. האפיון אוסר החזר בלי תשלום מקורי.</p>
   <p class="msg" id="m1" hidden></p>
   <select id="orig" aria-describedby="h1 m1">
    <option value="">בחרו תשלום</option>
    ${D.pays.map(p => `<option value="${p.id}" data-by="${esc(p.by)}" data-amt="${p.amount}">${money(p.amount)} ₪ · ${esc(p.method)} · לפני ${p.ago} חודשים · נרשם בידי ${esc(p.by)}</option>`).join('\n    ')}
   </select>
  </div>

  <div class="grp" id="g2">
   <label for="amt">סכום ההחזר</label>
   <p class="hint" id="h2">לא יותר מהתשלום המקורי.</p>
   <p class="msg" id="m2" hidden></p>
   <div class="prefix"><span aria-hidden="true">₪</span>
    <input type="text" id="amt" inputmode="numeric" aria-describedby="h2 m2" value="${P0.amount}"></div>
  </div>

  <div class="grp" id="g3">
   <fieldset aria-describedby="h3 m3">
    <legend>אמצעי ההחזר</legend>
    <p class="hint" id="h3">האפיון אוסר החזר במזומן מעל <bdi>1,000</bdi> ₪.</p>
    <p class="msg" id="m3" hidden></p>
    <div class="radios">
     ${['מזומן', 'העברה בנקאית', 'זיכוי בחשבון המשפחה'].map((m, i) => `<div class="radio">
      <input type="radio" name="way" id="w${i}" value="${esc(m)}"${i === 0 ? ' checked' : ''}>
      <label for="w${i}">${esc(m)}</label></div>`).join('\n     ')}
    </div>
   </fieldset>
  </div>

  <div class="grp" id="g4">
   <label for="apr">מי מאשר את ההחזר?</label>
   <p class="hint" id="h4">הפרדת תפקידים: מי שרשם את התשלום אינו יכול לאשר את החזרתו.</p>
   <p class="msg" id="m4" hidden></p>
   <select id="apr" aria-describedby="h4 m4">
    <option value="">בחרו מאשר</option>
    ${D.clerks.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join('\n    ')}
   </select>
  </div>

  <button class="go" type="submit">רישום ההחזר</button>
 </form>

 <p class="note">הרכיב מועתק במדידה ממערכת-העיצוב של GOV.UK: סיכום-שגיאות בגבול <bdi>5px</bdi> ובריפוד <bdi>20</bdi>, כותרת <bdi>700 24/30</bdi>, קישורי-שגיאה <bdi>700 19/25</bdi> בקו תחתון, שדה בגובה <bdi>40</bdi> עם גבול <bdi>2px</bdi>, כפתור בצל מלא <bdi>0 2px 0</bdi> — ואפס עיגול פינות בכל המסמך. המיקוד הצהוב <bdi>#ffdd00</bdi> הופך את הרכיב במקום להקיף אותו, כדי שייראה גם למי שאינו מבחין בצבע. נוסח ההודעות הוא הכלל של המקור: <em>אומרים מה לעשות, לא מה השתבש</em>.</p>

</div></div>

<script>
(function(){
 var f=document.getElementById('f'),sum=document.getElementById('sum'),
     L=document.getElementById('sumL'),ok=document.getElementById('ok');
 var F=[{g:'g1',m:'m1',c:'orig'},{g:'g2',m:'m2',c:'amt'},{g:'g3',m:'m3',c:'w0'},{g:'g4',m:'m4',c:'apr'}];
 function num(s){return parseInt(String(s).replace(/[^0-9]/g,''),10);}
 function check(){
  var o=document.getElementById('orig'),amt=document.getElementById('amt'),
      apr=document.getElementById('apr'),
      way=(document.querySelector('input[name=way]:checked')||{}).value||'',
      sel=o.options[o.selectedIndex],
      by=sel?sel.getAttribute('data-by'):'', max=sel?num(sel.getAttribute('data-amt')):0,
      v=num(amt.value), e=[];
  /* שלושת האיסורים של האפיון, מילה במילה */
  if(!o.value) e.push({id:'orig',g:'g1',m:'m1',t:'בחרו את התשלום שההחזר מתייחס אליו'});
  if(!v||v<=0) e.push({id:'amt',g:'g2',m:'m2',t:'הזינו סכום החזר במספרים'});
  else if(sel&&v>max) e.push({id:'amt',g:'g2',m:'m2',t:'הזינו סכום של '+max.toLocaleString('en-US')+' ₪ או פחות — כגובה התשלום המקורי'});
  if(way==='מזומן'&&v>1000) e.push({id:'w0',g:'g3',m:'m3',t:'בחרו העברה בנקאית או זיכוי — מזומן מותר עד 1,000 ₪ בלבד'});
  if(!apr.value) e.push({id:'apr',g:'g4',m:'m4',t:'בחרו מי מאשר את ההחזר'});
  else if(by&&apr.value===by) e.push({id:'apr',g:'g4',m:'m4',t:'בחרו מאשר אחר — '+by+' רשם את התשלום הזה ואינו יכול לאשר את החזרתו'});
  return e;
 }
 function paint(e){
  F.forEach(function(x){document.getElementById(x.g).classList.remove('bad');
   var m=document.getElementById(x.m);m.hidden=true;m.textContent='';});
  L.innerHTML='';
  if(!e.length){sum.hidden=true;return;}
  sum.hidden=false;ok.hidden=true;
  e.forEach(function(x){
   document.getElementById(x.g).classList.add('bad');
   var m=document.getElementById(x.m);m.hidden=false;m.textContent='שגיאה: '+x.t;
   var li=document.createElement('li'),a=document.createElement('a');
   a.href='#'+x.id;a.textContent=x.t;
   a.addEventListener('click',function(ev){ev.preventDefault();
    var el=document.getElementById(x.id);el.focus();
    el.scrollIntoView({block:'center',behavior:'smooth'});});
   li.appendChild(a);L.appendChild(li);});
 }
 f.addEventListener('submit',function(ev){ev.preventDefault();
  var e=check();paint(e);
  if(e.length){sum.focus();return;}
  var amt=num(document.getElementById('amt').value);
  document.getElementById('okT').textContent=
   'החזר של '+amt.toLocaleString('en-US')+' ₪ נרשם ל${esc(D.fam.name)}, באישור '+
   document.getElementById('apr').value+'.';
  ok.hidden=false;ok.focus();});
 /* העמוד נפתח במצב-שגיאה — זה הרכיב שנמדד */
 paint(check());
})();
</script>
</body></html>`;

writeFileSync(join(here, 'hechzer.html'), html);
console.log('hechzer.html · תשלומים ' + D.pays.length + ' · פקידים ' + D.clerks.length +
  ' · איסורי-אפיון ' + D.forb.length);
