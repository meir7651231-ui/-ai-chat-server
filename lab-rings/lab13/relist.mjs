import fs from 'fs'; import { makeSpecs } from './specs.mjs'; import { checker, shrink, anneal } from './tools2.mjs';
const sh=JSON.parse(fs.readFileSync('shelf.json','utf8')); const orig=new Map(JSON.parse(fs.readFileSync('lib2.before-new-engine.json','utf8')).map(b=>[b.name,b.prog])); const {S}=makeSpecs(515);
const guard=(b)=>{ const keepCells=/הפוך|מיין/.test(b.name)?[]:[1,8,9,10,11,12,13,14,15]; return ()=>{ const e=S[b.name](); const bf=e.mem.slice(); return {mem:e.mem,ok:r=>e.ok(r)&&keepCells.every(c=>r[c]===bf[c])}; }; };
for(const b of sh.named){ if(!/רשימה/.test(b.name)) continue; const g=guard(b); const fast=checker(g,40,40000), full=checker(g,300,40000), fresh=checker(g,3000,40000); const ok=p=>fast(p)&&full(p);
  if(fresh(b.prog)) continue; const o=orig.get(b.name); if(!o||!fresh(o)){ console.log(`✗ ${b.name}: גם המקור לא עומד בכללים`); continue; }
  const p=anneal(shrink(o,ok),ok,15000,4,3); const best=fresh(p)?p:o; console.log(`${b.name}: מהמקור ${o.length} → ${best.length} (עומדת בכללים)`); b.prog=best; }
fs.writeFileSync('shelf.json',JSON.stringify(sh));
