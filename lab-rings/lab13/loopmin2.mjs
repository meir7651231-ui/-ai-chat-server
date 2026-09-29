// לולאה עם למידה: כל שינוי שהצליח נרשם (סוג השינוי + מה יש סביבו). בסוף כל סבב המנוע לומד מהרישום,
// ובסבב הבא (א) «גזור והדבק» בוחר קודם שינויים שלמד שעובדים, (ב) חיפוש 3 שינויים מונחה לפי מה שלמד.
import fs from 'fs'; import { run } from './machine2.mjs'; import { makeSpecs } from './specs.mjs'; import { checker, shrink, ALPHA } from './tools2.mjs';
const name=process.argv[2]||'אורך רשימה (לולאה + ספירה)'; const OUT=process.argv[3]||'loopmin.json'; const HOURS=+process.argv[4]||1.5; const LEARN='loop-learned.json';
const {S}=makeSpecs(7171); const L=[0,1,8,9,10,11,12,13,14,15]; const sh=JSON.parse(fs.readFileSync('shelf.json','utf8'));
const g=()=>{ const e=S[name](); const b=e.mem.slice(); return {mem:e.mem,ok:r=>e.ok(r)&&L.every(c=>r[c]===b[c])}; };
const fast=checker(g,40,20000), full=checker(g,300,20000), fresh=checker(g,3000,20000); const ok=p=>fast(p)&&full(p);
let s=31; const R=(n)=>{ s=(Math.imul(s,1103515245)+12345)&0x7fffffff; return (s>>>16)%n; }, U=()=>R(1e6)/1e6;
const HARD=[]; for(let pa=0;pa<16;pa++) for(let aa=0;aa<16;aa++) for(let t=0;t<12;t++){ HARD.push({e:g(),pa,aa,sc:t%2?1+R(1e5):0}); }
const hard=(p)=>{ for(const {e,pa,aa,sc} of HARD){ const q=[['WHERE',pa],['GO'],['WHERE',aa],...p.map(([o,k,c])=>o==='WHERE'?['WHERE',c?k+3:k]:[o])]; const r=run(q,e.mem,{maxSteps:20000,scramble:sc}); if(!r||r.st.length||!e.ok(r.mem)) return false; } return true; };
const T0=Date.now(); const min=()=>((Date.now()-T0)/60000).toFixed(1);
const accept=(p,best,why)=>{ if(p.length<best.length&&fresh(p)&&hard(p)){ console.log(`  ✓ ${why}: ${best.length} → ${p.length}  (${min()} דק')`); fs.writeFileSync(OUT,JSON.stringify(p)); return true; } return false; };
// ---- ייצוג שינויים + «מה יש סביבו»
const key=(x)=>x?(x[0]==='WHERE'?(x[2]?'W@':'W'+x[1]):x[0]):'^';
function rebuild(p,order,ins){ const newPos=new Map(); order.forEach((o,i)=>{ if(o!=null&&!newPos.has(o)) newPos.set(o,i); }); const n=order.length;
  const mapT=(t)=>{ if(t>=p.length) return n; for(let x=t;x<p.length;x++) if(newPos.has(x)) return newPos.get(x); return n; };
  return order.map((o,i)=>{ const x=o==null?ins[i]:p[o]; return x[2]==='code'?['WHERE',mapT(x[1]),'code']:x; }); }
function mkEdit(p,kind,i,a,w,k){ const n=p.length, o=[...Array(n).keys()]; const ctx=`${key(p[i-1])}|${key(p[i])}|${key(p[i+1])}`;
  if(kind==='D'){ const q=o.slice(); q.splice(i,1); return {p:rebuild(p,q,{}),f:`D|${ctx}`}; }
  if(kind==='R'){ if(p[i][2]||p[i][0]==='JUMP') return null; const q=o.slice(); q[i]=null; return {p:rebuild(p,q,{[i]:a}),f:`R|${ctx}|${key(a)}`}; }
  if(kind==='I'){ const q=o.slice(); q.splice(i,0,null); return {p:rebuild(p,q,{[i]:a}),f:`I|${key(p[i-1])}|${key(p[i])}|${key(a)}`}; }
  if(kind==='M'){ if(i+w>n) return null; const seg=o.slice(i,i+w), rest=[...o.slice(0,i),...o.slice(i+w)]; if(k>rest.length) return null; rest.splice(k,0,...seg); return {p:rebuild(p,rest,{}),f:`M${w}|${ctx}|${k<i?'<':'>'}`}; }
  if(kind==='X'){ if(i+w>n) return null; const q=[...o.slice(0,i),...o.slice(i+w)]; return {p:rebuild(p,q,{}),f:`X${w}|${ctx}`}; } }
