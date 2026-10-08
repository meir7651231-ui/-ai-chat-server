// מריץ את המוח המאוחד על כל קבצי המשימות שבתיקיית suite — ממשיך מאיפה שעצר (תוצאות נשמרות שורה-שורה)
import fs from 'fs'; import { solveAny } from './brain-all.mjs';
const DIR=process.env.SUITE||'../suite'; const OUT=process.env.OUT||'bench-results.jsonl';
const done=new Set(); try{ for(const l of fs.readFileSync(OUT,'utf8').split('\n').filter(Boolean)){ const j=JSON.parse(l); done.add(j.key); } }catch{}
const files=fs.readdirSync(DIR).filter(f=>f.endsWith('.json')).sort();
for(const f of files){ const {tasks}=JSON.parse(fs.readFileSync(DIR+'/'+f,'utf8')); for(const t of tasks){ const key=f+'|'+t.name; if(done.has(key)) continue;
    const r=await solveAny(t); const row={key,file:f,...t,...r}; fs.appendFileSync(OUT,JSON.stringify(row)+'\n');
    console.log(`${r.ok?'✓':'✗'} [${f.replace('.json','')}·${t.kind}·${t.difficulty}] ${t.name}: ${r.ok?r.len+' פקודות · '+r.stage:'לא נפתר'}${r.bad?' (נכשל בבדיקה: '+r.bad+')':''} · ${(r.ms/1000).toFixed(0)} שנ׳ · ${r.tried.join(' ')}`); } }
console.log('הסתיים'); process.exit(0);
