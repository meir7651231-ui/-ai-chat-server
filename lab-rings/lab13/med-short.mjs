import { shorten, finalCheck } from './tzoref.mjs'; import { goals, goalFor } from './tzoref-goals.mjs'; import { valueBuild } from './tzoref-value.mjs';
const G=goals(); const name='חציון של שלושה'; const g=G[name]; const gen=goalFor(name,{ins:g.ins},G);
const r=valueBuild(gen,{name,ins:g.ins,out:g.out}); const t=Date.now(); const s=shorten(r.prog,gen,{minutes:+process.env.MIN||8,quiet:9});
const fc=finalCheck(s.prog,gen); console.log(`חציון: ${r.prog.length} ⇒ ${s.prog.length} · ${((Date.now()-t)/60000).toFixed(1)} דק' · בדיקה ${fc.n-fc.bad}/${fc.n} · במדף 169`); if(!fc.bad){ const fs=await import('fs'); const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); const b=sh.named.find(b=>b.name===name); if(b&&s.prog.length<b.prog.length){ b.prog=s.prog; fs.writeFileSync('shelf3.json',JSON.stringify(sh)); console.log('נשמר במדף:',s.prog.length); } }
process.exit(0);
