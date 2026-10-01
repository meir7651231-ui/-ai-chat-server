// הלולאות: מה הבונה מוצא מאפס (ואחרי קיצור) מול מה שבמדף
import { shorten, finalCheck } from './tzoref.mjs'; import { goals, goalFor } from './tzoref-goals.mjs'; import { loopBuild } from './tzoref-loop.mjs';
import fs from 'fs'; const G=goals(); const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8'));
for(const name of process.argv.slice(2)){ const g=G[name]; const gen=goalFor(name,{ins:g.ins},G); const t=Date.now(); const r=loopBuild(gen,{name});
  if(!r.prog){ console.log('✗',name); continue; } const cand=[r.all.find(x=>!/תנאי/.test(x.skel)),r.all.find(x=>/תנאי/.test(x.skel))].filter(Boolean); let s=null;
  for(const c of cand){ const q=shorten(c.prog,gen,{minutes:+process.env.MIN||3,quiet:9}); console.log(`  ${/תנאי/.test(c.skel)?'עם תנאי':'בלי תנאי'}: ${c.prog.length} ⇒ ${q.prog.length}`); if(!s||q.prog.length<s.prog.length) s=q; } const fc=finalCheck(s.prog,gen);
  console.log(`${name}: נבנה ${r.prog.length} ⇒ קוצר ${s.prog.length} · במדף ${sh.named.find(b=>b.name===name)?.prog.length} · בדיקה ${fc.n-fc.bad}/${fc.n} · ${((Date.now()-t)/1000).toFixed(0)} שנ׳`);
  fs.writeFileSync('loopgap-'+name.replace(/\s/g,'_')+'.json',JSON.stringify({built:r.prog,short:s.prog})); }
process.exit(0);
