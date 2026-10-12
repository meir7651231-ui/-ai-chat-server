// «סדר-תועלת» למדף שגדל: הסולם (כלי «מבחן: …» = פתרונות שנבדקו) נשאר כולו על המדף, אבל הבונים רואים אותו בסדר ובמנה.
//   1. כפולים: כלי-סולם שמתנהג בדיוק כמו כלי קודם (אותו זיכרון-סופי על סט-בדיקה קבוע; לכלי-מספר — אותו לוח על הקלטים) ⇒ מקופל לנציג הקודם (המדף הבסיסי קודם; אחר-כך הקצר).
//   2. סדר: ציון-תועלת מתוך הסולם עצמו — כמה פתרונות של מבחן-1 (bench4-*.jsonl, שדה how) השתמשו בכלי. כלי-סולם יורש את ממוצע הציונים של החלקים שמהם נבנה; מחולק באורך (300/(300+אורך)).
//   3. מנה: כל בונה מקבל את כל כלי-הבסיס (כמו במדף הקר, באותו סדר) ועוד לכל היותר CAP[מפתח] כלי-סולם: קודם מהסוג שהבונה צריך, ובתוכו לפי הציון.
// נתונים: רק פתרונות מבחן-1 (לא נוגעים במבחן-2). אפשר לכבות: LADDER_CAP=off (מנה ללא-גבול) · LADDER_CAPS='pipe.L=4,ll.T=6'.
import fs from 'fs'; import crypto from 'crypto'; import { encodeG, runFastG } from './chainsafe.mjs';
export const isLadder=n=>typeof n==='string'&&n.startsWith('מבחן: ');
const has=n=>typeof n==='string'&&n.includes('מבחן: ');
// מנות לכל בונה (כמה כלי-סולם נכנסים לכל רשימת-מועמדים) — נמדד: כל צירוף נוסף עולה זמן בחזקת עומק-הצירוף
export const CAPS={
  'll.T1':40, 'll.T':8,                 // רצף-כלים: כל הסולם כצעד יחיד; בזוגות/שלשות — 8 הראשונים
  'pipe.L1':40, 'pipe.L':8, 'pipe.V':40,   // שרשרת: משנה יחיד — כולם; זוגות-משנים — 8; מחשבי-מספר — כולם (בדיקה זולה)
  'lc.tools':12, 'lc.U1':4, 'lc.TB':6,     // צירוף-זוג: כלי-רשימה⇒מספר · פעולות חד-מקומיות · פעולות דו-מקומיות
  'st.LL':10, 'st.LN':10,                 // צעדי רצף-מקום (וכל מי שמשתמש בהם: אם-רשימה, אם-אחרת, בחירה-במקום)
  'ifp.ops':4, 'ife.stats':10, 'ife.ops':4,
  'cut.L1':12, 'cut.L':6, 'cut.V':16, 'cut.T':4,   // מסגרות-סריקה: משנה יחיד (לפני/אחרי) · זוג-משנים · עזרים · לוחות
  'ifc.base':8, 'ifc.T':8, 'ifc.U1':4,
  'ks.pre':6, 'ks.cmp':4,
  'scan.T':6, 'po.TB':6, 'po.V':12, 'pick.K':6, 'hf.V':12,
  'vb.TB':40, 'loop.PR':12, 'case.TB':8,
};
// סוג כלי-סולם (מהמטרה שלו, מבחן-1): LL רשימה⇒רשימה · LN רשימה⇒מספר · N מספרים. לכל מנה — הסוג שהבונה צריך; כלי מסוג אחר (למשל כלי-מספר שכותב בתאי הרשימה) — בסוף התור
const WANT=k=>/^(ll\.|pipe\.L|st\.LL|cut\.L|ifc\.T|ks\.pre)/.test(k)?'LL':/^(pipe\.V|lc\.tools|st\.LN|ife\.stats|cut\.V|ifc\.base|po\.V|hf\.V)/.test(k)?'LN':'N';
let KINDS=null; export const kindOf=n=>{ if(!KINDS){ KINDS=new Map(); try{ for(const [k,g] of Object.entries(JSON.parse(fs.readFileSync('tzoref-learned-goals.json','utf8')))) if(isLadder(k)) KINDS.set(k,g.listlf?'LL':g.listf?'LN':'N'); }catch{} } const m=ladderIn(n); return m?KINDS.get(m)||null:null; };
const capOf=key=>{ if(process.env.LADDER_CAP==='off') return Infinity; const o=Object.fromEntries((process.env.LADDER_CAPS||'').split(',').filter(Boolean).map(s=>s.split('=')).map(([k,v])=>[k,+v])); return o[key]??CAPS[key]??8; };
// ─── 2. ציון-תועלת ───
let PRIOR=null;
export function priors(){ if(PRIOR) return PRIOR; PRIOR=new Map(); let names=[]; try{ names=JSON.parse(fs.readFileSync('shelf3.json','utf8')).named.map(b=>b.name); }catch{}
  names=[...new Set(names)].filter(n=>!isLadder(n)).sort((a,b)=>b.length-a.length);   // שם ארוך קודם («חיסור רווי» לפני «חיסור»)
  const rows=[]; for(const k of ['num','list2num','list2list']){ let t=''; try{ t=fs.readFileSync(`bench4-${k}.jsonl`,'utf8'); }catch{} for(const l of t.split('\n').filter(Boolean)){ try{ const j=JSON.parse(l); if(j.ok&&j.how) rows.push(j); }catch{} } }
  const parts=how=>{ let h=how; const got=[]; for(const n of names) if(h.includes(n)){ got.push(n); h=h.split(n).join(''); } return got; };
  const cnt=new Map(); const comp=new Map(); for(const r of rows){ const p=parts(r.how); comp.set('מבחן: '+r.name,p); for(const n of p) cnt.set(n,(cnt.get(n)||0)+1); }
  for(const [n,c] of cnt) PRIOR.set(n,c);
  for(const [n,p] of comp){ const s=p.reduce((a,x)=>a+(cnt.get(x)||0),0); PRIOR.set(n,p.length?s/p.length:0); }   // כלי-סולם: ממוצע החלקים
  return PRIOR; }
