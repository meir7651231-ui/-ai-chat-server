// «שני צוברים»: משימות כמו «טווח» (הגדול פחות הקטן) או «סכום בלי הגדול» — שתי לולאות-צבירה במעבר אחד,
// ובסוף חלק אחד שמחבר את שתי התוצאות. הצורף מחפש: שני צעדים, שתי התחלות, וחלק-חיבור.
import { loadShelf, placements, makeChecker } from './tzoref.mjs'; import { partTables } from './tzoref-tables.mjs';
const ACC=2, ACC2=5, X=3, KEY=0; const XS=[8,9,10,11,12,13,14,15], KS=[0,8,9,10,11,12,13,14,15];
const DOM=[]; for(let a=0;a<16;a++) for(const x of XS) for(const k of KS) DOM.push([a,x,k]); const D=DOM.length;
const idx=(a,x,k)=>(a*8+(x-8))*9+(k?k-7:0);
const walk=m=>{ const l=[]; let a=m[1]; for(let i=0;a&&i<10;i++){ l.push(a); a=m[a]; } return l; };
export function loop2Build(gen,{name='',maxSize=2,ms=60000,N=64,tries=60}={}){ const t0=Date.now(); const sh=loadShelf(); const blocks=new Map(sh.named.map(b=>[b.name,b]));
  const TB=partTables(sh.named.filter(b=>!b.bad&&b.name!==name)).filter(t=>t.name!=='העתק');
  const ex=Array.from({length:N},()=>gen()); const want=ex.map(e=>e.want&15); const lists=ex.map(e=>walk(e.mem)), keys=ex.map(e=>e.mem[KEY]);
  // 1) צעדים שונים (לפי מה שהם עושים בכל המצבים)
  const seen=new Set(), by=[[]], steps=[]; const hk=v=>{ let h1=2166136261,h2=5381; for(let i=0;i<v.length;i++){ h1=Math.imul(h1^v[i],16777619); h2=(Math.imul(h2,33)+v[i])|0; } return h1+':'+h2; };
  const add=(v,expr,s)=>{ const k=hk(v); if(seen.has(k)) return; seen.add(k); (by[s]||(by[s]=[])).push({v,expr}); steps.push({v,expr}); };
  add(Uint8Array.from(DOM.map(d=>d[0])),{cell:ACC},0); add(Uint8Array.from(DOM.map(d=>d[1])),{cell:X},0); add(Uint8Array.from(DOM.map(d=>d[2])),{cell:KEY},0);
  for(let s=1;s<=maxSize;s++) for(const tb of TB){ const F=tb.T;
    if(tb.k===1){ for(const a of by[s-1]||[]){ const v=new Uint8Array(D); for(let i=0;i<D;i++) v[i]=F[a.v[i]]; add(v,{f:tb.name,k:1,a:a.expr},s); } }
    else for(let sa=0;sa<=s-1;sa++) for(const a of by[sa]||[]) for(const b of by[s-1-sa]||[]){ if(a===b) continue; const v=new Uint8Array(D); for(let i=0;i<D;i++) v[i]=F[a.v[i]*16+b.v[i]]; add(v,{f:tb.name,k:2,a:a.expr,b:b.expr},s); } }
  // 2) כל צעד × כל התחלה ⇒ התוצאה בסוף הלולאה בכל דוגמה
  const INITS=[{c:0,name:'0'},{c:15,name:'15'},{cell:KEY,name:'המפתח'}]; const folds=[], fseen=new Set();
  for(const st of steps) for(const I of INITS){ const r=new Uint8Array(ex.length); for(let i=0;i<ex.length;i++){ let acc=I.cell!=null?ex[i].mem[I.cell]:I.c; for(const x of lists[i]) acc=st.v[idx(acc,x,keys[i])]; r[i]=acc; }
    const k=r.join(','); if(fseen.has(k)) continue; fseen.add(k); folds.push({r,step:st.expr,init:I}); }
  // 3) חלק-חיבור: T(צבירה1, צבירה2) = התשובה
  const byFirst=new Map(); folds.forEach(f=>{ const v=f.r[0]; if(!byFirst.has(v)) byFirst.set(v,[]); byFirst.get(v).push(f); });
  let found=null;
  for(const tb of TB){ if(tb.k!==2||found) continue; const F=tb.T; for(const f1 of folds){ if(found||Date.now()-t0>ms) break;
      for(let b0=0;b0<16&&!found;b0++){ if(F[f1.r[0]*16+b0]!==want[0]) continue; for(const f2 of byFirst.get(b0)||[]){ if(f2===f1) continue; let e=1; for(;e<ex.length;e++) if(F[f1.r[e]*16+f2.r[e]]!==want[e]) break; if(e===ex.length){ found={f1,f2,comb:tb.name}; break; } } } } }
  if(!found) return {prog:null,folds:folds.length,ms:Date.now()-t0};
  // 4) תוכנית
  const EQ=new Map(); { const byT=new Map(); for(const t of TB){ const k=t.k+':'+t.T.join(','); if(!byT.has(k)) byT.set(k,[]); byT.get(k).push(t.name); } for(const L of byT.values()) for(const n of L) EQ.set(n,L); }
  const used=p=>new Set(p.filter(x=>x[0]==='WHERE'&&!x[2]).map(x=>x[1]).filter(c=>c<8)); const shift=(p,o)=>p.map(x=>x[2]==='code'&&x[1]>=0?['WHERE',x[1]+o,'code']:x);
  const P=s=>s.split(';').map(x=>x.trim()).filter(Boolean).map(x=>{ const [o,a]=x.split(' '); return a==null?[o]:[o,+a]; });
  const size=e=>e.cell!=null?0:1+size(e.a)+(e.b?size(e.b):0); const remap=(e,from,to)=>e.cell!=null?{cell:e.cell===from?to:e.cell}:{...e,a:remap(e.a,from,to),b:e.b?remap(e.b,from,to):undefined};
  const keepCells=[0,1,ACC,ACC2,X];
  function compile(expr,dest,rnd){ const prog=[], live=new Set(); const R=k=>rnd?Math.floor(Math.random()*k):0;
    const emit=(e)=>{ if(e.cell!=null) return e.cell; const kids=e.b?[e.a,e.b]:[e.a]; const order=kids.map((k,i)=>i).sort((i,j)=>size(kids[j])-size(kids[i])); const cells=[];
      for(const i of order){ const c=emit(kids[i]); if(c==null) return null; cells[i]=c; if(!keepCells.includes(c)) live.add(c); }
      const free=[4,6,7].filter(c=>!live.has(c)); if(!free.length) return null; const tgt=free[R(free.length)];
      const C=(EQ.get(e.f)||[e.f]).map(n=>blocks.get(n)).flatMap(b=>b.movable===false?[{prog:b.prog,ins:(b.ins||[]).filter(c=>c<8),out:b.out??2}]:placements(b,6000));
      const ok=C.filter(p=>p.out===tgt&&p.ins.join()===cells.join()&&[...used(p.prog)].every(c=>c===tgt||cells.includes(c)||(!live.has(c)&&!keepCells.includes(c))));
      if(!ok.length) return null; const p=ok[R(ok.length)]; prog.push(...shift(p.prog,prog.length)); for(const c of cells) live.delete(c); return tgt; };
    const t=emit(expr); if(t==null) return null; if(t===dest) return prog; return [...prog,...P(`WHERE ${t}; GO; TAKE; WHERE ${dest}; GO; PUT`)]; }
  const initP=(I,cell)=>I.cell!=null?P(`WHERE ${I.cell}; GO; TAKE; WHERE ${cell}; GO; PUT`):P(`WHERE ${cell}; GO; TAKE; TAKE; CALC; TAKE; CALC; PUT`+(I.c===0?'; TAKE; TAKE; CALC; PUT':''));
  const chk=makeChecker(gen,300);
  for(let t=0;t<tries;t++){ const r=t>0; const B1=compile(found.f1.step,ACC,r), B2=compile(remap(found.f2.step,ACC,ACC2),ACC2,r), C=compile({f:found.comb,k:2,a:{cell:ACC},b:{cell:ACC2}},ACC,r); if(!B1||!B2||!C) continue;
    const head=[...initP(found.f1.init,ACC),...initP(found.f2.init,ACC2),...P(`WHERE 1; GO; TAKE; WHERE ${X}; GO; PUT`)]; const bodyAt=head.length+P(`TAKE; TAKE; CALC; TAKE; CALC`).length+2;
    const B=[...B1,...shift(B2,B1.length)]; const next=P(`WHERE ${X}; GO; TAKE; WHERE@; GO; TAKE; WHERE ${X}; GO; PUT`); const testAt=bodyAt+B.length+next.length; const endAt=testAt+P(`WHERE ${X}; GO; TAKE`).length+2;
    const prog=[...head,...P(`TAKE; TAKE; CALC; TAKE; CALC`),['WHERE',testAt,'code'],['JUMP'],...shift(B,bodyAt),...next,...P(`WHERE ${X}; GO; TAKE`),['WHERE',bodyAt,'code'],['JUMP'],...shift(C,endAt)];
    if(chk(prog)) return {prog,found,folds:folds.length,ms:Date.now()-t0}; }
  return {prog:null,found,folds:folds.length,ms:Date.now()-t0,why:'נמצא, אבל התוכנית לא עברה'}; }
const S=e=>e.cell!=null?(e.cell===ACC?'צובר':e.cell===X?'איבר':'מפתח'):`${e.f}(${S(e.a)}${e.b?', '+S(e.b):''})`;
if(import.meta.url==='file://'+process.argv[1]){ const { goals, goalFor }=await import('./tzoref-goals.mjs'); const G=goals();
  for(const name of process.argv.slice(2)){ const r=loop2Build(goalFor(name,{ins:G[name].ins},G),{name}); const f=r.found;
    console.log(`${r.prog?'✓':'✗'} ${name}: ${f?`צובר א (מ-${f.f1.init.name}): ${S(f.f1.step)} · צובר ב (מ-${f.f2.init.name}): ${S(f.f2.step)} · בסוף: ${f.comb}(א, ב)`:'-'} · ${r.prog?r.prog.length+' פקודות':(r.why||'לא נמצא')} · ${r.folds} צבירות שונות · ${(r.ms/1000).toFixed(1)} שנ׳`); } }
