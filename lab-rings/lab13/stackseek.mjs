// חיפוש מקום ל«זרוק» (לאן s; לך; שים) בתוך התוכנית — כך שבכל מסלול המחסנית תיגמר ריקה. אחד, ואם אין — שניים.
import fs from 'fs'; import { makeSpecs } from './specs.mjs'; import { checker, shrink, anneal, replace } from './tools2.mjs';
const sh=JSON.parse(fs.readFileSync('shelf.json','utf8')); const orig=new Map(JSON.parse(fs.readFileSync('lib2.before-new-engine.json','utf8')).map(b=>[b.name,b.prog])); const {S}=makeSpecs(616);
const guard=(b)=>{ const keepCells=/הפוך|מיין/.test(b.name)?[]:[1,8,9,10,11,12,13,14,15]; return ()=>{ const e=S[b.name](); const bf=e.mem.slice(); return {mem:e.mem,ok:r=>e.ok(r)&&keepCells.every(c=>r[c]===bf[c])}; }; };
const ins=(p,i,s)=>replace(p,i,0,[['WHERE',s],['GO'],['PUT']]);
for(const b of sh.named){ if(!/רשימה/.test(b.name)) continue; const g=guard(b); const fast=checker(g,40,40000), full=checker(g,300,40000), fresh=checker(g,3000,40000); const ok=p=>fast(p)&&full(p);
  if(fresh(b.prog)) continue; const o=orig.get(b.name); let found=null; const t=Date.now();
  for(const s of [7,6,5,4]){ for(let i=0;i<=o.length&&!found;i++){ const q=ins(o,i,s); if(q&&ok(q)&&fresh(q)) found=q; } if(found) break; }
  if(!found) for(const s of [7,6]) { for(let i=0;i<=o.length&&!found;i++){ const q1=ins(o,i,s); if(!q1) continue; for(let j=i;j<=q1.length&&!found;j++){ const q=ins(q1,j,s); if(q&&fast(q)&&full(q)&&fresh(q)) found=q; } } if(found) break; }
  if(!found){ console.log(`✗ ${b.name}: לא נמצא מקום`); continue; }
  const p=anneal(shrink(found,ok),ok,15000,4,5); const best=fresh(p)?p:found; console.log(`${b.name}: מקור ${o.length} + זריקה ⇐ ${best.length} (עומדת בכללים) · ${((Date.now()-t)/1000).toFixed(0)}s`); b.prog=best; fs.writeFileSync('shelf.json',JSON.stringify(sh)); }
