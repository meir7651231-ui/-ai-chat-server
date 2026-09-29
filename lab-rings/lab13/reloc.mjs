// איזו לבנה «ניידת»? ממפים את תאי-הקלט 0,1 ואת הפלט 2 לתאים אחרים, ובודקים אם היא עדיין עובדת
import fs from 'fs'; import { expand, dataOf } from './recipes.mjs'; import { run } from './machine3s.mjs';
const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); const shelf=new Map(sh.named.map(b=>[b.name,b]));
const F={'גדול מ-':(a,b)=>a>b?15:0,'קטן מ-':(a,b)=>a<b?15:0,'מקסימום':Math.max,'מינימום':Math.min,'חיסור':(a,b)=>(a-b)&15,'שווה (מספרים)':(a,b)=>a===b?15:0};
for(const [n,f] of Object.entries(F)){ const b=shelf.get(n); if(!b){ console.log(n,'אין'); continue; } let ok=0,tot=0;
  const rest=dataOf(b.prog).filter(c=>c>2); const p=expand([{call:n,map:{0:6,1:7,2:5},free:[2,3,4].filter(c=>true)}],shelf);
  for(let a=0;a<16;a++) for(let c=0;c<16;c++){ const m=Array.from({length:16},(_,i)=>(i*7+a+c)&15); m[6]=a; m[7]=c; const r=run(p,m,{maxSteps:5000}); tot++; if(r&&!r.st.length&&r.mem[5]===f(a,c)&&r.mem[6]===a&&r.mem[7]===c) ok++; }
  console.log(n.padEnd(14), b.prog.length, 'תאים', JSON.stringify(dataOf(b.prog)), ok===tot?'✓ ניידת':`✗ מוברגת (${ok}/${tot})`); }
