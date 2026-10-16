// מריץ את המוח המאוחד על כל קבצי המשימות שבתיקיית suite — ממשיך מאיפה שעצר (תוצאות נשמרות שורה-שורה) · לכל משימה נרשם גם זיכרון: heapMB (ערימה אחריה), maxRssMB (שיא התהליך עד כה)
import fs from 'fs'; import { solveAny, genFor } from './brain-all.mjs'; import { deepRelocOk } from './jumpfix.mjs'; import { shelveSolution } from './shelvebench.mjs';
const DIR=process.env.SUITE||'../suite'; const OUT=process.env.OUT||'bench-results.jsonl';
const done=new Set(); try{ for(const l of fs.readFileSync(OUT,'utf8').split('\n').filter(Boolean)){ const j=JSON.parse(l); done.add(j.key); } }catch{}
const files=fs.readdirSync(DIR).filter(f=>f.endsWith('.json')).sort();
for(const f of files){ const {tasks}=JSON.parse(fs.readFileSync(DIR+'/'+f,'utf8')); for(const t of tasks){ const key=f+'|'+t.name; if(done.has(key)) continue; if(process.env.KIND&&!process.env.KIND.split(',').includes(t.kind)) continue;
    const r=await solveAny(t); r.reloc=r.ok?deepRelocOk(r.prog,genFor(t),{n:200}):null; if(r.ok&&process.env.SHELVE) r.shelved=shelveSolution(t,r.prog); r.heapMB=Math.round(process.memoryUsage().heapUsed/1e6); r.maxRssMB=Math.round(process.resourceUsage().maxRSS/1e3); const {prog,...rr}=r; const row={key,file:f,...t,...rr,prog}; fs.appendFileSync(OUT,JSON.stringify(row)+'\n');
    console.log(`${r.ok?'✓':'✗'} [${f.replace('.json','')}·${t.kind}·${t.difficulty}] ${t.name}: ${r.ok?r.len+' פקודות · '+r.stage:'לא נפתר'}${r.bad?' (נכשל בבדיקה: '+r.bad+')':''}${r.ok&&!r.reloc?' (לא נייד!)':''} · ${(r.ms/1000).toFixed(0)} שנ׳ · ${r.tried.join(' ')}`); } }
console.log('הסתיים');
// Track C (fg/learn.mjs): the batched part of the learning runs once per bench — exhaustive check of the programs recorded during it,
// adapters (family solutions ⇒ G0 ASTs), one-hole neighbours, refit of the learned costs. LEARN=0 or LEARN_REFIT=0 skips it.
if(process.env.LEARN!=='0'&&process.env.LEARN_REFIT!=='0'){ const { spawnSync }=await import('child_process'); const t=Date.now(); const z=spawnSync(process.execPath,['--max-old-space-size=5000','fg/learn.mjs','refit'],{encoding:'utf8',timeout:+process.env.LEARN_REFIT_MS||1800000}); console.log('למידה (refit): '+((z.stdout||'').trim().split('\n').pop()||'')+' · '+Math.round((Date.now()-t)/1000)+' שנ׳'); }
process.exit(0);
