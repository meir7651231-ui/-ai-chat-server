// «המקצר» של הצורף בתוך Worker — כדי שאפשר יהיה לעצור אותו בדיוק בזמן (הוא לא תמיד עומד בתקציב שלו בתוכניות ארוכות).
// מקבל {prog,T,ins,slice}; מקצר בסבבים קצרים ושולח את הטוב ביותר אחרי כל סבב.
import { parentPort, workerData } from 'worker_threads';
console.log=()=>{};   // המקצר מדבר הרבה — כאן שקט
const { shorten }=await import('./tzoref.mjs');
const { prog, T, ins, slice }=workerData; const K=ins.length; const R=k=>Math.floor(Math.random()*k);
const gen=()=>{ const mem=Array.from({length:16},()=>R(16)); let x=0; for(const c of ins) x=x*16+mem[c]; const w=T[x]; const keep=ins.map(c=>mem[c]); return {mem,want:w,ok:r=>r[2]===w&&ins.every((c,i)=>r[c]===keep[i])}; };
let best=prog, sl=slice, idle=0;
for(let round=0;round<50&&idle<2;round++){ let s; try{ s=shorten(best,gen,{minutes:sl,quiet:1,tag:'פריסת-ביטים'}); }catch(e){ parentPort.postMessage({err:String(e.message||e).slice(0,200)}); break; }
  if(s.prog.length<best.length){ best=s.prog; idle=0; parentPort.postMessage({prog:best}); } else { idle++; sl*=2; } }   // סבב בלי שיפור ⇒ סבב ארוך יותר; שניים ברצף ⇒ סוף
parentPort.postMessage({done:true});
