// «מסגרות-החלטה» לרשימות: «אם [תנאי] אז [כלי]» ו«כל עוד [תנאי] עשה [כלי]».
// התנאי = תשובה של כלי-רשימה שהיא תמיד 0 או 15 (או «לא» שלה). הכלי = כלי שמשנה רשימה, מהמדף. המכונה בוחרת מה לשים במסגרת.
import fs from 'fs'; import { run } from './machine3s.mjs'; import { partTables } from './tzoref-tables.mjs'; import { placements, makeChecker } from './tzoref.mjs';
import { llGen } from './listlist.mjs';
const walk=m=>{ const o=[]; let a=m[1]; for(let i=0;a&&i<10;i++){ o.push(a); a=m[a]; } return o; };
const shift=(p,o)=>p.map(x=>x[2]==='code'&&x[1]>=0?['WHERE',x[1]+o,'code']:x); const Z=[['WHERE',0],['GO']]; const mv=(a,b)=>[['WHERE',a],['GO'],['TAKE'],['WHERE',b],['GO'],['PUT']];
const RUN=(p,m)=>run(p,m,{maxSteps:600000});
export function ifCompose(gen,{N=150,ms=+process.env.IFMS||240000}={}){ const DEAD=Date.now()+ms; const SCR=(p,m)=>run(p,m,{maxSteps:30000}); const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); const ex=Array.from({length:N},()=>gen());
  const PAD=[...Z,...Z,...Z,...Z,...Z];
  // תנאים: כלי-רשימה ששומרים על הרשימה (8–15), ניידים, ועונים בתא 2; וגם פעולה חד-מקומית עליהם
  const base=[]; for(const b of sh.named){ if(!b.prog.some(x=>x[0]==='WHERE@')||b.prog.length>300) continue; let ok=true; const v=[];
    for(const e of ex){ const r=RUN(b.prog,e.mem); if(!r||r.st.length||[8,9,10,11,12,13,14,15].some(c=>r.mem[c]!==e.mem[c])){ ok=false; break; } const r2=RUN([...PAD,...shift(b.prog,PAD.length)],e.mem); if(!r2||(r2.mem[2]&15)!==(r.mem[2]&15)){ ok=false; break; } v.push(r.mem[2]&15); } if(ok) base.push({name:b.name,prog:b.prog,v}); }
  const conds=[...base]; for(const tb of partTables(sh.named.filter(b=>!b.bad)).filter(t=>t.k===1&&!t.partial)){ const opB=sh.named.find(b=>b.name===tb.name); if(!opB) continue; const P=placements(opB,6000).filter(q=>q.ins.join()==='3'&&q.out===2); if(!P.length) continue;
    for(const t of base) conds.push({name:`${tb.name}(${t.name})`,prog:[...t.prog,...mv(2,3),...shift(P[0].prog,t.prog.length+6)],v:t.v.map(x=>tb.T[x])}); }
  const C1=conds.filter(c=>c.v.every(x=>x===0||x===15)&&c.v.some(x=>x)&&c.v.some(x=>!x)); const C=[...C1];
  const PT=partTables(sh.named.filter(b=>!b.bad)).filter(t=>t.k===2&&!t.partial&&/^(וגם|או) \(מספרים\)$/.test(t.name));
  for(const tb of PT){ const opB=sh.named.find(b=>b.name===tb.name); const opP=placements(opB,6000).filter(z=>z.ins.join()==='5,6'&&z.out===2); if(!opP.length) continue;
    for(let i=0;i<C1.length;i++) for(let j=i+1;j<C1.length;j++){ const a=C1[i], b=C1[j]; const v=a.v.map((x,k)=>tb.T[x*16+b.v[k]]); if(!(v.some(x=>x)&&v.some(x=>!x))) continue;
      C.push({name:`${tb.name}(${a.name}, ${b.name})`,v,lazy:()=>{ let p=[['WHERE',1],['GO'],['TAKE'],['WHERE',0],['GO'],['TAKE'],...Z]; p=[...p,...shift(a.prog,p.length)]; p=[...p,['WHERE',0],['GO'],['PUT'],['WHERE',1],['GO'],['PUT'],['WHERE',2],['GO'],['TAKE'],...Z]; p=[...p,...shift(b.prog,p.length)]; p=[...p,...mv(2,6),['WHERE',5],['GO'],['PUT']]; return [...p,...shift(opP[0].prog,p.length)]; }}); } }
  for(const c of C) if(!c.prog) Object.defineProperty(c,'prog',{get(){ return this._p||(this._p=this.lazy()); }});
  // כלים שמשנים רשימה (ניידים)
  const T=[]; for(const b of sh.named){ if(b.prog.length>300) continue; let ok=true, ch=0; const outs=[];
    for(const e of ex){ const r=RUN(b.prog,e.mem); if(!r||r.st.length){ ok=false; break; } const a=walk(r.mem); if(JSON.stringify(a)!==JSON.stringify(walk(e.mem))) ch++; const r2=RUN([...PAD,...shift(b.prog,PAD.length)],e.mem); if(!r2||JSON.stringify(walk(r2.mem))!==JSON.stringify(a)){ ok=false; break; } outs.push(a); }
    if(ok&&ch>0) T.push({name:b.name,prog:b.prog}); }
  const chk=makeChecker(gen,300,600000); const tryP=p=>ex.every(e=>{ const r=SCR(p,e.mem); return r&&!r.st.length&&e.ok(r.mem); })&&chk(p);
  // קוד המסגרת: שמירת ראש+מפתח במחסנית ⇒ תנאי ⇒ החזרה ⇒ (תנאי = 15 ⇒ לכלי, אחרת לסוף)
  const frame=(c,t,loop,neg)=>{ let p=[['WHERE',1],['GO'],['TAKE'],['WHERE',0],['GO'],['TAKE'],...Z]; const start=0; p=[...p,...shift(c.prog,p.length)];
    p=[...p,['WHERE',0],['GO'],['PUT'],['WHERE',1],['GO'],['PUT'],['WHERE',2],['GO'],['TAKE'],...(neg?[]:[['TAKE'],['CALC']])];   // במחסנית: «דלג?» (≠0 ⇒ לסוף)
    const jAt=p.length; p=[...p,['WHERE',-1,'code'],['JUMP'],...Z]; p=[...p,...shift(t.prog,p.length)];
    if(loop) p=[...p,['WHERE',2],['GO'],['TAKE'],['TAKE'],['CALC'],['TAKE'],['CALC'],['WHERE',start,'code'],['JUMP']];   // חזרה להתחלה תמיד (≠0): NAND(NAND(x,x),x)=15 לכל x
    p[jAt]=['WHERE',p.length,'code']; return p; };
  const orig=ex.map(e=>JSON.stringify(walk(e.mem))); const need=ex.map((e,k)=>e.want!==orig[k]);   // איפה הרשימה צריכה להשתנות
  const fit=(c,neg)=>c.v.every((x,k)=>((neg?!x:!!x))===need[k]);
  for(const loop of [false,true]) for(const t of T) for(const c of C) for(const neg of [false,true]){ if(Date.now()>DEAD) return {prog:null,nc:C.length,nt:T.length,timeout:true}; if(!fit(c,neg)) continue; const p=frame(c,t,loop,neg); if(tryP(p)) return {prog:p,how:`${loop?'כל עוד':'אם'} ${neg?'לא ':''}[${c.name}] ${loop?'עשה':'אז'} [${t.name}]`,nc:C.length,nt:T.length}; }
  return {prog:null,nc:C.length,nt:T.length,nfit:C.filter(c=>fit(c,false)||fit(c,true)).length}; }
