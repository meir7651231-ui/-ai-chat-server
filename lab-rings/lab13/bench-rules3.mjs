import { makeChecker } from './tzoref.mjs'; import { goals, goalFor } from './tzoref-goals.mjs'; const { swarBuild }=await import('./tzoref-swar.mjs');
const G=goals();
for(const n of ['לא (מספר)','לא-וגם (מספרים)','חיבור מספרים','קח מהכתובת שבתא','דלג אם לא-אפס (תא0 אפס ⇒ העתק תא1)','קבוע 1']){ const t=[];
  for(let k=0;k<3;k++){ const gen=goalFor(n,null,G); const r=swarBuild(gen,{ms:30000,check:makeChecker(gen,300)}); t.push(r.prog?r.tries:1e9); }
  t.sort((a,b)=>a-b); console.log(`${n.slice(0,20)}|${t.join(',')}|${t[1]}`); }
