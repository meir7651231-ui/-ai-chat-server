// בונים מחדש כלים «תלויי-מקום»: בנייה מאפס ⇒ קיצור (עם חוק-הניידות) ⇒ בדיקה מלאה + בדיקת-ניידות ⇒ מחליף במדף (גם אם ארוך יותר)
import fs from 'fs'; import { solve } from './tzoref-solve.mjs'; import { goals, goalFor } from './tzoref-goals.mjs'; import { shorten, finalCheck } from './tzoref.mjs'; import { run } from './machine3s.mjs';
const G=goals(); const NAMES=process.argv.slice(2);
const posOk=(p,g)=>{ for(let t=0;t<600;t++){ const e=g(); const n=t%2?4:10+2*(t%7); const P=[]; for(let i=0;i<n;i++) P.push(i%2?['GO']:['WHERE',0]); const q=[...P,...p.map(x=>x[2]==='code'?['WHERE',x[1]+n,'code']:x)]; const r=run(q,e.mem,{maxSteps:300000}); if(!r||r.st.length||!e.ok(r.mem)) return false; } return true; };
for(const name of NAMES){ const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); const old=sh.named.find(b=>b.name===name); const g=G[name]; const gen=goalFor(name,old,G); const t=Date.now();
  const r=await Promise.race([solve(name,gen,g||{},{splitMin:5}),new Promise(res=>setTimeout(()=>res({prog:null}),900000))]);
  if(!r.prog){ console.log('✗ לא נבנה:',name); continue; } console.log(`  נבנה ${r.prog.length} · נייד? ${posOk(r.prog,gen)} · ${r.how}`);
  let s=r.prog; try{ s=shorten(r.prog,gen,{minutes:+process.env.MIN||4,quiet:9}).prog; }catch(e){ console.log('  מקצר:',e.message); }
  const fc=finalCheck(s,gen); const pos=posOk(s,gen); console.log(`${!fc.bad&&pos?'✓':'✗'} ${name}: במדף היה ${old?.prog.length} (תלוי-מקום) ⇒ חדש ${s.length} · בדיקה ${fc.n-fc.bad}/${fc.n} · נייד ${pos} · ${((Date.now()-t)/1000).toFixed(0)} שנ׳`);
  if(!fc.bad&&pos){ const S2=JSON.parse(fs.readFileSync('shelf3.json','utf8')); const b=S2.named.find(x=>x.name===name); b.prog=s; b.by=(b.by||'')+' · נבנה מחדש: נייד'; fs.writeFileSync('shelf3.json',JSON.stringify(S2)); console.log('  הוחלף במדף'); } }
process.exit(0);
