// בלי הרשימה השחורה ⇔ עם הרשימה השחורה · ליבה אחת · אותן משימות, אותן דוגמאות
import { makeChecker } from './tzoref.mjs'; import { goals, goalFor } from './tzoref-goals.mjs';
const G=goals(); const mode=process.argv[2]; const { swarBuild }=await import('./tzoref-swar.mjs');
for(const n of ['לא (מספר)','לא-וגם (מספרים)','חיבור מספרים','קח מהכתובת שבתא','דלג אם לא-אפס (תא0 אפס ⇒ העתק תא1)','קבוע 1','אם (תא0 לא-אפס ⇒ תא1, אחרת תא3)','וגם (מספרים)']){
  const gen=goalFor(n,null,G); const r=swarBuild(gen,{ms:60000,check:makeChecker(gen,300)});
  console.log(`${n.slice(0,20).padEnd(20)}|${r.prog?r.prog.length:'✗'}|${r.tries}|${r.ms}`); }
