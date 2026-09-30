import { shorten } from './tzoref.mjs'; import { goals, goalFor } from './tzoref-goals.mjs'; import { valueBuild } from './tzoref-value.mjs'; import { loopBuild } from './tzoref-loop.mjs'; import { loadTricks } from './tzoref-tricks.mjs';
const G=goals(); const T=process.argv.slice(2);
for(const name of T){ const g=G[name]; const gen=goalFor(name,{ins:g.ins},G); const r=g.ins?valueBuild(gen,{name,ins:g.ins,out:g.out??2}):loopBuild(gen,{name}); if(!r.prog){ console.log('✗',name); continue; }
  const before=loadTricks().length; let s; try{ s=shorten(r.prog,gen,{minutes:+process.env.MIN||1.5,quiet:1,tag:name}).prog; }catch(e){ console.log('✗',name,e.message); continue; }
  console.log(`${name}: ${r.prog.length} ⇒ ${s.length} · טריקים חדשים: ${loadTricks().length-before} · סה״כ במחברת: ${loadTricks().length}`); }
process.exit(0);
