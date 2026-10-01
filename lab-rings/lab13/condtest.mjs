import { loopBuild, showL } from './tzoref-loop.mjs'; import { goals, goalFor } from './tzoref-goals.mjs'; import { finalCheck } from './tzoref.mjs';
const G=goals(); for(const name of process.argv.slice(2)){ const g=G[name]; const gen=goalFor(name,{ins:g.ins},G); const r=loopBuild(gen,{name});
  console.log(`${name}: ${r.prog?r.prog.length+' פקודות · '+r.skel+' · בדיקה '+(20000-finalCheck(r.prog,gen).bad)+'/20000':'✗ '+(r.why||'')} · תנאי: ${r.cond?showL(r.cond.cond)+' ⇒ '+showL(r.cond.val):'-'} · ${(r.ms/1000).toFixed(0)} שנ׳`); }
process.exit(0);
