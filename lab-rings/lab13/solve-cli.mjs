// הרצת «המוח האחד» משורת-הפקודה (קובץ נפרד — כדי שלא ייווצר מצב שבו המוח מחכה לעצמו)
import { solve } from './tzoref-solve.mjs';
const { goals, goalFor }=await import('./tzoref-goals.mjs'); const G=goals();
  for(const name of process.argv.slice(2)){ const g=G[name]; const gen=goalFor(name,{ins:g.ins},G); const r=await solve(name,gen,g,{say:s=>console.log(s)});
    console.log(`${r.prog?'✓':'✗'} ${name} · ${r.prog?r.prog.length+' פקודות · '+r.how:'לא נמצא'} · ניסה: ${r.tried.join(' ⇒ ')} · ${(r.ms/1000).toFixed(1)} שנ׳`); } process.exit(0); 
