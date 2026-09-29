// איקאה מול נגר: לבנים שנבנו ממתכון — מעבירים את מנוע העיגולים על כל התפרים.
import fs from 'fs'; import { expand } from './recipes.mjs'; import { checker, shrink } from './tools2.mjs'; import { seamRings } from './ringseam.mjs'; import { makeSpecs } from './specs.mjs';
const sh=JSON.parse(fs.readFileSync('shelf.json','utf8')); const shelf=new Map(sh.named.map(b=>[b.name,b])); const {S}=makeSpecs(4040);
let s=5; const R=(n)=>{ s=(Math.imul(s,1103515245)+12345)&0x7fffffff; return (s>>>16)%n; };
const M=(f)=>()=>{ const m=Array.from({length:16},()=>R(16)); if(R(4)===0) m[1]=m[0]; const w=f(m[0],m[1]); return {mem:m,ok:r=>r[2]===w}; };
Object.assign(S,{'קטן מ-':M((a,b)=>a<b?15:0),'מינימום':M((a,b)=>Math.min(a,b)),'מקסימום':M((a,b)=>Math.max(a,b)),'חיסור':M((a,b)=>(a-b)&15)});
const keep=(gen,cells)=>()=>{ const e=gen(); const bf=e.mem.slice(); return {mem:e.mem,ok:r=>e.ok(r)&&cells.every(c=>r[c]===bf[c])}; };
const F15='TAKE; TAKE; CALC; TAKE; CALC';
const INIT0='WHERE 2; GO; '+F15+'; PUT; TAKE; TAKE; CALC; PUT; WHERE 1; GO; TAKE; WHERE 3; GO; PUT';
const TEST='LOOP: WHERE 3; GO; TAKE; WHERE @BODY; JUMP; WHERE 3; GO; TAKE; TAKE; CALC; WHERE @END; JUMP';
const STEP='WHERE 3; GO; TAKE; WHERE@; GO; TAKE; WHERE 3; GO; PUT';
const LISTK=[1,8,9,10,11,12,13,14,15];
const CASES=[
 {name:'חיסור', rec:shelf.get('חיסור').recipe, cells:[0,1], hand:null},
 {name:'אורך רשימה (לולאה + ספירה)', rec:[INIT0,TEST,'BODY: '+STEP.replace('WHERE 3; GO; TAKE;','WHERE 3; GO; TAKE; TAKE;'),{call:'ועוד 1 באותו תא',map:{2:2},free:[7,6,5,4,0]},'WHERE @LOOP; JUMP; END:'], cells:[0,...LISTK], hand:39},
 {name:'קטן מ-', rec:shelf.get('קטן מ-').recipe, cells:[0,1], hand:null},
 {name:'מקסימום', rec:shelf.get('מקסימום').recipe, cells:[0,1], hand:null},
 {name:'חיסור', rec:shelf.get('חיסור').recipe, cells:[0,1], hand:null},
];
for(const c of CASES){ const g=keep(S[c.name],c.cells); const fast=checker(g,40,60000), full=checker(g,300,60000), fresh=checker(g,3000,60000); const ok=p=>fast(p)&&full(p);
  const raw=expand(c.rec,shelf); if(!fresh(raw)){ console.log('✗',c.name,'המורכבת לא עובדת'); continue; }
  const runs=Array.from({length:24},(_,i)=>{ const e=g(); return {mem:e.mem,pa:(i*5)&15,aa:(i*7+3)&15,sc:0}; });
  const t=Date.now(); const a=shrink(raw,ok); const b=seamRings(a,ok,runs,{D:4,keepCells:[2,...c.cells]}); const b2=shrink(b,ok); const good=fresh(b2);
  console.log(`${c.name}: הורכבה ${raw.length} ⇐ מקצר רגיל ${a.length} ⇐ עיגולים על התפרים ${b2.length}${good?'':' (נכשל בבדיקה!)'} · עכשיו במדף ${shelf.get(c.name).prog.length}${c.hand?` · נגר ${c.hand}`:''} · ${((Date.now()-t)/1000).toFixed(0)}s`); }
