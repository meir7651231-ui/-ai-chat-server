// רק הלבנים הקשות (עם חלקים) + «לא-וגם» 3 פעמים (לבדוק אם ההאטה אמיתית)
import fs from 'fs'; import { makeChecker, placements, loadShelf } from './tzoref.mjs'; import { goals, goalFor } from './tzoref-goals.mjs'; const { swarBuild }=await import('./tzoref-swar.mjs');
const G=goals(); const LIST=[0,1,8,9,10,11,12,13,14,15]; const sh=loadShelf(); const TBL=JSON.parse(fs.readFileSync('tzoref-tables.json','utf8'));
const partsFor=(name)=>{ const out=[]; const pref=[...(G[name]?.ins||[0,1]),4,5,6,7,2].filter((c,i,a)=>a.indexOf(c)===i); for(const b of sh.named){ if(b.name===name||!(b.ins||[]).length||/רשימה|ספור|בלי|אמצע|וקטן/.test(b.name)||b.prog.length>60) continue; out.push(...(b.movable===false?[{name:b.name,prog:b.prog}]:placements(b,b.prog.length<=20?400:200,pref))); } return out; };
const jobs=process.argv[2]==='reg'?[['לא-וגם (מספרים)',0],['לא-וגם (מספרים)',0],['לא-וגם (מספרים)',0],['חיבור מספרים',0],['קח מהכתובת שבתא',0]]:[['הגדול מבין שלושה',1],['הקטן מבין שלושה',1],['זוגי?',1],['אם (תא0 לא-אפס ⇒ תא1, אחרת תא3)',1],['הפרש מוחלט',1]];
for(const [n,wp] of jobs){ const gen=goalFor(n,null,G); const r=swarBuild(gen,{ms:45000,check:makeChecker(gen,300),ins:G[n]?.ins??LIST,tables:TBL.filter(t=>t.name!==n),pieces:wp?partsFor(n):[]});
  console.log(`${n.slice(0,20)}|${r.prog?r.prog.length:'✗'}|${(r.ms/1000).toFixed(1)}|${(r.used||[]).join(' + ')}`); }
