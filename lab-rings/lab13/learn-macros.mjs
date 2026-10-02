// «מתכונים»: כל חלק במדף (1–2 קלטים) ⇒ ביטוי של חבר/נאנד/חצי. נשמר ב-tzoref-macros.json — בונה-היסודות משתמש בהם כצעד אחד
import fs from 'fs'; import { partTables } from './tzoref-tables.mjs'; import { basicBuild, showB, size } from './tzoref-basic.mjs';
const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); let M={}; try{ M=JSON.parse(fs.readFileSync('tzoref-macros.json','utf8')); }catch{}
const TB=partTables(sh.named.filter(b=>!b.bad)).filter(t=>t.k<=2&&!t.partial&&!M[t.name]);
for(const t of TB){ const tt=t.k===1?Array.from({length:16},(_,i)=>t.T[i]):Array.from({length:256},(_,i)=>t.T[i]);
  const r=basicBuild(tt,{ins:t.k===1?[0]:[0,1],ms:+process.env.MMS||15000});
  if(r.expr){ M[t.name]={k:t.k,expr:r.expr,size:size(r.expr)}; fs.writeFileSync('tzoref-macros.json',JSON.stringify(M)); console.log(`✓ ${t.name} = ${showB(r.expr)}`); } else console.log(`· ${t.name}: לא נמצא`); }
console.log('מתכונים:',Object.keys(M).length); process.exit(0);
