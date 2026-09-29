// כלל חדש: לבנה לא משנה את הקלטים שלה (אחרת אי אפשר להרכיב ממנה). מי שמשנה — עוטפים: שומרים את הקלט בצד, ובסוף מחזירים; ואז המנוע מקצר עם הכלל.
import fs from 'fs'; import { run } from './machine2.mjs'; import { makeSpecs } from './specs.mjs'; import { checker, shrink, anneal, plain } from './tools2.mjs';
const keep=(gen,ins)=>()=>{ const e=gen(); const before=e.mem.slice(); return {mem:e.mem,ok:(r)=>e.ok(r)&&ins.every(c=>r[c]===before[c])}; };
const copy=(a,b)=>[['WHERE',a],['GO'],['TAKE'],['WHERE',b],['GO'],['PUT']];
const clobbers=(prog,ins)=>{ const hit=new Set(); for(let t=0;t<400;t++){ const m=Array.from({length:16},()=>Math.floor(Math.random()*16)); const r=run(plain(prog),m,{maxSteps:6000}); if(!r) continue; for(const c of ins) if(r.mem[c]!==m[c]) hit.add(c); } return [...hit]; };
function fix(prog,ins,gen,MS){ const g=keep(gen,ins); const fast=checker(g,40,6000), full=checker(g,300,6000), fresh=checker(g,3000,6000); const ok=p=>fast(p)&&full(p);
  if(fresh(prog)) return prog; const hit=clobbers(prog,ins); const usedC=new Set(prog.filter(x=>x[0]==='WHERE'&&!x[2]).map(x=>x[1])); const spare=[15,14,13,12,11,10,9,8,7,6,5,4].filter(c=>!usedC.has(c)&&!ins.includes(c)&&c!==2); let p=prog.slice();
  hit.forEach((c,i)=>{ p=[...copy(c,spare[i]),...p.map(x=>x[2]==='code'?['WHERE',x[1]+6,'code']:x),...copy(spare[i],c)]; });
  if(!fresh(p)) return null; const s=anneal(shrink(p,ok),ok,MS,4,prog.length); return fresh(s)?s:p; }
const MS=+process.argv[2]||1500; const sh=JSON.parse(fs.readFileSync('shelf.json','utf8')); const {S}=makeSpecs(66);
const M=(f)=>()=>{ const m=Array.from({length:16},()=>Math.floor(Math.random()*16)); if(Math.random()<0.25) m[1]=m[0]; const w=f(m[0],m[1]); return {mem:m,ok:r=>r[2]===w}; };
Object.assign(S,{'חיסור':M((a,b)=>(a-b)&15),'ועוד 2':M(a=>(a+2)&15),'קטן מ-':M((a,b)=>a<b?15:0),'גדול מ-':M((a,b)=>a>b?15:0)});
let nf=0, add=0;
for(const b of sh.named){ if(/רשימה|כתוב לכתובת/.test(b.name)) continue; const ins=(b.ins||[]).filter(c=>c!==2); if(!S[b.name]||!ins.length) continue;
  if(!clobbers(b.prog,ins).length) continue; const p=fix(b.prog,ins,S[b.name],MS); if(!p){ console.log('✗',b.name); continue; } console.log(`${b.name}: ${b.prog.length} → ${p.length} (עכשיו לא נוגעת בקלט)`); add+=p.length-b.prog.length; b.prog=p; nf++; }
const tt=(t)=>()=>{ const m=Array.from({length:16},()=>Math.floor(Math.random()*16)); const a=m[0],bb=m[1],c=m[3]; let w=0; for(let k=0;k<4;k++){ const idx=(((a>>k)&1)<<2)|(((bb>>k)&1)<<1)|((c>>k)&1); w|=((t>>idx)&1)<<k; } return {mem:m,ok:r=>r[2]===w}; };
let nl=0, addl=0; for(const b of sh.logic){ if(!clobbers(b.prog,[0,1,3]).length) continue; const p=fix(b.prog,[0,1,3],tt(b.tt),MS/3); if(!p){ console.log('✗ לוגית',b.tt); continue; } addl+=p.length-b.prog.length; b.prog=p; nl++; }
console.log(`תוקנו: ${nf} עם שם (+${add} פעולות) · ${nl} לוגיות (+${addl} פעולות)`); fs.writeFileSync('shelf.json',JSON.stringify(sh));
