import { nearBuild, showN } from './tzoref-near.mjs'; import { shorten, finalCheck } from './tzoref.mjs'; import { goals, goalFor } from './tzoref-goals.mjs';
const G=goals(); const MIN=+process.env.MIN||2;
for(const name of process.argv.slice(2)){ const g=G[name]; const gen=goalFor(name,{ins:g.ins},G); const r=nearBuild(gen,{name}); if(!r.prog){ console.log(`✗ ${name}: אין לבנה דומה (${r.cands} מועמדים)`); continue; }
  let s=r.prog; try{ s=shorten(r.prog,gen,{minutes:MIN,quiet:9}).prog; }catch{} const fc=finalCheck(s,gen);
  console.log(`✓ ${name.padEnd(26)} ${showN(r)} · ${r.prog.length} ⇒ קוצר ${s.length} · ${fc.n-fc.bad}/${fc.n} · ${(r.ms/1000).toFixed(1)} שנ׳ חיפוש`); }
process.exit(0);
