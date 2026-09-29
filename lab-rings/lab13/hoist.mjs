// «ההכנה פעם אחת»: המספר 1 נבנה לפני החזרה (לבנת «קבוע 1» לתא 5), ובכל סיבוב רק «חיבור» (בלי לבנות 1 מחדש).
import fs from 'fs'; import { expand } from './recipes.mjs'; import { makeSpecs } from './specs.mjs'; import { checker, shrink, anneal } from './tools2.mjs';
const sh=JSON.parse(fs.readFileSync('shelf.json','utf8')); const shelf=new Map(sh.named.map(b=>[b.name,b])); const {S}=makeSpecs(717);
const F15='TAKE; TAKE; CALC; TAKE; CALC';
const INIT0='WHERE 2; GO; '+F15+'; PUT; TAKE; TAKE; CALC; PUT; WHERE 1; GO; TAKE; WHERE 3; GO; PUT';
const TEST='LOOP: WHERE 3; GO; TAKE; WHERE @BODY; JUMP; WHERE 3; GO; TAKE; TAKE; CALC; WHERE @END; JUMP';
const STEP='WHERE 3; GO; TAKE; WHERE@; GO; TAKE; WHERE 3; GO; PUT';
const rec=[{call:'קבוע 1',map:{2:5},free:[7,6,4,0]}, INIT0, TEST, 'BODY: WHERE 3; GO; TAKE', {call:'חיבור מספרים',map:{0:2,1:5,2:7},free:[6,4,0]}, 'WHERE 7; GO; TAKE; WHERE 2; GO; PUT', STEP, 'WHERE @LOOP; JUMP; END:'];
const name='אורך רשימה (לולאה + ספירה)'; const L=[0,1,8,9,10,11,12,13,14,15];
const g=()=>{ const e=S[name](); const b=e.mem.slice(); return {mem:e.mem,ok:r=>e.ok(r)&&L.every(c=>r[c]===b[c])}; };
const fast=checker(g,40,20000), full=checker(g,300,20000), fresh=checker(g,3000,20000); const ok=p=>fast(p)&&full(p);
const raw=expand(rec,shelf); console.log('הורכבה:',raw.length,'· עובדת:',fresh(raw));
if(fresh(raw)){ const p=anneal(shrink(raw,ok),ok,+process.argv[2]||60000,4,3); const best=fresh(p)?p:raw; console.log(`אחרי המנוע: ${best.length} · ביד: ${shelf.get(name).prog.length} · בלי «הכנה פעם אחת»: 57`); fs.writeFileSync('hoist.json',JSON.stringify(best)); }
