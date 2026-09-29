// מיון בלי השוואה: מעבר 1 — מסמנים כל איבר (m[p]=p). מעבר 2 — עוברים על 8..15 לפי הסדר ומשרשרים רק את המסומנים.
import fs from 'fs'; import { asm } from './machine2.mjs'; import { makeSpecs } from './specs.mjs'; import { checker, shrink, anneal } from './tools2.mjs';
const tag=(p)=>{ const out=p.map(x=>x.slice()); let last=-1; out.forEach(([o],i)=>{ if(o==='WHERE') last=i; else if(o==='WHERE@'||o==='GO') last=-1; else if(o==='JUMP'&&last>=0){ out[last]=['WHERE',out[last][1],'code']; last=-1; } }); return out; };
const F15='TAKE; TAKE; CALC; TAKE; CALC';
const SRC=`WHERE 1; GO; TAKE; WHERE 4; GO; PUT;
 L1: WHERE 4; GO; TAKE; WHERE @B1; JUMP;
 WHERE 4; GO; ${F15}; PUT; TAKE; TAKE; ADD; PUT; TAKE; TAKE; ADD; PUT; TAKE; TAKE; ADD; PUT;
 WHERE 3; GO; ${F15}; PUT; TAKE; TAKE; ADD; PUT; TAKE; TAKE; CALC; PUT; TAKE; WHERE 5; GO; PUT;
 L2: WHERE 4; GO; TAKE; WHERE@; GO; TAKE; WHERE @D2; JUMP; WHERE 3; GO; TAKE; WHERE @N2; JUMP;
 D2: WHERE 4; GO; TAKE; WHERE 3; GO; TAKE; WHERE@; GO; PUT; WHERE 4; GO; TAKE; WHERE 3; GO; PUT;
 N2: WHERE 4; GO; TAKE; WHERE 5; GO; TAKE; ADD; WHERE 4; GO; PUT; WHERE 4; GO; TAKE; WHERE @L2; JUMP;
 WHERE 4; GO; TAKE; WHERE 3; GO; TAKE; WHERE@; GO; PUT; WHERE 3; GO; TAKE; WHERE @END; JUMP;
 B1: WHERE 4; GO; TAKE; WHERE@; GO; TAKE; WHERE 4; GO; TAKE; TAKE; WHERE@; GO; PUT; WHERE 4; GO; PUT; WHERE 1; GO; TAKE; WHERE @L1; JUMP;
 END:`;
const P0=tag(asm(SRC)); const P=fs.existsSync('sort2.json')?JSON.parse(fs.readFileSync('sort2.json','utf8')):P0; const {S}=makeSpecs(3131); const g=S['מיין רשימה'];
const fast=checker(g,40,20000), full=checker(g,300,20000), fresh=checker(g,3000,20000); const ok=p=>fast(p)&&full(p);
const sh=JSON.parse(fs.readFileSync('shelf.json','utf8')); const old=sh.named.find(b=>b.name==='מיין רשימה');
console.log('כתבתי:',P.length,'· עובד:',fresh(P),'· הישנה:',old.prog.length);
if(fresh(P)){ const t=Date.now(); const p=anneal(shrink(P,ok),ok,+process.argv[2]||30000,4,9); const best=fresh(p)?p:P; console.log('אחרי המנוע:',best.length,`· ${((Date.now()-t)/1000).toFixed(0)}s`);
  fs.writeFileSync('sort2.json',JSON.stringify(best)); }
