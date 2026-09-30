// «לולאה עם זיכרון»: שני צוברים שמתעדכנים ביחד בכל צעד — כל אחד יכול להשתמש בשני.
// למשל «האם ממוינת?»: צובר ב = האיבר הקודם · צובר א = «עד עכשיו ממוין» (וגם: הקודם קטן מהנוכחי).
import { loadShelf, placements, makeChecker } from './tzoref.mjs'; import { partTables } from './tzoref-tables.mjs'; import { keepOf } from './tzoref-goals.mjs';
const A=2, B=5, X=3;   // צובר א בתא 2 (שם גם התשובה), צובר ב בתא 5, האיבר הנוכחי בתא 3
const DOM=[]; for(let a=0;a<16;a++) for(let b=0;b<16;b++) for(let x=8;x<16;x++) DOM.push([a,b,x]); const D=DOM.length; const idx=(a,b,x)=>(a*16+b)*8+(x-8);
const walk=m=>{ const l=[]; let p=m[1]; for(let i=0;p&&i<10;i++){ l.push(p); p=m[p]; } return l; };
export function loop3Build(gen,{name='',maxF=2,maxG=1,N=64,ms=120000,tries=60}={}){ const t0=Date.now(); const sh=loadShelf(); const blocks=new Map(sh.named.map(b=>[b.name,b]));
  const TB=partTables(sh.named.filter(b=>!b.bad&&b.name!==name)).filter(t=>t.name!=='העתק');
  const ex=Array.from({length:N},()=>gen()); const want=ex.map(e=>e.want&15); const lists=ex.map(e=>walk(e.mem));
  // ביטויים על (א, ב, איבר) — כל התנהגות שונה פעם אחת
  const seen=new Set(), by=[[]]; const hk=v=>{ let h1=2166136261,h2=5381; for(let i=0;i<D;i++){ h1=Math.imul(h1^v[i],16777619); h2=(Math.imul(h2,33)+v[i])|0; } return h1+':'+h2; };
  const add=(v,e,s)=>{ const k=hk(v); if(seen.has(k)) return; seen.add(k); (by[s]||(by[s]=[])).push({v,e}); };
  add(Uint8Array.from(DOM.map(d=>d[0])),{cell:A},0); add(Uint8Array.from(DOM.map(d=>d[1])),{cell:B},0); add(Uint8Array.from(DOM.map(d=>d[2])),{cell:X},0);
  for(let s=1;s<=maxF;s++) for(const tb of TB){ const F=tb.T;
    if(tb.k===1){ for(const a of by[s-1]||[]){ const v=new Uint8Array(D); for(let i=0;i<D;i++) v[i]=F[a.v[i]]; add(v,{f:tb.name,k:1,a:a.e},s); } }
    else for(let sa=0;sa<=s-1;sa++) for(const a of by[sa]||[]) for(const b of by[s-1-sa]||[]){ if(a===b) continue; const v=new Uint8Array(D); for(let i=0;i<D;i++) v[i]=F[a.v[i]*16+b.v[i]]; add(v,{f:tb.name,k:2,a:a.e,b:b.e},s); } }
  // בדיקה על 2,000 דוגמאות חדשות — רשימות ממוינות נדירות, אז «עובד במקרה» קל מאוד כאן
  const V=Array.from({length:2000},()=>gen()); const VL=V.map(e=>walk(e.mem));
  const verify=(f,g,ia,ib,out)=>V.every((e,i)=>{ let a=ia==='first'?e.mem[1]:ia,b=ib==='first'?e.mem[1]:ib; for(const x of VL[i]){ const k=idx(a,b,x); const na=f.v[k], nb=g.v[k]; a=na; b=nb; } return (out===A?a:b)===(e.want&15); });
  const Fs=by.slice(0,maxF+1).flat(), Gs=by.slice(0,maxG+1).flat(); const INIT=[0,15,'first']; let found=null, sims=0;
  outer: for(const g of Gs) for(const f of Fs){ if(Date.now()-t0>ms) break outer; for(const ia of INIT) for(const ib of INIT) for(const out of [A,B]){ sims++; let ok=true;
        for(let i=0;i<ex.length&&ok;i++){ let a=ia==='first'?ex[i].mem[1]:ia,b=ib==='first'?ex[i].mem[1]:ib; for(const x of lists[i]){ const k=idx(a,b,x); const na=f.v[k], nb=g.v[k]; a=na; b=nb; } if((out===A?a:b)!==want[i]) ok=false; }
        if(ok&&verify(f,g,ia,ib,out)){ found={f:f.e,g:g.e,ia,ib,out}; break outer; } } }
  if(!found) return {prog:null,sims,ms:Date.now()-t0};
  // תוכנית: התחלה (א, ב) · ראש⇒תא3 · קפוץ לבדיקה · גוף: F⇒זמני1, G⇒זמני2, העתק ⇒ א, ב · הבא · בדיקה · בסוף: התשובה לתא 2
  const EQ=new Map(); { const byT=new Map(); for(const t of TB){ const k=t.k+':'+t.T.join(','); if(!byT.has(k)) byT.set(k,[]); byT.get(k).push(t.name); } for(const L of byT.values()) for(const n of L) EQ.set(n,L); }
  const used=p=>new Set(p.filter(x=>x[0]==='WHERE'&&!x[2]).map(x=>x[1]).filter(c=>c<8)); const shift=(p,o)=>p.map(x=>x[2]==='code'&&x[1]>=0?['WHERE',x[1]+o,'code']:x);
  const P=s=>s.split(';').map(x=>x.trim()).filter(Boolean).map(x=>{ const [o,a]=x.split(' '); return a==null?[o]:[o,+a]; });
  const size=e=>e.cell!=null?0:1+size(e.a)+(e.b?size(e.b):0);
  function compile(expr,keep,freeCells,rnd){ const prog=[], live=new Set(); const R=k=>rnd?Math.floor(Math.random()*k):0;
    const emit=(e)=>{ if(e.cell!=null) return e.cell; const kids=e.b?[e.a,e.b]:[e.a]; const order=kids.map((k,i)=>i).sort((i,j)=>size(kids[j])-size(kids[i])); const cells=[];
      for(const i of order){ const c=emit(kids[i]); if(c==null) return null; cells[i]=c; if(!keep.includes(c)) live.add(c); }
      const free=freeCells.filter(c=>!live.has(c)); if(!free.length) return null; const tgt=free[R(free.length)];
      const C=(EQ.get(e.f)||[e.f]).map(n=>blocks.get(n)).flatMap(b=>b.movable===false?[{prog:b.prog,ins:(b.ins||[]).filter(c=>c<8),out:b.out??2}]:placements(b,6000));
      const ok=C.filter(p=>p.out===tgt&&p.ins.join()===cells.join()&&[...used(p.prog)].every(c=>c===tgt||cells.includes(c)||(!live.has(c)&&!keep.includes(c))));
      if(!ok.length) return null; const p=ok[R(ok.length)]; prog.push(...shift(p.prog,prog.length)); for(const c of cells) live.delete(c); return tgt; };
    const t=emit(expr); return t==null?null:{prog,cell:t}; }
  const initP=(v,cell)=>v==='first'?P(`WHERE 1; GO; TAKE; WHERE ${cell}; GO; PUT`):P(`WHERE ${cell}; GO; TAKE; TAKE; CALC; TAKE; CALC; PUT`+(v===0?'; TAKE; TAKE; CALC; PUT':''));
  const cp=(from,to)=>from===to?[]:P(`WHERE ${from}; GO; TAKE; WHERE ${to}; GO; PUT`); const chk=makeChecker(gen,300);
  const KG=keepOf(name,{}); const SCR=[4,6,7,...[0,1].filter(c=>!KG.includes(c))];
  for(let t=0;t<tries;t++){ const r=t>0; const keep=[...[0,1].filter(c=>KG.includes(c)),A,B,X];
    // סדר חכם: אם העדכון של ב לא קורא את א — מעדכנים את א מיד (משחררים תא); אם העדכון של א לא קורא את ב — קודם ב. אחרת — שניהם לתאים זמניים.
    const reads=(e,c)=>e.cell!=null?e.cell===c:reads(e.a,c)||(e.b?reads(e.b,c):false); let body=null;
    const seq=(e1,d1,e2,d2)=>{ const c1=compile(e1,keep,SCR,r); if(!c1) return null; const p1=[...c1.prog,...cp(c1.cell,d1)]; const c2=compile(e2,keep,SCR,r); if(!c2) return null; return [...p1,...shift(c2.prog,p1.length),...cp(c2.cell,d2)]; };
    if(!reads(found.g,A)) body=seq(found.f,A,found.g,B); else if(!reads(found.f,B)) body=seq(found.g,B,found.f,A);
    else { const Fc=compile(found.f,keep,SCR,r); if(!Fc) continue; const keep2=Fc.cell===A||Fc.cell===B||Fc.cell===X?keep:[...keep,Fc.cell];
      const Gc=compile(found.g,keep2,SCR.filter(c=>c!==Fc.cell),r); if(!Gc) continue; body=[...Fc.prog,...shift(Gc.prog,Fc.prog.length),...cp(Fc.cell,A),...cp(Gc.cell,B)]; }
    if(!body) continue;
    const head=[...initP(found.ia,A),...initP(found.ib,B),...P(`WHERE 1; GO; TAKE; WHERE ${X}; GO; PUT`)]; const bodyAt=head.length+P('TAKE; TAKE; CALC; TAKE; CALC').length+2;
    const next=P(`WHERE ${X}; GO; TAKE; WHERE@; GO; TAKE; WHERE ${X}; GO; PUT`); const testAt=bodyAt+body.length+next.length;
    const prog=[...head,...P('TAKE; TAKE; CALC; TAKE; CALC'),['WHERE',testAt,'code'],['JUMP'],...shift(body,bodyAt),...next,...P(`WHERE ${X}; GO; TAKE`),['WHERE',bodyAt,'code'],['JUMP'],...cp(found.out,2)];
    if(chk(prog)) return {prog,found,sims,ms:Date.now()-t0}; }
  return {prog:null,found,sims,ms:Date.now()-t0,why:'נמצא, אבל התוכנית לא עברה'}; }
const S=e=>e.cell!=null?(e.cell===A?'א':e.cell===B?'ב':'איבר'):`${e.f}(${S(e.a)}${e.b?', '+S(e.b):''})`;
export const show3=f=>`התחל א=${f.ia==='first'?'הראשון':f.ia}, ב=${f.ib==='first'?'הראשון':f.ib} · בכל איבר: א ⇐ ${S(f.f)} · ב ⇐ ${S(f.g)} · התשובה: ${f.out===A?'א':'ב'}`;
if(import.meta.url==='file://'+process.argv[1]){ const { goals, goalFor }=await import('./tzoref-goals.mjs'); const G=goals();
  for(const name of process.argv.slice(2)){ const r=loop3Build(goalFor(name,{ins:G[name].ins},G),{name});
    console.log(`${r.prog?'✓':'✗'} ${name}: ${r.found?show3(r.found):'-'} · ${r.prog?r.prog.length+' פקודות':(r.why||'לא נמצא')} · ${r.sims.toLocaleString()} ניסיונות · ${(r.ms/1000).toFixed(1)} שנ׳`); } process.exit(0); }
