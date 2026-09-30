// השוואה: הבונה הרגיל מול המהיר — אותן משימות, רק 5 הפעולות
import { build, makeChecker } from './tzoref.mjs'; import { fastBuild } from './tzoref-fast.mjs'; import { goals, goalFor } from './tzoref-goals.mjs';
const G=goals();
for(const n of ['העתק','לא (מספר)','קח מהכתובת שבתא','לא-וגם (מספרים)','וגם (מספרים)']){ const gen=goalFor(n,null,G);
  const a=build(gen,{pieces:[],ms:60000}); const b=fastBuild(gen,{pieces:[],ms:60000,check:makeChecker(gen,300)});
  const ra=a.tries/(a.ms/1000), rb=b.tries/(b.ms/1000);
  console.log(`${n.padEnd(18)} רגיל: ${a.prog?a.prog.length+' פק׳':'✗'} ${String(a.ms).padStart(6)}ms (${Math.round(ra/1000)} אלף/שנ׳) · מהיר: ${b.prog?b.prog.length+' פק׳':'✗'} ${String(b.ms).padStart(6)}ms (${Math.round(rb/1000)} אלף/שנ׳) · פי ${(a.ms/Math.max(1,b.ms)).toFixed(1)} בזמן, פי ${(rb/ra).toFixed(1)} בקצב`); }
