// הלולאות: מה הבונה מוצא מאפס (ואחרי קיצור) מול מה שבמדף
import { shorten, finalCheck } from './tzoref.mjs'; import { goals, goalFor } from './tzoref-goals.mjs'; import { loopBuild, recordWin } from './tzoref-loop.mjs';
import fs from 'fs'; const G=goals(); const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8'));
for(const name of process.argv.slice(2)){ const g=G[name]; const gen=goalFor(name,{ins:g.ins},G); const t=Date.now(); const r=loopBuild(gen,{name});
  if(!r.prog){ console.log('✗',name); continue; } const cand=[...r.all].sort((a,b)=>a.prog.length-b.prog.length).slice(0,4); let s=null;
  for(const c of cand){ const q=shorten(c.prog,gen,{minutes:+process.env.MIN||3,quiet:9}); console.log(`  ${c.skel}: ${c.prog.length} ⇒ ${q.prog.length}`); recordWin(c.skel,c.prog.length,q.prog.length,name); if(!s||q.prog.length<s.prog.length) s=q; } const fc=finalCheck(s.prog,gen);
  console.log(`${name}: נבנה ${r.prog.length} ⇒ קוצר ${s.prog.length} · במדף ${sh.named.find(b=>b.name===name)?.prog.length} · בדיקה ${fc.n-fc.bad}/${fc.n} · ${((Date.now()-t)/1000).toFixed(0)} שנ׳`);
  { const b=sh.named.find(b=>b.name===name); if(b&&!fc.bad&&s.prog.length<b.prog.length){ const S2=JSON.parse(fs.readFileSync('shelf3.json','utf8')); S2.named.find(x=>x.name===name).prog=s.prog; fs.writeFileSync('shelf3.json',JSON.stringify(S2)); console.log('  נשמר במדף ⇐',s.prog.length); } }
  fs.writeFileSync('loopgap-'+name.replace(/\s/g,'_')+'.json',JSON.stringify({built:r.prog,short:s.prog})); }
process.exit(0);
