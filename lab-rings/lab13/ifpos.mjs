// «אם [תנאי על כל הרשימה] אז [צעד]» — עם הכלים הבטוחים-לשרשרת של רצף-מקום.
// התנאי = כלי רשימה⇒מספר מהמדף, ישר או דרך פעולה חד-מקומית מהמדף; ואם אין — הפעולה נלמדת מהדוגמאות (טבלה על הערכים שנראו) ונבנית.
// «לא אכפת»: כשהצעד לא משנה את הרשימה (מיון של רשימה ממוינת, היפוך של איבר אחד) — מותר לתנאי לענות כל דבר.
import fs from 'fs'; import { run } from './machine3s.mjs'; import { makeChecker, finalCheck, movable } from './tzoref.mjs'; import { valueBuild } from './tzoref-value.mjs';
import { runFastG, encodeG, walk, walkA, shift, Z } from './chainsafe.mjs'; import { ifFrame } from './posframes.mjs';
import { stepTools, pickExamplesFor, offsetCheck } from './poscompose.mjs';
const R=k=>Math.floor(Math.random()*k); const J=JSON.stringify; const PADN=14, PADA=Array.from({length:PADN},(_,i)=>i%2?['GO']:['WHERE',0]);
const usedC=p=>new Set(p.filter(x=>x[0]==='WHERE'&&!x[2]).map(x=>x[1]));
// פעולות חד-מקומיות מהמדף: טבלה מלאה על 0..15 (רק אם התשובה תלויה בתא 0 בלבד)
function unaryOps(sh){ const out=[], seen=new Set(); for(const b of sh.named){ if(b.bad||(b.ins||[]).join()!=='0'||(b.out??2)!==2||b.prog.length>200||b.prog.some(x=>x[0]==='WHERE@')) continue; if([...usedC(b.prog)].some(c=>c>7)) continue;
    const tt=[]; let ok=true; for(let v=0;v<16&&ok;v++){ let z=null; for(let t=0;t<4;t++){ const m=Array.from({length:16},()=>R(16)); m[0]=v; const r=run([...Z,...b.prog],m,{maxSteps:20000}); if(!r||r.st.length){ ok=false; break; } const y=r.mem[2]&15; if(z===null) z=y; else if(z!==y){ ok=false; break; } } tt.push(z); }
    if(!ok) continue; const k=tt.map(x=>x?1:0).join(''); if(seen.has(k)) continue; seen.add(k); out.push({name:b.name,prog:b.prog,nz:tt.map(x=>x!==0)}); } return out; }
export async function learnValCond(tab,{say=()=>{},ms=90000}={}){ const name='ערכים: '+tab.map((x,i)=>x?i:null).filter(x=>x!==null).join(',');
  const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); const have=sh.named.find(b=>b.name===name); if(have) return {name,prog:have.prog,learned:false};
  const tt=tab.map(x=>x?15:0); const gen=()=>{ const mem=Array.from({length:16},()=>R(16)); const w=tt[mem[0]], k=mem[0]; return {mem,want:w,ok:r=>r[2]===w&&r[0]===k}; };
  say(`  לומד פעולה «${name}» (בונה-ערכים)…`); const v=valueBuild(gen,{name,ins:[0],out:2,ms}); if(!v.prog||finalCheck(v.prog,gen).bad) return null;
  const S2=JSON.parse(fs.readFileSync('shelf3.json','utf8')); S2.named.push({name,prog:v.prog,ins:[0],out:2,movable:movable(v.prog,gen),by:'נלמד: תנאי-על-ערך (אם-רשימה)'}); fs.writeFileSync('shelf3.json',JSON.stringify(S2));
  const LG=JSON.parse(fs.readFileSync('tzoref-learned-goals.json','utf8')); LG[name]={ins:[0],tt}; fs.writeFileSync('tzoref-learned-goals.json',JSON.stringify(LG)); return {name,prog:v.prog,learned:true}; }