// שם מורכב (למשל «על-כל-זנב [מבחן: X]») ⇒ כלי-הסולם שבתוכו (השם הארוך ביותר שמופיע)
let LNAMES=null; const ladNames=()=>{ if(LNAMES) return LNAMES; let n=[]; try{ n=JSON.parse(fs.readFileSync('shelf3.json','utf8')).named.map(b=>b.name).filter(isLadder); }catch{} return LNAMES=[...new Set([...n,...[...priors().keys()].filter(isLadder)])].sort((a,b)=>b.length-a.length); };
export const ladderIn=n=>{ if(!has(n)) return null; if(isLadder(n)&&priors().has(n)) return n; return ladNames().find(x=>n.includes(x))||null; };
export const prior=n=>{ const P=priors(); if(P.has(n)) return P.get(n); const m=ladderIn(n); return m&&P.has(m)?P.get(m):0; };
// ─── 1. כפולים ───
let TWINS=null;
export function twins(){ if(TWINS) return TWINS; let sh; try{ sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); }catch{ return TWINS=new Set(); }
  const h=crypto.createHash('md5').update(JSON.stringify(sh.named.map(b=>[b.name,b.prog]))).digest('hex'); const CF='ladder-twins.json';
  try{ const c=JSON.parse(fs.readFileSync(CF,'utf8')); if(c.h===h) return TWINS=new Set(c.twins); }catch{}
  let s=12345; const R=k=>{ s=(s*1103515245+12345)%2147483648; return Math.floor(s/2147483648*k); };   // סט-בדיקה קבוע (זרע קבוע)
  const PL=[], PN=[]; for(let i=0;i<144;i++){ const p=[8,9,10,11,12,13,14,15]; for(let k=7;k>0;k--){ const j=R(k+1); [p[k],p[j]]=[p[j],p[k]]; } const l=p.slice(0,i%9); const m=Array.from({length:16},()=>R(16)); m[0]=0; m[1]=l[0]||0; for(let c=8;c<16;c++) m[c]=0; l.forEach((a,k)=>{ m[a]=l[k+1]||0; }); PL.push(m); }
  for(let i=0;i<96;i++) PN.push(Array.from({length:16},()=>R(16)));
  const order=[...sh.named.filter(b=>!isLadder(b.name)),...sh.named.filter(b=>isLadder(b.name)).sort((a,b)=>a.prog.length-b.prog.length)];
  const seenF=new Map(), seenN=new Map(), out=[];
  for(const b of order){ const c=encodeG(b.prog); const o=[...PL,...PN].map(m=>runFastG(c,m,0,200000)); const kf=o.map(r=>r?Array.from(r).join(','):'X').join(';');
    const num=(b.ins||[]).length>0; const kn=num?(b.ins.join()+'>'+(b.out??2)+':'+o.slice(144).map(r=>r?r[b.out??2]:'X').join(',')):null;
    const dupF=seenF.has(kf), dupN=kn&&!kn.includes('X')&&seenN.has(kn);
    if(isLadder(b.name)&&(dupF||dupN)) out.push(b.name); else { if(!dupF) seenF.set(kf,b.name); if(kn&&!seenN.has(kn)) seenN.set(kn,b.name); } }
  try{ fs.writeFileSync(CF,JSON.stringify({h,twins:out})); }catch{}
  return TWINS=new Set(out); }
// ─── 3. סדר + מנה ───
// list: רשימת-מועמדים של בונה; nameOf: השם (כולל שמות מורכבים כמו «על-כל-זנב [מבחן: …]»). מחזיר: כל מה שאינו מהסולם, באותו סדר; אחריו עד k כלי-סולם לפי הציון.
export function cap(list,key,nameOf=x=>x.name){ const base=[], lad=[]; const T=twins();
  for(const x of list){ const n=nameOf(x); if(has(n)){ const m=ladderIn(n); if(m&&T.has(m)) continue; lad.push(x); } else base.push(x); }
  const k=capOf(key); if(!lad.length) return base;
  const len=x=>(x.prog||x.b?.prog||[]).length||0;
  const w=WANT(key), km=x=>kindOf(nameOf(x))===w?1:0;
  const sc=x=>prior(nameOf(x))*300/(300+len(x));   // תועלת לכל פקודה: כלי ארוך יקר יותר בכל הרצה, וצר יותר
  lad.sort((a,b)=>km(b)-km(a)||sc(b)-sc(a)||len(a)-len(b));
  const kept=lad.slice(0,k); NOTE.set(key,{base:base.length,ladder:lad.length,kept:kept.length}); return [...base,...kept]; }
export const NOTE=new Map();
// אורך: מסנני-אורך של הבונים (200–400 פקודות) כוונו למדף הבסיסי; כלי-סולם הם פתרונות שלמים וארוכים — עד LADLEN (640), והמנה שומרת על הגבול
export const LADLEN=+process.env.LADLEN||640; export const lenOk=(b,n)=>b.prog.length<=(isLadder(b.name)?Math.max(n,LADLEN):n);
// כלי-סולם שנחסם בשלב (מנה) — לבדיקות
export const capCount=key=>capOf(key);
