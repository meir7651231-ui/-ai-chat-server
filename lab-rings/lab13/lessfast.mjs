// «קטן מ-» בלי לולאה — קיצור עד הסוף: חישול ארוך (הרבה נקודות התחלה), מנוע העיגולים על קטעים, ושוב. כל תוצאה: 3000 בדיקות, קלט שמור, מחסנית נקייה.
import fs from 'fs'; import { run } from './machine2.mjs'; import { checker, shrink, anneal, plain } from './tools2.mjs'; import { seamRings } from './ringseam.mjs';
let s=7; const R=(n)=>{ s=(Math.imul(s,1103515245)+12345)&0x7fffffff; return (s>>>16)%n; };
const gen=()=>{ const m=Array.from({length:16},()=>R(16)); if(R(4)===0) m[1]=m[0]; const w=m[0]<m[1]?15:0; const b=m.slice(); return {mem:m,ok:r=>r[2]===w&&r[0]===b[0]&&r[1]===b[1]}; };
const fast=checker(gen,40), full=checker(gen,400), fresh=checker(gen,4000); const ok=p=>fast(p)&&full(p);
let best=JSON.parse(fs.readFileSync('less-fast.json','utf8')); console.log('התחלה:',best.length,fresh(best));
const runs=Array.from({length:24},(_,i)=>{ const e=gen(); return {mem:e.mem,pa:(i*5)&15,aa:(i*7+3)&15,sc:0}; });
for(let round=1;round<=+process.argv[2]||4;round++){ const a=anneal(best,ok,+process.argv[3]||40000,6,round*31); if(a.length<best.length&&fresh(a)) best=a;
  const b=seamRings(best,ok,runs,{D:4,keepCells:[0,1,2]}); if(b.length<best.length&&fresh(b)) best=b;
  const steps=(()=>{ let mx=0; for(let i=0;i<300;i++){ const r=run(plain(best),Array.from({length:16},()=>R(16))); mx=Math.max(mx,r.steps);} return mx; })();
  console.log(`סבב ${round}: ${best.length} פעולות בקוד · הכי הרבה צעדים בהרצה ${steps}`); fs.writeFileSync('less-fast.json',JSON.stringify(best)); }
