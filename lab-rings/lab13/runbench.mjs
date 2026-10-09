// מריץ את המוח המאוחד על כל קבצי המשימות שבתיקיית suite — ממשיך מאיפה שעצר (תוצאות נשמרות שורה-שורה)
import fs from 'fs'; import { solveAny, genFor } from './brain-all.mjs'; import { deepRelocOk } from './jumpfix.mjs'; import { shelveSolution } from './shelvebench.mjs';
const DIR=process.env.SUITE||'../suite'; const OUT=process.env.OUT||'bench-results.jsonl';
const done=new Set(); try{ for(const l of fs.readFileSync(OUT,'utf8').split('\n').filter(Boolean)){ const j=JSON.parse(l); done.add(j.key); } }catch{}
const files=fs.readdirSync(DIR).filter(f=>f.endsWith('.json')).sort();
for(const f of files){ const {tasks}=JSON.parse(fs.readFileSync(DIR+'/'+f,'utf8')); for(const t of tasks){ const key=f+'|'+t.name; if(done.has(key)) continue; if(process.env.KIND&&!process.env.KIND.split(',').includes(t.kind)) continue;
    const r=await solveAny(t); r.reloc=r.ok?deepRelocOk(r.prog,genFor(t),{n:200}):null; if(r.ok&&process.env.SHELVE) r.shelved=shelveSolution(t,r.prog); const {prog,...rr}=r; const row={key,file:f,...t,...rr,prog}; fs.appendFileSync(OUT,JSON.stringify(row)+'\n');
    console.log(`${r.ok?'✓':'✗'} [${f.replace('.json','')}·${t.kind}·${t.difficulty}] ${t.name}: ${r.ok?r.len+' פקודות · '+r.stage:'לא נפתר'}${r.bad?' (נכשל בבדיקה: '+r.bad+')':''}${r.ok&&!r.reloc?' (לא נייד!)':''} · ${(r.ms/1000).toFixed(0)} שנ׳ · ${r.tried.join(' ')}`); } }
console.log('הסתיים'); process.exit(0);
