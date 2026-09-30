import { compileSplit } from './tzoref-split.mjs'; import { goals, goalFor } from './tzoref-goals.mjs'; import { run } from './machine3s.mjs';
const G=goals(); const gen=goalFor('מיין רשימה',{},G);
function exec(ops,m){ for(let p=0;p<ops.length;p++){ const o=ops[p]; switch(o.t){ case 'zero': m[o.i]=0; break; case 'mark': m[m[o.i]&15]=15; break; case 'copy': m[o.i]=m[o.j]; break; case 'load': m[o.i]=m[m[o.j]&15]; break; case 'store': m[m[o.i]&15]=m[o.j]; break; case 'if': if(m[o.i]===0) p+=o.k; break; } } }
const r={a:{init:[{t:'zero',i:2}],body:[{t:'copy',i:3,j:1},{t:'load',i:1,j:1},{t:'mark',i:3}],cond:3},b:{init:[],body:[{t:'load',i:1,j:4},{t:'if',i:1,k:2},{t:'store',i:4,j:2},{t:'copy',i:2,j:4}],fin:[{t:'copy',i:1,j:2}]}};
let simBad=0, macBad=0, ex1=null; const p=compileSplit(r);
for(let t=0;t<3000;t++){ const e=gen(); const m=e.mem.slice(); exec(r.a.init,m); let k=0; while(m[r.a.cond]!==0&&k++<20) exec(r.a.body,m); exec(r.b.init,m); for(let v=15;v>=8;v--){ m[4]=v; exec(r.b.body,m); } exec(r.b.fin,m);
  if(!e.ok(m)){ simBad++; if(!ex1) ex1={mem:e.mem.join(','),sim:m.join(',')}; }
  const q=run([['WHERE',0],['GO'],['WHERE',0],...p.map(x=>x[2]?['WHERE',x[1]+3,'code']:x)],e.mem,{maxSteps:20000}); if(!q||q.st.length||!e.ok(q.mem)) macBad++; }
console.log('בסימולציה נכשלו:',simBad,'/3000 · במכונה נכשלו:',macBad,'/3000'); if(ex1) console.log(ex1);
