import fs from 'fs'; import { goals, goalFor } from './tzoref-goals.mjs';
const mod=await import(process.argv[2]||'./tzoref.mjs'); const G=goals(); const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8'));
let tot=0, pass=0; const T0=Date.now();
for(const name of ['ספור זוגיים ברשימה','מ8 שארית ב-3','ממוצע','הגדול ברשימה']){ const b=sh.named.find(x=>x.name===name); const g=G[name]; const gen=goalFor(name,{ins:g.ins},G); const chk=mod.makeChecker(gen,300);
  // מוטציות: מחיקה/החלפה של פקודה אחת — כמו שהמקצר עושה; רובן נכשלות מהר, חלקן עוברות
  const P=b.prog; const muts=[P]; const OPS=[['GO'],['TAKE'],['PUT'],['ADD'],['SHR'],['CALC'],['WHERE',0],['WHERE',3]];
  for(let i=0;i<P.length;i++){ if(P[i][2]) continue; muts.push([...P.slice(0,i),...P.slice(i+1)].map(x=>x[2]==='code'&&x[1]>i?['WHERE',x[1]-1,'code']:x)); for(const o of OPS) muts.push([...P.slice(0,i),o,...P.slice(i+1)]); }
  const t=Date.now(); let n=0; while(Date.now()-t<5000){ for(const m of muts){ n++; if(chk(m)) pass++; } } tot+=n; console.log(name, (n/5).toFixed(0)+' בדיקות/שנ׳'); }
console.log('סה״כ',(tot/20).toFixed(0),'בדיקות/שנ׳ · עברו',pass,'· השוואות',globalThis.__CMP||0,'· אי-הסכמות',globalThis.__DIS||0); process.exit(0);
