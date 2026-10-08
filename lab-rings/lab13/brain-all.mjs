// «המוח המאוחד»: מקבל משימה (רק דוגמאות קלט/פלט) ובוחר לבד איזה בונה לנסות — מהמהיר לאיטי.
//   מספרים            ⇒ בונה-ערכים ⇒ מסגרת-לולאה ⇒ פיצול-מקרים ⇒ פריסת-ביטים (תקציב אחד למשימה: כל שלב מקבל רק את מה שנשאר)
//   רשימה ⇒ מספר      (בדיקה קשוחה: הרשימה חייבת להישאר שלמה; פתרון הורס נעטף ב«שומר-רשימה») ⇒ צירוף-זוג ⇒ שרשרת ⇒ קיפול+מיפוי ⇒ סריקה-עם-זיכרון ⇒ סינון-נסתר (לומד תנאי חסר)
//   רשימה ⇒ רשימה     ⇒ רצף-כלים ⇒ סינון ⇒ סינון עם תנאי שנלמד מהדוגמאות ⇒ רצף-מקום ⇒ אם-רשימה ⇒ מסגרות-סריקה ⇒ מסגרות-החלטה
import fs from 'fs'; import { run } from './machine3s.mjs'; import { valueBuild } from './tzoref-value.mjs'; import { shorten, finalCheck, movable } from './tzoref.mjs';
import { listGen, listCompose } from './listcomp.mjs'; import { llGen, llCompose } from './listlist.mjs'; import { pipeCompose } from './pipeline.mjs';
import { loopBuild } from './numloop.mjs'; import { repairJumps } from './jumpfix.mjs'; import { posCompose } from './poscompose.mjs'; import { ifPosCompose } from './ifpos.mjs'; import { caseBuild } from './tzoref-case.mjs'; import { bitsliceSolve } from './bitslice.mjs';
import { filterCompose } from './filtcomp.mjs'; import { ifCompose } from './ifcomp.mjs'; import { hiddenFilter } from './hiddenfilter.mjs'; import { scanCompose as cutCompose } from './cutframes.mjs'; import { postOpCompose } from './postop.mjs'; import { scanCompose as foldCompose } from './scanfold.mjs';
const R=k=>Math.floor(Math.random()*k); const walk=m=>{ const o=[]; let a=m[1]; for(let i=0;a&&i<10;i++){ o.push(a); a=m[a]; } return o; };
export function genFor(spec){ const f=new Function('return ('+spec.src+')')();
  if(spec.kind==='num'){ const ins=spec.ins; return ()=>{ const mem=Array.from({length:16},()=>R(16)); const w=f(...ins.map(c=>mem[c]))&15; const keep=ins.map(c=>mem[c]); return {mem,want:w,ok:r=>r[2]===w&&ins.every((c,i)=>r[c]===keep[i])}; }; }
  if(spec.kind==='list2num') return process.env.LOOSELIST?listGen(f):strictList(listGen(f)); return llGen(f); }
// בדיקה קשוחה ל«רשימה ⇒ מספר»: התשובה בתא 2 — וגם הרשימה (תא 1 ותאים 8–15) נשארת בדיוק כמו שהייתה
const LISTCELLS=[1,8,9,10,11,12,13,14,15];
const strictList=g=>()=>{ const e=g(); const keep=LISTCELLS.map(c=>e.mem[c]); return {...e,ok:r=>r[2]===e.want&&LISTCELLS.every((c,i)=>r[c]===keep[i])}; };
// «שומר-רשימה»: פתרון שהורס את הרשימה בדרך ⇒ עוטפים אותו: דוחפים את 9 תאי הרשימה למחסנית לפני, ומחזירים אותם אחרי
const shiftC=(p,o)=>p.map(x=>x[2]==='code'&&x[1]>=0?['WHERE',x[1]+o,'code']:x);
export function keepList(prog){ const pre=[...LISTCELLS.flatMap(c=>[['WHERE',c],['GO'],['TAKE']]),['WHERE',0],['GO']]; const post=[...LISTCELLS].reverse().flatMap(c=>[['WHERE',c],['GO'],['PUT']]); return [...pre,...shiftC(prog,pre.length),...post]; }
// סינון שהתנאי שלו חסר: מהדוגמאות בלבד — איזה ערך נשאר ואיזה הוצא (אם הפלט הוא תת-רשימה בסדר המקורי)
function inferFromExamples(gen){ const rem=new Map(); for(let t=0;t<2000;t++){ const e=gen(); const l=walk(e.mem); const out=JSON.parse(e.want); let j=0; for(const x of l){ if(j<out.length&&out[j]===x) j++; } if(j!==out.length) return null;
    const keep=new Set(out); for(const x of l){ const r=!keep.has(x); if(rem.has(x)&&rem.get(x)!==r) return null; rem.set(x,r); } }
  return Array.from({length:16},(_,v)=>rem.get(v)?15:0); }
