/* תפעול — מפת-קו. הקו נמשך כמו מפת-רכבת: תחנות על ציר, שעה מתחת, והאוטובוס מסומן עליו.
   המבנה הייחודי: דיאגרמה. לא טבלה ולא כרטיסים — קו אחד גדול שקוראים משמאל לימין… כלומר מימין לשמאל. */
import { navDrawer, ltr } from '../base.mjs';

/* [שם, נהג, צבע, [[תחנה, שעה, נוסעים]…], מיקום-נוכחי (אינדקס תחנה, שבר)] */
const LINES = [
  ['קו 1 · ירושלים מרכז', 'ר׳ ג. אדלר', 1, [['גאולה', '07:00', 14], ['מאה שערים', '07:08', 9], ['בר אילן', '07:17', 12], ['רמות ג׳', '07:29', 7], ['המוסד', '07:45', 0]], [2, 0.4]],
  ['קו 2 · בית שמש', 'מר י. שוורץ', 2, [['רמב״ש א׳', '06:40', 11], ['רמב״ש ב׳', '06:48', 16], ['נהר הירדן', '06:56', 8], ['המוסד', '07:40', 0]], [1, 0.7]],
  ['קו 3 · ביתר', 'ר׳ מ. שטרן', 3, [['גבעה א׳', '06:50', 10], ['גבעה ב׳', '06:58', 13], ['המוסד', '07:42', 0]], [0, 0.2]],
  ['קו 4 · מודיעין עילית', 'ללא נהג', 5, [['קרית ספר', '06:45', 18], ['גרין פארק', '06:55', 9], ['המוסד', '07:38', 0]], null],
  ['קו 5 · בני ברק', 'מר א. פישר', 4, [['רבי עקיבא', '06:35', 12], ['חזון איש', '06:44', 7], ['המוסד', '07:35', 0]], [1, 0.9]],
  ['קו 6 · פנימייה · פיזור', 'ר׳ ג. אדלר', 6, [['המוסד', '16:10', 0], ['רמות', '16:32', 6], ['גאולה', '16:48', 9], ['בית שמש', '17:20', 11]], null],
];

const CALLS = [
  ['דוד חם לא עובד · פנימייה קומה ב׳', 'דחוף', 2, 'ב. נוימן (מחלה)'],
  ['נזילה במטבח · מתחת לכיור', 'דחוף', 1, 'מ. שטרן'],
  ['תאורה בחדר 14', 'רגיל', 4, 'לא שובץ'],
  ['דלת הכיתה לא ננעלת', 'רגיל', 6, 'מ. שטרן'],
  ['צביעת מסדרון מזרחי', 'כשיתאפשר', 21, 'לא שובץ'],
];

