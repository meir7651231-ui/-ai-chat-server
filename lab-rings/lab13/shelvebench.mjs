// הסולם ברמת-המבחן: כל משימה שנפתרה ונבדקה (0 שגויים מ-20,000) נכנסת למדף ככלי, עם מטרה-נלמדת — כדי שמשימות אחרות יוכלו לבנות עליה
import fs from 'fs'; import { genFor } from './brain-all.mjs'; import { finalCheck, movable } from './tzoref.mjs';
export function shelveSolution(spec,prog){ const name='מבחן: '+spec.name; const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); if(sh.named.some(b=>b.name===name)) return false;
  const gen=genFor(spec); if(finalCheck(prog,gen,5000).bad) return false; const LG=JSON.parse(fs.readFileSync('tzoref-learned-goals.json','utf8')); const f=new Function('return ('+spec.src+')')();
  if(spec.kind==='num'){ const k=spec.ins.length; LG[name]={ins:spec.ins,tt:Array.from({length:16**k},(_,i)=>f(...spec.ins.map((_,j)=>(i>>(4*(k-1-j)))&15))&15)}; sh.named.push({name,prog,ins:spec.ins,out:2,movable:movable(prog,gen),by:'מבחן-100: פתרון שנבדק'}); }
  else { LG[name]=spec.kind==='list2num'?{listf:spec.src}:{listlf:spec.src}; sh.named.push({name,prog,ins:[],out:2,by:'מבחן-100: פתרון שנבדק'}); }
  fs.writeFileSync('tzoref-learned-goals.json',JSON.stringify(LG)); fs.writeFileSync('shelf3.json',JSON.stringify(sh)); return true; }
