/* אנשים — ספר-אנשים. סרגל א׳–ת׳ דביק, קיבוץ לפי אות, ולוח-קשרים מצויר.
   המבנה הייחודי: אינדקס-אלפבית + גרף-משפחה ב-SVG. אין אריחים, אין טבלה, אין מדפים. */
import { navDrawer, ltr } from '../base.mjs';

/* [שם, אות-מיון, תפקיד, עיר, טלפון, צבע, אב, אם, בן/בת-זוג, ילדים] */
const P = [
  ['אברהם ברגר', 'א', 'ראש הישיבה', 'ירושלים', '02-500-1180', 1, 'יעקב ברגר', 'רחל ברגר', 'מרים ברגר', 'שמואל · חנה · לוי'],
  ['אליהו ויס', 'א', 'מגיד שיעור כיתה ז׳', 'בית שמש', '02-500-1181', 3, 'דוד ויס', 'לאה ויס', 'שרה ויס', 'יוסף · אסתר'],
  ['אסתר רוזן', 'א', 'אם-בית · פנימייה', 'ירושלים', '02-500-1182', 5, 'משה כהן', 'ברכה כהן', 'נתן רוזן', 'רבקה · אהרן · מרים'],
  ['בנימין שטרן', 'ב', 'גזבר', 'בני ברק', '03-500-1183', 6, 'אורי שטרן', 'טובה שטרן', 'דבורה שטרן', 'ישראל · חיה'],
  ['ברוך נוימן', 'ב', 'אחזקה', 'ירושלים', '02-500-1184', 2, 'זאב נוימן', 'פייגא נוימן', 'שרה נוימן', 'מנחם'],
  ['גרשון אדלר', 'ג', 'נהג קו 4', 'מודיעין עילית', '08-500-1185', 4, 'חיים אדלר', 'מלכה אדלר', 'יוכבד אדלר', 'שלמה · רחל'],
  ['דוד לוי', 'ד', 'מלמד כיתה ג׳', 'ירושלים', '02-500-1186', 1, 'עמרם לוי', 'שושנה לוי', 'נחמה לוי', 'אליעזר · תמר · דן · גיטל'],
  ['הרב יצחק פריד', 'ה', 'משגיח', 'ביתר עילית', '02-500-1187', 3, 'אשר פריד', 'בילא פריד', 'פסיה פריד', 'מרדכי · רייזל'],
  ['זלמן כץ', 'ז', 'מנהל מטבח', 'ירושלים', '02-500-1188', 2, 'ברוך כץ', 'חוה כץ', 'מרגלית כץ', 'ניסן · שיינדל'],
  ['חנה גולד', 'ח', 'מזכירות · גבייה', 'ירושלים', '02-500-1189', 5, 'יהודה גולד', 'אביגיל גולד', 'עזרא גולד', 'יעל · אורי'],
  ['טוביה רוט', 'ט', 'תורם · פרנס השנה', 'אנטוורפן', '+32-3-500-118', 6, 'אליהו רוט', 'צירל רוט', 'הינדא רוט', 'שמעון · פריידא · יענקי'],
  ['יוסף מלר', 'י', 'מנהל אדמיניסטרטיבי', 'ירושלים', '02-500-1191', 4, 'קלמן מלר', 'רוזא מלר', 'בתיה מלר', 'אליהו · דינה'],
  ['מנחם פרידמן', 'מ', 'גבאי בית המדרש', 'ירושלים', '02-500-1192', 1, 'שרגא פרידמן', 'גיטל פרידמן', 'לאה פרידמן', 'אברהם · סימא · יוסי'],
  ['נפתלי הורוביץ', 'נ', 'רכז שידוכים', 'בני ברק', '03-500-1193', 3, 'מאיר הורוביץ', 'פערל הורוביץ', 'רויזא הורוביץ', 'חיים · אסתר'],
  ['שלמה אונגר', 'ש', 'ועד הכספים', 'ירושלים', '02-500-1194', 2, 'נחום אונגר', 'זיסל אונגר', 'חיה אונגר', 'יעקב · מלכה · דוד'],
  ['שרה ויסבלט', 'ש', 'אחראית ציוד', 'ירושלים', '02-500-1195', 5, 'אלימלך ויסבלט', 'רבקה ויסבלט', 'ארי ויסבלט', 'נעמי'],
  ['תמר גרין', 'ת', 'מתנדבת · חלוקת מזון', 'ירושלים', '02-500-1196', 6, 'שאול גרין', 'מרים גרין', 'בערל גרין', 'אליהו · שרי'],
].map(a => ({ n: a[0], l: a[1], role: a[2], city: a[3], tel: a[4], c: a[5], av: a[6], em: a[7], sp: a[8], kids: a[9] }));