function* allEdits(p){ const n=p.length; for(let i=0;i<n;i++) yield mkEdit(p,'D',i); for(let i=0;i<n;i++) for(const a of ALPHA) yield mkEdit(p,'R',i,a); for(let i=0;i<=n;i++) for(const a of ALPHA) yield mkEdit(p,'I',i,a);
  for(let w=2;w<=6;w++) for(let i=0;i+w<=n;i++) for(let k=0;k<=n-w;k++) if(k!==i) yield mkEdit(p,'M',i,null,w,k); for(let w=2;w<=5;w++) for(let i=0;i+w<=n;i++) yield mkEdit(p,'X',i,null,w); }
const randEdit=(p)=>{ const n=p.length, t=R(9); if(t<2) return mkEdit(p,'D',R(n)); if(t<4) return mkEdit(p,'R',R(n),ALPHA[R(ALPHA.length)]); if(t<5) return mkEdit(p,'I',R(n+1),ALPHA[R(ALPHA.length)]); if(t<8){ const w=1+R(8); return mkEdit(p,'M',R(n),null,w,R(n+1)); } return mkEdit(p,'X',R(n),null,2+R(4)); };
// ---- הזיכרון של הלמידה
const mem=fs.existsSync(LEARN)?JSON.parse(fs.readFileSync(LEARN,'utf8')):{good:{},tried:{}};
const score=(f)=>((mem.good[f]||0)+0.3)/((mem.tried[f]||0)+3);
const note=(f,won)=>{ mem.tried[f]=(mem.tried[f]||0)+1; if(won) mem.good[f]=(mem.good[f]||0)+1; };
// ---- (א) חישול «גזור והדבק» שבוחר קודם את מה שלמד
function learnedAnneal(p0,ms){ let cur=p0, best=p0; const t0=Date.now();
  while(Date.now()-t0<ms){ const T=1.5*(1-(Date.now()-t0)/ms)+0.05; let e=null, bs=-1;
    for(let j=0;j<6;j++){ const c=randEdit(cur); if(!c) continue; const sc=score(c.f)*(0.5+U()); if(sc>bs){ bs=sc; e=c; } } if(!e) continue;
    const d=e.p.length-cur.length; if(d>0&&U()>Math.exp(-d/T)) continue; if(e.p.length>best.length+10){ continue; } const good=ok(e.p); note(e.f,good);
    if(!good) continue; cur=e.p; if(cur.length<best.length) best=cur; }
  return best; }
// ---- (ב) חיפוש 3 שינויים מונחה
function guided(best,K,deadline){ let layer=[{p:best,s:0}]; const seen=new Set([JSON.stringify(best)]);
  for(let d=1;d<=3;d++){ const cand=[]; for(const c of layer) for(const e of allEdits(c.p)){ if(!e) continue; const k=JSON.stringify(e.p); if(seen.has(k)) continue; seen.add(k); cand.push({p:e.p,s:c.s+Math.log(score(e.f)),f:e.f}); if(Date.now()>deadline) break; }
    for(const c of cand){ if(c.p.length<best.length&&ok(c.p)){ note(c.f,true); if(accept(c.p,best,`חיפוש מונחה (${d} שינויים)`)) return c.p; } }
    cand.sort((a,b)=>b.s-a.s); layer=cand.slice(0,K); if(Date.now()>deadline) break; } return null; }
// ---- הלולאה
const hand=sh.named.find(b=>b.name===name).prog; let best=[hand,...['bigmoves.json',OUT].filter(f=>fs.existsSync(f)).map(f=>JSON.parse(fs.readFileSync(f,'utf8')))].filter(p=>fresh(p)).sort((a,b)=>a.length-b.length)[0];
console.log(`${name} · מתחילים מ-${best.length} (ביד ${hand.length}) · בזיכרון הלמידה: ${Object.keys(mem.tried).length} סוגי שינוי`);
let dry=0, cycle=0;
while(dry<2&&Date.now()-T0<HOURS*3600e3){ cycle++; let got=false;
  for(const [k,st] of [best,hand].entries()){ const p=shrink(learnedAnneal(st,120000),ok); if(accept(p,best,`גזור-והדבק לומד (סבב ${cycle}, התחלה ${k?'ביד':'הכי טובה'})`)){ best=p; got=true; } }
  const p2=guided(best,600,Date.now()+8*60000); if(p2){ best=p2; got=true; }
  fs.writeFileSync(LEARN,JSON.stringify(mem)); const top=Object.keys(mem.good).sort((a,b)=>score(b)-score(a)).slice(0,3).join(' , ');
  console.log(`סבב ${cycle}: ${best.length}${got?'':' (בלי שיפור)'} · למד ${Object.keys(mem.tried).length} סוגי שינוי · הכי מוצלחים: ${top} (${min()} דק')`); dry=got?0:dry+1; }
console.log(`סוף: ${best.length} · ${min()} דקות · ${dry>=2?'שני סבבים שלמים בלי שיפור':'נגמר הזמן'}`);
