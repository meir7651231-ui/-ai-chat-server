import { valueBuild } from './tzoref-value.mjs'; import { goals, goalFor } from './tzoref-goals.mjs';
const G=goals(); const name='חציון של שלושה'; const g=G[name]; const gen=goalFor(name,{ins:g.ins},G);
const r=valueBuild(gen,{name,ins:g.ins,out:g.out,ms:60000}); console.log(JSON.stringify({ok:!!r.prog,len:r.prog?.length,made:r.made,ms:r.ms,why:r.why,expr:r.expr}).slice(0,600));
process.exit(0);