const LETTERS = [...'אבגדהוזחטיכלמנסעפצקרשת'];

export default {
  id: 'anashim',
  name: 'אנשים',
  title: 'אנשים — מוסד',
  desc: 'ספר האנשים של המוסד: אינדקס אלפביתי וגרף קשרי משפחה.',
  css: `
.hd{position:sticky;top:0;z-index:30;background:var(--bg);border-block-end:1px solid var(--hair);
 padding:var(--s3) var(--s4);display:flex;gap:var(--s3);align-items:center;flex-wrap:wrap}
.hd h1{font-size:19px}
.hd .cnt{font-size:12.5px;color:var(--mut);flex:1}
.hd input{border:1px solid var(--hair);background:var(--card);border-radius:999px;padding:9px var(--s4);
 font-size:14px;min-width:min(100%,220px);outline:0;min-height:40px}
.hd input:focus{border-color:var(--acc)}

.cols{display:grid;grid-template-columns:34px minmax(0,1fr) minmax(0,340px);gap:0;align-items:start}
.rail{position:sticky;top:64px;display:grid;gap:1px;padding:var(--s3) 0;justify-items:center}
.rail button{border:0;background:none;color:var(--mut);font:700 11.5px Heebo;width:26px;height:19px;border-radius:5px;padding:0}
.rail button[data-has=y]{color:var(--mut)}
.rail button[data-has=y]:hover,.rail button[aria-current=true]{background:var(--acc-soft);color:var(--acc)}
.rail button[data-has=n]{opacity:.35;cursor:default}

.book{border-inline:1px solid var(--hair);min-height:100vh}
.lgroup{position:sticky;top:64px;background:var(--sunk);padding:5px var(--s4);font:800 12px Heebo;color:var(--mut);
 border-block:1px solid var(--hair);z-index:10}
.person{display:grid;grid-template-columns:38px minmax(0,1fr) auto;gap:var(--s3);align-items:center;width:100%;
 padding:var(--s3) var(--s4);border:0;border-block-end:1px solid var(--hair);background:none;text-align:start;min-height:58px}
.person:hover{background:var(--sunk)}
.person[aria-selected=true]{background:var(--acc-soft)}
.person .av{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;font:700 13px Heebo}
.person .nm{font-weight:600;font-size:15px}
.person .ro{font-size:12.5px;color:var(--mut)}
.person .ci{font-size:12px;color:var(--mut);white-space:nowrap}
@media(max-width:560px){.person .ci{display:none}}

.panel{position:sticky;top:64px;padding:var(--s4);max-height:calc(100vh - 64px);overflow:auto}
.pcard{background:var(--card);border:1px solid var(--hair);border-radius:var(--r);padding:var(--s4)}
.pcard .who{display:flex;gap:var(--s3);align-items:center}
.pcard .who .av{width:52px;height:52px;border-radius:50%;display:grid;place-items:center;font:700 18px Heebo}
.pcard h2{font-size:18px}
.pcard .ro{font-size:13px;color:var(--mut)}
.chips{display:flex;gap:6px;flex-wrap:wrap;margin-top:var(--s3)}
.chip{font-size:11.5px;font-weight:700;border-radius:999px;padding:3px 10px;background:var(--sunk);color:var(--mut)}
dl.kv{display:grid;grid-template-columns:auto minmax(0,1fr);gap:6px var(--s3);margin:var(--s4) 0 0;font-size:13.5px}
dl.kv dt{color:var(--mut)}dl.kv dd{margin:0;text-align:end}
.tree{margin-top:var(--s4);border-block-start:1px solid var(--hair);padding-block-start:var(--s3)}
.tree h3{font-size:13px;color:var(--mut);font-weight:400;margin-bottom:var(--s2)}
.tree svg{width:100%;height:auto;display:block}
.tree text{font:600 11px Heebo;fill:var(--ink)}
.tree text.t2{font:400 9.5px Heebo;fill:var(--mut)}
.tree line{stroke:var(--hair);stroke-width:1.5}
.tree rect.node{fill:var(--sunk);stroke:var(--hair)}
.tree rect.me{fill:var(--acc-soft);stroke:var(--acc)}
.acts{display:flex;gap:var(--s2);flex-wrap:wrap;margin-top:var(--s4)}
.acts button{border:1px solid var(--hair);background:var(--card);border-radius:var(--rs);padding:7px 12px;font-size:12.5px;min-height:38px}
.acts button.pri{background:var(--acc);border-color:var(--acc);color:var(--on-acc);font-weight:600}

@media(max-width:900px){
 .cols{grid-template-columns:30px minmax(0,1fr)}
 .panel{grid-column:1/-1;position:static;max-height:none;border-block-start:1px solid var(--hair)}
 .book{border-inline-end:0}
}
@media print{.rail,.hd input,.acts{display:none!important}.cols{display:block}.panel{position:static}}
`,
  body: `
<header class="hd">
  <h1>אנשים</h1>
  <p class="cnt">1,904 רשומות · מוצגות 17 · נתוני דוגמה</p>
  <input id="q" type="search" placeholder="שם, תפקיד או עיר…" aria-label="סינון אנשים" autocomplete="off">
  ${navDrawer('anashim')}
</header>

<div class="cols">
  <nav class="rail" id="rail" aria-label="קפיצה לאות"></nav>
  <main class="book" id="main" aria-label="רשימת אנשים"></main>
  <aside class="panel"><div class="pcard" id="panel" aria-live="polite"></div></aside>
</div>`,
  js: `
const P=${JSON.stringify(P)}, LETTERS=${JSON.stringify(LETTERS)};
const el=i=>document.getElementById(i);
const ltr=s=>'<bdi dir="ltr">'+s+'</bdi>';
let sel=0, filt='';

function list(){
 const rows=P.map((p,i)=>({p,i})).filter(({p})=>!filt||[p.n,p.role,p.city].some(t=>t.includes(filt)));
 let out='',last='';
 rows.forEach(({p,i})=>{
  if(p.l!==last){last=p.l;out+='<h2 class="lgroup" id="L'+p.l+'">'+p.l+'</h2>';}
  out+='<button class="person" role="option" id="p'+i+'" data-i="'+i+'" aria-selected="'+(i===sel)+'">'+
   '<span class="av" style="background:var(--c'+p.c+'-soft);color:var(--c'+p.c+')">'+p.n.slice(0,2)+'</span>'+
   '<span><span class="nm">'+p.n+'</span><br><span class="ro">'+p.role+'</span></span>'+
   '<span class="ci">'+p.city+'</span></button>';
 });
 el('main').innerHTML=rows.length?'<div role="listbox" aria-label="אנשים">'+out+'</div>':'<p style="padding:var(--s5);color:var(--mut)">אין תוצאה ל«'+filt+'».</p>';
 el('rail').innerHTML=LETTERS.map(L=>{
  const has=rows.some(({p})=>p.l===L);
  return '<button data-l="'+L+'" data-has="'+(has?'y':'n')+'"'+(has?'':' disabled')+' aria-label="קפוץ לאות '+L+'">'+L+'</button>';
 }).join('');
}

/* גרף-המשפחה: הורים למעלה, בן/בת-זוג לצד, ילדים למטה — נגזר מהשדות, לא מצויר ביד */
function tree(p){
 const kids=p.kids.split(' · '), W=304, bw=86, bh=30;
 const x=c=>Math.round(c), box=(cx,cy,t,cls,sub)=>
  '<rect class="'+cls+'" x="'+x(cx-bw/2)+'" y="'+cy+'" width="'+bw+'" height="'+bh+'" rx="8"></rect>'+
  '<text x="'+x(cx)+'" y="'+(cy+(sub?13:19))+'" text-anchor="middle">'+t+'</text>'+
  (sub?'<text class="t2" x="'+x(cx)+'" y="'+(cy+24)+'" text-anchor="middle">'+sub+'</text>':'');
 const kw=Math.min(bw, Math.floor((W-12)/kids.length)-6);
 const kidBox=(cx,cy,t)=>'<rect class="node" x="'+x(cx-kw/2)+'" y="'+cy+'" width="'+kw+'" height="26" rx="8"></rect>'+
  '<text x="'+x(cx)+'" y="'+(cy+17)+'" text-anchor="middle" style="font-size:10px">'+t+'</text>';
 let s='<svg viewBox="0 0 '+W+' 178" role="img" aria-label="קשרי משפחה של '+p.n+': הורים '+p.av+' ו'+p.em+', בן/בת זוג '+p.sp+', '+kids.length+' ילדים">';
 s+='<line x1="76" y1="30" x2="76" y2="46"></line><line x1="228" y1="30" x2="228" y2="46"></line>';
 s+='<line x1="76" y1="46" x2="228" y2="46"></line><line x1="152" y1="46" x2="152" y2="62"></line>';
 s+=box(228,0,p.av,'node','אב')+box(76,0,p.em,'node','אם');
 s+=box(210,62,p.n,'me')+box(94,62,p.sp,'node','זוג');
 s+='<line x1="152" y1="62" x2="152" y2="77"></line>';
 s+='<line x1="152" y1="112" x2="152" y2="126"></line>';
 const step=(W-12)/kids.length, xs=kids.map((_,i)=>W-6-step*(i+0.5));
 s+='<line x1="'+x(Math.min(...xs))+'" y1="126" x2="'+x(Math.max(...xs))+'" y2="126"></line>';
 kids.forEach((k,i)=>{s+='<line x1="'+x(xs[i])+'" y1="126" x2="'+x(xs[i])+'" y2="140"></line>'+kidBox(xs[i],140,k);});
 return s+'</svg>';
}

function panel(){
 const p=P[sel];
 el('panel').innerHTML=
  '<div class="who"><span class="av" style="background:var(--c'+p.c+'-soft);color:var(--c'+p.c+')">'+p.n.slice(0,2)+'</span>'+
  '<span><h2>'+p.n+'</h2><span class="ro">'+p.role+'</span></span></div>'+
  '<div class="chips"><span class="chip">רשומה פעילה</span><span class="chip">'+p.city+'</span><span class="chip">'+p.kids.split(" · ").length+' ילדים</span></div>'+
  '<dl class="kv"><dt>טלפון</dt><dd class="num">'+ltr(p.tel)+'</dd>'+
  '<dt>בן/בת זוג</dt><dd>'+p.sp+'</dd><dt>הורים</dt><dd>'+p.av+' · '+p.em+'</dd>'+
  '<dt>מזהה</dt><dd class="num">'+ltr('P-'+String(1000+sel))+'</dd></dl>'+
  '<div class="tree"><h3>קשרים</h3>'+tree(p)+'</div>'+
  '<div class="acts"><button class="pri">פתח תיק</button><button>שיוך לאגף</button><button>היסטוריית שינויים</button></div>';
 document.querySelectorAll('.person').forEach(b=>b.setAttribute('aria-selected',String(+b.dataset.i===sel)));
}

document.addEventListener('click',e=>{
 const b=e.target.closest('.person'); if(b){sel=+b.dataset.i;panel();return;}
 const L=e.target.closest('[data-l]');
 if(L&&L.dataset.has==='y'){const t=document.getElementById('L'+L.dataset.l);
  if(t)t.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});}
});
document.addEventListener('keydown',e=>{
 if(!e.target.closest('.person'))return;
 const bs=[...document.querySelectorAll('.person')], i=bs.indexOf(e.target.closest('.person'));
 if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();
  const n=bs[i+(e.key==='ArrowDown'?1:-1)]; if(n){n.focus();sel=+n.dataset.i;panel();}}
});
el('q').addEventListener('input',e=>{filt=e.target.value.trim();list();});
list();panel();
`,
};
