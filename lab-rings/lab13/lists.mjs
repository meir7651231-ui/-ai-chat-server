// לבני רשימות כמתכונים: לולאה אחת (קוד גולמי) + לבנה מהמדף בגוף. תאים 8–15 = הרשימה, אסור לגעת. תא 3 = «איפה אני ברשימה».
import fs from 'fs'; import { expand } from './recipes.mjs'; import { makeSpecs } from './specs.mjs'; import { checker, shrink, anneal } from './tools2.mjs';
const F15='TAKE; TAKE; CALC; TAKE; CALC'; const FREE=[7,6,5,4,0];
const INIT0='WHERE 2; GO; '+F15+'; PUT; TAKE; TAKE; CALC; PUT; WHERE 1; GO; TAKE; WHERE 3; GO; PUT';
const TEST='LOOP: WHERE 3; GO; TAKE; WHERE @BODY; JUMP; WHERE 3; GO; TAKE; TAKE; CALC; WHERE @END; JUMP';
const STEP='BODY: WHERE 3; GO; TAKE; TAKE; WHERE@; GO; TAKE; WHERE 3; GO; PUT';   // משאיר על המחסנית את הכתובת הישנה (לא-אפס) לקפיצה חזרה
const BACK='WHERE @LOOP; JUMP; END:';
const R={
 'אורך רשימה (לולאה + ספירה)': [INIT0,TEST,STEP,{call:'ועוד 1 באותו תא',map:{2:2},free:FREE},BACK],
 'סכום רשימה': [INIT0,TEST,'BODY: WHERE 3; GO; TAKE; TAKE',{call:'חיבור מספרים',map:{0:2,1:3,2:7},free:[6,5,4,0]},'WHERE 7; GO; TAKE; WHERE 2; GO; PUT; WHERE 3; GO; TAKE; WHERE@; GO; TAKE; WHERE 3; GO; PUT',BACK],
 'הגדול ברשימה': [INIT0,TEST,'BODY: WHERE 3; GO; TAKE',{call:'מקסימום',map:{0:2,1:3,2:0},free:[7,6,5,4]},'WHERE 0; GO; TAKE; WHERE 2; GO; PUT; WHERE 3; GO; TAKE; WHERE@; GO; TAKE; WHERE 3; GO; PUT',BACK],
};
const file=JSON.parse(fs.readFileSync('shelf.json','utf8')); const shelf=new Map(file.named.map(b=>[b.name,b])); const {S}=makeSpecs(123);
const keepList=(gen)=>()=>{ const e=gen(); const b=e.mem.slice(); return {mem:e.mem,ok:r=>e.ok(r)&&[1,8,9,10,11,12,13,14,15].every(c=>r[c]===b[c])}; };
for(const [name,rec] of Object.entries(R)){ const gen=keepList(S[name]); const fast=checker(gen,40,40000), full=checker(gen,300,40000), fresh=checker(gen,3000,40000); const ok=p=>fast(p)&&full(p);
  let raw; try{ raw=expand(rec,shelf); }catch(e){ console.log(`✗ ${name}: ${e.message}`); continue; }
  if(!fresh(raw)){ console.log(`✗ ${name}: המורכבת לא עובדת (${raw.length})`); continue; }
  const s1=shrink(raw,ok); const s2=anneal(s1,ok,15000,4,9); const best=fresh(s2)?s2:s1; const old=shelf.get(name); const oldOk=fresh(old.prog);
  console.log(`${name}: ממתכון ${raw.length} ⇐ ${best.length} · הישנה ${old.prog.length}${oldOk?'':' (הישנה משנה את הרשימה!)'}`);
  if(best.length<old.prog.length||!oldOk) shelf.set(name,{...old,prog:best,recipe:rec,by:'ממתכון'}); else shelf.set(name,{...old,recipe:rec}); }
fs.writeFileSync('shelf.json',JSON.stringify({...file,named:[...shelf.values()]}));
