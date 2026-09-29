// שלב 4: הלבנים הגדולות — חישול ארוך (הרבה נקודות התחלה, מותר לעלות), כל תוצאה נבדקת על 3000 דוגמאות חדשות.
import fs from 'fs'; import { makeSpecs } from './specs.mjs'; import { checker, shrink, anneal } from './tools2.mjs';
const MS=+process.argv[2]||20000; const {S}=makeSpecs(31); const shelf=JSON.parse(fs.readFileSync('shelf.json','utf8'));
const targets=new Set(['שווה (מספרים)','אורך רשימה (לולאה + ספירה)','חפש ברשימה','סכום רשימה','הגדול ברשימה','הפוך רשימה','מיין רשימה','ועוד 1','ועוד 1 באותו תא','סוף רשימה (לולאה, עד 6)']);
for(const b of shelf.named){ if(!targets.has(b.name)) continue; const gen=S[b.name]; const fast=checker(gen,40), full=checker(gen,300), fresh=checker(gen,3000); const ok=p=>fast(p)&&full(p);
  const t=Date.now(); let best=b.prog; for(let round=0;round<3;round++){ const p=anneal(best,ok,MS/3,6,round*97+b.prog.length); if(p.length<best.length&&fresh(p)) best=p; }
  console.log(`${b.name}: ${b.prog.length} → ${best.length} · ${((Date.now()-t)/1000).toFixed(0)}s`); if(best.length<b.prog.length){ b.prog=best; b.by=(b.by||'')+' · חישול ארוך'; }
  fs.writeFileSync('shelf.json',JSON.stringify(shelf)); }
console.log('סך לבנים-עם-שם:',shelf.named.reduce((a,b)=>a+b.prog.length,0));
