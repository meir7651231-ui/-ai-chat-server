// מבוי-סתום-אמיתי: בלי ⇔ עם · ליבה אחת · 5 הפעולות + חלקי המדף (כמו בשגרת העבודה)
import { makeChecker, placements, loadShelf } from './tzoref.mjs'; import { goals, goalFor } from './tzoref-goals.mjs'; const { swarBuild }=await import('./tzoref-swar.mjs');
const G=goals(); const LIST=[0,1,8,9,10,11,12,13,14,15]; const sh=loadShelf();
const partsFor=(name)=>{ const out=[]; for(const b of sh.named){ if(b.name===name||!(b.ins||[]).length||/רשימה|ספור|בלי|אמצע|וקטן/.test(b.name)||b.prog.length>60) continue; const pref=[...(G[name]?.ins||[0,1]),4,5,6,7,2].filter((c,i,a)=>a.indexOf(c)===i); out.push(...(b.movable===false?[{name:b.name,prog:b.prog}]:placements(b,b.prog.length<=20?400:200,pref))); } return out; };
for(const [n,withParts] of [['לא (מספר)',0],['לא-וגם (מספרים)',0],['קבוע 1',0],['אם (תא0 לא-אפס ⇒ תא1, אחרת תא3)',0],['וגם (מספרים)',0],['זוגי?',1],['הפרש מוחלט',1],['הגדול מבין שלושה',1],['הקטן מבין שלושה',1]]){
  const gen=goalFor(n,null,G); const ins=G[n]?.ins??LIST; const tables=JSON.parse((await import("fs")).readFileSync("tzoref-tables.json","utf8")).filter(t=>t.name!==n); const r=swarBuild(gen,{ms:45000,check:makeChecker(gen,300),ins,tables,pieces:withParts?partsFor(n):[]});
  console.log(`${n.slice(0,20)}|${r.prog?r.prog.length:'✗'}|${r.tries}|${r.ms}|${r.deads||0}`); }
