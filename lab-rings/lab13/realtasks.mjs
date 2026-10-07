// מבחן «משימות אמיתיות»: כל משימה מורכבת מכמה חלקים שכבר במדף. האם המכונה בונה אותן? כמה זמן? כמה ארוך? — בונה-עם-מדף מול בונה-מאפס
import { valueBuild, show } from './tzoref-value.mjs'; import { basicBuild, compile, showB, tableOf } from './tzoref-basic.mjs'; import { finalCheck, makeChecker } from './tzoref.mjs';
const R=k=>Math.floor(Math.random()*k);
const mn=(...x)=>Math.min(...x), mx=(...x)=>Math.max(...x), m=x=>x&15;
const T=[
 ['ממוצע של הגדול והקטן (3 מספרים)',[0,1,3],(a,b,c)=>(mx(a,b,c)+mn(a,b,c))>>1],
 ['הגדול מבין א+ב ו-ג',[0,1,3],(a,b,c)=>mx(m(a+b),c)],
 ['הפרש מוחלט בין א ל-ב, ועוד ג',[0,1,3],(a,b,c)=>m(Math.abs(a-b)+c)],
 ['האם ג נמצא בין א ל-ב',[0,1,3],(a,b,c)=>(c>=mn(a,b)&&c<=mx(a,b))?1:0],
 ['ממוצע של א ו-ב, כפול 2',[0,1],(a,b)=>m(((a+b)>>1)*2)],
 ['הקטן מבין א ו-ב, בריבוע',[0,1],(a,b)=>m(mn(a,b)**2)],
 ['א כפול ב, ועוד א',[0,1],(a,b)=>m(a*b+a)],
 ['הגבל את א+ב ל-15 (סכום רווי) פחות 1',[0,1],(a,b)=>mx(mn(a+b,15)-1,0)],
 ['שארית של א+ב ב-3',[0,1],(a,b)=>(a+b)%3],
 ['הגדול מבין (א פחות ב) ו-(ב פחות א), חצי',[0,1],(a,b)=>Math.abs(a-b)>>1],
];
for(const [name,ins,f] of T){ const gen=()=>{ const mem=Array.from({length:16},()=>R(16)); const w=f(...ins.map(c=>mem[c])); const keep=ins.map(c=>mem[c]); return {mem,want:w,ok:r=>r[2]===w&&ins.every((c,i)=>r[c]===keep[i])}; };
  const chk=makeChecker(gen,300); let line=name+':';
  // (א) בונה-עם-מדף
  let t=Date.now(); let v=null; try{ v=valueBuild(gen,{name,ins,out:2,ms:+process.env.VMS||60000}); }catch(e){} const tv=((Date.now()-t)/1000).toFixed(0);
  line+=v&&v.prog&&!finalCheck(v.prog,gen,3000).bad?` מדף ✓ ${v.prog.length} (${tv} שנ׳)`:` מדף ✗ (${tv} שנ׳)`;
  // (ב) בונה-מאפס (חבר/נאנד/חצי)
  t=Date.now(); const TT=tableOf(gen,ins); let b=null; if(TT){ const r=basicBuild(TT,{ins,ms:+process.env.BMS||60000}); if(r.expr){ const p=compile(r.expr,2); if(chk(p)) b=p; } } const tb=((Date.now()-t)/1000).toFixed(0);
  line+=b?` · מאפס ✓ ${b.length} (${tb} שנ׳)`:` · מאפס ✗ (${tb} שנ׳)`;
  console.log(line); }
process.exit(0);
