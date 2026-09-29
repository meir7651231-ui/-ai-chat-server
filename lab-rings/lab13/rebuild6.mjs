// שש הלבנים השבורות — נכתבות מחדש כך שלא סומכות על שום תא שהוא 0. הטריק: מכל תא מלוכלך x, «x לא-וגם (לא x)» = 15 תמיד.
// אחר כך המנוע מקצר. «שווה» משתמשת בלבנת «שונה» מהמדף של 256 (הגרסה הקצרה) ובקפיצה.
import fs from 'fs'; import { asm } from './machine2.mjs'; import { makeSpecs } from './specs.mjs'; import { checker, shrink, anneal } from './tools2.mjs';
const tag=(p)=>{ const out=p.map(x=>x.slice()); let last=-1; out.forEach(([o],i)=>{ if(o==='WHERE') last=i; else if(o==='WHERE@'||o==='GO') last=-1; else if(o==='JUMP'&&last>=0){ out[last]=['WHERE',out[last][1],'code']; last=-1; } }); return out; };
const L=new Map(JSON.parse(fs.readFileSync('logic256b.json','utf8')).map(b=>[b.tt,b.prog])); const XOR=L.get(60);
const xorSrc=XOR.map(([o,k])=>o==='WHERE'?`WHERE ${k}`:o).join('; ');
const F15='TAKE; TAKE; CALC; TAKE; CALC';   // על התא הנוכחי x: ~x, ואז ~x לא-וגם x = 15
const SRC={
 'קבוע 14 (15 ועוד 15)': `WHERE 2; GO; ${F15}; PUT; TAKE; TAKE; ADD; PUT`,
 'קבוע 1': `WHERE 2; GO; ${F15}; PUT; TAKE; TAKE; ADD; PUT; TAKE; TAKE; CALC; PUT`,
 'ועוד 1': `WHERE 2; GO; ${F15}; PUT; TAKE; TAKE; ADD; PUT; TAKE; TAKE; CALC; WHERE 0; GO; TAKE; ADD; WHERE 2; GO; PUT`,
 'ועוד 1 באותו תא': `WHERE 4; GO; ${F15}; PUT; TAKE; TAKE; ADD; PUT; TAKE; TAKE; CALC; WHERE 2; GO; TAKE; ADD; PUT`,
 'שווה (מספרים)': `${xorSrc}; WHERE 2; GO; TAKE; WHERE @NZ; JUMP; TAKE; TAKE; CALC; PUT; TAKE; WHERE @END; JUMP; NZ: ${F15}; PUT; TAKE; TAKE; CALC; PUT; END: WHERE 2`,
};
const {S}=makeSpecs(21); const lib=JSON.parse(fs.readFileSync('lib3.json','utf8')); const byName=new Map(lib.map(b=>[b.name,b]));
for(const [name,src] of Object.entries(SRC)){ const gen=S[name]; const fast=checker(gen,40), full=checker(gen,300), fresh=checker(gen,3000); const ok=p=>fast(p)&&full(p);
  const P=tag(asm(src)); if(!fresh(P)){ console.log('✗ מה שכתבתי לא עובד:',name); continue; }
  const p=anneal(shrink(P,ok),ok,3000,4,5); const good=fresh(p); const use=good?p:P;
  console.log(`✓ ${name}: כתבתי ${P.length} ⇐ קוצר ${p.length}${good?'':' (הקיצור נכשל — נשאר מה שכתבתי)'}`);
  byName.set(name,{...byName.get(name),prog:use,by:'נכתב מחדש (בלי לסמוך על 0) · קוצר במנוע'}); }
// «סוף רשימה עד 2»: הלבנה «סוף רשימה (לולאה, עד 6)» עושה אותו דבר ויותר — בודקים ומשתמשים בה
{ const name='סוף רשימה באורך עד 2', six=byName.get('סוף רשימה (לולאה, עד 6)').prog; const fresh=checker(S[name],3000);
  console.log(fresh(six)?`✓ ${name}: משתמשים ב«סוף רשימה (עד 6)» — ${six.length}`:`✗ ${name}`); if(fresh(six)) byName.set(name,{...byName.get(name),prog:six,by:'זהה ל«סוף רשימה (עד 6)»'}); }
fs.writeFileSync('lib3.json',JSON.stringify([...byName.values()]));
