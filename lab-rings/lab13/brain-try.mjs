import { solve } from './tzoref-solve.mjs'; import { goals, goalFor } from './tzoref-goals.mjs'; import { finalCheck } from './tzoref.mjs';
const G=goals(); for(const name of process.argv.slice(2)){ const g=G[name]; const gen=goalFor(name,{ins:g.ins},G); const r=await solve(name,gen,g,{});
  console.log(`${name}: ${r.prog?r.prog.length+' · '+r.how+' · בדיקה '+(20000-finalCheck(r.prog,gen).bad):'✗'} · ${(r.ms/1000).toFixed(0)} שנ׳`); } process.exit(0);
