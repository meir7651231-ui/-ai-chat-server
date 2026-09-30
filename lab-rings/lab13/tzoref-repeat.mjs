// «חזור N פעמים»: לולאה על מספר (לא על רשימה). הצורף מחפש: במה להתחיל, כמה פעמים לחזור (תא 0 או תא 1),
// ומה לעשות בכל סיבוב — צירוף חלקים על (צובר, תא0, תא1). למשל כפל = «התחל מ-0, חזור תא1 פעמים: צובר ⇐ צובר + תא0».
import { loadShelf, placements, makeChecker } from './tzoref.mjs'; import { partTables } from './tzoref-tables.mjs';
const ACC=2, CNT=3;   // צובר בתא 2 (שם התשובה), מונה בתא 3
const DOM=[]; for(let a=0;a<16;a++) for(let x=0;x<16;x++) for(let y=0;y<16;y++) DOM.push([a,x,y]); const D=DOM.length; const idx=(a,x,y)=>(a*16+x)*16+y;
export function repeatBuild(gen,{name='',ins=[0,1],maxSize=2,N=64,ms=60000,tries=60}={}){ const t0=Date.now(); const sh=loadShelf(); const blocks=new Map(sh.named.map(b=>[b.name,b]));
  const TB=partTables(sh.named.filter(b=>!b.bad&&b.name!==name)).filter(t=>t.name!=='העתק');
  const ex=Array.from({length:N},()=>gen()); const V=Array.from({length:1500},()=>gen()); const [I0,I1]=[ins[0],ins[1]??ins[0]];
  const seen=new Set(), by=[[]]; const hk=v=>{ let h1=2166136261,h2=5381; for(let i=0;i<D;i++){ h1=Math.imul(h1^v[i],16777619); h2=(Math.imul(h2,33)+v[i])|0; } return h1+':'+h2; };
  const add=(v,e,s)=>{ const k=hk(v); if(seen.has(k)) return; seen.add(k); (by[s]||(by[s]=[])).push({v,e}); };
  add(Uint8Array.from(DOM.map(d=>d[0])),{cell:ACC},0); add(Uint8Array.from(DOM.map(d=>d[1])),{cell:I0},0); add(Uint8Array.from(DOM.map(d=>d[2])),{cell:I1},0);
  for(let s=1;s<=maxSize;s++) for(const tb of TB){ const F=tb.T;
    if(tb.k===1){ for(const a of by[s-1]||[]){ const v=new Uint8Array(D); for(let i=0;i<D;i++) v[i]=F[a.v[i]]; add(v,{f:tb.name,k:1,a:a.e},s); } }
    else for(let sa=0;sa<=s-1;sa++) for(const a of by[sa]||[]) for(const b of by[s-1-sa]||[]){ if(a===b) continue; const v=new Uint8Array(D); for(let i=0;i<D;i++) v[i]=F[a.v[i]*16+b.v[i]]; add(v,{f:tb.name,k:2,a:a.e,b:b.e},s); } }
  const steps=by.flat().filter(x=>x.e.cell==null); const INITS=[{c:0,name:'0'},{c:15,name:'15'},{cell:I0,name:'תא'+I0},{cell:I1,name:'תא'+I1}]; const CNTS=[I0,I1];
  const run=(st,I,cnt,m)=>{ let acc=I.cell!=null?m[I.cell]:I.c; const x=m[I0], y=m[I1]; for(let n=m[cnt];n>0;n--) acc=st.v[idx(acc,x,y)]; return acc; };
  let found=null;
  outer: for(const st of steps) for(const I of INITS) for(const cnt of CNTS){ if(Date.now()-t0>ms) break outer;
      if(ex.every(e=>run(st,I,cnt,e.mem)===(e.want&15))&&V.every(e=>run(st,I,cnt,e.mem)===(e.want&15))){ found={st,I,cnt}; break outer; } }
  if(!found) return {prog:null,steps:steps.length,ms:Date.now()-t0};
  // תוכנית: התחלה ⇒ תא2 · מונה ⇒ תא3 · קפוץ לבדיקה · גוף: צעד ⇒ זמני ⇒ תא2 · מונה פחות 1 · בדיקה: מונה≠0 ⇒ לגוף
  const EQ=new Map(); { const byT=new Map(); for(const t of TB){ const k=t.k+':'+t.T.join(','); if(!byT.has(k)) byT.set(k,[]); byT.get(k).push(t.name); } for(const L of byT.values()) for(const n of L) EQ.set(n,L); }
  const used=p=>new Set(p.filter(x=>x[0]==='WHERE'&&!x[2]).map(x=>x[1]).filter(c=>c<8)); const shift=(p,o)=>p.map(x=>x[2]==='code'&&x[1]>=0?['WHERE',x[1]+o,'code']:x);
  const P=s=>s.split(';').map(x=>x.trim()).filter(Boolean).map(x=>{ const [o,a]=x.split(' '); return a==null?[o]:[o,+a]; }); const size=e=>e.cell!=null?0:1+size(e.a)+(e.b?size(e.b):0);
  const keep=[...new Set([...ins,ACC,CNT])]; const SCR=[4,5,6,7].filter(c=>!keep.includes(c));
  function compile(expr,rnd){ const prog=[], live=new Set(); const R=k=>rnd?Math.floor(Math.random()*k):0;
    const emit=(e)=>{ if(e.cell!=null) return e.cell; const kids=e.b?[e.a,e.b]:[e.a]; const order=kids.map((k,i)=>i).sort((i,j)=>size(kids[j])-size(kids[i])); const cells=[];
      for(const i of order){ const c=emit(kids[i]); if(c==null) return null; cells[i]=c; if(!keep.includes(c)) live.add(c); }
      const free=SCR.filter(c=>!live.has(c)); if(!free.length) return null; const tgt=free[R(free.length)];
      const C=(EQ.get(e.f)||[e.f]).map(n=>blocks.get(n)).flatMap(b=>b.movable===false?[{prog:b.prog,ins:(b.ins||[]).filter(c=>c<8),out:b.out??2}]:placements(b,6000));
      const ok=C.filter(p=>p.out===tgt&&p.ins.join()===cells.join()&&[...used(p.prog)].every(c=>c===tgt||cells.includes(c)||(!live.has(c)&&!keep.includes(c))));
      if(!ok.length) return null; const p=ok[R(ok.length)]; prog.push(...shift(p.prog,prog.length)); for(const c of cells) live.delete(c); return tgt; };
    const t=emit(expr); return t==null?null:[...prog,...P(`WHERE ${t}; GO; TAKE; WHERE ${ACC}; GO; PUT`)]; }
  const F15='TAKE; TAKE; CALC; TAKE; CALC'; const I=found.I; const chk=makeChecker(gen,300);
  const init=I.cell!=null?P(`WHERE ${I.cell}; GO; TAKE; WHERE ${ACC}; GO; PUT`):P(`WHERE ${ACC}; GO; ${F15}; PUT`+(I.c===0?'; TAKE; TAKE; CALC; PUT':''));
  for(let t=0;t<tries;t++){ const B=compile(found.st.e,t>0); if(!B) continue;
    const head=[...init,...P(`WHERE ${found.cnt}; GO; TAKE; WHERE ${CNT}; GO; PUT; ${F15}`)]; const bodyAt=head.length+2;
    const dec=P(`WHERE ${CNT}; GO; TAKE; TAKE; TAKE; CALC; TAKE; CALC; ADD; PUT`); const testAt=bodyAt+B.length+dec.length;
    const prog=[...head,['WHERE',testAt,'code'],['JUMP'],...shift(B,bodyAt),...dec,...P(`WHERE ${CNT}; GO; TAKE`),['WHERE',bodyAt,'code'],['JUMP']];
    if(chk(prog)) return {prog,found,ms:Date.now()-t0}; }
  return {prog:null,found,ms:Date.now()-t0,why:'נמצא, אבל התוכנית לא עברה'}; }
const S=(e,I0,I1)=>e.cell!=null?(e.cell===ACC?'צובר':'תא'+e.cell):`${e.f}(${S(e.a)}${e.b?', '+S(e.b):''})`;
export const showR=f=>`התחל מ-${f.I.name} · חזור «תא${f.cnt}» פעמים: צובר ⇐ ${S(f.st.e)}`;
