// הרעיון של הסשן השני (pairs.mjs): לא לנחש — לנסות כל זוג שינויים, ולאחד תוכניות שמתנהגות אותו דבר.
// כאן: לקצר. שינוי = מחיקה / החלפה / הכנסה של פעולה (כתובות-קפיצה מתוקנות לבד). שלב 1: כל שינוי אחד. שלב 2: כל שינוי שני. נשמר רק מה שנהיה קצר יותר ועובד.
import fs from 'fs'; import { run } from './machine2.mjs'; import { makeSpecs } from './specs.mjs'; import { checker, ALPHA, plain } from './tools2.mjs';
function rebuild(p,order,ins){ const newPos=new Map(); order.forEach((o,i)=>{ if(o!=null&&!newPos.has(o)) newPos.set(o,i); }); const L=order.length;
  const mapT=(t)=>{ if(t>=p.length) return L; for(let x=t;x<p.length;x++) if(newPos.has(x)) return newPos.get(x); return L; };
  return order.map((o,i)=>{ const x=o==null?ins[i]:p[o]; return x[2]==='code'?['WHERE',mapT(x[1]),'code']:x; }); }
function* edits(p){ const n=p.length, o=[...Array(n).keys()];
  for(let i=0;i<n;i++){ const q=o.slice(); q.splice(i,1); yield rebuild(p,q,{}); }
  for(let i=0;i<n;i++){ if(p[i][2]||p[i][0]==='JUMP') continue; for(const a of ALPHA){ const q=o.slice(); q[i]=null; yield rebuild(p,q,{[i]:a}); } }
  for(let i=0;i<=n;i++) for(const a of ALPHA){ const q=o.slice(); q.splice(i,0,null); yield rebuild(p,q,{[i]:a}); } }
const {S}=makeSpecs(4242); const name=process.argv[3]||'אורך רשימה (לולאה + ספירה)'; const L=[0,1,8,9,10,11,12,13,14,15];
const g=()=>{ const e=S[name](); const b=e.mem.slice(); return {mem:e.mem,ok:r=>e.ok(r)&&L.every(c=>r[c]===b[c])}; };
const EX=Array.from({length:24},(_,i)=>({...g(),pa:(i*5)&15,aa:(i*7+3)&15}));
const quick=(p,maxWrong)=>{ let wrong=0; const sig=[]; for(const e of EX){ const q=[['WHERE',e.pa],['GO'],['WHERE',e.aa],...plain(p.map(x=>x[2]?['WHERE',x[1]+3,'code']:x))];
    const r=run(q,e.mem,{maxSteps:3000}); if(!r){ if(++wrong>maxWrong) return null; sig.push('x'); continue; } if(r.st.length||!e.ok(r.mem)){ if(++wrong>maxWrong) return null; } sig.push(r.mem.join(',')+'|'+r.st.join(',')); } return {wrong,sig:sig.join('/')}; };
const full=checker(g,300,20000), fresh=checker(g,3000,20000);
let best=JSON.parse(fs.readFileSync(process.argv[2]||'bigmoves.json','utf8')); const MIN=+process.argv[4]||8; const t0=Date.now();
console.log('התחלה:',best.length);
let improved=true; while(improved&&Date.now()-t0<MIN*60000){ improved=false;
  const one=new Map(); for(const e of edits(best)){ const r=quick(e,+process.argv[5]||24); if(!r) continue; if(r.wrong===0&&e.length<best.length&&full(e)&&fresh(e)){ best=e; improved=true; console.log('  שינוי אחד ⇒',best.length); break; } if(!one.has(r.sig)) one.set(r.sig,e); }
  if(improved) continue; console.log(`  שלב 1: ${one.size} תוכניות שונות (אחרי איחוד) · ${((Date.now()-t0)/1000).toFixed(0)}s`);
  for(const p1 of one.values()){ if(Date.now()-t0>MIN*60000) break; for(const e of edits(p1)){ if(e.length>=best.length) continue; const r=quick(e,0); if(!r) continue; if(full(e)&&fresh(e)){ best=e; improved=true; console.log(`  שני שינויים ⇒ ${best.length} · ${((Date.now()-t0)/1000).toFixed(0)}s`); break; } } if(improved) break; }
  fs.writeFileSync('pairs2.json',JSON.stringify(best)); }
console.log('סוף:',best.length,`· ${((Date.now()-t0)/1000).toFixed(0)}s`);