export async function ifPosCompose(gen,{ms=+process.env.IFPMS||150000,learn=true,say=()=>{}}={}){ const T0=Date.now(), DEAD=T0+ms; const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8'));
  const ex=pickExamplesFor(gen); const wantS=ex.map(e=>J(JSON.parse(e.want))); const same=ex.map((e,i)=>J(walk(e.mem))===wantS[i]); if(same.every(Boolean)) return {prog:null};
  const {tools,LN}=stepTools(ex,{say}); const ops=unaryOps(sh); const chk=makeChecker(gen,300,600000); const more=Array.from({length:300},()=>gen());
  const verify=p=>{ for(const e of more){ const r=run(p,e.mem,{maxSteps:600000}); if(!r||r.st.length||!e.ok(r.mem)) return false; } return chk(p); };
  const fits=(c,must1,must0)=>{ let a=true, b=true; for(let i=0;i<c.length;i++){ if(must1[i]&&!c[i]) a=false; if(must0[i]&&c[i]) a=false; if(must1[i]&&c[i]) b=false; if(must0[i]&&!c[i]) b=false; } return a?1:b?-1:0; };
  const toLearn=[];
  for(const t of tools){ if(Date.now()>DEAD) break; const works=ex.map((e,i)=>{ const m=runFastG(t.P,e.mem,PADN,300000); return !!m&&J(walkA(m))===wantS[i]; });
    if(ex.some((e,i)=>!same[i]&&!works[i])) continue; const must1=same.map(s=>!s), must0=same.map((s,i)=>s&&!works[i]);
    for(const L of LN){ const v=L.v; const tries=[[null,v.map(x=>x!==0),L.name]]; for(const op of ops) tries.push([op,v.map(x=>op.nz[x]),`${op.name}(${L.name})`]);
      for(const [op,c,nm] of tries){ const f=fits(c,must1,must0); if(!f) continue; const p=ifFrame(L.prog,op?op.prog:null,t.prog,f<0);
        if(verify(p)) return {prog:p,how:`אם ${f<0?'לא ':''}[${nm}] אז [${t.name}]`,ms:Date.now()-T0}; }
      // טבלה על הערכים שנראו: מה התנאי חייב לענות לכל ערך
      const req=Array(16).fill(null); let ok=true; for(let i=0;i<v.length&&ok;i++){ const need=must1[i]?true:must0[i]?false:null; if(need===null) continue; if(req[v[i]]===null) req[v[i]]=need; else if(req[v[i]]!==need) ok=false; }
      if(ok&&req.some(x=>x===true)&&req.some(x=>x===false)) toLearn.push({t,L,tab:req.map(x=>!!x),known:req.filter(x=>x!==null).length}); } }
  // לפני לימוד: הטבלה חייבת להחזיק גם על 300 דוגמאות נוספות (אחרת זו התאמה מקרית)
  const enc=new Map(); const encOf=p=>{ if(!enc.has(p)) enc.set(p,encodeG([...PADA,...shift(p,PADN)])); return enc.get(p); };
  const solid=toLearn.filter(q=>{ const req=q.tab.map((x,i)=>null); for(let i=0;i<ex.length;i++){} let ok=true; const tabK=Array(16).fill(null);
      for(const e of [...ex,...more]){ const m=runFastG(encOf(q.L.prog),e.mem,PADN,300000); if(!m){ ok=false; break; } const v=m[2]&15; const w=J(JSON.parse(e.want)), sm=J(walk(e.mem))===w;
        const o=runFastG(q.t.P,e.mem,PADN,300000); const wk=!!o&&J(walkA(o))===w; if(!sm&&!wk){ ok=false; break; } const need=!sm?true:!wk?false:null; if(need===null) continue;
        if(tabK[v]===null) tabK[v]=need; else if(tabK[v]!==need){ ok=false; break; } }
      if(ok){ q.tab=tabK.map(x=>!!x); q.known=tabK.filter(x=>x!==null).length; } return ok; });
  if(learn) for(const q of solid.sort((a,b)=>b.known-a.known).slice(0,2)){ if(Date.now()>DEAD) break; const c=await learnValCond(q.tab,{say,ms:Math.min(90000,Math.max(20000,DEAD-Date.now()))}); if(!c) continue;
    const p=ifFrame(q.L.prog,c.prog,q.t.prog,false); if(verify(p)) return {prog:p,how:`אם [${c.name}(${q.L.name})] אז [${q.t.name}]${c.learned?' (פעולה נלמדה עכשיו)':''}`,learned:c.learned?c.name:null,ms:Date.now()-T0}; }
  return {prog:null,cand:toLearn.length,solid:solid.length,ms:Date.now()-T0}; }

if((process.argv[1]||'').endsWith('ifpos.mjs')){ const { llGen }=await import('./listlist.mjs'); const file=process.argv[2]||'../suite-listfail.json'; const only=process.argv[3]?new Set(process.argv[3].split('|')):null;
  const S=JSON.parse(fs.readFileSync(file,'utf8')).tasks.filter(t=>t.kind==='list2list'&&(!only||only.has(t.name))); let n=0;
  for(const t of S){ const f=new Function('return ('+t.src+')')(); const gen=llGen(f); const t0=Date.now(); const r=await ifPosCompose(gen,{say:process.env.V?console.log:()=>{}}); const sec=(Date.now()-t0)/1000;
    let fc=null, off=null; if(r.prog){ fc=finalCheck(r.prog,gen,20000).bad; off=offsetCheck(r.prog,gen); } const ok=!!r.prog&&fc===0&&off===0; if(ok) n++;
    console.log(`${ok?'✓':'✗'} ${t.name}: ${r.prog?`${r.prog.length} פקודות · ${r.how} · בדיקה-סופית ${fc}/20000 · במקום-אחר ${off}/300`:'לא נמצא'} · ${sec.toFixed(1)} שנ׳`); }
  console.log(`סך: ${n}/${S.length}`); process.exit(0); }
