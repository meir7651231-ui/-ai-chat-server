// מריץ משימה אחת מהמבחן (לפי שם) דרך המוח המאוחד ושומר שורה — לבדיקה חוזרת אחרי תיקון
import fs from 'fs'; import { solveAny } from './brain-all.mjs';
const [name,OUT]=[process.argv[2],process.argv[3]||'bench-fix.jsonl']; const DIR=process.env.SUITE||'../suite';
for(const f of fs.readdirSync(DIR).filter(f=>f.endsWith('.json')).sort()){ const t=JSON.parse(fs.readFileSync(DIR+'/'+f,'utf8')).tasks.find(t=>t.name===name); if(!t) continue;
  const r=await solveAny(t); const {prog,...rr}=r; fs.appendFileSync(OUT,JSON.stringify({key:f+'|'+t.name,file:f,...t,...rr,prog})+'\n');
  console.log(`${r.ok?'✓':'✗'} ${t.name}: ${r.ok?r.len+' פקודות · '+r.stage+' · '+r.how:'לא נפתר'} · ${(r.ms/1000).toFixed(0)} שנ׳ · ${r.tried.join(' ')}`); }
process.exit(0);
