// «כל עוד»: לולאה עם תנאי. הצורף מחפש: במה להתחיל (צובר), מה לבדוק בכל סיבוב, מה לעשות בכל סיבוב,
// ומה התשובה — הצובר או «כמה סיבובים היו». למשל חילוק = «צובר=תא0; כל עוד צובר ≥ תא1: צובר ⇐ צובר − תא1; התשובה: כמה סיבובים».
import { loadShelf, placements, makeChecker } from './tzoref.mjs'; import { partTables } from './tzoref-tables.mjs';
const AC=3, CNT=2;   // צובר בתא 3, מונה-סיבובים בתא 2 (שם התשובה)
const DOM=[]; for(let a=0;a<16;a++) for(let x=0;x<16;x++) for(let y=0;y<16;y++) DOM.push([a,x,y]); const D=DOM.length; const idx=(a,x,y)=>(a*16+x)*16+y;
export function whileBuild(gen,{name='',ins=[0,1],maxSize=1,N=64,tries=60}={}){ const t0=Date.now(); const sh=loadShelf(); const blocks=new Map(sh.named.map(b=>[b.name,b]));
  const TB=partTables(sh.named.filter(b=>!b.bad&&b.name!==name)).filter(t=>t.name!=='העתק');
  const ex=Array.from({length:N},()=>gen()), V=Array.from({length:1500},()=>gen()); const [I0,I1]=[ins[0],ins[1]??ins[0]];
  const seen=new Set(), by=[[]]; const hk=v=>{ let h1=2166136261,h2=5381; for(let i=0;i<D;i++){ h1=Math.imul(h1^v[i],16777619); h2=(Math.imul(h2,33)+v[i])|0; } return h1+':'+h2; };
  const add=(v,e,s)=>{ const k=hk(v); if(seen.has(k)) return; seen.add(k); (by[s]||(by[s]=[])).push({v,e}); };
  add(Uint8Array.from(DOM.map(d=>d[0])),{cell:AC},0); add(Uint8Array.from(DOM.map(d=>d[1])),{cell:I0},0); add(Uint8Array.from(DOM.map(d=>d[2])),{cell:I1},0);
  for(let s=1;s<=maxSize;s++) for(const tb of TB){ const F=tb.T;
    if(tb.k===1){ for(const a of by[s-1]||[]){ const v=new Uint8Array(D); for(let i=0;i<D;i++) v[i]=F[a.v[i]]; add(v,{f:tb.name,k:1,a:a.e},s); } }
    else for(let sa=0;sa<=s-1;sa++) for(const a of by[sa]||[]) for(const b of by[s-1-sa]||[]){ if(a===b) continue; const v=new Uint8Array(D); for(let i=0;i<D;i++) v[i]=F[a.v[i]*16+b.v[i]]; add(v,{f:tb.name,k:2,a:a.e,b:b.e},s); } }
  const E=by.flat().filter(x=>x.e.cell==null); const INITS=[{cell:I0,name:'תא'+I0},{cell:I1,name:'תא'+I1},{c:0,name:'0'},{c:15,name:'15'}];
  const run=(C,S,I,m)=>{ let a=I.cell!=null?m[I.cell]:I.c, n=0; const x=m[I0], y=m[I1]; while(C.v[idx(a,x,y)]!==0){ if(++n>16) return null; a=S.v[idx(a,x,y)]; } return [a,n]; };
  let found=null;
  outer: for(const C of E) for(const S of E) for(const I of INITS) for(const out of ['סיבובים','צובר']){
    const ok=es=>es.every(e=>{ const r=run(C,S,I,e.mem); return r&&(out==='צובר'?r[0]:r[1]&15)===(e.want&15); });
    if(ok(ex)&&ok(V)){ found={C,S,I,out}; break outer; } }
  if(!found) return {prog:null,ms:Date.now()-t0};
  const EQ=new Map(); { const byT=new Map(); for(const t of TB){ const k=t.k+':'+t.T.join(','); if(!byT.has(k)) byT.set(k,[]); byT.get(k).push(t.name); } for(const L of byT.values()) for(const n of L) EQ.set(n,L); }
  const used=p=>new Set(p.filter(x=>x[0]==='WHERE'&&!x[2]).map(x=>x[1]).filter(c=>c<8)); const shift=(p,o)=>p.map(x=>x[2]==='code'&&x[1]>=0?['WHERE',x[1]+o,'code']:x);
  const P=s=>s.split(';').map(x=>x.trim()).filter(Boolean).map(x=>{ const [o,a]=x.split(' '); return a==null?[o]:[o,+a]; }); const size=e=>e.cell!=null?0:1+size(e.a)+(e.b?size(e.b):0);
  const keep=[...new Set([...ins,AC,CNT])]; const SCR=[4,5,6,7].filter(c=>!keep.includes(c));
  function compile(expr,dest,rnd){ const prog=[], live=new Set(); const R=k=>rnd?Math.floor(Math.random()*k):0;
    const emit=(e)=>{ if(e.cell!=null) return e.cell; const kids=e.b?[e.a,e.b]:[e.a]; const order=kids.map((k,i)=>i).sort((i,j)=>size(kids[j])-size(kids[i])); const cells=[];
      for(const i of order){ const c=emit(kids[i]); if(c==null) return null; cells[i]=c; if(!keep.includes(c)) live.add(c); }
      const free=SCR.filter(c=>!live.has(c)); if(!free.length) return null; const tgt=free[R(free.length)];
      const C=(EQ.get(e.f)||[e.f]).map(n=>blocks.get(n)).flatMap(b=>b.movable===false?[{prog:b.prog,ins:(b.ins||[]).filter(c=>c<8),out:b.out??2}]:placements(b,6000));
      const ok=C.filter(p=>p.out===tgt&&p.ins.join()===cells.join()&&[...used(p.prog)].every(c=>c===tgt||cells.includes(c)||(!live.has(c)&&!keep.includes(c))));
      if(!ok.length) return null; const p=ok[R(ok.length)]; prog.push(...shift(p.prog,prog.length)); for(const c of cells) live.delete(c); return tgt; };
    const t=emit(expr); if(t==null) return null; return {prog:dest==null?prog:[...prog,...P(`WHERE ${t}; GO; TAKE; WHERE ${dest}; GO; PUT`)],cell:t}; }
  const F15='TAKE; TAKE; CALC; TAKE; CALC'; const I=found.I; const chk=makeChecker(gen,300);
  const init=[...(I.cell!=null?P(`WHERE ${I.cell}; GO; TAKE; WHERE ${AC}; GO; PUT`):P(`WHERE ${AC}; GO; ${F15}; PUT`+(I.c===0?'; TAKE; TAKE; CALC; PUT':''))),...P(`WHERE ${CNT}; GO; ${F15}; PUT; TAKE; TAKE; CALC; PUT`)];
  const INC=P(`WHERE ${CNT}; GO; TAKE; TAKE; CALC; TAKE; TAKE; TAKE; CALC; CALC; ADD; PUT; TAKE; TAKE; CALC; PUT`);   // מונה ⇐ לא(לא(מונה) + 15) = מונה + 1
  for(let t=0;t<tries;t++){ const c=compile(found.C.e,null,t>0), s=compile(found.S.e,AC,t>0); if(!c||!s) continue;
    // התחלה · בדיקה: [תנאי ⇒ תא] ; אם ≠0 ⇒ לגוף ; אחרת ⇒ לסוף · גוף: [צעד ⇒ צובר] ; מונה+1 ; חזרה לבדיקה · סוף: (צובר ⇒ תא 2)
    const testAt=init.length; const T=[...c.prog,...P(`WHERE ${c.cell}; GO; TAKE`)]; const bodyAt=testAt+T.length+2+P(F15).length+2;
    const body=[...s.prog,...INC,...P(F15)]; const endAt=bodyAt+body.length+2;
    const prog=[...init,...shift(T,testAt),['WHERE',bodyAt,'code'],['JUMP'],...P(F15),['WHERE',endAt,'code'],['JUMP'],...shift(body,bodyAt),['WHERE',testAt,'code'],['JUMP'],...(found.out==='צובר'?P(`WHERE ${AC}; GO; TAKE; WHERE ${CNT}; GO; PUT`):[])];
    if(chk(prog)) return {prog,found,ms:Date.now()-t0}; }
  return {prog:null,found,ms:Date.now()-t0,why:'נמצא, אבל התוכנית לא עברה'}; }
const S=e=>e.cell!=null?(e.cell===AC?'צובר':'תא'+e.cell):`${e.f}(${S(e.a)}${e.b?', '+S(e.b):''})`;
export const showW=f=>`צובר ⇐ ${f.I.name} · כל עוד ${S(f.C.e)}: צובר ⇐ ${S(f.S.e)} · התשובה: ${f.out}`;
