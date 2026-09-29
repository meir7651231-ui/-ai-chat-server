// לא עוצרים עד שזה הכי קצר: מחזור של כל הכלים, שוב ושוב, עד שמחזור שלם לא מוצא שיפור (פעמיים ברצף).
import fs from 'fs'; import { run } from './machine3s.mjs'; import { makeSpecs } from './specs.mjs'; import { checkerF as checker, shrink, ALPHA } from './tools3f.mjs'; import { encode, sigOf } from './machine3f.mjs'; import { bigAnneal } from './bigmoves3.mjs';
const name=process.argv[2]||'אורך רשימה (לולאה + ספירה)'; const OUT=process.argv[3]||'loopmin.json';
const {S}=makeSpecs(7070);
const shuf=()=>{ const q=[8,9,10,11,12,13,14,15]; for(let i=7;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [q[i],q[j]]=[q[j],q[i]]; } return q; };
const LG=(f,key)=>()=>{ const m=new Array(16).fill(0); const l=shuf().slice(0,Math.floor(Math.random()*9)); m[1]=l[0]||0; l.forEach((a,i)=>{ m[a]=l[i+1]||0; }); if(key) m[0]=8+Math.floor(Math.random()*8); const w=f(l,m); const LL=[0,1,8,9,10,11,12,13,14,15]; const mem=m.map((v,k)=>LL.includes(k)?v:Math.floor(Math.random()*16)); return {mem,ok:r=>r[2]===w}; };
const M=(f)=>()=>{ const m=Array.from({length:16},()=>Math.floor(Math.random()*16)); if(Math.random()<0.25) m[1]=m[0]; const w=f(m[0],m[1]); return {mem:m,ok:r=>r[2]===w}; };
Object.assign(S,{'חיסור':M((a,b)=>(a-b)&15),'ועוד 2':M(a=>(a+2)&15),'קטן מ-':M((a,b)=>a<b?15:0),'גדול מ-':M((a,b)=>a>b?15:0),'מינימום':M((a,b)=>Math.min(a,b)),'מקסימום':M((a,b)=>Math.max(a,b))});
S['כמה מעל האמצע']=LG(l=>{ const a=l.length?Math.max(...l):0, b=l.length?Math.min(...l):15, mid=(b+(((a-b)&15)>>1))&15; return l.filter(x=>x>mid).length; }); S['סכום בלי הגדול']=LG(l=>(l.reduce((a,b)=>a+b,0)-(l.length?Math.max(...l):0))&15); Object.assign(S,{'הקטן ברשימה':LG(l=>l.length?Math.min(...l):15),'ספור גדולים מ-X':LG((l,m)=>l.filter(x=>x>m[0]).length,true)}); const L=/הפוך|מיין/.test(name)?[]:/רשימה|ספור|בלי|אמצע/.test(name)?[0,1,8,9,10,11,12,13,14,15]:/^ועוד/.test(name)?[0]:[0,1]; const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8'));
const g=()=>{ const e=S[name](); const b=e.mem.slice(); return {mem:e.mem,ok:r=>e.ok(r)&&L.every(c=>r[c]===b[c])}; };
const fast=checker(g,40,20000), full=checker(g,300,20000), fresh=checker(g,3000,20000); const ok=p=>fast(p)&&full(p);
// בדיקה קשוחה: כל 256 צירופי «איפה/לאן» × 12 רשימות × עם ובלי ערבוב
let s=31; const R=(n)=>{ s=(Math.imul(s,1103515245)+12345)&0x7fffffff; return (s>>>16)%n; };
const HARD=[]; for(let pa=0;pa<16;pa++) for(let aa=0;aa<16;aa++) for(let t=0;t<12;t++){ const e=g(); HARD.push({e,pa,aa,sc:t%2?1+R(1e5):0}); }
const hard=(p)=>{ for(const {e,pa,aa,sc} of HARD){ const q=[['WHERE',pa],['GO'],['WHERE',aa],...p.map(([o,k,c])=>o==='WHERE'?['WHERE',c?k+3:k]:[o])]; const r=run(q,e.mem,{maxSteps:20000,scramble:sc}); if(!r||r.st.length||!e.ok(r.mem)) return false; } return true; };
const accept=(p,best,why)=>{ if(p.length<best.length&&fresh(p)&&hard(p)){ console.log(`  ✓ ${why}: ${best.length} → ${p.length}  (${((Date.now()-T0)/1000/60).toFixed(1)} דק')`); fs.writeFileSync(OUT,JSON.stringify(p)); return true; } return false; };
function rebuild(p,order,ins){ const newPos=new Map(); order.forEach((o,i)=>{ if(o!=null&&!newPos.has(o)) newPos.set(o,i); }); const n=order.length;
  const mapT=(t)=>{ if(t>=p.length) return n; for(let x=t;x<p.length;x++) if(newPos.has(x)) return newPos.get(x); return n; };
  return order.map((o,i)=>{ const x=o==null?ins[i]:p[o]; return x[2]==='code'?['WHERE',mapT(x[1]),'code']:x; }); }
