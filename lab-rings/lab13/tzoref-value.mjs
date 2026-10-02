// «בונה-ערכים»: במקום לחפש פקודות — מחפש צירוף של חלקים לפי מה שהם נותנים (ערכים על הדוגמאות).
// כל ערך חדש שנראה כבר (אותן תוצאות בכל הדוגמאות) — נזרק. כך מגיעים מהר לצירופים של 3–5 חלקים.
// בסוף: הופך את הצירוף לתוכנית (שיבוץ תאים בלי לדרוס ערכים חיים), ובודק אותה בבודק הרגיל.
import { loadShelf, placements, makeChecker } from './tzoref.mjs'; import { partTables } from './tzoref-tables.mjs'; import { dataOf } from './recipes.mjs'; import { keepOf as GM_KEEP_ } from './tzoref-goals.mjs'; const GM_KEEP=n=>GM_KEEP_(n,{}); import { run as runSlow } from './machine3s.mjs';
// טבלה לחלק עם 3 כניסות (16×16×16) — כמו partTables, רק לשלוש
export function tables3(named){ const out=[]; for(const b of named){ const ins=(b.ins||[]).filter(c=>c<8), o=b.out??2; if(ins.length!==3||o>7||/רשימה|ספור|בלי|אמצע|וקטן/.test(b.name)) continue;
  const T=new Uint8Array(4096); let ok=true; for(let x=0;x<4096&&ok;x++){ let v=null; for(let k=0;k<2;k++){ const m=Array.from({length:16},()=>Math.floor(Math.random()*16)); m[ins[0]]=x>>8; m[ins[1]]=(x>>4)&15; m[ins[2]]=x&15; const r=runSlow(b.prog,m,{maxSteps:20000}); if(!r||r.st.length){ ok=false; break; } if(v==null) v=r.mem[o]; else if(v!==r.mem[o]){ ok=false; break; } } T[x]=v??0; }
  if(ok) out.push({name:b.name,k:3,T}); } return out; }