if((process.argv[1]||'').endsWith('ifcomp.mjs')){
  const TASKS=[['בלי הראשון אם זוגי',l=>(l.length&&l[0]%2===0)?l.slice(1):l],['בלי הזוגיים שבהתחלה',l=>{ let i=0; while(i<l.length&&l[i]%2===0) i++; return l.slice(i); }],
    ['בלי הראשון אם גדול מ-12',l=>(l.length&&l[0]>12)?l.slice(1):l],['בלי הגדולים מ-12 שבהתחלה',l=>{ let i=0; while(i<l.length&&l[i]>12) i++; return l.slice(i); }]];
  for(const [name,f] of TASKS){ const gen=llGen(f); const t0=Date.now(); const r=ifCompose(gen); let bad=null; if(r.prog){ bad=0; for(let k=0;k<20000;k++){ const e=gen(); const z=RUN(r.prog,e.mem); if(!z||z.st.length||!e.ok(z.mem)) bad++; } }
    console.log(`${r.prog&&!bad?'✓':'✗'} ${name}: ${r.prog?r.prog.length+' פקודות · '+r.how+' · בדיקה-עצמאית '+bad+' שגויים מ-20000':'לא נמצא'} · תנאים ${r.nc}${r.nfit!=null?' (מתאימים '+r.nfit+')':''} · כלים ${r.nt} · ${((Date.now()-t0)/1000).toFixed(0)} שנ׳`); }
  process.exit(0); }
