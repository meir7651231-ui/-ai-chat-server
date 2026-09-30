import fs from 'fs'; import { loopBuild, showL } from './tzoref-loop.mjs'; import { shorten, finalCheck, loadShelf } from './tzoref.mjs'; import { goals, goalFor } from './tzoref-goals.mjs';
const G=goals(); const sh=loadShelf(); const rows=[]; const SAVE=process.env.SAVE==='1';
for(const name of process.argv.slice(2)){ const g=G[name]; const gen=goalFor(name,{ins:g.ins},G); const t=Date.now(); const r=loopBuild(gen,{name}); const tb=(Date.now()-t)/1000; if(r.all) console.log(`  ${name}: שלדים — ${r.all.map(a=>a.skel+' '+a.prog.length).join(' · ')}`);
  if(r.all&&process.env.ALLSK==='1'){ let bestS=null; for(const a of r.all){ let q=a.prog; try{ q=shorten(a.prog,gen,{minutes:+process.env.MIN||2,quiet:1}).prog; }catch{} if(!bestS||q.length<bestS.q.length) bestS={q,skel:a.skel}; } r.prog=bestS.q; r.skel=bestS.skel; }
  if(!r.prog){ rows.push(`✗ ${name}`); continue; }
  let s=r.prog; try{ s=shorten(r.prog,gen,{minutes:+process.env.MIN||2,quiet:1}).prog; }catch(e){ rows.push(`✗ ${name}: קיצור נכשל ${e.message}`); }
  const fc=finalCheck(s,gen); const cur=sh.named.find(b=>b.name===name);
  rows.push(`${(r.skel||'').padEnd(22)} ${name.padEnd(28)} · במדף ${String(cur?.prog.length??'-').padStart(4)} · הצורף ${String(r.prog.length).padStart(4)} ⇒ קוצר ${String(s.length).padStart(4)} · ${fc.n-fc.bad}/${fc.n} · נבנה ב-${tb.toFixed(1)} שנ׳`);
  if(SAVE&&!fc.bad&&cur&&s.length<cur.prog.length){ cur.prog=s; cur.by='הצורף · בונה-לולאות'; delete cur.recipe; } }
rows.forEach(l=>console.log(l)); if(SAVE){ fs.copyFileSync('shelf3.json','shelf3.before-loops.json'); fs.writeFileSync('shelf3.json',JSON.stringify(sh)); }
process.exit(0);
