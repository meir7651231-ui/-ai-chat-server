// מבחן הוגן: אותה תוכנית-התחלה, אותו זמן (2 דקות) — עובד אחד מול 4 עובדים
import { shorten, finalCheck } from './tzoref.mjs'; import { goals, goalFor } from './tzoref-goals.mjs'; import { loopBuild } from './tzoref-loop.mjs'; import { valueBuild } from './tzoref-value.mjs'; import { pshorten } from './tzoref-pshorten.mjs';
const G=goals(); const MIN=+process.env.MIN||2;
for(const name of process.argv.slice(2)){ const g=G[name]; const gen=goalFor(name,{ins:g.ins},G); const r=g.ins?valueBuild(gen,{name,ins:g.ins,out:g.out??2}):loopBuild(gen,{name}); if(!r.prog){ console.log('✗',name); continue; }
  let t=Date.now(); let one=r.prog; try{ one=shorten(r.prog,gen,{minutes:MIN,quiet:9}).prog; }catch{} const t1=(Date.now()-t)/1000;
  t=Date.now(); const four=await pshorten(name,r.prog,{minutes:MIN,rounds:2}); const t4=(Date.now()-t)/1000;
  const fc=finalCheck(four,gen);
  console.log(`${name.padEnd(28)} התחלה ${String(r.prog.length).padStart(4)} · עובד אחד ${String(one.length).padStart(4)} (${t1.toFixed(0)} שנ׳) · 4 עובדים ${String(four.length).padStart(4)} (${t4.toFixed(0)} שנ׳) · בדיקה ${fc.n-fc.bad}/${fc.n}`); }
process.exit(0);