let T3CACHE=null;
export function valueBuild(gen,opts={}){ const {name='',ins=[0,1],out=2,N=96,maxSize=5,maxBank=3000000,ms=60000,tries=60,keep=+process.env.VKEEP||3000,extra=[],ban=[]}=opts; const t0=Date.now();
  const sh=loadShelf(); const blocks=new Map(sh.named.map(b=>[b.name,b]));
  const TB=partTables(sh.named.filter(b=>!b.bad&&b.name!==name)).filter(t=>t.name!=='העתק'); if(!T3CACHE) T3CACHE=tables3(sh.named.filter(b=>!b.bad)); TB.push(...T3CACHE.filter(t=>t.name!==name)); for(let i=TB.length-1;i>=0;i--) if(ban.includes(TB[i].name)) TB.splice(i,1);
  const ex0=[...extra,...Array.from({length:N},()=>gen())]; const ex=ex0; const NN=ex.length; const want=Uint8Array.from(ex.map(e=>e.want&15)); const wkey=Buffer.from(want).toString('latin1');
  const seen=new Map(); const bySize=[]; let found=null, made=0;
  const TGT=new Map(); const add=(vec,expr,s)=>{ const k=Buffer.from(vec).toString('latin1'); if(seen.has(k)) return; if(!found&&TGT.has(k)){ const t=TGT.get(k); found=t.k===1?{f:t.f,k:1,a:expr}:t.side?{f:t.f,k:2,a:expr,b:t.x}:{f:t.f,k:2,a:t.x,b:expr}; } if(seen.size>maxBank){ if(k===wkey) found=expr; return; }   /* מחסן מלא ⇒ רק בודקים, לא שומרים */ seen.set(k,expr); (bySize[s]||(bySize[s]=[])).push({vec,expr}); made++; if(k===wkey) found=expr; };
  bySize[0]=[]; ins.forEach((c,i)=>add(Uint8Array.from(ex.map(e=>e.mem[c]&15)),{cell:c},0));
  const close=v=>{ let eq=0; const joint=new Map(); for(let e=0;e<NN;e++){ if(v[e]===want[e]) eq++; const k=v[e]*16+want[e]; joint.set(k,(joint.get(k)||0)+1); } return eq+0.5*(NN-joint.size); };   // «קרוב»: שווה לתשובה, או קובע אותה
  // «פתרון לאחור»: התשובה = F(x, ?) — לכל x שכבר נבנה, מחשבים מה חייב להיות ה-? (כשיש רק אפשרות אחת) ומחפשים אותו במחסן
  const INV=new Map(); for(const tb of TB){ if(tb.k===2){ const I=new Int16Array(512).fill(-1); for(let x=0;x<16;x++) for(let w=0;w<16;w++){ let y=-1,n=0; for(let c=0;c<16;c++) if(tb.T[x*16+c]===w){ y=c; n++; } I[x*16+w]=n===1?y:-1; const n2=[...Array(16).keys()].filter(c=>tb.T[c*16+x]===w); I[256+x*16+w]=n2.length===1?n2[0]:-1; } INV.set(tb,I); }
    else if(tb.k===1){ const I=new Int16Array(16).fill(-1); for(let w=0;w<16;w++){ const c=[...Array(16).keys()].filter(z=>tb.T[z]===w); I[w]=c.length===1?c[0]:-1; } INV.set(tb,I); } }
  const tryInv=lim=>{ if(found) return; const need=new Uint8Array(NN);
    for(const tb of TB){ const I=INV.get(tb); if(!I) continue;
      if(tb.k===1){ let ok=true; for(let e=0;e<NN;e++){ const y=I[want[e]]; if(y<0){ ok=false; break; } need[e]=y; } if(ok){ const k=Buffer.from(need).toString('latin1'); if(seen.has(k)){ found={f:tb.name,k:1,a:seen.get(k)}; return; } if(!TGT.has(k)) TGT.set(k,{f:tb.name,k:1}); } continue; }
      for(let sa=0;sa<bySize.length;sa++) for(const x of (bySize[sa]||[]).slice(0,lim)) for(const side of [0,1]){ let ok=true; for(let e=0;e<NN;e++){ const y=I[side*256+x.vec[e]*16+want[e]]; if(y<0){ ok=false; break; } need[e]=y; }
        if(!ok) continue; const k=Buffer.from(need).toString('latin1'); if(seen.has(k)){ const y=seen.get(k); found=side?{f:tb.name,k:2,a:y,b:x.expr}:{f:tb.name,k:2,a:x.expr,b:y}; return; } if(TGT.size<400000&&!TGT.has(k)) TGT.set(k,{f:tb.name,k:2,x:x.expr,side}); } } };   /* לא נמצא עכשיו ⇒ «מבוקש»: ייתפס ברגע שייבנה */
  for(let s=1;s<=maxSize&&!found;s++){ tryInv(3000); if(found) break; if(s>=3&&bySize[s-1]&&bySize[s-1].length>keep){ { const isConst=v=>v.every(x=>x===v[0]); const C=bySize[s-1].filter(x=>isConst(x.vec)); bySize[s-1]=[...C,...bySize[s-1].filter(x=>!isConst(x.vec)).map(x=>[close(x.vec),x]).sort((a,b)=>b[0]-a[0]).slice(0,keep).map(x=>x[1])]; } }
    for(const tb of TB){ if(found||Date.now()-t0>ms) break; const F=tb.T;
      if(tb.k===1){ for(const x of bySize[s-1]||[]){ const v=new Uint8Array(NN); for(let e=0;e<NN;e++) v[e]=F[x.vec[e]]; add(v,{f:tb.name,k:1,a:x.expr},s); if(found) break; } }
      else if(tb.k===3){ for(let sa=0;sa<=s-1&&!found;sa++) for(let sb=0;sa+sb<=s-1&&!found;sb++){ const sc=s-1-sa-sb; let A=bySize[sa]||[], B=bySize[sb]||[], C=bySize[sc]||[]; if(A.length*B.length*C.length>2e6){ const top=L=>L.length<=120?L:(L._top||(L._top=L.map(x=>[close(x.vec),x]).sort((a,b)=>b[0]-a[0]).slice(0,120).map(x=>x[1]))); A=top(A); B=top(B); C=top(C); }   /* גדול מדי ⇒ רק המבטיחים */
          for(const x of A){ if(found) break; for(const y of B){ if(found) break; if(x===y) continue; for(const z of C){ if(z===x||z===y) continue; const v=new Uint8Array(NN); for(let e=0;e<NN;e++) v[e]=F[x.vec[e]*256+y.vec[e]*16+z.vec[e]]; add(v,{f:tb.name,k:3,a:x.expr,b:y.expr,c:z.expr},s); if(found) break; } } } } }
      else for(let sa=0;sa<=s-1&&!found;sa++){ const sb=s-1-sa; for(const x of bySize[sa]||[]){ if(found) break; for(const y of bySize[sb]||[]){ if(x===y) continue;
            const v=new Uint8Array(NN); for(let e=0;e<NN;e++) v[e]=F[x.vec[e]*16+y.vec[e]]; add(v,{f:tb.name,k:2,a:x.expr,b:y.expr},s); if(found) break; } if(Date.now()-t0>ms) break; } } } }
  if(!found) tryInv(20000);
  if(!found) return {prog:null,made,ms:Date.now()-t0};
  { const tbl=new Map(TB.map(t=>[t.name,t])); const ev=(e,m)=>e.cell!=null?m[e.cell]&15:(e.k===1?tbl.get(e.f).T[ev(e.a,m)]:e.k===3?tbl.get(e.f).T[ev(e.a,m)*256+ev(e.b,m)*16+ev(e.c,m)]:tbl.get(e.f).T[ev(e.a,m)*16+ev(e.b,m)]);
    const bad=[]; for(let t=0;t<3000&&bad.length<16;t++){ const x=gen(); if(ev(found,x.mem)!==(x.want&15)) bad.push(x); }
    if(bad.length&&(opts.round||0)<6) return valueBuild(gen,{...opts,round:(opts.round||0)+1,extra:[...(opts.extra||[]),...bad]}); }
  const EQ=new Map(); { const byT=new Map(); for(const t of [...partTables(sh.named.filter(b=>!b.bad&&b.name!==name)),...T3CACHE.filter(t=>t.name!==name)]){ const k=t.k+':'+Array.from(t.T).join(','); if(!byT.has(k)) byT.set(k,[]); byT.get(k).push(t.name); } for(const L of byT.values()) for(const n of L) EQ.set(n,L); }
  const chk=makeChecker(gen,300); const size=e=>e.cell!=null?0:1+size(e.a)+(e.b?size(e.b):0)+(e.c?size(e.c):0);
  const usedCells=p=>new Set(p.filter(x=>x[0]==='WHERE'&&!x[2]).map(x=>x[1]).filter(c=>c<8));
  const shift=(p,o)=>p.map(x=>x[2]==='code'&&x[1]>=0?['WHERE',x[1]+o,'code']:x);
  // תוכנית מהצירוף: מחשבים קודם את הענף הגדול; כל תוצאת-ביניים לתא פנוי; חלק לא נוגע בתאים חיים ולא בתאי-הקלט
  const PROTECT=GM_KEEP(name); const SPILLS=[15,14,13,12].filter(c=>!PROTECT.includes(c)&&!ins.includes(c)); let SPILL=false;
  const PS=s=>s.split(';').map(x=>x.trim()).filter(Boolean).map(x=>{ const [o,a]=x.split(' '); return a==null?[o]:[o,+a]; });
  function gen1(rnd){ const prog=[]; const live=new Set(); const R=k=>rnd?Math.floor(Math.random()*k):0;
    const emit=(e,target)=>{ if(e.cell!=null) return e.cell;
      const kids=e.c?[e.a,e.b,e.c]:e.b?[e.a,e.b]:[e.a]; const order=kids.map((k,i)=>i).sort((i,j)=>size(kids[j])-size(kids[i])); const cells=[];
      const spilled={}; let sp=0;
      for(let oi=0;oi<order.length;oi++){ const i=order[oi]; const c=emit(kids[i],null); if(c==null) return null; cells[i]=c; if(!ins.includes(c)) live.add(c);
        // «מגירה»: אם יש עוד ילד לחשב ואין הרבה תאים פנויים — מעבירים את התוצאה זמנית לתא רחוק (15, 14…) ומשחררים
        if(SPILL&&oi<order.length-1&&!ins.includes(c)&&sp<SPILLS.length){ const S=SPILLS[sp++]; prog.push(...PS(`WHERE ${c}; GO; TAKE; WHERE ${S}; GO; PUT`)); live.delete(c); spilled[i]=S; } }
      for(const [i,S] of Object.entries(spilled)){ const fr=[2,4,5,6,7].filter(c=>!live.has(c)&&!ins.includes(c)&&!cells.includes(c)); if(!fr.length) return null; const f=fr[R(fr.length)];
        prog.push(...PS(`WHERE ${S}; GO; TAKE; WHERE ${f}; GO; PUT`)); cells[i]=f; live.add(f); }
      // כל לבנה שעושה בדיוק אותו דבר (אותה טבלה) — גם גרסה «ניידת» של לבנה מוברגת
      const same=(EQ.get(e.f)||[e.f]).map(n=>blocks.get(n)); const free=[2,4,5,6,7].filter(c=>!live.has(c)&&!ins.includes(c));
      const tgt=target??(free.length?free[R(free.length)]:null); if(tgt==null) return null;
      const P=same.flatMap(b=>b.movable===false?[{prog:b.prog,ins:(b.ins||[]).filter(c=>c<8),out:b.out??2}]:placements(b,6000));
      const ok=P.filter(p=>p.out===tgt&&p.ins.join()===cells.join()&&[...usedCells(p.prog)].every(c=>c===tgt||cells.includes(c)||(!live.has(c)&&!ins.includes(c))));
      if(!ok.length) return null; const p=ok[R(ok.length)]; prog.push(...shift(p.prog,prog.length));
      for(const c of cells) live.delete(c); return tgt; };
    return emit(found,out)==null?null:prog; }
  for(let t=0;t<tries;t++){ SPILL=t>=tries/2; const p=gen1(t>0); if(p&&chk(p)) return {prog:p,expr:found,made,ms:Date.now()-t0}; }
  // לא הצלחנו להפוך לתוכנית: חוסמים את החלקים «המוברגים» שבצירוף (אין להם שיבוץ גמיש) ומחפשים צירוף אחר
  const names=[]; const walk=e=>{ if(e.cell!=null) return; names.push(e.f); walk(e.a); if(e.b) walk(e.b); if(e.c) walk(e.c); }; walk(found);
  const stuck=[...new Set(names)].filter(n=>(EQ.get(n)||[n]).every(m=>blocks.get(m)?.movable===false)); const k3=[...new Set(names)].filter(n=>T3CACHE.some(t=>t.name===n)); const ban2=[...new Set([...ban,...(stuck.length?stuck:k3.length?k3:names.slice(0,1))])];   // קודם מוברגים, אחר-כך חלקי-שלושה, ורק בסוף השורש
  if((opts.banRound||0)<4&&Date.now()-t0<ms) return valueBuild(gen,{...opts,ban:ban2,banRound:(opts.banRound||0)+1,ms:ms-(Date.now()-t0)});
  return {prog:null,expr:found,made,ms:Date.now()-t0,why:'נמצא צירוף, אבל לא הצלחתי להפוך אותו לתוכנית'}; }
export const show=e=>e.cell!=null?'תא'+e.cell:`${e.f}(${show(e.a)}${e.b?', '+show(e.b):''}${e.c?', '+show(e.c):''})`;
if(import.meta.url==='file://'+process.argv[1]){ const { goals, goalFor }=await import('./tzoref-goals.mjs'); const G=goals();
  for(const name of process.argv.slice(2)){ const g=G[name]; const r=valueBuild(goalFor(name,{ins:g.ins},G),{name,ins:g.ins||[0,1],out:g.out??2});
    console.log(`${r.prog?'✓':'✗'} ${name}: ${r.expr?show(r.expr):'-'} · ${r.prog?r.prog.length+' פקודות':(r.why||'לא נמצא')} · ${r.made} ערכים · ${(r.ms/1000).toFixed(1)} שנ׳`); } }
