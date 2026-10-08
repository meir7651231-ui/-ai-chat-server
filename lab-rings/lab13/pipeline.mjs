// «שרשרת»: 0–2 כלים שמשנים רשימה (סנן, מיין, הפוך, בלי הראשון…) ⇒ כלי אחד שמחשב מספר מהרשימה. הכל מהמדף, המכונה בוחרת.
import fs from 'fs'; import { run } from './machine3s.mjs'; import { makeChecker, finalCheck } from './tzoref.mjs'; import { listGen } from './listcomp.mjs';
const walk=m=>{ const o=[]; let a=m[1]; for(let i=0;a&&i<10;i++){ o.push(a); a=m[a]; } return o; };
const shift=(p,o)=>p.map(x=>x[2]==='code'&&x[1]>=0?['WHERE',x[1]+o,'code']:x); const Z=[['WHERE',0],['GO']]; const PAD=[...Z,...Z,...Z,...Z,...Z];
const RUN=(p,m)=>run(p,m,{maxSteps:600000}); const J=x=>JSON.stringify(x);
export function pipeCompose(gen,{N=150,maxPre=2}={}){ const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); const ex=Array.from({length:N},()=>gen());
  const L=[], V=[];   // L: משני-רשימה · V: מחשבי-מספר (לא משנים את הרשימה)
  for(const b of sh.named){ if(b.prog.length>300) continue; let ok=true, ch=0, keeps=true;
    for(const e of ex){ const r=RUN(b.prog,e.mem); if(!r||r.st.length){ ok=false; break; } const r2=RUN([...PAD,...shift(b.prog,PAD.length)],e.mem); if(!r2||J(walk(r2.mem))!==J(walk(r.mem))||(r2.mem[2]&15)!==(r.mem[2]&15)){ ok=false; break; }
      if(J(walk(r.mem))!==J(walk(e.mem))) ch++; if([8,9,10,11,12,13,14,15].some(c=>r.mem[c]!==e.mem[c])) keeps=false; }
    if(!ok) continue; if(ch>0) L.push(b); else if(keeps&&b.prog.some(x=>x[0]==='WHERE@')) V.push(b); }
  const chk=makeChecker(gen,300,600000); const seq=bs=>{ let p=[]; for(const b of bs){ p=[...p,...Z]; p=[...p,...shift(b.prog,p.length)]; } return p; };
  // קודם מחשבים, לכל רצף-משנים, את הרשימות שיוצאות; ואז בודקים כל מחשב-מספר מולן (בלי להרכיב תוכנית לכל צירוף)
  let pres=[[]]; for(let k=1;k<=maxPre;k++) pres=[...pres,...pres.filter(s=>s.length===k-1).flatMap(s=>L.map(b=>[...s,b]))];
  const best=[]; for(const pre of pres){ const P=seq(pre); const mems=ex.map(e=>{ const r=pre.length?RUN(P,e.mem):{mem:e.mem.slice()}; return r&&r.mem; }); if(mems.some(m=>!m)) continue;
    for(const v of V){ let ok=true; for(let i=0;i<N;i++){ const r=RUN(v.prog,mems[i]); if(!r||r.st.length||(r.mem[2]&15)!==ex[i].want){ ok=false; break; } } if(!ok) continue;
      const p=seq([...pre,v]); if(chk(p)&&!finalCheck(p,gen,5000).bad) best.push({prog:p,how:[...pre.map(b=>b.name),v.name].join(' ⇒ ')}); } if(best.length) break; }
  if(process.env.PDBG) console.log("משנים:",L.map(b=>b.name).join(" | "));
  best.sort((a,b)=>a.prog.length-b.prog.length); return best[0]?{...best[0],nL:L.length,nV:V.length}:{prog:null,nL:L.length,nV:V.length}; }
if((process.argv[1]||'').endsWith('pipeline.mjs')){ const sum=l=>l.reduce((a,b)=>a+b,0);
  const TASKS=[['סכום האי-זוגיים',l=>sum(l.filter(x=>x%2))],['כמה זוגיים גדולים מ-12',l=>l.filter(x=>x%2===0&&x>12).length],['הקטן מבין הגדולים מ-12',l=>{ const q=l.filter(x=>x>12); return q.length?Math.min(...q):0; }],
    ['הגדול מבין הזוגיים',l=>{ const q=l.filter(x=>x%2===0); return q.length?Math.max(...q):0; }],['סכום הזוגיים הקטנים או שווים ל-12',l=>sum(l.filter(x=>x%2===0&&x<=12))],['השני הכי קטן',l=>{ const q=[...l].sort((a,b)=>a-b); return q.length>1?q[1]:0; }]];
  for(const [name,f] of TASKS){ const gen=listGen(f); const t0=Date.now(); const r=pipeCompose(gen); let bad=null; if(r.prog){ bad=0; for(let k=0;k<20000;k++){ const e=gen(); const z=RUN(r.prog,e.mem); if(!z||z.st.length||z.mem[2]!==e.want) bad++; } }
    console.log(`${r.prog&&!bad?'✓':'✗'} ${name}: ${r.prog?r.prog.length+' פקודות · '+r.how+' · בדיקה-עצמאית '+bad+' שגויים מ-20000':'לא נמצא'} · משנים ${r.nL} · מחשבים ${r.nV} · ${((Date.now()-t0)/1000).toFixed(0)} שנ׳`); }
  process.exit(0); }
