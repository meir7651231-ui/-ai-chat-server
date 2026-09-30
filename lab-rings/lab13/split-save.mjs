import fs from 'fs'; import { splitBuild, compileSplit, showSplit } from './tzoref-split.mjs'; import { makeChecker, shorten, finalCheck, loadShelf } from './tzoref.mjs'; import { goals, goalFor } from './tzoref-goals.mjs';
const G=goals(); const nm='מיין רשימה'; const gen=goalFor(nm,{},G);
// הפתרון שנמצא (מההרצה) — משוחזר כאן כדי לא לחפש שוב
const r={a:{init:[{t:'zero',i:2}],body:[{t:'load',i:3,j:1},{t:'mark',i:1},{t:'copy',i:1,j:3}],cond:1},b:{init:[],body:[{t:'load',i:1,j:4},{t:'if',i:1,k:2},{t:'store',i:4,j:2},{t:'copy',i:2,j:4}],fin:[{t:'copy',i:1,j:2}]}};
const p=compileSplit(r); const chk=makeChecker(gen,300); console.log('תוכנית:',p.length,'פקודות · בודק:',chk(p));
if(!chk(p)) process.exit(0);
const s=shorten(p,gen,{minutes:+process.env.MIN||4,quiet:1,tag:nm}).prog; const fc=finalCheck(s,gen); const sh=loadShelf(); const cur=sh.named.find(b=>b.name===nm);
console.log(`${nm}: במדף ${cur.prog.length} (נכתב ביד) · הצורף ${p.length} ⇒ קוצר ${s.length} · בדיקה ${fc.n-fc.bad}/${fc.n}`);
if(!fc.bad&&s.length<cur.prog.length){ fs.copyFileSync('shelf3.json','shelf3.before-sort.json'); cur.prog=s; cur.by='הצורף · פגישה-באמצע (לבד)'; fs.writeFileSync('shelf3.json',JSON.stringify(sh)); console.log('⇒ נכנס למדף'); } process.exit(0);
