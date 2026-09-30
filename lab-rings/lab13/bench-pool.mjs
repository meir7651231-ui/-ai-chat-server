// השוואה: הבונה המקורי מול הצורף עם ליבות דלוקות + בלי שטויות
import { build } from './tzoref.mjs'; import { pool } from './tzoref-fast.mjs'; import { goals, goalFor } from './tzoref-goals.mjs';
const G=goals(); const P=pool(4); await P.build('העתק',{jobs:[{width:500}],ms:5000});   // הדלקה (פעם אחת)
const W=[500,5000,50000,400000].map(width=>({width}));
for(const n of ['העתק','לא (מספר)','כפול 2','לא-וגם (מספרים)','חיבור מספרים','קח מהכתובת שבתא','דלג אם לא-אפס (תא0 אפס ⇒ העתק תא1)','אם (תא0 לא-אפס ⇒ תא1, אחרת תא3)']){ const gen=goalFor(n,null,G);
  const a=build(gen,{pieces:[],ms:60000}); const b=await P.build(n,{jobs:W,ms:60000});
  console.log(`${n.slice(0,22).padEnd(22)} מקורי: ${a.prog?String(a.prog.length).padStart(2)+' פק׳':' ✗   '} ${(a.ms/1000).toFixed(3).padStart(7)} שנ׳ · היום: ${b.prog?String(b.prog.length).padStart(2)+' פק׳':' ✗   '} ${(b.ms/1000).toFixed(3).padStart(7)} שנ׳ · פי ${(a.ms/Math.max(b.ms,1)).toFixed(0)}`); }
P.close(); process.exit(0);
