// «בונה-ערכים»: במקום לחפש פקודות — מחפש צירוף של חלקים לפי מה שהם נותנים (ערכים על הדוגמאות).
// כל ערך חדש שנראה כבר (אותן תוצאות בכל הדוגמאות) — נזרק. כך מגיעים מהר לצירופים של 3–5 חלקים.
// בסוף: הופך את הצירוף לתוכנית (שיבוץ תאים בלי לדרוס ערכים חיים), ובודק אותה בבודק הרגיל.
import { loadShelf, placements, makeChecker } from './tzoref.mjs'; import { partTables } from './tzoref-tables.mjs'; import { dataOf } from './recipes.mjs'; import { run as runSlow } from './machine3s.mjs';
// טבלה לחלק עם 3 כניסות (16×16×16) — כמו partTables, רק לשלוש
function tables3(named){ const out=[]; for(const b of named){ const ins=(b.ins||[]).filter(c=>c<8), o=b.out??2; if(ins.length!==3||o>7||/רשימה|ספור|בלי|אמצע|וקטן/.test(b.name)) continue;
  const T=new Uint8Array(4096); let ok=true; for(let x=0;x<4096&&ok;x++){ let v=null; for(let k=0;k<2;k++){ const m=Array.from({length:16},()=>Math.floor(Math.random()*16)); m[ins[0]]=x>>8; m[ins[1]]=(x>>4)&15; m[ins[2]]=x&15; const r=runSlow(b.prog,m,{maxSteps:20000}); if(!r||r.st.length){ ok=false; break; } if(v==null) v=r.mem[o]; else if(v!==r.mem[o]){ ok=false; break; } } T[x]=v??0; }
  if(ok) out.push({name:b.name,k:3,T}); } return out; }
