// לא עוצרים עד שזה הכי קצר: מחזור של כל הכלים, שוב ושוב, עד שמחזור שלם לא מוצא שיפור (פעמיים ברצף).
import fs from 'fs'; import { run } from './machine2s.mjs'; import { makeSpecs } from './specs.mjs'; import { checker, shrink, ALPHA } from './tools2.mjs'; import { bigAnneal } from './bigmoves.mjs';
const name=process.argv[2]||'אורך רשימה (לולאה + ספירה)'; const OUT=process.argv[3]||'loopmin.json';
const {S}=makeSpecs(7070); const L=/הפוך|מיין/.test(name)?[]:[0,1,8,9,10,11,12,13,14,15]; const sh=JSON.parse(fs.readFileSync('shelf.json','utf8'));
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
function* edits(p){ const n=p.length, o=[...Array(n).keys()];
  for(let i=0;i<n;i++){ const q=o.slice(); q.splice(i,1); yield rebuild(p,q,{}); }
  for(let i=0;i<n;i++){ if(p[i][2]||p[i][0]==='JUMP') continue; for(const a of ALPHA){ const q=o.slice(); q[i]=null; yield rebuild(p,q,{[i]:a}); } }
  for(let i=0;i<=n;i++) for(const a of ALPHA){ const q=o.slice(); q.splice(i,0,null); yield rebuild(p,q,{[i]:a}); }
  for(let w=2;w<=6;w++) for(let i=0;i+w<=n;i++){ const seg=o.slice(i,i+w), rest=[...o.slice(0,i),...o.slice(i+w)]; for(let k=0;k<=rest.length;k++){ if(k===i) continue; const q=rest.slice(); q.splice(k,0,...seg); yield rebuild(p,q,{}); } } }
// זוגות: שלב 1 = כל שינוי (גם שבור), מאוחד לפי התנהגות; שלב 2 = כל שינוי שני, רק מה שקצר יותר ועובד
const EX=Array.from({length:20},(_,i)=>({...g(),pa:(i*5)&15,aa:(i*7+3)&15}));
const sig=(p)=>{ const out=[]; for(const e of EX){ const q=[['WHERE',e.pa],['GO'],['WHERE',e.aa],...p.map(([o,k,c])=>o==='WHERE'?['WHERE',c?k+3:k]:[o])]; const r=run(q,e.mem,{maxSteps:3000}); out.push(r?r.mem.join(',')+'|'+r.st.join(','):'x'); } return out.join('/'); };
function pairs(best,deadline){ const one=new Map(); for(const e of edits(best)){ const k=sig(e); if(!one.has(k)) one.set(k,e); } 
  for(const p1 of one.values()){ if(Date.now()>deadline) break; for(const e of edits(p1)){ if(e.length>=best.length) continue; if(ok(e)&&accept(e,best,'זוג שינויים')) return e; } } return null; }
const T0=Date.now(); const HOURS=+process.argv[4]||1;
const hand=process.env.START?JSON.parse(fs.readFileSync(process.env.START,'utf8')):sh.named.find(b=>b.name===name).prog; let best=[hand, !process.env.START&&fs.existsSync('bigmoves.json')?JSON.parse(fs.readFileSync('bigmoves.json','utf8')):hand].filter(p=>fresh(p)).sort((a,b)=>a.length-b.length)[0];
if(!process.env.START&&fs.existsSync(OUT)){ const o=JSON.parse(fs.readFileSync(OUT,'utf8')); if(o.length<best.length&&fresh(o)) best=o; }
console.log(`${name} · מתחילים מ-${best.length} (ביד ${hand.length})`);
let dry=0, cycle=0; const starts=()=>[best,hand];
while(dry<2&&Date.now()-T0<HOURS*3600e3){ cycle++; let got=false;
  for(const [k,st] of starts().entries()){ const p=shrink(bigAnneal(st,ok,120000,cycle*101+k),ok); if(accept(p,best,`גזור-והדבק (מחזור ${cycle}, התחלה ${k?'ביד':'הכי טובה'})`)){ best=p; got=true; } }
  const p2=pairs(best,Date.now()+4*60000); if(p2){ best=p2; got=true; }
  console.log(`מחזור ${cycle}: ${best.length}${got?'':' (בלי שיפור)'}`); dry=got?0:dry+1; }
console.log(`סוף: ${best.length} · ${((Date.now()-T0)/60000).toFixed(0)} דקות · ${dry>=2?'שני מחזורים שלמים בלי שיפור':'נגמר הזמן'}`);
