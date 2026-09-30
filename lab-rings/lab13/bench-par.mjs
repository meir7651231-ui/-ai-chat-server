import { build } from './tzoref.mjs'; import { parallelBuild } from './tzoref-fast.mjs'; import { goals, goalFor } from './tzoref-goals.mjs';
const G=goals();
for(const n of ['העתק','לא (מספר)','קח מהכתובת שבתא','לא-וגם (מספרים)','וגם (מספרים)']){ const gen=goalFor(n,null,G);
  const a=build(gen,{pieces:[],ms:60000}); const b=await parallelBuild(n,{ms:60000});
  console.log(`${n.padEnd(18)} רגיל: ${a.prog?a.prog.length+' פק׳':'✗'} ${String(a.ms).padStart(6)}ms · 4 ליבות מהירות: ${b.prog?b.prog.length+' פק׳':'✗'} ${String(b.ms).padStart(6)}ms · פי ${(a.ms/Math.max(1,b.ms)).toFixed(1)}`); }
process.exit(0);
