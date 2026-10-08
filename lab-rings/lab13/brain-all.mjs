// «המוח המאוחד»: מקבל משימה (רק דוגמאות קלט/פלט) ובוחר לבד איזה בונה לנסות — מהמהיר לאיטי.
//   מספרים            ⇒ בונה-ערכים
//   רשימה ⇒ מספר      ⇒ צירוף-זוג ⇒ שרשרת ⇒ סינון-נסתר (לומד תנאי חסר)
//   רשימה ⇒ רשימה     ⇒ רצף-כלים ⇒ סינון ⇒ סינון עם תנאי שנלמד מהדוגמאות ⇒ מסגרות-החלטה
import fs from 'fs'; import { run } from './machine3s.mjs'; import { valueBuild } from './tzoref-value.mjs'; import { shorten, finalCheck, movable } from './tzoref.mjs';
import { listGen, listCompose } from './listcomp.mjs'; import { llGen, llCompose } from './listlist.mjs'; import { pipeCompose } from './pipeline.mjs';
import { filterCompose } from './filtcomp.mjs'; import { ifCompose } from './ifcomp.mjs'; import { hiddenFilter } from './hiddenfilter.mjs';
const R=k=>Math.floor(Math.random()*k); const walk=m=>{ const o=[]; let a=m[1]; for(let i=0;a&&i<10;i++){ o.push(a); a=m[a]; } return o; };
export function genFor(spec){ const f=new Function('return ('+spec.src+')')();
  if(spec.kind==='num'){ const ins=spec.ins; return ()=>{ const mem=Array.from({length:16},()=>R(16)); const w=f(...ins.map(c=>mem[c]))&15; const keep=ins.map(c=>mem[c]); return {mem,want:w,ok:r=>r[2]===w&&ins.every((c,i)=>r[c]===keep[i])}; }; }
  if(spec.kind==='list2num') return listGen(f); return llGen(f); }
// סינון שהתנאי שלו חסר: מהדוגמאות בלבד — איזה ערך נשאר ואיזה הוצא (אם הפלט הוא תת-רשימה בסדר המקורי)
function inferFromExamples(gen){ const rem=new Map(); for(let t=0;t<2000;t++){ const e=gen(); const l=walk(e.mem); const out=JSON.parse(e.want); let j=0; for(const x of l){ if(j<out.length&&out[j]===x) j++; } if(j!==out.length) return null;
    const keep=new Set(out); for(const x of l){ const r=!keep.has(x); if(rem.has(x)&&rem.get(x)!==r) return null; rem.set(x,r); } }
  return Array.from({length:16},(_,v)=>rem.get(v)?15:0); }
async function learnCond(tt){ const name='תנאי: '+tt.slice(8).map((x,i)=>x?String(i+8):'').filter(Boolean).join(','); const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); if(sh.named.some(b=>b.name===name)) return name;
  const gen=()=>{ const mem=Array.from({length:16},()=>R(16)); mem[0]=8+R(8); const w=tt[mem[0]]; const k=mem[0]; return {mem,want:w,ok:r=>r[2]===w&&r[0]===k}; };
  const v=valueBuild(gen,{name,ins:[0],out:2,ms:90000}); if(!v.prog) return null; let s=v.prog; try{ s=shorten(v.prog,gen,{minutes:1,quiet:9}).prog; }catch{} if(finalCheck(s,gen).bad) return null;
  const S2=JSON.parse(fs.readFileSync('shelf3.json','utf8')); S2.named.push({name,prog:s,ins:[0],out:2,movable:movable(s,gen),by:'המוח המאוחד: תנאי שנלמד'}); fs.writeFileSync('shelf3.json',JSON.stringify(S2));
  const LG=JSON.parse(fs.readFileSync('tzoref-learned-goals.json','utf8')); LG[name]={ins:[0],tt:Array.from({length:16},(_,v)=>v<8?0:tt[v])}; fs.writeFileSync('tzoref-learned-goals.json',JSON.stringify(LG)); return name; }
export async function solveAny(spec,{say=()=>{}}={}){ const gen=genFor(spec); const tried=[]; const T0=Date.now();
  const attempt=async(name,fn)=>{ const t=Date.now(); let r=null; try{ r=await fn(); }catch(e){ r={prog:null,err:String(e.message||e).slice(0,80)}; } tried.push(`${name}${r&&r.prog?'✓':'✗'}(${((Date.now()-t)/1000).toFixed(0)}s)`); say(tried.at(-1)); return r&&r.prog?{...r,stage:name}:null; };
  let r=null;
  if(spec.kind==='num'){ r=await attempt('בונה-ערכים',()=>valueBuild(gen,{name:spec.name,ins:spec.ins,out:2,ms:+process.env.VMS||90000})); if(r) r.how=r.how||'בונה-ערכים'; }
  else if(spec.kind==='list2num'){ r=await attempt('צירוף-זוג',()=>listCompose(gen)) || await attempt('שרשרת',()=>pipeCompose(gen)) || await attempt('סינון-נסתר',()=>hiddenFilter(gen)); }
  else { r=await attempt('רצף-כלים',()=>llCompose(gen)) || await attempt('סינון',()=>filterCompose(gen))
      || await attempt('סינון+תנאי-נלמד',async()=>{ const tt=inferFromExamples(gen); if(!tt) return {prog:null}; const n=await learnCond(tt); if(!n) return {prog:null}; return filterCompose(gen); })
      || await attempt('מסגרות-החלטה',()=>ifCompose(gen)); }
  let bad=null; if(r){ bad=0; for(let k=0;k<20000;k++){ const e=gen(); const z=run(r.prog,e.mem,{maxSteps:600000}); if(!z||z.st.length||!e.ok(z.mem)) bad++; } }
  return {ok:!!r&&bad===0,len:r?.prog?.length??null,how:r?.how||null,stage:r?.stage||null,bad,tried,ms:Date.now()-T0}; }
