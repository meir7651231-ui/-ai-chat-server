// כלל: לבנה מחזירה את המחסנית כמו שקיבלה (ריקה). מי שמשאירה — מוסיפים בסוף «שים» לתא-עבודה, ואז המנוע מקצר עם הכלל.
import fs from 'fs'; import { run } from './machine2.mjs'; import { makeSpecs } from './specs.mjs'; import { checker, shrink, anneal, plain } from './tools2.mjs';
const sh=JSON.parse(fs.readFileSync('shelf.json','utf8')); const {S}=makeSpecs(313); const MS=+process.argv[2]||6000;
const M=(f)=>()=>{ const m=Array.from({length:16},()=>Math.floor(Math.random()*16)); if(Math.random()<0.25) m[1]=m[0]; const w=f(m[0],m[1]); return {mem:m,ok:r=>r[2]===w}; };
Object.assign(S,{'חיסור':M((a,b)=>(a-b)&15),'ועוד 2':M(a=>(a+2)&15),'קטן מ-':M((a,b)=>a<b?15:0),'גדול מ-':M((a,b)=>a>b?15:0),'מינימום':M((a,b)=>Math.min(a,b)),'מקסימום':M((a,b)=>Math.max(a,b))});
export const guard=(b)=>{ const list=/רשימה/.test(b.name), changesList=/הפוך|מיין/.test(b.name); const keepCells=list?(changesList?[]:[1,8,9,10,11,12,13,14,15]):/כתוב לכתובת/.test(b.name)?[]:(b.ins||[]).filter(c=>c!==2);
  return ()=>{ const e=S[b.name](); const bf=e.mem.slice(); return {mem:e.mem,ok:r=>e.ok(r)&&keepCells.every(c=>r[c]===bf[c])}; }; };
const left=(p)=>{ let k=0; for(let t=0;t<300;t++){ const m=Array.from({length:16},()=>Math.floor(Math.random()*16)); const r=run(plain(p),m,{maxSteps:40000}); if(r) k=Math.max(k,r.st.length); } return k; };
const order=['קטן מ-','גדול מ-','מינימום','מקסימום']; const named=[...sh.named].sort((a,b)=>order.indexOf(a.name)-order.indexOf(b.name));
for(const b of named){ const k=left(b.prog); if(!k) continue; const g=guard(b); const fast=checker(g,40,40000), full=checker(g,300,40000), fresh=checker(g,3000,40000); const ok=p=>fast(p)&&full(p);
  const ins=b.ins||[]; const s=[7,6,5,4].find(c=>!ins.includes(c)); const p0=[...b.prog,['WHERE',s],['GO'],...Array(k).fill(['PUT'])];
  if(!fresh(p0)){ console.log(`✗ ${b.name}: גם עם הניקוי לא עוברת`); continue; }
  const p=anneal(shrink(p0,ok),ok,MS,4,k*7+b.prog.length); const best=fresh(p)?p:p0; console.log(`${b.name}: ${b.prog.length} → ${best.length} (מחסנית נקייה)`); b.prog=best; }
fs.writeFileSync('shelf.json',JSON.stringify(sh));
