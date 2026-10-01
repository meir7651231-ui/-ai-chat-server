// «להתחיל מהדומה ביותר במדף»: אם התשובה של המשימה החדשה היא «חישוב קטן» על התשובה של לבנה שכבר במדף —
// לוקחים את הגרסה המלוטשת של הלבנה (כמו שהיא) ומוסיפים בסוף את החישוב הקטן. כך נהנים מכל שעות הליטוש שכבר נעשו.
import { loadShelf, placements, makeChecker } from './tzoref.mjs'; import { partTables } from './tzoref-tables.mjs'; import { run } from './machine3s.mjs'; import { keepOf } from './tzoref-goals.mjs';
const P=s=>s.split(';').map(x=>x.trim()).filter(Boolean).map(x=>{ const [o,a]=x.split(' '); return a==null?[o]:[o,+a]; });
const shift=(p,o)=>p.map(x=>x[2]==='code'&&x[1]>=0?['WHERE',x[1]+o,'code']:x);
export function nearBuild(gen,{name='',N=64,tries=40}={}){ const t0=Date.now(); const sh=loadShelf(); const blocks=new Map(sh.named.map(b=>[b.name,b]));
  const TB=partTables(sh.named.filter(b=>!b.bad&&b.name!==name)).filter(t=>t.name!=='העתק'); const ex=Array.from({length:N},()=>gen()), V=Array.from({length:1000},()=>gen());
  if(ex.some(e=>e.want==null)) return {prog:null,why:'משימה בלי תשובה-במספר'};
  const KEEP=keepOf(name,{}); const out=b=>b.out??2;
  // פונקציות של משתנה אחד (16 ערכים) מצירופי-חלקים — עד 3 חלקים
  const U=[{v:[...Array(16).keys()],e:{cell:2}}], seen=new Set([U[0].v.join()]);
  for(let s=1;s<=3;s++){ const cur=U.slice(); for(const tb of TB){ const F=tb.T; if(tb.k===1){ for(const a of cur){ const v=a.v.map(x=>F[x]); const k=v.join(); if(!seen.has(k)){ seen.add(k); U.push({v,e:{f:tb.name,k:1,a:a.e}}); } } }
      else for(const a of cur) for(const b of cur){ if(a===b) continue; const v=a.v.map((x,i)=>F[x*16+b.v[i]]); const k=v.join(); if(!seen.has(k)){ seen.add(k); U.push({v,e:{f:tb.name,k:2,a:a.e,b:b.e}}); } } } if(U.length>20000) break; }
  const cands=[];
  for(const b of sh.named){ if(b.bad||b.name===name||out(b)!==2) continue; const res=e=>{ const r=run(b.prog,e.mem,{maxSteps:20000}); return r&&!r.st.length?r.mem[2]:null; };
    const r=ex.map(res); if(r.some(x=>x==null)) continue; const M=new Map(); let ok=true; ex.forEach((e,i)=>{ const w=e.want&15; if(M.has(r[i])&&M.get(r[i])!==w) ok=false; M.set(r[i],w); }); if(!ok) continue;
    for(const u of U){ let good=true; for(const [k,w] of M) if(u.v[k]!==w){ good=false; break; } if(!good) continue;
      if(V.every(e=>{ const x=res(e); return x!=null&&u.v[x]===(e.want&15); })){ cands.push({b,post:u.e}); if(cands.filter(c=>c.b===b).length>=12) break; } } }   // כמה חישובים אפשריים (חלק לא ניתנים לחיבור, כמו «התשובה + התשובה»)
  // לכל מועמד: תוכנית = הלבנה מהמדף + החישוב-שאחרי (תא 2 ⇒ תא-עזר ⇒ תא 2). בוחרים את הקצרה שעוברת.
  const used=p=>new Set(p.filter(x=>x[0]==='WHERE'&&!x[2]).map(x=>x[1]).filter(c=>c<8)); const chk=makeChecker(gen,300); const size=e=>e.cell!=null?0:1+size(e.a)+(e.b?size(e.b):0);
  const EQ=new Map(); { const byT=new Map(); for(const t of TB){ const k=t.k+':'+t.T.join(','); if(!byT.has(k)) byT.set(k,[]); byT.get(k).push(t.name); } for(const L of byT.values()) for(const n of L) EQ.set(n,L); }
  const keep=[...new Set([...KEEP,2])]; const SCR=[3,4,5,6,7].filter(c=>!keep.includes(c));
  function postCode(expr,rnd){ if(expr.cell!=null) return []; const prog=[], live=new Set(); const R=k=>rnd?Math.floor(Math.random()*k):0;
    const emit=e=>{ if(e.cell!=null) return e.cell; const kids=e.b?[e.a,e.b]:[e.a]; const order=kids.map((k,i)=>i).sort((i,j)=>size(kids[j])-size(kids[i])); const cells=[];
      for(const i of order){ const c=emit(kids[i]); if(c==null) return null; cells[i]=c; if(!keep.includes(c)) live.add(c); }
      const free=SCR.filter(c=>!live.has(c)); if(!free.length) return null; const tgt=free[R(free.length)];
      const C=(EQ.get(e.f)||[e.f]).map(n=>blocks.get(n)).flatMap(b=>b.movable===false?[{prog:b.prog,ins:(b.ins||[]).filter(c=>c<8),out:b.out??2}]:placements(b,6000));
      const ok=C.filter(p=>p.out===tgt&&p.ins.join()===cells.join()&&[...used(p.prog)].every(c=>c===tgt||cells.includes(c)||(!live.has(c)&&!keep.includes(c))));
      if(!ok.length) return null; const p=ok[R(ok.length)]; prog.push(...shift(p.prog,prog.length)); for(const c of cells) live.delete(c); return tgt; };
    const t=emit(expr); return t==null?null:[...prog,...P(`WHERE ${t}; GO; TAKE; WHERE 2; GO; PUT`)]; }
  let best=null;
  for(const c of cands) for(let t=0;t<tries;t++){ const q=postCode(c.post,t>0); if(!q) continue; const prog=[...c.b.prog,...shift(q,c.b.prog.length)]; if(chk(prog)){ if(!best||prog.length<best.prog.length) best={prog,from:c.b.name,post:c.post}; break; } }
  return best?{...best,cands:cands.length,ms:Date.now()-t0}:{prog:null,cands:cands.length,ms:Date.now()-t0}; }
const S=e=>e.cell!=null?'התשובה':`${e.f}(${S(e.a)}${e.b?', '+S(e.b):''})`; export const showN=r=>`«${r.from}» מהמדף, ואחריו: ${S(r.post)}`;
