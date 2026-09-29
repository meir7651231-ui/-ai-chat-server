// למידה מתוקנת: נקודה רק לשינוי שהיה חלק מדרך שהסתיימה בקיצור. ניסיון נאסף מתוכניות «שמנות».
// שני לומדים: טבלה (ספירה) + רשת קטנה (מכלילה: לומדת מכל חלק של ההקשר בנפרד). ואז — מפעילים על «אורך רשימה» (39).
import fs from 'fs'; import { run } from './machine2.mjs'; import { makeSpecs } from './specs.mjs'; import { checker, shrink, ALPHA } from './tools2.mjs';
let s=17; const R=(n)=>{ s=(Math.imul(s,1103515245)+12345)&0x7fffffff; return (s>>>16)%n; }, U=()=>R(1e6)/1e6;
const key=(x)=>x?(x[0]==='WHERE'?(x[2]?'W@':'W'+x[1]):x[0]):'^';
function rebuild(p,order,ins){ const newPos=new Map(); order.forEach((o,i)=>{ if(o!=null&&!newPos.has(o)) newPos.set(o,i); }); const n=order.length;
  const mapT=(t)=>{ if(t>=p.length) return n; for(let x=t;x<p.length;x++) if(newPos.has(x)) return newPos.get(x); return n; };
  return order.map((o,i)=>{ const x=o==null?ins[i]:p[o]; return x[2]==='code'?['WHERE',mapT(x[1]),'code']:x; }); }
// שינוי + «מאפיינים» (לרשת: כל חלק של ההקשר בנפרד)
function mk(p,kind,i,a,w,k){ const n=p.length, o=[...Array(n).keys()]; const P=key(p[i-1]),C=key(p[i]),N=key(p[i+1]); let q,ins={};
  if(kind==='D'){ q=o.slice(); q.splice(i,1); } else if(kind==='R'){ if(!p[i]||p[i][2]||p[i][0]==='JUMP'||key(a)===C) return null; q=o.slice(); q[i]=null; ins[i]=a; }
  else if(kind==='I'){ q=o.slice(); q.splice(i,0,null); ins[i]=a; } else if(kind==='M'){ if(i+w>n) return null; const seg=o.slice(i,i+w); q=[...o.slice(0,i),...o.slice(i+w)]; if(k>q.length||k===i) return null; q.splice(k,0,...seg); }
  else { if(i+w>n) return null; q=[...o.slice(0,i),...o.slice(i+w)]; }
  const t=kind+(w?w:''); const A=a?key(a):'-'; return {p:rebuild(p,q,ins), f:`${t}|${P}|${C}|${N}|${A}`, feats:[`t:${t}`,`t:${t}|c:${C}`,`t:${t}|p:${P}`,`t:${t}|n:${N}`,`t:${t}|a:${A}`,`c:${C}|a:${A}`,`p:${P}|c:${C}`,`t:${t}|p:${P}|c:${C}`]}; }
const rnd=(p)=>{ const n=p.length, t=R(9); if(t<2) return mk(p,'D',R(n)); if(t<4) return mk(p,'R',R(n),ALPHA[R(ALPHA.length)]); if(t<5) return mk(p,'I',R(n+1),ALPHA[R(ALPHA.length)]); if(t<8) return mk(p,'M',R(n),null,1+R(6),R(n+1)); return mk(p,'X',R(n),null,2+R(4)); };
// ---- הלומדים
const tab={good:{},tried:{}}; const W={}; const sig=(z)=>1/(1+Math.exp(-z));
const netScore=(e)=>sig(e.feats.reduce((a,f)=>a+(W[f]||0),-3));
const train=(e,y)=>{ const p=netScore(e); for(const f of e.feats) W[f]=(W[f]||0)+0.05*(y-p); };
const tabScore=(e)=>((tab.good[e.f]||0)+0.1)/((tab.tried[e.f]||0)+2);
// ---- איסוף ניסיון: חישול אקראי על תוכניות שמנות; כשיש קיצור — כל הצעדים מאז הקיצור הקודם מקבלים נקודה
function collect(p0,ok,ms){ let cur=p0,best=p0,path=[],t0=Date.now(),wins=0;
  while(Date.now()-t0<ms){ const T=1.2*(1-(Date.now()-t0)/ms)+0.05; const e=rnd(cur); if(!e) continue; tab.tried[e.f]=(tab.tried[e.f]||0)+1; train(e,0);
    const d=e.p.length-cur.length; if(d>0&&U()>Math.exp(-d/T)) continue; if(e.p.length>best.length+8||!ok(e.p)) continue; cur=e.p; path.push(e);
    if(cur.length<best.length){ best=cur; wins++; for(const x of path){ tab.good[x.f]=(tab.good[x.f]||0)+1; train(x,1); train(x,1); } path=[]; } }
  return {best,wins}; }