async function learnCond(tt){ const name='תנאי: '+tt.slice(8).map((x,i)=>x?String(i+8):'').filter(Boolean).join(','); const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); if(sh.named.some(b=>b.name===name)) return name;
  const gen=()=>{ const mem=Array.from({length:16},()=>R(16)); mem[0]=8+R(8); const w=tt[mem[0]]; const k=mem[0]; return {mem,want:w,ok:r=>r[2]===w&&r[0]===k}; };
  const v=valueBuild(gen,{name,ins:[0],out:2,ms:90000}); if(!v.prog) return null; let s=v.prog; try{ s=shorten(v.prog,gen,{minutes:1,quiet:9}).prog; }catch{} if(finalCheck(s,gen).bad) return null;
  const S2=JSON.parse(fs.readFileSync('shelf3.json','utf8')); S2.named.push({name,prog:s,ins:[0],out:2,movable:movable(s,gen),by:'המוח המאוחד: תנאי שנלמד'}); fs.writeFileSync('shelf3.json',JSON.stringify(S2));
  const LG=JSON.parse(fs.readFileSync('tzoref-learned-goals.json','utf8')); LG[name]={ins:[0],tt:Array.from({length:16},(_,v)=>v<8?0:tt[v])}; fs.writeFileSync('tzoref-learned-goals.json',JSON.stringify(LG)); return name; }
