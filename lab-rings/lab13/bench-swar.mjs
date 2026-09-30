// (ב) השוואה: הבונה המהיר (דוגמה-דוגמה) מול «8 במכה» — אותן משימות, ליבה אחת כל אחד, כל תוצאה עוברת את הבודק המלא
import { makeChecker } from './tzoref.mjs'; import { fastBuild } from './tzoref-fast.mjs'; import { swarBuild } from './tzoref-swar.mjs'; import { goals, goalFor } from './tzoref-goals.mjs';
const G=goals();
for(const n of ['העתק','לא (מספר)','כפול 2','לא-וגם (מספרים)','חיבור מספרים','קח מהכתובת שבתא','דלג אם לא-אפס (תא0 אפס ⇒ העתק תא1)','אם (תא0 לא-אפס ⇒ תא1, אחרת תא3)','וגם (מספרים)']){ const gen=goalFor(n,null,G); const chk=makeChecker(gen,300);
  const a=fastBuild(gen,{ms:60000,check:chk}); const b=swarBuild(gen,{ms:60000,check:chk});
  const ra=a.tries/(a.ms/1000), rb=b.tries/(b.ms/1000);
  console.log(`${n.slice(0,22).padEnd(22)} מהיר: ${a.prog?String(a.prog.length).padStart(2)+' פק׳':' ✗   '} ${String(a.ms).padStart(6)}ms ${String(Math.round(ra/1000)).padStart(5)}K/שנ׳ · 8-במכה: ${b.prog?String(b.prog.length).padStart(2)+' פק׳':' ✗   '} ${String(b.ms).padStart(6)}ms ${String(Math.round(rb/1000)).padStart(5)}K/שנ׳ · קצב פי ${(rb/ra).toFixed(1)} · זמן פי ${(a.ms/Math.max(b.ms,1)).toFixed(1)}`); }