let T3CACHE=null;
export function valueBuild(gen,opts={}){ const {name='',ins=[0,1],out=2,N=96,maxSize=5,maxBank=3000000,ms=60000,tries=60,keep=+process.env.VKEEP||3000,extra=[],ban=[]}=opts; const t0=Date.now();
  const sh=loadShelf(); const blocks=new Map(sh.named.map(b=>[b.name,b]));
  const TB=partTables(sh.named.filter(b=>!b.bad&&b.name!==name)).filter(t=>t.name!=='העתק'); if(!T3CACHE) T3CACHE=tables3(sh.named.filter(b=>!b.bad)); TB.push(...T3CACHE.filter(t=>t.name!==name)); for(let i=TB.length-1;i>=0;i--) if(ban.includes(TB[i].name)) TB.splice(i,1);
  const ex0=[...extra,...Array.from({length:N},()=>gen())]; const ex=ex0; const NN=ex.length; const want=Uint8Array.from(ex.map(e=>e.want&15)); const wkey=Buffer.from(want).toString('latin1');
  const seen=new Map(); const bySize=[]; let found=null, made=0;
  const add=(vec,expr,s)=>{ const k=Buffer.from(vec).toString('latin1'); if(seen.has(k)) return; seen.set(k,expr); (bySize[s]||(bySize[s]=[])).push({vec,expr}); made++; if(k===wkey) found=expr; };
  bySize[0]=[]; ins.forEach((c,i)=>add(Uint8Array.from(ex.map(e=>e.mem[c]&15)),{cell:c},0));
  const close=v=>{ let eq=0; const joint=new Map(); for(let e=0;e<NN;e++){ if(v[e]===want[e]) eq++; const k=v[e]*16+want[e]; joint.set(k,(joint.get(k)||0)+1); } return eq+0.5*(NN-joint.size); };   // «קרוב»: שווה לתשובה, או קובע אותה
  for(let s=1;s<=maxSize&&!found;s++){ if(s>=3&&bySize[s-1]&&bySize[s-1].length>keep){ bySize[s-1]=bySize[s-1].map(x=>[close(x.vec),x]).sort((a,b)=>b[0]-a[0]).slice(0,keep).map(x=>x[1]); }
    for(const tb of TB){ if(found||seen.size>maxBank||Date.now()-t0>ms) break; const F=tb.T;
      if(tb.k===1){ for(const x of bySize[s-1]||[]){ const v=new Uint8Array(NN); for(let e=0;e<NN;e++) v[e]=F[x.vec[e]]; add(v,{f:tb.name,k:1,a:x.expr},s); if(found) break; } }
      else if(tb.k===3){ for(let sa=0;sa<=s-1&&!found;sa++) for(let sb=0;sa+sb<=s-1&&!found;sb++){ const sc=s-1-sa-sb; const A=bySize[sa]||[], B=bySize[sb]||[], C=bySize[sc]||[]; if(A.length*B.length*C.length>2e6) continue;
          for(const x of A){ if(found) break; for(const y of B){ if(found) break; if(x===y) continue; for(const z of C){ if(z===x||z===y) continue; const v=new Uint8Array(NN); for(let e=0;e<NN;e++) v[e]=F[x.vec[e]*256+y.vec[e]*16+z.vec[e]]; add(v,{f:tb.name,k:3,a:x.expr,b:y.expr,c:z.expr},s); if(found) break; } } } } }
      else for(let sa=0;sa<=s-1&&!found;sa++){ const sb=s-1-sa; for(const x of bySize[sa]||[]){ if(found) break; for(const y of bySize[sb]||[]){ if(x===y) continue;
            const v=new Uint8Array(NN); for(let e=0;e<NN;e++) v[e]=F[x.vec[e]*16+y.vec[e]]; add(v,{f:tb.name,k:2,a:x.expr,b:y.expr},s); if(found) break; } if(seen.size>maxBank||Date.now()-t0>ms) break; } } } }
  if(!found) return {prog:null,made,ms:Date.now()-t0};
  { const tbl=new Map(TB.map(t=>[t.name,t])); const ev=(e,m)=>e.cell!=null?m[e.cell]&15:(e.k===1?tbl.get(e.f).T[ev(e.a,m)]:e.k===3?tbl.get(e.f).T[ev(e.a,m)*256+ev(e.b,m)*16+ev(e.c,m)]:tbl.get(e.f).T[ev(e.a,m)*16+ev(e.b,m)]);
    const bad=[]; for(let t=0;t<3000&&bad.length<16;t++){ const x=gen(); if(ev(found,x.mem)!==(x.want&15)) bad.push(x); }
    if(bad.length&&(opts.round||0)<6) return valueBuild(gen,{...opts,round:(opts.round||0)+1,extra:[...(opts.extra||[]),...bad]}); }
  const EQ=new Map(); { const byT=new Map(); for(const t of [...partTables(sh.named.filter(b=>!b.bad&&b.name!==name)),...T3CACHE.filter(t=>t.name!==name)]){ const k=t.k+':'+Array.from(t.T).join(','); if(!byT.has(k)) byT.set(k,[]); byT.get(k).push(t.name); } for(const L of byT.values()) for(const n of L) EQ.set(n,L); }
  const chk=makeChecker(gen,300); const size=e=>e.cell!=null?0:1+size(e.a)+(e.b?size(e.b):0)+(e.c?size(e.c):0);
  const usedCells=p=>new Set(p.filter(x=>x[0]==='WHERE'&&!x[2]).map(x=>x[1]).filter(c=>c<8));
  const shift=(p,o)=>p.map(x=>x[2]==='code'&&x[1]>=0?['WHERE',x[1]+o,'code']:x);
  // תוכנית מהצירוף: מחשבים קודם את הענף הגדול; כל תוצאת-ביניים לתא פנוי; חלק לא נוגע בתאים חיים ולא בתאי-הקלט
  function gen1(rnd){ const prog=[]; const live=new Set(); const R=k=>rnd?Math.floor(Math.random()*k):0;
    const emit=(e,target)=>{ if(e.cell!=null) return e.cell;
      const kids=e.c?[e.a,e.b,e.c]:e.b?[e.a,e.b]:[e.a]; const order=kids.map((k,i)=>i).sort((i,j)=>size(kids[j])-size(kids[i])); const cells=[];
      for(const i of order){ const c=emit(kids[i],null); if(c==null) return null; cells[i]=c; if(!ins.includes(c)) live.add(c); }
      // כל לבנה שעושה בדיוק אותו דבר (אותה טבלה) — גם גרסה «ניידת» של לבנה מוברגת
      const same=(EQ.get(e.f)||[e.f]).map(n=>blocks.get(n)); const free=[2,4,5,6,7].filter(c=>!live.has(c)&&!ins.includes(c));
      const tgt=target??(free.length?free[R(free.length)]:null); if(tgt==null) return null;
      const P=same.flatMap(b=>b.movable===false?[{prog:b.prog,ins:(b.ins||[]).filter(c=>c<8),out:b.out??2}]:placements(b,6000));
      const ok=P.filter(p=>p.out===tgt&&p.ins.join()===cells.join()&&[...usedCells(p.prog)].every(c=>c===tgt||cells.includes(c)||(!live.has(c)&&!ins.includes(c))));
      if(!ok.length) return null; const p=ok[R(ok.length)]; prog.push(...shift(p.prog,prog.length));
      for(const c of cells) live.delete(c); return tgt; };
    return emit(found,out)==null?null:prog; }
  for(let t=0;t<tries;t++){ const p=gen1(t>0); if(p&&chk(p)) return {prog:p,expr:found,made,ms:Date.now()-t0}; }
  // לא הצלחנו להפוך לתוכנית: חוסמים את החלקים «המוברגים» שבצירוף (אין להם שיבוץ גמיש) ומחפשים צירוף אחר
  const names=[]; const walk=e=>{ if(e.cell!=null) return; names.push(e.f); walk(e.a); if(e.b) walk(e.b); if(e.c) walk(e.c); }; walk(found);
  const stuck=[...new Set(names)].filter(n=>(EQ.get(n)||[n]).every(m=>blocks.get(m)?.movable===false)); const k3=[...new Set(names)].filter(n=>T3CACHE.some(t=>t.name===n)); const ban2=[...new Set([...ban,...(stuck.length?stuck:k3.length?k3:names.slice(0,1))])];   // קודם מוברגים, אחר-כך חלקי-שלושה, ורק בסוף השורש
  if((opts.banRound||0)<4&&Date.now()-t0<ms) return valueBuild(gen,{...opts,ban:ban2,banRound:(opts.banRound||0)+1,ms:ms-(Date.now()-t0)});
  return {prog:null,expr:found,made,ms:Date.now()-t0,why:'נמצא צירוף, אבל לא הצלחתי להפוך אותו לתוכנית'}; }
export const show=e=>e.cell!=null?'תא'+e.cell:`${e.f}(${show(e.a)}${e.b?', '+show(e.b):''}${e.c?', '+show(e.c):''})`;
if(import.meta.url==='file://'+process.argv[1]){ const { goals, goalFor }=await import('./tzoref-goals.mjs'); const G=goals();
  for(const name of process.argv.slice(2)){ const g=G[name]; const r=valueBuild(goalFor(name,{ins:g.ins},G),{name,ins:g.ins||[0,1],out:g.out??2});
    console.log(`${r.prog?'✓':'✗'} ${name}: ${r.expr?show(r.expr):'-'} · ${r.prog?r.prog.length+' פקודות':(r.why||'לא נמצא')} · ${r.made} ערכים · ${(r.ms/1000).toFixed(1)} שנ׳`); } }