const {S}=makeSpecs(8080); const sources=[];
const tt=(t)=>()=>{ const m=Array.from({length:16},()=>Math.floor(Math.random()*16)); const a=m[0],bb=m[1],c=m[3]; let w=0; for(let k=0;k<4;k++){ const idx=(((a>>k)&1)<<2)|(((bb>>k)&1)<<1)|((c>>k)&1); w|=((t>>idx)&1)<<k; } return {mem:m,ok:r=>r[2]===w}; };
const fat=JSON.parse(fs.readFileSync('../viz/core2-state.before-shrink.json','utf8')).eng.lib.filter((_,i)=>i%6===0);
for(const b of fat) sources.push({name:'טבלה '+b.tt, prog:[['WHERE',0],['GO'],...b.ops.map(([o,k])=>o==='W'?['WHERE',k]:[o])], g:tt(b.tt)});
if(fs.existsSync('hoist.json')) { const L=[0,1,8,9,10,11,12,13,14,15]; const n='אורך רשימה (לולאה + ספירה)'; sources.push({name:'אורך (מתכון)', prog:JSON.parse(fs.readFileSync('hoist.json','utf8')), g:()=>{ const e=S[n](); const b=e.mem.slice(); return {mem:e.mem,ok:r=>e.ok(r)&&L.every(c=>r[c]===b[c])}; }}); }
const T0=Date.now(); let totalWins=0, before=0, after=0;
for(const src of sources){ const ok=checker(src.g,60,20000); if(!ok(src.prog)) continue; const {best,wins}=collect(src.prog,ok,src.prog.length>100?8000:4000); totalWins+=wins; before+=src.prog.length; after+=best.length; }
console.log(`איסוף ניסיון: ${sources.length} תוכניות שמנות · ${before} → ${after} צעדים · ${totalWins} קיצורים · ${Object.keys(tab.good).length} סוגי שינוי «שעזרו» · ${((Date.now()-T0)/60000).toFixed(1)} דק'`);
console.log('הרשת הכי מאמינה ב:',Object.entries(W).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([f,v])=>f+' '+v.toFixed(2)).join(' · '));
fs.writeFileSync('learn2.json',JSON.stringify({tab,W}));
// ---- הפעלה על «אורך רשימה» 39: חישול שבוחר לפי הרשת+הטבלה, וחיפוש 3 שינויים מונחה
const name='אורך רשימה (לולאה + ספירה)'; const L=[0,1,8,9,10,11,12,13,14,15];
const g=()=>{ const e=S[name](); const b=e.mem.slice(); return {mem:e.mem,ok:r=>e.ok(r)&&L.every(c=>r[c]===b[c])}; };
const ok=((f,u)=>p=>f(p)&&u(p))(checker(g,40,20000),checker(g,300,20000)); const fresh=checker(g,3000,20000);
const sh=JSON.parse(fs.readFileSync('shelf.json','utf8')); let best=sh.named.find(b=>b.name===name).prog; console.log('מתחילים מ:',best.length);
const both=(e)=>0.5*netScore(e)+0.5*tabScore(e);
for(let round=1;round<=3;round++){ let cur=best; const t0=Date.now(), ms=180000;
  while(Date.now()-t0<ms){ const T=1.5*(1-(Date.now()-t0)/ms)+0.05; let e=null,bs=-1; for(let j=0;j<8;j++){ const c=rnd(cur); if(!c) continue; const v=both(c)*(0.5+U()); if(v>bs){ bs=v; e=c; } } if(!e) continue;
    const d=e.p.length-cur.length; if(d>0&&U()>Math.exp(-d/T)) continue; if(e.p.length>best.length+10||!ok(e.p)) continue; cur=e.p; if(cur.length<best.length&&fresh(cur)){ best=cur; console.log(`  ✓ ${best.length}`); fs.writeFileSync('learn2-best.json',JSON.stringify(best)); } }
  console.log(`סבב ${round}: ${best.length} · ${((Date.now()-T0)/60000).toFixed(1)} דק'`); }
console.log('סוף:',best.length);