const EX=Array.from({length:20},(_,i)=>({...g(),pa:(i*5)&15,aa:(i*7+3)&15}));
const sig=(p)=>{ const code=encode(p); let out=''; for(const e of EX) out+=sigOf(code,e.pa,e.aa,e.mem,3000)+'/'; return out; };
// ===== קיצור לפי חלונות («תפר אחרי תפר»): המנוע עובד רק על חלון של W פקודות, אבל חיפוש עמוק שם — כל זוג שינויים בתוך החלון.
const T0=Date.now(); const W=+process.env.W||24, STRIDE=+process.env.STRIDE||12, PER=+process.env.PER||150; // PER = שניות לחלון
let best=JSON.parse(fs.readFileSync(process.env.START,'utf8')); if(!(fresh(best)&&hard(best))){ console.log('נקודת ההתחלה לא עוברת'); process.exit(1); }
console.log(`${name} · חלונות של ${W}, צעד ${STRIDE} · מתחילים מ-${best.length}`);
function* winEdits(p,a,b){ const n=p.length, o=[...Array(n).keys()];
  for(let i=a;i<Math.min(b,n);i++){ const q=o.slice(); q.splice(i,1); yield rebuild(p,q,{}); }
  for(let i=a;i<Math.min(b,n);i++){ if(p[i][2]||p[i][0]==='JUMP') continue; for(const x of ALPHA){ const q=o.slice(); q[i]=null; yield rebuild(p,q,{[i]:x}); } }
  for(let i=a;i<=Math.min(b,n);i++) for(const x of ALPHA){ const q=o.slice(); q.splice(i,0,null); yield rebuild(p,q,{[i]:x}); }
  for(let w=2;w<=5;w++) for(let i=a;i+w<=Math.min(b,n);i++){ const seg=o.slice(i,i+w), rest=[...o.slice(0,i),...o.slice(i+w)]; for(let k=Math.max(0,a-w);k<=Math.min(rest.length,b);k++){ if(k===i) continue; const q=rest.slice(); q.splice(k,0,...seg); yield rebuild(p,q,{}); } } }
function window(p,a,b){ const dl=Date.now()+PER*1000;
  // שלב 1: כל שינוי יחיד בחלון — מה שקצר ועובד ⇒ מיד
  const one=new Map(); for(const e of winEdits(p,a,b)){ if(e.length<p.length&&ok(e)&&accept(e,p,`חלון ${a}–${b}, שינוי אחד`)) return e; const k=sig(e); if(!one.has(k)) one.set(k,e); }
  // שלב 2: כל זוג שינויים בחלון
  for(const p1 of one.values()){ if(Date.now()>dl) break; for(const e of winEdits(p1,a,b)){ if(e.length>=p.length) continue; if(ok(e)&&accept(e,p,`חלון ${a}–${b}, זוג שינויים`)) return e; } }
  return null; }
let pass=0, quiet=0; const HOURS=+process.argv[4]||1;
while(Date.now()-T0<HOURS*3600e3){ pass++; let improved=false;
  for(let a=0;a<best.length;a+=STRIDE){ if(Date.now()-T0>HOURS*3600e3) break; let r; while((r=window(best,a,a+W))){ best=r; improved=true; } }
  console.log(`מעבר ${pass}: ${best.length}`); if(!improved){ if(++quiet>=1) break; } else quiet=0; }
fs.writeFileSync(OUT,JSON.stringify(best)); console.log(`סוף: ${best.length} · ${((Date.now()-T0)/60000).toFixed(0)} דקות`);
