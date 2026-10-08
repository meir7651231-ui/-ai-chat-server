import { hiddenFilter } from './hiddenfilter.mjs'; import { listGen } from './listcomp.mjs'; import { run } from './machine3s.mjs';
const keep=[9,10,12,15]; const gen=listGen(l=>l.filter(x=>keep.includes(x)).length); const t=Date.now(); const r=await hiddenFilter(gen); let bad=null;
if(r.prog){ bad=0; for(let k=0;k<20000;k++){ const e=gen(); const z=run(r.prog,e.mem,{maxSteps:600000}); if(!z||z.st.length||z.mem[2]!==e.want) bad++; } }
console.log(`${r.prog&&!bad?'✓':'✗'} כמה של [${keep}] בלבד: ${r.prog?r.prog.length+' פקודות · '+r.how+' · '+r.via+' · בדיקה-עצמאית '+bad+' שגויים מ-20000':'לא נמצא'} · ${((Date.now()-t)/1000).toFixed(0)} שנ׳`); process.exit(0);
