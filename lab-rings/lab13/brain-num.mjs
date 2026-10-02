// המוח (עם בונה-היסודות) על משימות-מספרים: בונה ⇒ מקצר ⇒ משווה למדף; קצר יותר ועובר 20,000 ⇒ מחליף במדף
import fs from 'fs'; import { solve } from './tzoref-solve.mjs'; import { shorten, finalCheck } from './tzoref.mjs'; import { goals, goalFor } from './tzoref-goals.mjs';
const G=goals(); const MIN=+process.env.MIN||2;
for(const name of process.argv.slice(2)){ const g=G[name]; const gen=goalFor(name,{ins:g.ins},G); const t=Date.now(); const r=await solve(name,gen,g,{});
  if(!r.prog){ console.log(`✗ ${name}`); continue; } const T1=((Date.now()-t)/1000).toFixed(0); let s=r.prog; try{ s=shorten(r.prog,gen,{minutes:MIN,quiet:9}).prog; }catch{}
  const fc=finalCheck(s,gen); const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); const b=sh.named.find(x=>x.name===name); let note='';
  if(!fc.bad&&b&&s.length<b.prog.length){ b.prog=s; fs.writeFileSync('shelf3.json',JSON.stringify(sh)); note=' ⇒ הוחלף במדף'; }
  console.log(`${name}: ${r.how.split(':')[0]} ${r.prog.length} (${T1} שנ׳) ⇒ קוצר ${s.length} · במדף ${b?.prog.length??'-'}${note} · בדיקה ${fc.n-fc.bad}/${fc.n}`); }
process.exit(0);
