/* תקשורת — עורך עם תצוגה-מקדימה חיה. כותבים מימין, רואים בטלפון משמאל.
   המבנה הייחודי: שני חצאים שמדברים זה עם זה בזמן-אמת. אין רשימה ואין לוח. */
import { navDrawer, ltr } from '../base.mjs';

const GROUPS = [['הורי כיתה ז׳', 31], ['כל ההורים', 412], ['צוות חינוכי', 18], ['תורמים · פרנסים', 64], ['ועד ההורים', 9]];
const TPL = [
  ['תזכורת תשלום', 'שלום {שם}, נותרה יתרה של {סכום} בשכר הלימוד לחודש {חודש}. ניתן לשלם בקישור: {קישור}. תזכורת בלבד — אם שולם, נא להתעלם.'],
  ['ביטול לימודים', 'הורים יקרים, בשל {סיבה} אין לימודים ביום {יום}. ההסעות מבוטלות. נעדכן על השלמה.'],
  ['הזמנה לאירוע', 'בשמחה רבה מוזמנים ל{אירוע} ביום {יום} בשעה {שעה} באולם המוסד. הכניסה חופשית.'],
  ['הודעה חופשית', ''],
];
const SENT = [['תזכורת תשלום · כיתה ז׳', '31 נשלחו', '2 נכשלו', 'אתמול'],
['ביטול לימודים · סערה', '412 נשלחו', '0 נכשלו', 'לפני 3 ימים'],
['עלון פרשת נצבים', '388 פתחו מתוך 412', '', 'לפני שבוע']];

