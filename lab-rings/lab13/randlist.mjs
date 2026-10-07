// משימות-רשימה אקראיות (לא אני בחרתי): פעולה אקראית על שתי תכונות אקראיות של הרשימה, לפעמים עם «כפול 2»/«ועוד 1» על אחת מהן
import { listGen, listCompose } from './listcomp.mjs'; import { finalCheck } from './tzoref.mjs'; import { run } from './machine3.mjs';
let s=(+(process.env.SEED||5))>>>0; const rnd=()=>{ s=(s+0x6D2B79F5)>>>0; let t=s; t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61); return ((t^(t>>>14))>>>0)/4294967296; }; const R=k=>Math.floor(rnd()*k);
const sum=l=>l.reduce((a,b)=>a+b,0);
const FEAT=[['הסכום',l=>sum(l)&15],['הגדול',l=>l.length?Math.max(...l):0],['האורך',l=>l.length],['סכום הזוגיים',l=>sum(l.filter(x=>x%2===0))&15],
 ['כמה זוגיים',l=>l.filter(x=>x%2===0).length],['כמה גדולים מ-12',l=>l.filter(x=>x>12).length],['האחרון פחות הראשון',l=>l.length?(l[l.length-1]-l[0])&15:0],
 ['כמה עליות',l=>l.filter((x,i)=>i&&x>l[i-1]).length],['כמה ירידות',l=>l.filter((x,i)=>i&&x<l[i-1]).length],['כמה גדולים מהראשון',l=>l.filter(x=>l.length&&x>l[0]).length],
 ['הסכום בלי הגדול',l=>l.length?(sum(l)-Math.max(...l))&15:0],['הגדול פחות האורך',l=>((l.length?Math.max(...l):0)-l.length)&15]];
const OPS=[['ועוד',(a,b)=>(a+b)&15],['פחות',(a,b)=>(a-b)&15],['הקטן מבין',Math.min],['הגדול מבין',Math.max]];
const U=[['',x=>x],['כפול 2 של ',x=>(2*x)&15],['ועוד 1 של ',x=>(x+1)&15]];
const N=+(process.env.N||10); let ok=0; const seen=new Set();
for(let t=0;t<N;t++){ let A,B,op,u,key; do{ A=FEAT[R(FEAT.length)]; B=FEAT[R(FEAT.length)]; op=OPS[R(OPS.length)]; u=U[R(U.length)]; key=A[0]+B[0]+op[0]+u[0]; }while(A===B||seen.has(key)); seen.add(key);
  const name=`אקראי ${t+1}: ${op[0]} [${u[0]}${A[0]}] [${B[0]}]`; const f=l=>op[1](u[1](A[1](l)),B[1](l)); const gen=listGen(f); const t0=Date.now();
  const r=listCompose(gen); let good=r.prog&&!finalCheck(r.prog,gen,5000).bad; let bad=null;
  if(good){ bad=0; for(let k=0;k<20000;k++){ const e=gen(); const z=run(r.prog,e.mem,{maxSteps:60000}); if(!z||z.mem[2]!==e.want||z.st.length) bad++; } if(bad) good=false; } if(good) ok++;
  console.log(`${good?'✓':'✗'} ${name}: ${good?r.prog.length+' פקודות · '+r.how:'לא נמצא'+(bad?' (נכשל בבדיקה העצמאית: '+bad+')':'')} · ${((Date.now()-t0)/1000).toFixed(0)} שנ׳`); }
console.log(`סך: ${ok}/${N}`); process.exit(0);