export async function solveAny(spec,{say=()=>{}}={}){ const strict=genFor(spec); const tried=[]; const T0=Date.now();
  const gen=spec.kind==='list2num'?listGen(new Function('return ('+spec.src+')')()):strict;   // הבונים מחפשים עם הבדיקה הרגילה; כל פתרון עובר אחר כך את הבדיקה הקשוחה
  const passes=(p,n)=>{ for(let k=0;k<n;k++){ const e=strict(); const z=run(p,e.mem,{maxSteps:600000}); if(!z||z.st.length||!e.ok(z.mem)) return false; } return true; };
  const honest=x=>{ if(!x) return null; if(passes(x.prog,20000)) return {...x,sure:true}; for(const [w,tag] of [[keepList(x.prog),''],[(()=>{ const f=repairJumps(x.prog,gen); return f&&keepList(f); })(),' + תיקון-קפיצות']]) if(w&&passes(w,20000)) return {...x,prog:w,how:(x.how||x.stage)+' · עטוף ב«שומר-רשימה»'+tag,sure:true}; tried.push(x.stage+': נפסל — הורס את הרשימה'); return null; };
  const attempt=async(name,fn)=>{ const t=Date.now(); let r=null; try{ r=await fn(); }catch(e){ r={prog:null,err:String(e.message||e).slice(0,80)}; } tried.push(`${name}${r&&r.prog?'✓':'✗'}(${((Date.now()-t)/1000).toFixed(0)}s)`); say(tried.at(-1)); return r&&r.prog?{...r,stage:name}:null; };
  let r=null;
  if(spec.kind==='num'){ const left=()=>(+process.env.NUMMS||280000)-(Date.now()-T0), off=s=>(process.env.NUMOFF||'').split(',').includes(s);   // NUMOFF=loop,case,bits מכבה שלבים
    const sure=x=>{ if(!x) return null; for(let k=0;k<20000;k++){ const e=gen(); const z=run(x.prog,e.mem,{maxSteps:600000}); if(!z||z.st.length||!e.ok(z.mem)){ tried.push(x.stage+': נפסל בבדיקה הסופית'); return null; } } return {...x,sure:true}; };   // שלב שנכשל בבדיקה הסופית ⇒ ממשיכים לבא אחריו
    const loop=ms=>attempt('מסגרת-לולאה',()=>loopBuild(gen,{ins:spec.ins,ms})).then(sure);
    if(process.env.LOOPFIRST&&!off('loop')) r=await loop(+process.env.LOOPMS||30000);
    if(!r){ r=await attempt('בונה-ערכים',()=>valueBuild(gen,{name:spec.name,ins:spec.ins,out:2,ms:+process.env.VMS||90000})); if(r) r.how=r.how||'בונה-ערכים'; }
    if(!r&&!process.env.LOOPFIRST&&!off('loop')&&left()>15000) r=await loop(Math.min(+process.env.LOOPMS||60000,left()-10000));   // מסגרת-לולאה: מהירה וקצרה, 0–20 שנ׳ במה שהיא פותרת
    if(!r&&!off('case')&&left()>30000){ r=sure(await attempt('פיצול-מקרים',()=>caseBuild(gen,{ins:spec.ins,ms:Math.min(+process.env.CASEMS||280000,left()-(off('bits')?10000:+process.env.BSRESERVE||50000))}))); if(r) r.how='פיצול-מקרים: '+r.how; }
    if(!r&&!off('bits')&&left()>15000) r=await attempt('פריסת-ביטים',()=>bitsliceSolve(gen,{ins:spec.ins,ms:left()-10000}));   // רשת-ביטחון: מדויק לכל פונקציה של הקלטים (ארוך)
  }
  else if(spec.kind==='list2num'){ r=honest(await attempt('צירוף-זוג',()=>listCompose(gen))) || honest(await attempt('שרשרת',()=>pipeCompose(gen)))
      || honest(await attempt('קיפול+מיפוי',()=>postOpCompose(gen,{ms:+process.env.POMS||150000})))   // קיפול על תת-קבוצה נסתרת + פעולה אחריו / שני קיפולים (postop.mjs)
      || honest(await attempt('סריקה-עם-זיכרון',()=>foldCompose(gen,{ms:+process.env.SCANMS||150000})))   // מצב רץ: שיא, קודם, מיקום (scanfold.mjs)
      || honest(await attempt('סינון-נסתר',()=>hiddenFilter(gen))); }
  else { r=await attempt('רצף-כלים',()=>llCompose(gen)) || await attempt('סינון',()=>filterCompose(gen))
      || await attempt('סינון+תנאי-נלמד',async()=>{ const tt=inferFromExamples(gen); if(!tt) return {prog:null}; const n=await learnCond(tt); if(!n) return {prog:null}; return filterCompose(gen); })
      || await attempt('רצף-מקום',()=>posCompose(gen)) || await attempt('אם-רשימה',()=>ifPosCompose(gen))   // עד 4 צעדים + מסגרות-מקום (סנן לפי מקום, על-כל-זנב, סובב-אל) · תנאי על כל הרשימה (poscompose.mjs, ifpos.mjs)
      || await attempt('מסגרות-סריקה',()=>cutCompose(gen,{ms:+process.env.CUTMS||150000}))   // קח/דלג-כל-עוד, סנן מול ערך-מהרשימה, מצב-רץ (cutframes.mjs)
      || await attempt('מסגרות-החלטה',()=>ifCompose(gen)); }
  let bad=null; if(r){ bad=0; if(!r.sure) for(let k=0;k<20000;k++){ const e=strict(); const z=run(r.prog,e.mem,{maxSteps:600000}); if(!z||z.st.length||!e.ok(z.mem)) bad++; } }
  return {ok:!!r&&bad===0,prog:r&&bad===0?r.prog:null,len:r?.prog?.length??null,how:r?.how||null,stage:r?.stage||null,bad,tried,ms:Date.now()-T0}; }
