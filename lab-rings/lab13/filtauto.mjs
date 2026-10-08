// סינון עם מילוי-פער אוטומטי: אם אין תנאי מתאים במדף — המכונה מסיקה מהדוגמאות איזה מספר נשאר ואיזה הוצא,
// בונה מזה טבלת-אמת, לומדת כלי-מספר חדש (בונה-ערכים), שמה במדף, ומנסה שוב.
import fs from 'fs'; import { filterCompose } from './filtcomp.mjs'; import { llGen } from './listlist.mjs'; import { valueBuild } from './tzoref-value.mjs'; import { shorten, finalCheck, movable } from './tzoref.mjs'; import { run } from './machine3s.mjs';
const R=k=>Math.floor(Math.random()*k);
function inferPredicate(f){ const removed=new Map(); for(let t=0;t<3000;t++){ const n=R(9); const pool=[8,9,10,11,12,13,14,15].sort(()=>Math.random()-0.5).slice(0,n); const out=new Set(f(pool)); for(const v of pool){ const r=!out.has(v); if(removed.has(v)&&removed.get(v)!==r) return null; removed.set(v,r); } }
  return Array.from({length:16},(_,v)=>removed.get(v)?15:0); }   // ערכים 0–7 לא מופיעים ברשימה — 0
async function learnTable(name,tt){ const gen=()=>{ const mem=Array.from({length:16},()=>R(16)); const w=tt[mem[0]]; const keep=mem[0]; return {mem,want:w,ok:r=>r[2]===w&&r[0]===keep}; };
  const v=valueBuild(gen,{name,ins:[0],out:2,ms:90000}); if(!v.prog) return null; let s=v.prog; try{ s=shorten(v.prog,gen,{minutes:2,quiet:9}).prog; }catch{} if(finalCheck(s,gen).bad) return null;
  const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); sh.named.push({name,prog:s,ins:[0],out:2,movable:movable(s,gen),by:'נלמד אוטומטית: תנאי-סינון שחסר'}); fs.writeFileSync('shelf3.json',JSON.stringify(sh));
  let LG={}; try{ LG=JSON.parse(fs.readFileSync('tzoref-learned-goals.json','utf8')); }catch{} LG[name]={ins:[0],tt}; fs.writeFileSync('tzoref-learned-goals.json',JSON.stringify(LG)); return s; }
const TASKS=[['בלי ה-8 וה-15',l=>l.filter(x=>x!==8&&x!==15)],['רק 9, 10, 13',l=>l.filter(x=>[9,10,13].includes(x))],['בלי הכפולות של 3',l=>l.filter(x=>x%3)]];
for(const [name,f] of TASKS){ const gen=llGen(f); const t0=Date.now(); let r=filterCompose(gen); let learned='';
  if(!r.prog){ const tt=inferPredicate(f); if(!tt){ console.log('✗',name,': זה לא סינון לפי ערך (סתירה בדוגמאות)'); continue; }
    const pname='תנאי: '+tt.slice(8).map((x,i)=>x?String(i+8):'').filter(Boolean).join(','); const s=await learnTable(pname,tt); if(!s){ console.log('✗',name,': לא הצליח ללמוד את התנאי',pname); continue; } learned=` · למד קודם «${pname}» (${s.length} פקודות)`; r=filterCompose(gen); }
  let bad=null; if(r.prog){ bad=0; for(let k=0;k<20000;k++){ const e=gen(); const z=run(r.prog,e.mem,{maxSteps:600000}); if(!z||z.st.length||!e.ok(z.mem)) bad++; } }
  console.log(`${r.prog&&!bad?'✓':'✗'} ${name}: ${r.prog?r.prog.length+' פקודות · '+r.how+' · בדיקה-עצמאית '+bad+' שגויים מ-20000':'לא נמצא'}${learned} · ${((Date.now()-t0)/1000).toFixed(0)} שנ׳`); }
process.exit(0);
