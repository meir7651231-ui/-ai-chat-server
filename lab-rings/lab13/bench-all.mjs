// השוואה סופית: הבונה המקורי (ליבה אחת, 50 אלף/שנ׳) מול הצורף היום (4 ליבות × «8 במכה»)
import { build } from './tzoref.mjs'; import { parallelBuild } from './tzoref-fast.mjs'; import { goals, goalFor } from './tzoref-goals.mjs';
const G=goals(); let A=0,B=0;
for(const n of ['העתק','לא (מספר)','כפול 2','לא-וגם (מספרים)','חיבור מספרים','קח מהכתובת שבתא','דלג אם לא-אפס (תא0 אפס ⇒ העתק תא1)','אם (תא0 לא-אפס ⇒ תא1, אחרת תא3)']){ const gen=goalFor(n,null,G);
  const a=build(gen,{pieces:[],ms:60000}); const b=await parallelBuild(n,{ms:60000});
  console.log(`${n.slice(0,22).padEnd(22)} מקורי: ${a.prog?String(a.prog.length).padStart(2)+' פק׳':' ✗   '} ${(a.ms/1000).toFixed(2).padStart(6)} שנ׳ · היום: ${b.prog?String(b.prog.length).padStart(2)+' פק׳':' ✗   '} ${(b.ms/1000).toFixed(2).padStart(6)} שנ׳ · פי ${(a.ms/Math.max(b.ms,1)).toFixed(0)}`); }
process.exit(0);
