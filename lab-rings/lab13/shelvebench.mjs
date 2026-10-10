// הסולם ברמת-המבחן: כל משימה שנפתרה ונבדקה (0 שגויים מ-20,000) נכנסת למדף ככלי, עם מטרה-נלמדת — כדי שמשימות אחרות יוכלו לבנות עליה
// לפני שנכנסת: אותה ביקורת כמו של המדף (node tzoref.mjs audit — 256 צירופי מצביעים, «לולאה נקייה», תאים שאסור לשנות).
//   כלי רשימה⇒מספר שמשתמש בתא 0 כטיוטה ⇒ נעטף ב«שומר תא 0» (דוחף לפני, מחזיר אחרי). לא עובר ⇒ לא נכנס.
import fs from 'fs'; import { genFor } from './brain-all.mjs'; import { finalCheck, movable, makeChecker } from './tzoref.mjs'; import { goals, goalFor } from './tzoref-goals.mjs';
const shiftC=(p,o)=>p.map(x=>x[2]==='code'&&x[1]>=0?['WHERE',x[1]+o,'code']:x);
const seal0=p=>[['WHERE',0],['GO'],['TAKE'],...shiftC(p,3),['WHERE',0],['GO'],['PUT']];
export function shelveSolution(spec,prog,{why}={}){ const name='מבחן: '+spec.name; const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); if(sh.named.some(b=>b.name===name)) return false;
  const gen=genFor(spec); if(finalCheck(prog,gen,5000).bad) return false; const LG=JSON.parse(fs.readFileSync('tzoref-learned-goals.json','utf8')); const before=JSON.stringify(LG); const f=new Function('return ('+spec.src+')')();
  let block; if(spec.kind==='num'){ const k=spec.ins.length; LG[name]={ins:spec.ins,tt:Array.from({length:16**k},(_,i)=>f(...spec.ins.map((_,j)=>(i>>(4*(k-1-j)))&15))&15)}; block={name,prog,ins:spec.ins,out:2,movable:movable(prog,gen),by:'מבחן-100: פתרון שנבדק'}; }
  else { LG[name]=spec.kind==='list2num'?{listf:spec.src}:{listlf:spec.src}; block={name,prog,ins:[],out:2,by:'מבחן-100: פתרון שנבדק'}; }
  fs.writeFileSync('tzoref-learned-goals.json',JSON.stringify(LG));   // goalFor קורא את המטרה מהקובץ
  const passes=b=>{ const g=goalFor(b.name,b,goals()); return !!g&&makeChecker(g,3000,600000)(b.prog); };
  if(!passes(block)&&!(spec.kind==='list2num'&&passes(block={...block,prog:seal0(prog),by:block.by+' · שומר תא 0'}))){ fs.writeFileSync('tzoref-learned-goals.json',before); if(why) why.push(spec.name); return false; }
  sh.named.push(block); fs.writeFileSync('shelf3.json',JSON.stringify(sh)); return true; }