export default {
  id: 'tikshor',
  name: 'תקשורת',
  title: 'תקשורת — מוסד',
  desc: 'עורך ההודעות עם תצוגה מקדימה חיה, קבוצות תפוצה והיסטוריית שליחה.',
  css: `
.hd{display:flex;align-items:center;gap:var(--s3);flex-wrap:wrap;padding:var(--s4);border-block-end:1px solid var(--hair)}
.hd h1{font-size:20px}.hd .sp{flex:1}

.work{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,380px);gap:0;align-items:start}
.editor{padding:var(--s4);display:grid;gap:var(--s4)}
fieldset{border:0;padding:0;margin:0}
legend{font-size:12.5px;color:var(--mut);margin-bottom:var(--s2);padding:0}
.chips{display:flex;gap:var(--s2);flex-wrap:wrap}
.chips label{display:inline-flex;align-items:center;gap:7px;border:1px solid var(--hair);background:var(--card);
 border-radius:999px;padding:8px 14px;font-size:13.5px;cursor:pointer;min-height:40px}
.chips input{accent-color:var(--acc);margin:0}
.chips label:has(input:checked){border-color:var(--acc);background:var(--acc-soft);color:var(--acc);font-weight:600}
.chips .cnt{font-size:11.5px;color:var(--mut)}
.chips label:has(input:checked) .cnt{color:inherit}

select,textarea,input[type=text]{width:100%;border:1px solid var(--hair);background:var(--card);border-radius:12px;
 padding:11px var(--s3);font-size:14.5px;outline:0;min-height:44px}
select:focus,textarea:focus,input:focus{border-color:var(--acc)}
textarea{min-height:150px;line-height:1.6;resize:vertical}
.vars{display:flex;gap:6px;flex-wrap:wrap;margin-top:var(--s2)}
.vars button{border:1px dashed var(--hair);background:var(--sunk);border-radius:8px;padding:5px 10px;font-size:12px;color:var(--mut);min-height:34px}
.vars button:hover{border-color:var(--acc);color:var(--acc)}
.meter{display:flex;gap:var(--s4);font-size:12.5px;color:var(--mut);margin-top:var(--s2);flex-wrap:wrap}
.meter b{color:var(--ink);font-variant-numeric:tabular-nums}
.meter .over b{color:var(--err)}
.send{display:flex;gap:var(--s2);flex-wrap:wrap;align-items:center}
.send button{border:1px solid var(--hair);background:var(--card);border-radius:var(--rs);padding:11px 18px;font-size:14.5px;min-height:46px}
.send button.pri{background:var(--acc);border-color:var(--acc);color:var(--on-acc);font-weight:700}
.send .note{font-size:12.5px;color:var(--mut)}

.preview{padding:var(--s4);background:var(--sunk);border-inline-start:1px solid var(--hair);
 position:sticky;top:0;min-height:100vh}
.preview h2{font-size:13px;color:var(--mut);font-weight:400;margin-bottom:var(--s3)}
.phone{background:var(--card);border:1px solid var(--hair);border-radius:26px;padding:var(--s4) var(--s3) var(--s5);
 box-shadow:0 10px 30px rgba(0,0,0,.09);max-width:320px;margin-inline:auto}
.phone .bar{display:flex;justify-content:space-between;font-size:11px;color:var(--mut);padding:0 var(--s2) var(--s3)}
.phone .from{font-size:12.5px;color:var(--mut);text-align:center;padding-bottom:var(--s2);border-block-end:1px solid var(--hair);margin-bottom:var(--s3)}
.bubble{background:var(--acc-soft);color:var(--ink);border-radius:16px 16px 16px 4px;padding:var(--s3);
 font-size:14px;line-height:1.55;white-space:pre-wrap;word-break:break-word}
.bubble .var{background:var(--card);border-radius:5px;padding:0 4px;color:var(--acc);font-weight:600}
.stamp{font-size:11px;color:var(--mut);text-align:end;margin-top:6px}
.previewfoot{font-size:12px;color:var(--mut);margin-top:var(--s4);text-align:center;line-height:1.6}

.hist{padding:var(--s5) var(--s4) var(--s7);border-block-start:1px solid var(--hair);grid-column:1/-1}
.hist h2{font-size:16px;margin-bottom:var(--s3)}
.hist li{display:flex;gap:var(--s3);align-items:baseline;flex-wrap:wrap;padding:11px 0;border-block-end:1px solid var(--hair);font-size:13.5px}
.hist .t{font-weight:600;flex:1;min-width:180px}
.hist .ok{color:var(--ok);font-size:12.5px}
.hist .bad{color:var(--err);font-size:12.5px}
.hist .when{color:var(--mut);font-size:12.5px}

@media(max-width:860px){.work{grid-template-columns:1fr}.preview{position:static;min-height:0;border-inline-start:0;border-block-start:1px solid var(--hair)}}
@media print{.send,.vars,.nav{display:none!important}}
`,
  body: `
<header class="hd">
  <h1>תקשורת</h1>
  <span class="sp"></span>
  <span style="font-size:12.5px;color:var(--mut)">שלוחה ${ltr('073-000-0000')} · נתוני דוגמה</span>
  ${navDrawer('tikshor')}
</header>

<div class="work">
  <main id="main" class="editor">
    <fieldset>
      <legend>למי</legend>
      <div class="chips">
        ${GROUPS.map(([n, c], i) => `<label><input type="checkbox" class="grp" data-c="${c}" ${i === 0 ? 'checked' : ''}>${n}<span class="cnt">${c}</span></label>`).join('')}
      </div>
    </fieldset>

    <fieldset>
      <legend>תבנית</legend>
      <select id="tpl">${TPL.map(([n], i) => `<option value="${i}">${n}</option>`).join('')}</select>
    </fieldset>

    <fieldset>
      <legend>נוסח</legend>
      <textarea id="txt" aria-describedby="meter">${TPL[0][1]}</textarea>
      <div class="vars">
        <span style="font-size:12px;color:var(--mut);align-self:center">הוספת שדה:</span>
        ${['{שם}', '{סכום}', '{חודש}', '{כיתה}', '{קישור}'].map(v => `<button data-v="${v}">${v}</button>`).join('')}
      </div>
      <p class="meter" id="meter">
        <span>תווים: <b id="chars">0</b></span>
        <span>מקטעי SMS: <b id="segs">1</b></span>
        <span>נמענים: <b id="rcpt">0</b></span>
        <span>עלות משוערת: <b id="cost">₪0</b></span>
      </p>
    </fieldset>

    <div class="send">
      <button class="pri" id="sendBtn">שליחה עכשיו</button>
      <button>תזמון למוצ״ש</button>
      <button>שמירה כתבנית</button>
      <span class="note">שליחה לא מתבצעת בשבת ובחג — נדחית אוטומטית.</span>
    </div>
  </main>

  <aside class="preview">
    <h2>כך זה ייראה אצל ההורה</h2>
    <div class="phone">
      <div class="bar"><span>${ltr('13:48')}</span><span>${ltr('SMS')}</span></div>
      <p class="from">המוסד</p>
      <div class="bubble" id="bub"></div>
      <p class="stamp">נמסר · ${ltr('13:48')}</p>
    </div>
    <p class="previewfoot">השדות בסוגריים מוחלפים לכל נמען בנפרד.<br>
       התצוגה מתעדכנת עם כל הקלדה.</p>
  </aside>

  <section class="hist">
    <h2>נשלחו לאחרונה</h2>
    <ul>
      ${SENT.map(([t, ok, bad, when]) => `<li><span class="t">${t}</span>
        <span class="ok">${ok}</span>${bad ? `<span class="bad">${bad}</span>` : ''}<span class="when">${when}</span></li>`).join('')}
    </ul>
  </section>
</div>`,
  js: `
const TPL=${JSON.stringify(TPL)};
const txt=document.getElementById('txt'), bub=document.getElementById('bub');
const esc=s=>s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));

function paint(){
 const s=txt.value;
 bub.innerHTML=esc(s).replace(/\\{[^}]+\\}/g,m=>'<span class="var">'+m+'</span>')||'<span style="color:var(--mut)">הנוסח יופיע כאן…</span>';
 const n=s.length, segs=Math.max(1,Math.ceil(n/(/[֐-׿]/.test(s)?70:160)));
 const rcpt=[...document.querySelectorAll('.grp')].filter(c=>c.checked).reduce((a,c)=>a+ +c.dataset.c,0);
 document.getElementById('chars').textContent=n;
 document.getElementById('segs').textContent=segs;
 document.getElementById('rcpt').textContent=rcpt;
 document.getElementById('cost').innerHTML='<bdi dir="ltr">₪'+(segs*rcpt*0.07).toFixed(2)+'</bdi>';
 document.getElementById('meter').querySelectorAll('span').forEach(x=>x.classList.remove('over'));
 if(segs>2)document.getElementById('segs').parentElement.classList.add('over');
}
txt.addEventListener('input',paint);
document.querySelectorAll('.grp').forEach(c=>c.addEventListener('change',paint));
document.getElementById('tpl').addEventListener('change',e=>{txt.value=TPL[+e.target.value][1];paint();});
document.querySelectorAll('.vars button').forEach(b=>b.onclick=()=>{
 const p=txt.selectionStart??txt.value.length;
 txt.value=txt.value.slice(0,p)+b.dataset.v+txt.value.slice(txt.selectionEnd??p);
 txt.focus(); txt.selectionStart=txt.selectionEnd=p+b.dataset.v.length; paint();
});
document.getElementById('sendBtn').onclick=()=>{
 const n=document.getElementById('rcpt').textContent;
 document.querySelector('.send .note').textContent='דוגמה בלבד — לא נשלח. היה נשלח ל-'+n+' נמענים.';
};
paint();
`,
};