export default {
  id: 'tifol',
  name: 'תפעול',
  title: 'תפעול — מוסד',
  desc: 'קווי ההסעה כמפת קו, ולוח קריאות השירות הפתוחות.',
  css: `
.hd{display:flex;align-items:center;gap:var(--s3);flex-wrap:wrap;padding:var(--s4);max-width:1100px;margin-inline:auto}
.hd h1{font-size:20px}.hd .sp{flex:1}
main{max-width:1100px;margin-inline:auto;padding:0 var(--s4) var(--s7)}

.picker{display:flex;gap:var(--s2);overflow-x:auto;padding-bottom:var(--s3)}
.picker button{flex:none;border:1px solid var(--hair);background:var(--card);border-radius:999px;
 padding:8px 15px;font-size:13.5px;min-height:40px;display:flex;align-items:center;gap:7px}
.picker button i{width:9px;height:9px;border-radius:50%;display:inline-block}
.picker button[aria-pressed=true]{border-color:var(--ink);font-weight:700}
.picker button.noDriver{border-style:dashed}

.linehead{display:flex;align-items:baseline;gap:var(--s3);flex-wrap:wrap;margin:var(--s4) 0 var(--s2)}
.linehead h2{font-size:19px}
.linehead .drv{font-size:13px;color:var(--mut)}
.linehead .alert{font-size:12.5px;font-weight:700;color:var(--err);background:var(--err-soft);border-radius:999px;padding:3px 11px}

.map{background:var(--card);border:1px solid var(--hair);border-radius:var(--r);padding:var(--s5) var(--s4);overflow-x:auto}
.map svg{display:block;min-width:560px;width:100%;height:auto}
.map text{font:600 12px Heebo;fill:var(--ink)}
.map text.t2{font:400 11px Heebo;fill:var(--mut)}
.map text.t3{font:700 10.5px Heebo}
.riders{display:flex;gap:var(--s4);flex-wrap:wrap;margin-top:var(--s4);font-size:13px;color:var(--mut)}
.riders b{color:var(--ink);font-variant-numeric:tabular-nums}

.calls{margin-top:var(--s6)}
.calls h2{font-size:17px;margin-bottom:var(--s1)}
.calls p.s{font-size:13px;color:var(--mut);margin-bottom:var(--s3)}
.calls li{display:grid;grid-template-columns:auto minmax(0,1fr) auto auto;gap:var(--s3);align-items:center;
 padding:var(--s3) 0;border-block-end:1px solid var(--hair);font-size:13.5px}
.calls .sev{width:9px;height:9px;border-radius:50%;background:var(--faint)}
.calls .d1 .sev{background:var(--err)}
.calls .d2 .sev{background:var(--warn)}
.calls .age{font-size:12px;color:var(--mut);white-space:nowrap}
.calls .own{font-size:12px;white-space:nowrap}
.calls .own.none{color:var(--err)}

@media print{.picker,.nav{display:none!important}.map{break-inside:avoid}}
`,
  body: `
<header class="hd">
  <h1>תפעול · הסעות ואחזקה</h1>
  <span class="sp"></span>
  ${navDrawer('tifol')}
</header>

<main id="main">
  <div class="picker" role="group" aria-label="בחירת קו">
    ${LINES.map((l, i) => `<button data-i="${i}" aria-pressed="${i === 0}" class="${l[1] === 'ללא נהג' ? 'noDriver' : ''}">
      <i style="background:var(--c${l[2]})"></i>${l[0].split(' · ')[0]}<span style="color:var(--mut)">${l[0].split(' · ')[1]}</span></button>`).join('')}
  </div>

  <div class="linehead" id="lh"></div>
  <div class="map" id="map"></div>
  <p class="riders" id="riders"></p>

  <section class="calls">
    <h2>קריאות שירות פתוחות</h2>
    <p class="s">5 פתוחות · 2 דחופות · אחת מהן על עובד שבמחלה</p>
    <ul>
      ${CALLS.map(([t, sev, days, who]) => `<li class="d${sev === 'דחוף' ? 1 : sev === 'רגיל' ? 2 : 3}">
        <span class="sev" aria-hidden="true"></span>
        <span>${t}<br><span class="age">${sev}</span></span>
        <span class="age">${days} ימים</span>
        <span class="own ${who === 'לא שובץ' ? 'none' : ''}">${who}</span></li>`).join('')}
    </ul>
  </section>
</main>`,
  js: `
const LINES=${JSON.stringify(LINES)};
const lh=document.getElementById('lh'), map=document.getElementById('map'), riders=document.getElementById('riders');
const ltr=s=>'<bdi dir="ltr">'+s+'</bdi>';

/* הקו מצויר לפי מספר התחנות — מרווח שווה, התחנה הראשונה בימין */
function draw(i){
 const [name,drv,c,stops,at]=LINES[i];
 const W=760, pad=64, y=64;
 const step=(W-pad*2)/(stops.length-1);
 const x=k=>W-pad-k*step;
 let s='<svg viewBox="0 0 '+W+' 132" role="img" aria-label="'+name+': '+stops.map(st=>st[0]+' ב-'+st[1]).join(', ')+'">';
 s+='<line x1="'+x(0)+'" y1="'+y+'" x2="'+x(stops.length-1)+'" y2="'+y+'" stroke="var(--c'+c+')" stroke-width="7" stroke-linecap="round"></line>';
 stops.forEach((st,k)=>{
  const last=k===stops.length-1;
  s+='<circle cx="'+x(k)+'" cy="'+y+'" r="'+(last?10:7)+'" fill="var(--card)" stroke="var(--c'+c+')" stroke-width="4"></circle>';
  s+='<text x="'+x(k)+'" y="'+(y-22)+'" text-anchor="middle">'+st[0]+'</text>';
  s+='<text class="t2" x="'+x(k)+'" y="'+(y+30)+'" text-anchor="middle" dir="ltr">'+st[1]+'</text>';
  if(st[2])s+='<text class="t3" x="'+x(k)+'" y="'+(y+46)+'" text-anchor="middle" fill="var(--c'+c+')">'+st[2]+' נוסעים</text>';
 });
 if(at){
  const bx=x(at[0])-step*at[1];
  s+='<g transform="translate('+bx+','+(y)+')"><rect x="-15" y="-13" width="30" height="26" rx="7" fill="var(--c'+c+')"></rect>'+
     '<text x="0" y="5" text-anchor="middle" fill="var(--on-acc)" style="font-size:13px">🚌</text></g>';
 }
 map.innerHTML=s+'</svg>';
 lh.innerHTML='<h2>'+name+'</h2><span class="drv">נהג: '+drv+'</span>'+
  (at?'<span class="drv">בדרך · '+Math.round((1-at[1])*100)+'% לתחנה הבאה</span>':'')+
  (drv==='ללא נהג'?'<span class="alert">אין נהג משובץ למחר</span>':'');
 const tot=stops.reduce((a,st)=>a+st[2],0);
 riders.innerHTML='<span>סך נוסעים בקו: <b>'+tot+'</b></span><span>תחנות: <b>'+stops.length+'</b></span>'+
  '<span>יציאה: <b>'+ltr(stops[0][1])+'</b> · הגעה: <b>'+ltr(stops[stops.length-1][1])+'</b></span>';
}
document.querySelector('.picker').addEventListener('click',e=>{
 const b=e.target.closest('[data-i]'); if(!b)return;
 document.querySelectorAll('.picker button').forEach(x=>x.setAttribute('aria-pressed','false'));
 b.setAttribute('aria-pressed','true'); draw(+b.dataset.i);
});
draw(0);
`,
};
