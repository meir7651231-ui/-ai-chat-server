// «להתחיל מהדומה ביותר במדף»: אם התשובה של המשימה החדשה היא «חישוב קטן» על התשובה של לבנה שכבר במדף —
// לוקחים את הגרסה המלוטשת של הלבנה (כמו שהיא) ומוסיפים בסוף את החישוב הקטן. כך נהנים מכל שעות הליטוש שכבר נעשו.
import { loadShelf, placements, makeChecker } from './tzoref.mjs'; import { partTables } from './tzoref-tables.mjs'; import { encode, runCode, MEM } from './machine3f.mjs'; import { keepOf } from './tzoref-goals.mjs';
const P=s=>s.split(';').map(x=>x.trim()).filter(Boolean).map(x=>{ const [o,a]=x.split(' '); return a==null?[o]:[o,+a]; });
const shift=(p,o)=>p.map(x=>x[2]==='code'&&x[1]>=0?['WHERE',x[1]+o,'code']:x);
export function nearBuild(gen,{name='',N=64,tries=40}={}){ const t0=Date.now(); const sh=loadShelf(); const blocks=new Map(sh.named.map(b=>[b.name,b]));
  const TB=partTables(sh.named.filter(b=>!b.bad&&b.name!==name)).filter(t=>t.name!=='העתק'); const ex=Array.from({length:N},()=>gen()), V=Array.from({length:1000},()=>gen());
  if(ex.some(e=>e.want==null)) return {prog:null,why:'משימה בלי תשובה-במספר'};
  const KEEP=keepOf(name,{}); const out=b=>b.out??2;
  // פונקציות של משתנה אחד (16 ערכים) מצירופי-חלקים — עד 3 חלקים
  // חישובים-שאחרי: צירופי חלקים על «התשובה» — כל שכבה מצטרפת רק לשכבות הפשוטות (לא «כולם עם כולם»), עד 6,000 בשכבה
  const U=[{v:[...Array(16).keys()],e:{cell:2},s:0}], seen=new Set([U[0].v.join()]); const lev=[[U[0]]];
  for(let s=1;s<=3;s++){ const L=[]; const push=(v,e)=>{ const k=v.join(); if(seen.has(k)||L.length>6000) return; seen.add(k); const u={v,e,s}; L.push(u); U.push(u); };
    for(const tb of TB){ const F=tb.T;
      if(tb.k===1){ for(const a of lev[s-1]) push(a.v.map(x=>F[x]),{f:tb.name,k:1,a:a.e}); }
      else for(const a of lev[s-1]) for(const b of [...lev[0],...(lev[1]||[]).slice(0,300)]){ if(a===b) continue; push(a.v.map((x,i)=>F[x*16+b.v[i]]),{f:tb.name,k:2,a:a.e,b:b.e}); push(a.v.map((x,i)=>F[b.v[i]*16+x]),{f:tb.name,k:2,a:b.e,b:a.e}); } }
    lev.push(L); }
  const cands=[];
  for(const b of sh.named){ if(b.bad||b.name===name||out(b)!==2) continue; const code=encode(b.prog); const res=e=>{ const r=runCode(code,0,0,e.mem,20000,0); return r===1?MEM[2]:null; };
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
  // ── שתי לבנות ──
  const outs=[]; for(const b of sh.named){ if(b.bad||b.name===name||out(b)!==2) continue; const code=encode(b.prog); const f=e=>{ const r=runCode(code,0,0,e.mem,20000,0); return r===1?MEM[2]:null; };
    const r=ex.map(f); if(r.some(x=>x==null)||new Set(r).size<2) continue; outs.push({b,r,f}); }
  const pairs=[]; if(!cands.length) for(const tb of TB){ if(tb.k!==2) continue; const F=tb.T;
    for(const A of outs) for(const B of outs){ if(A===B) continue; let ok=true; for(let i=0;i<ex.length&&ok;i++) if(F[A.r[i]*16+B.r[i]]!==(ex[i].want&15)) ok=false; if(!ok) continue;
      if(V.slice(0,300).every(e=>{ const a=A.f(e), b=B.f(e); return a!=null&&b!=null&&F[a*16+b]===(e.want&15); })) pairs.push({A:A.b,B:B.b,comb:tb.name}); if(pairs.length>40) break; } if(pairs.length>40) break; }
  const prot=[...new Set([...KEEP,0,1,2,3])];
  for(const pr of pairs){ const usedB=used(pr.B.prog); const save=[4,5,6,7,15,14,13,12].find(c=>!usedB.has(c)&&!prot.includes(c)&&!KEEP.includes(c)); if(save==null) continue;
    const bb=blocks.get(pr.comb); const C=(EQ.get(pr.comb)||[pr.comb]).map(n=>blocks.get(n)).flatMap(b=>b.movable===false?[]:placements(b,6000)).filter(p=>p.ins.join()===[save,2].join()&&p.out!==2&&!KEEP.includes(p.out)&&[...used(p.prog)].every(c=>c===p.out||c===save||c===2||!KEEP.includes(c)));
    for(const p of C){ const prog=[...pr.A.prog,...P(`WHERE 2; GO; TAKE; WHERE ${save}; GO; PUT`)]; const p2=[...prog,...shift(pr.B.prog,prog.length)]; const p3=[...p2,...shift(p.prog,p2.length),...P(`WHERE ${p.out}; GO; TAKE; WHERE 2; GO; PUT`)];
      if(chk(p3)){ cands.push({two:true,prog:p3,from:pr.A.name+' + '+pr.B.name,post:{f:pr.comb,k:2,a:{cell:2},b:{cell:2}}}); break; } } if(cands.some(c=>c.two)) break; }
  let best=null; for(const c of cands) if(c.two&&(!best||c.prog.length<best.prog.length)) best={prog:c.prog,from:c.from,post:c.post};
  for(const c of cands.filter(c=>!c.two)) for(let t=0;t<tries;t++){ const q=postCode(c.post,t>0); if(!q) continue; const prog=[...c.b.prog,...shift(q,c.b.prog.length)]; if(chk(prog)){ if(!best||prog.length<best.prog.length) best={prog,from:c.b.name,post:c.post}; break; } }
  return best?{...best,cands:cands.length,ms:Date.now()-t0}:{prog:null,cands:cands.length,ms:Date.now()-t0}; }
const S=e=>e.cell!=null?'התשובה':`${e.f}(${S(e.a)}${e.b?', '+S(e.b):''})`; export const showN=r=>`«${r.from}» מהמדף, ואחריו: ${S(r.post)}`;
