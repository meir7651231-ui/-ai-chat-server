// «שותפים-וצירופים» tupleframes.mjs (KEY=tuples) — three frames over pairs / triples of list elements.
// I write only skeletons + search; every slot (relation, scope, threshold, accumulator, tuple size, comparison, target,
// cap, pair function, summary) is chosen by the machine from the examples, from the shelf, or learned from a table that
// the examples dictate (built by the value builder and stored on the shelf).
//   PF  שותף-מסנן (list2list):  c(x) = #{ y ∈ scope(x) : R(y,x) }  (scope = after / before / others, always the ORIGINAL list)
//       or c(x) = fold of a shelf accumulator over R(y,x);  keep x iff G(c(x)) — G a threshold c≥k / c<k (k learned) or a shelf predicate.
//       R: every relation the shelf gives (pairframes relations(), as a yes/no table, or its complement), or the table read off
//       two-element lists (shelf match, else learned).
//   TC  ספירת-צירופים (list2num): #{ i<j(<k) : P(Σ g) }, k ∈ {2,3}, P ∈ {=,≥,≤,>,<} against T (0..63), capped at 15 or mod 16.
//       learning is a lookup in the per-example histogram of tuple sums.
//   DV  ערכי-זוג שונים (list2num): h({ D(y,x) : y before x }), h ∈ {count, max, min, first missing ≥1}, D a shelf relation
//       (pairframes relations(), or a shelf unary over a basic one).
// Pipeline (as greedyframes / pairframes): JS simulation on the examples ⇒ 600 fresh examples in JS ⇒ machine code ⇒
//   60 on the machine ⇒ makeChecker(gen,300,600000) ⇒ 2000 runs (600k steps).
import fs from 'fs'; import { run } from './machine3s.mjs'; import { makeChecker, finalCheck, movable } from './tzoref.mjs';
import { lib } from './scanfold.mjs'; import { scanTools, dataCells, remap } from './scan-tools.mjs'; import { valueBuild } from './tzoref-value.mjs';
import { relations, accumulators, innerStream, context, emitExpr, shelfMatch2, show } from './pairframes.mjs';
import * as GL from './greedylib.mjs';
const { assemble, T_, P_, MV, SET, GOTO, INC, DEC, JNE, JEQ, SUBW, AT, LOADAT, CONST, walk } = GL;
const LV=[8,9,10,11,12,13,14,15];
const V=v=>({v}); const N_=(f,...a)=>({f,a});
const subst=(e,m)=>e.v!=null?(m[e.v]??e):{f:e.f,a:e.a.map(x=>subst(x,m))};
const sizeOf=e=>e.v!=null?0:1+e.a.reduce((s,x)=>s+sizeOf(x),0);
const same=(a,b)=>a.length===b.length&&a.every((v,i)=>v===b[i]);
function hashArr(a){ let h1=2166136261|0, h2=5381|0; for(let i=0;i<a.length;i++){ const v=a[i]+2; h1=Math.imul(h1^v,16777619); h2=(Math.imul(h2,33)+v)|0; } return (h1>>>0).toString(36)+':'+(h2>>>0).toString(36)+':'+a.length; }
let UID=0;
const CELLS7=[0,2,3,4,5,6,7];
const poolOf=fixed=>CELLS7.filter(c=>!fixed.includes(c));
// expression ⇒ code into `code`; returns the cell holding the result (pairframes emitExpr: tools in place, live cells saved around them)
function emit(e,cellOf,fixed,code){ const pool=poolOf(fixed); return emitExpr(e,v=>{ const c=cellOf[v]; if(c==null) throw new Error('var '+v); return c; },pool,fixed,code,new Set()); }
const SATINC=(N,u)=>[...T_(N),['TAKE'],['CALC'],['J','tsi'+u],...GOTO('tsn'+u),'tsi'+u,...INC(N),'tsn'+u];   // N ⇐ min(15, N+1) · label prefixes must not meet greedylib's ('ne','sb','sh','sn','in','cw','qw' + its own counter)

// ═══ PF: partner filter (list2list) ═════════════════════════════════════════════════════════════
// yes/no relation tables from the shelf: every relation of pairframes relations() read as «≠0», deduplicated on the 56 off-diagonal pairs
let BM=null, BMT=null;
function boolMasks(){ const R=relations(); if(BM&&BMT===R) return BM; const out=[], seen=new Set();
  const keyOf=Rb=>{ let k=''; for(const y of LV) for(const x of LV) if(x!==y) k+=Rb[(y<<4)|x]; return k; };
  for(const r of R){ const Rb=new Uint8Array(256); for(const y of LV) for(const x of LV) Rb[(y<<4)|x]=r.T[(y<<4)|x]!==0?1:0; const k=keyOf(Rb); if(!k.includes('1')||!k.includes('0')) continue;
    if(!seen.has(k)){ seen.add(k); out.push({Rb,e:r.e,neg:false,cost:r.lvl+r.size/10}); }
    const Nb=new Uint8Array(256); for(const y of LV) for(const x of LV) if(x!==y) Nb[(y<<4)|x]=1-Rb[(y<<4)|x]; const kn=keyOf(Nb);
    if(!seen.has(kn)){ seen.add(kn); out.push({Rb:Nb,e:r.e,neg:true,cost:r.lvl+r.size/10+0.05}); } }
  out.sort((a,b)=>a.cost-b.cost); BM=out; BMT=R; return out; }
// keep labels: the output must be a subsequence of the input (values are distinct ⇒ greedy match is exact)
function labelsOf(ex){ const keep=[]; let anyDrop=false, anyKeep=false;
  for(const e of ex){ const k=new Uint8Array(e.l.length); let j=0; for(let i=0;i<e.l.length;i++) if(j<e.w.length&&e.w[j]===e.l[i]){ k[i]=1; j++; } if(j!==e.w.length) return null;
    for(const b of k){ if(b) anyKeep=true; else anyDrop=true; } keep.push(k); }
  return anyDrop&&anyKeep?keep:null; }
// c(x) for a yes/no table; the label must be a function of c ⇒ map c ⇒ keep (−1 unknown), else null
function fitCount(cx,keep,Rb,scope){ const m=new Int8Array(9).fill(-1); const {X,st,n}=cx;
  for(let e=0;e<n;e++){ const b=st[e], z=st[e+1];
    for(let t=b;t<z;t++){ const x=X[t]; let c=0; const j0=scope==='after'?t+1:b, j1=scope==='before'?t:z;
      for(let j=j0;j<j1;j++){ if(j!==t&&Rb[(X[j]<<4)|x]) c++; }
      const k=keep[t]; if(m[c]<0) m[c]=k; else if(m[c]!==k) return null; } }
  return m; }
const bothLabels=m=>{ let a=false,b=false; for(const v of m){ if(v===1) a=true; else if(v===0) b=true; } return a&&b; };
// G from the map: threshold c≥k / c<k (k 1..7; counts only), else the first shelf predicate (one-variable closure) whose «≠0» is the label (or its complement)
function gOf(m,{thr=true}={}){ if(!bothLabels(m)) return null;
  if(thr) for(let k=1;k<=7;k++) for(const pol of [1,0]){ let ok=true; for(let c=0;c<m.length&&ok;c++) if(m[c]>=0&&m[c]!==((c>=k)===!!pol?1:0)) ok=false; if(ok) return {kind:'thr',k,pol,cost:0}; }
  const {UC}=lib(); for(const u of UC){ let okA=true, okB=true; for(let c=0;c<m.length&&(okA||okB);c++){ if(m[c]<0) continue; const v=u.tab[c]; if(v<0){ okA=okB=false; break; } const z=v!==0?1:0; if(z!==m[c]) okA=false; if(z===m[c]) okB=false; }
    if(okA||okB) return {kind:'uc',e:u.e,tab:u.tab,flip:!okA,cost:1+u.size/10}; }
  return null; }
const gKeep=(G,c)=>G.kind==='thr'?((c>=G.k)===!!G.pol):((G.tab[c]!==0)!==G.flip);
function simPF(p,l){ const n=l.length; return l.filter((x,t)=>{ let c; const j0=p.scope==='after'?t+1:0, j1=p.scope==='before'?t:n;
    if(p.atom.kind==='cnt'){ c=0; for(let j=j0;j<j1;j++) if(j!==t&&p.atom.Rb[(l[j]<<4)|x]) c++; }
    else { c=p.atom.init; for(let j=j0;j<j1;j++){ if(j===t) continue; c=p.atom.INt[(c<<4)|p.atom.Rt[(l[j]<<4)|x]]; if(c<0) return false; } }
    return gKeep(p.G,c); }); }
// a learned yes/no partner table as a shelf tool (same name and meaning as pairframes «יחס-זוג»: T(y,x) on the 56 pairs, inputs cells 0,1 ⇒ cell 2).
// The value builder sometimes parks a scratch value in a list cell (8..15); such a tool is only usable inside list frames after its
// scratch cells are moved down (static addresses only), so every built tool is normalised and checked on every pair before it is shelved.
// A same-named shelf entry that fails the check (e.g. shelved before it was checked) is rebuilt and replaced.
const R_=k=>Math.floor(Math.random()*k);
function pairTableOk(prog,dom,f){ for(const [y,x] of dom){ const w=f(y,x); for(let t=0;t<3;t++){ const m=Array.from({length:16},()=>R_(16)); m[0]=y; m[1]=x; const r=run(prog,m,{maxSteps:20000});
      if(!r||r.st.length||r.mem[2]!==w||r.mem[0]!==y||r.mem[1]!==x||LV.some(c=>r.mem[c]!==m[c])) return false; } } return true; }
// usable as the frames use it: called in place (cells remapped, busy cells saved, code relocated) at the PF cell layouts
function frameUsable(tool,dom,f){ for(const [Y,X,fixed] of [[5,4,[3,4,5,6]],[4,3,[3,4,5,6]]]){ const code=[]; let rc; try{ rc=emit(N_(tool,V('y'),V('x')),{y:Y,x:X},fixed,code); }catch{ return false; }
    const prog=assemble([['WHERE',0],['GO'],['WHERE',0],['GO'],...code]);
    for(const [y,x] of dom){ const w=f(y,x); for(let t=0;t<2;t++){ const m=Array.from({length:16},()=>R_(16)); m[Y]=y; m[X]=x; const r=run(prog,m,{maxSteps:60000});
        if(!r||r.st.length||r.mem[rc]!==w||[1,...fixed,...LV].some(c=>c!==rc&&r.mem[c]!==m[c])) return false; } } }
  return true; }
function lowerScratch(prog){ if(prog.some(x=>x[0]==='WHERE@')) return prog; const used=dataCells(prog); const high=used.filter(c=>c>7); if(!high.length) return prog;
  const free=[0,1,2,3,4,5,6,7].filter(c=>!used.includes(c)); if(free.length<high.length) return null; const map={}; high.forEach((c,i)=>{ map[c]=free[i]; }); return remap(prog,map); }
function learnRelTool(name,dom,f,{ms,say}){ const ins=[0,1]; const T0=Date.now(); const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); const old=sh.named.find(x=>x.name===name);
  const asTool=b=>{ const T=new Int8Array(256).fill(-1); for(const [y,x] of dom) T[(y<<4)|x]=f(y,x); return {name:b.name,ins:b.ins,out:2,prog:b.prog,T,k:2}; };
  if(old&&pairTableOk(old.prog,dom,f)&&frameUsable(asTool(old),dom,f)) return asTool(old);
  // the tool's contract inside list frames: answer in cell 2, inputs kept, list cells 8..15 untouched, and callable in place at the frame
  // layouts. The value builder searches against the loose contract (inputs kept, fast); when the expression it finds assembles into a
  // program that breaks the contract (too many cells, values parked in 8..15), each tool of that expression is banned in turn and the
  // search repeats; last, a search against the strict contract.
  const genOf=strict=>()=>{ const mem=Array.from({length:16},()=>R_(16)); const a=dom[R_(dom.length)]; mem[0]=a[0]; mem[1]=a[1]; const w=f(a[0],a[1]); const hi=LV.map(c=>mem[c]); return {mem,want:w,ok:r=>r[2]===w&&r[0]===a[0]&&r[1]===a[1]&&(!strict||LV.every((c,i)=>r[c]===hi[i]))}; };
  const gen=genOf(true); const left=()=>ms-(Date.now()-T0);
  const toolsOf=e=>!e||e.cell!=null?[]:[e.f,...toolsOf(e.a),...toolsOf(e.b),...toolsOf(e.c)];
  const tryBuild=(strict,ban,cap=Infinity)=>{ if(left()<3000) return {}; const v=valueBuild(genOf(strict),{name,ins,out:2,ms:Math.max(3000,Math.min(cap,left())),ban}); if(!v.prog) return {expr:v.expr};
    const prog=lowerScratch(v.prog); const ok=prog&&!finalCheck(prog,gen,4000).bad&&pairTableOk(prog,dom,f)&&frameUsable(asTool({name,ins,prog}),dom,f); return {prog:ok?prog:null,expr:v.expr}; };
  let r=tryBuild(false,[]);
  if(!r.prog&&r.expr){ say(`    «${name}»: the found expression does not fit the frames, searching around its tools`); for(const n of [...new Set(toolsOf(r.expr))]){ const r2=tryBuild(false,[n],15000); if(r2.prog){ r=r2; break; } } }
  if(!r.prog) r=tryBuild(true,[]);
  if(!r.prog){ say(`    the value builder did not build a usable «${name}»`); return null; }
  { const prog=r.prog;
    const b={name,prog,ins,out:2,movable:movable(prog,gen),by:'נלמד: יחס-שותף (שותפים-וצירופים)'};
    const S2=JSON.parse(fs.readFileSync('shelf3.json','utf8')); S2.named=S2.named.filter(x=>x.name!==name); S2.named.push(b); fs.writeFileSync('shelf3.json',JSON.stringify(S2));
    try{ const LG=JSON.parse(fs.readFileSync('tzoref-learned-goals.json','utf8')); LG[name]={ins,dom,tt:dom.map(a=>[a,f(...a)])}; fs.writeFileSync('tzoref-learned-goals.json',JSON.stringify(LG)); }catch{}
    say(`    learned «${name}»: ${prog.length} ops (${((Date.now()-T0)/1000).toFixed(0)}s)${old?' (replaced a broken entry)':''}`); return asTool(b); } }
// two-element lists show R directly: G(0) from one-element lists; [a,b] ⇒ c(a) (y=b) and/or c(b) (y=a) is 0 or 1
function smallLists(gen,M=4000){ const out=[]; for(let t=0;t<M;t++){ const e=gen(); const l=walk(e.mem); if(l.length===0||l.length>2) continue; const w=JSON.parse(e.want); out.push([l,l.map(x=>w.includes(x)?1:0)]); } return out; }
function inferPartner(small,scope){ let g0=-1; const T=new Int8Array(256).fill(-1);
  for(const [l,kp] of small) if(l.length===1){ if(g0>=0&&g0!==kp[0]) return null; g0=kp[0]; }
  if(g0<0) return null;
  const set=(y,x,v)=>{ const k=(y<<4)|x; if(T[k]>=0&&T[k]!==v) return false; T[k]=v; return true; };
  for(const [l,[ka,kb]] of small){ if(l.length!==2) continue; const [a,b]=l;
    if(scope==='after'){ if(kb!==g0||!set(b,a,ka!==g0?1:0)) return null; }
    else if(scope==='before'){ if(ka!==g0||!set(a,b,kb!==g0?1:0)) return null; }
    else if(!set(b,a,ka!==g0?1:0)||!set(a,b,kb!==g0?1:0)) return null; }
  let ones=0, n=0; for(const y of LV) for(const x of LV){ if(x===y) continue; const v=T[(y<<4)|x]; if(v<0) return null; n++; if(v) ones++; }
  if(!ones||ones===n) return null; const Rb=new Uint8Array(256); for(const y of LV) for(const x of LV) if(x!==y) Rb[(y<<4)|x]=T[(y<<4)|x]; return Rb; }
function* pfPlans(ex,{gen,late,say,left}){ const lists=ex.map(e=>e.l); const lab=labelsOf(ex); if(!lab) return; const cx=context(lists); const keep=new Uint8Array(cx.S); { let t=0; for(const k of lab) for(const b of k) keep[t++]=b; }
  const SC=['after','others','before'];
  // A. yes/no relations from the shelf (and their complements), counted
  let nA=0; const t0=Date.now();
  for(const M of boolMasks()){ if(late()) return; for(const scope of SC){ const m=fitCount(cx,keep,M.Rb,scope); if(!m) continue; const G=gOf(m); if(!G) continue; nA++;
      yield {fr:'pf',scope,atom:{kind:'cnt',Rb:M.Rb,e:M.e,neg:M.neg},G,cost:M.cost+G.cost}; } }
  say(`  PF/A: ${nA} consistent (${Date.now()-t0}ms)`);
  // A'. the partner table read off two-element lists ⇒ shelf match, else learned (value builder, stored on the shelf)
  let small=null;
  for(const scope of SC){ if(late()||left()<15000) break; small=small||smallLists(gen); const Rb=inferPartner(small,scope); if(!Rb) continue; const m=fitCount(cx,keep,Rb,scope); if(!m) continue; const G=gOf(m); if(!G) continue;
    const T=new Int8Array(256); for(const y of LV) for(const x of LV) T[(y<<4)|x]=Rb[(y<<4)|x]?15:0;
    const sig=LV.map(y=>LV.filter(x=>x!==y&&T[(y<<4)|x]).map(x=>x-8).join('')).join('.'); say(`  PF: partner table (${scope}) from the examples: ${sig}`);
    const dom=LV.flatMap(y=>LV.filter(x=>x!==y).map(x=>[y,x])); const sm=shelfMatch2(T,dom); let e=null;
    if(sm) e=subst(sm.e,sm.order==='a'?{r:V('y'),s:V('x')}:{r:V('x'),s:V('y')});
    else { const tool=learnRelTool('יחס-זוג: '+sig,dom,(y,x)=>T[(y<<4)|x],{ms:Math.min(90000,left()-8000),say}); if(tool) e=N_(tool,V('y'),V('x')); }
    if(!e) continue; say('  PF: relation '+show(e));
    yield {fr:'pf',scope,atom:{kind:'cnt',Rb,e,neg:false},G,cost:5}; }
  // B. fold of a shelf accumulator over R(y,x) (pairframes atoms) ⇒ shelf predicate on the folded value
  const {agg,last}=accumulators(); const seen=new Set(); let nB=0; const t1=Date.now();
  const sub=[]; for(let i=0;i<ex.length&&sub.length<80;i+=Math.max(1,Math.floor(ex.length/80))) sub.push(i);   // a spread of lengths; the driver re-checks every plan on 600 fresh examples
  const cxB=context(sub.map(i=>lists[i])); const keepB=new Uint8Array(cxB.S); { let t=0; for(const i of sub) for(const b of lab[i]) keepB[t++]=b; }
  for(const lv of [1]){ const RS=relations().filter(r=>r.lvl<=lv);   // basic relations only (keyed relations as yes/no tables are already counted in A; folding them all costs ~0.5s per rejected task)
    for(const R of RS){ if(late()) return; if(!R.useY) continue;
      for(const scope of SC){ const ins=R.bool?agg.filter(a=>a.cnt):[...agg,last];
        for(const IN of ins) for(const init of [0,15]){ const sp=innerStream(cxB,R.T,IN.T,init,scope); if(!sp) continue; const h=hashArr(sp)+scope; if(seen.has(h)) continue; seen.add(h);
          const m=new Int8Array(16).fill(-1); let ok=true; for(let t=0;t<cxB.S;t++){ const c=sp[t]; if(m[c]<0) m[c]=keepB[t]; else if(m[c]!==keepB[t]){ ok=false; break; } } if(!ok) continue;
          const G=gOf(m,{thr:false}); if(!G) continue; nB++;
          yield {fr:'pf',scope,atom:{kind:'fold',R,IN,init,Rt:R.T,INt:IN.T},G,cost:10+lv+R.size/10+G.cost}; } } } }
  say(`  PF/B: ${nB} consistent (${Date.now()-t1}ms)`); }
// machine code. scope 'after': one pass (the tail is still original when x is decided).
// scopes 'before'/'others': pass 1 pushes one keep-flag per element, pass 2 unlinks from the end (wide2frames «מול-הממוצע» idiom).
function atomCode(p,cellOf,fixed,C){ const u=++UID; const code=[];
  if(p.atom.kind==='cnt'){ const r=emit(p.atom.e,cellOf,fixed,code);
    return p.atom.neg?[...code,...T_(r),['J','tak'+u],...INC(C),'tak'+u]:[...code,...T_(r),['J','tah'+u],...GOTO('tak'+u),'tah'+u,...INC(C),'tak'+u]; }
  const r=emit(subst(p.atom.IN.e,{r:V('c'),s:p.atom.R.e}),cellOf,fixed,code); return [...code,...(r!==C?MV(r,C):[])]; }
function decideCode(p,C,fixed,yes,no){ const G=p.G;
  if(G.kind==='thr') return [...T_(C),['SHR'],['SHR'],['SHR'],['J',G.pol?yes:no],...GOTO(G.pol?no:yes)];
  const code=[]; const r=emit(subst(G.e,{a:V('c')}),{c:C},fixed,code); return [...code,...T_(r),['J',G.flip?no:yes],...GOTO(G.flip?yes:no)]; }
const c0Of=p=>p.atom.kind==='fold'?p.atom.init:p.G.kind==='thr'?8-p.G.k:0;
function codePF(p){ const u=++UID, L=s=>'pf'+s+u;
  if(p.scope==='after'){ const Pc=3, X=4, Y=5, C=6; const fixed=[Pc,X,Y,C]; const cellOf={x:X,y:Y,c:C};
    return assemble([...SET(Pc,1),
      L('LOOP'),...LOADAT(Pc,X),...T_(X),['J',L('BODY')],...GOTO(L('END')),
      L('BODY'),...SET(C,c0Of(p)),...LOADAT(X,Y),
      L('IL'),...T_(Y),['J',L('IB')],...GOTO(L('IE')),
      L('IB'),...atomCode(p,cellOf,fixed,C),...LOADAT(Y,Y),...GOTO(L('IL')),
      L('IE'),...decideCode(p,C,fixed,L('KEEP'),L('DROP')),
      L('KEEP'),...MV(X,Pc),...GOTO(L('LOOP')),
      L('DROP'),...T_(X),['WHERE@'],['GO'],['TAKE'],...AT(Pc),['PUT'],...GOTO(L('LOOP')),
      L('END')]); }
  const X=3, Y=4, C=5, K=6, S=7; const fixed=[X,Y,C,K]; const cellOf={x:X,y:Y,c:C};
  const UNL=[...T_(X),['WHERE@'],['GO'],['TAKE'],['WHERE@'],['GO'],['TAKE'],...AT(X),['PUT']];   // mem[X] ⇐ mem[mem[X]]
  return assemble([...SET(K,0),...MV(1,X),
    L('OL'),...T_(X),['J',L('OB')],...GOTO(L('P2')),
    L('OB'),...SET(C,c0Of(p)),...MV(1,Y),
    L('IL'),...T_(Y),['J',L('IB')],...GOTO(L('IE')),
    L('IB'),...JNE(Y,X,S,L('NE')),...GOTO(p.scope==='before'?L('IE'):L('INX')),
    L('NE'),...atomCode(p,cellOf,fixed,C),
    L('INX'),...LOADAT(Y,Y),...GOTO(L('IL')),
    L('IE'),...decideCode(p,C,fixed,L('YES'),L('NO')),
    L('YES'),...CONST[1],...GOTO(L('NX')),
    L('NO'),...CONST[0],
    L('NX'),...INC(K),...LOADAT(X,X),...GOTO(L('OL')),
    L('P2'),...T_(K),['J',L('PB')],...GOTO(L('END')),
    L('PB'),...DEC(K),...SET(X,1),...MV(K,Y),
    L('WL'),...T_(Y),['J',L('WB')],...GOTO(L('WD')),
    L('WB'),...DEC(Y),...LOADAT(X,X),...GOTO(L('WL')),
    L('WD'),['J',L('P2')],...UNL,...GOTO(L('P2')),
    L('END')]); }
const SCN={after:'after x',before:'before x',others:'all others'};
const descG=G=>G.kind==='thr'?(G.pol?`c≥${G.k}`:`c<${G.k}`):`${G.flip?'not ':''}${show(subst(G.e,{a:V('c')}))}`;
const descPF=p=>`partner filter: c(x)=${p.atom.kind==='cnt'?`#{y ${SCN[p.scope]}: ${p.atom.neg?'not ':''}${show(p.atom.e)}}`:`fold_{y ${SCN[p.scope]}} ${show(subst(p.atom.IN.e,{r:V('c'),s:p.atom.R.e}))} from ${p.atom.init}`} · keep iff ${descG(p.G)}`;

// ═══ TC: tuple count (list2num) ═════════════════════════════════════════════════════════════════
// g = x or a shelf unary (defined on 8..15, deduplicated); per example the histogram of tuple sums ⇒ every (P, T, cap) is O(1)
const PREDS=['=','>=','<=','>','<'];
const pHit=(P,s,T)=>P==='='?s===T:P==='>='?s>=T:P==='<='?s<=T:P==='>'?s>T:s<T;
function gOpts(){ const {U}=scanTools(); const out=[{kind:'x',name:'x',f:x=>x,cost:0}]; const seen=new Set([LV.join()]);
  for(const t of U){ const v=LV.map(x=>t.T[x]); if(v.some(z=>z<0)) continue; const k=v.join(); if(seen.has(k)) continue; seen.add(k); out.push({kind:'tool',tool:t,name:t.name,f:x=>t.T[x],cost:1+t.prog.length/500}); }
  return out; }
function tupleSums(vals,k,cb){ const n=vals.length; if(k===2){ for(let i=0;i<n;i++) for(let j=i+1;j<n;j++) cb(vals[i]+vals[j]); } else { for(let i=0;i<n;i++) for(let j=i+1;j<n;j++) for(let q=j+1;q<n;q++) cb(vals[i]+vals[j]+vals[q]); } }
function* tcPlans(ex,{late,say}){ const t0=Date.now(); let nf=0;
  for(const k of [2,3]) for(const g of gOpts()){ if(late()) return;
    // the sums that can occur on the domain (distinct values 8..15): T outside [lo,hi] only makes P constant
    const dv=LV.map(g.f); let lo=99, hi=-1; tupleSums(dv,k,s=>{ if(s<lo) lo=s; if(s>hi) hi=s; });
    const H=ex.map(e=>{ const h=new Int16Array(64); tupleSums(e.l.map(g.f),k,s=>{ h[s]++; }); const cum=new Int16Array(65); for(let s=0;s<64;s++) cum[s+1]=cum[s]+h[s]; return {h,cum}; });
    const cnt=(z,P,T)=>{ const {h,cum}=z; return P==='='?h[T]:P==='>='?cum[64]-cum[T]:P==='<='?cum[T+1]:P==='>'?cum[64]-cum[T+1]:cum[T]; };
    for(const P of PREDS) for(let T=lo;T<=hi;T++){ if(T>63) break;
      // P must split the domain's tuples (otherwise the answer is a function of n alone)
      let a=false,b=false; tupleSums(dv,k,s=>{ if(pHit(P,s,T)) a=true; else b=true; }); if(!a||!b) continue;
      for(const cap of ['sat','mod']){ let ok=true, big=false; for(let i=0;i<ex.length;i++){ const c=cnt(H[i],P,T); if(c>15) big=true; const v=cap==='sat'?Math.min(15,c):c&15; if(v!==ex[i].want){ ok=false; break; } }
        if(!ok) continue; nf++; yield {fr:'tc',k,g,P,T,cap,cost:k+g.cost+PREDS.indexOf(P)/10+T/1000+(cap==='mod'?0.01:0)}; if(!big) break; } } }
  say(`  TC: ${nf} consistent (${Date.now()-t0}ms)`); }
function simTC(p,l){ let c=0; tupleSums(l.map(p.g.f),p.k,s=>{ if(pHit(p.P,s,p.T)) c++; }); return p.cap==='sat'?Math.min(15,c):c&15; }
// residual: (L,H) ⇐ T' then − g(each tuple member) with SUBW (jumps on underflow, nothing changed) ⇒ «=»: residual 0 ; «≤»,«<»: no underflow ; «≥»,«>»: underflow
function codeTC(p){ const u=++UID, Lb=s=>'tc'+s+u; const N=2, I=3, J=4, K=5, L=6, H=7, S=0;
  const Tp=(p.P==='<'||p.P==='>=')?p.T-1:p.T; if(Tp<0) throw new Error('T');
  const pushN=p.g.kind==='tool'&&p.k===3;   // no free cell for g(x) ⇒ the counter is parked on the stack while the tuple is tested
  const G=p.g.kind==='x'?null:(pushN?N:K);
  const live=new Set([I,J,L,H,...(p.k===3?[K]:[]),...(pushN?[]:[N])]);
  const sub=E=>{ if(!G) return SUBW(L,H,E,S,Lb('UN')); const c=GL.callTool(p.g.tool,[E],G,live); if(!c) throw new Error('no room for g'); return [...c,...SUBW(L,H,G,S,Lb('UN'))]; };
  const members=p.k===3?[I,J,K]:[I,J];
  const test=[...(pushN?T_(N):[]),...SET(L,Tp&15),...SET(H,Tp>>4),...members.flatMap(sub),
    ...(p.P==='='?[...T_(L),['J',Lb('NO')],...T_(H),['J',Lb('NO')],...GOTO(Lb('HIT'))]:(p.P==='<='||p.P==='<')?GOTO(Lb('HIT')):GOTO(Lb('NO'))),
    Lb('UN'),...((p.P==='>='||p.P==='>')?GOTO(Lb('HIT')):GOTO(Lb('NO'))),
    Lb('HIT'),...(pushN?P_(N):[]),...(p.cap==='sat'?SATINC(N,u):INC(N)),...GOTO(Lb('NXT')),
    Lb('NO'),...(pushN?P_(N):[]),
    Lb('NXT')];
  const inner=p.k===3?[...LOADAT(J,K),Lb('LK'),...T_(K),['J',Lb('BK')],...GOTO(Lb('NJ')),Lb('BK'),...test,...LOADAT(K,K),...GOTO(Lb('LK'))]
                     :[...test,...GOTO(Lb('NJ'))];
  return assemble([...SET(N,0),...MV(1,I),
    Lb('LI'),...T_(I),['J',Lb('BI')],...GOTO(Lb('END')),
    Lb('BI'),...LOADAT(I,J),
    Lb('LJ'),...T_(J),['J',Lb('BJ')],...GOTO(Lb('NI')),
    Lb('BJ'),...inner,
    Lb('NJ'),...LOADAT(J,J),...GOTO(Lb('LJ')),
    Lb('NI'),...LOADAT(I,I),...GOTO(Lb('LI')),
    Lb('END')]); }
const descTC=p=>`tuple count: #{${p.k===3?'i<j<k':'i<j'}: Σ${p.g.kind==='x'?'x':p.g.name+'(x)'} ${p.P} ${p.T}} ${p.cap==='sat'?'capped at 15':'mod 16'}`;

// ═══ DV: distinct values of a pair function (list2num) ══════════════════════════════════════════
const HS=['count','max','min','mex1'];
function dvCands(){ const R=relations(); const out=R.map(r=>({e:r.e,T:r.T,cost:r.lvl+r.size/10}));
  // a shelf unary over a basic relation (U(B(y,x)))
  const {U}=lib(); for(const r of R){ if(r.lvl>1||!r.useX||!r.useY) continue; for(const f of U){ const T=new Int8Array(256); let ok=true; for(const y of LV) for(const x of LV){ const v=f.T[r.T[(y<<4)|x]]; if(v==null||v<0){ ok=false; break; } T[(y<<4)|x]=v; } if(ok) out.push({e:N_(f,r.e),T,cost:3+r.size/10+0.5}); } }
  return out; }
const popc=m=>{ let c=0; while(m){ m&=m-1; c++; } return c; };
function hOf(h,mask,E){ if(h==='count') return popc(mask); if(!mask) return h==='mex1'?1:E; if(h==='max') return 31-Math.clz32(mask); if(h==='min') return 31-Math.clz32(mask&-mask); let d=1; while(mask>>d&1) d++; return d&15; }
function* dvPlans(ex,{late,say}){ const t0=Date.now(); let nf=0; const seen=new Set();
  // empty pair set (n<2): the answer the examples give (for max/min)
  const ev=new Set(ex.filter(e=>e.l.length<2).map(e=>e.want)); const E=ev.size===1?[...ev][0]:-1;
  for(const D of dvCands()){ if(late()) return; let vmin=15, vmax=0; for(const y of LV) for(const x of LV) if(x!==y){ const v=D.T[(y<<4)|x]; if(v<vmin) vmin=v; if(v>vmax) vmax=v; } if(vmin===vmax) continue;
    const alive=new Set(HS.filter(h=>(h!=='max'&&h!=='min')||E>=0)); const capOk={sat:true,mod:true};
    for(const e of ex){ let m=0; const l=e.l; for(let i=0;i<l.length;i++) for(let j=i+1;j<l.length;j++) m|=1<<D.T[(l[i]<<4)|l[j]];
      for(const h of [...alive]){ const v=hOf(h,m,E); if(h==='count'){ const s=Math.min(15,v), d=v&15; if(s!==e.want) capOk.sat=false; if(d!==e.want) capOk.mod=false; if(!capOk.sat&&!capOk.mod) alive.delete(h); } else if(v!==e.want) alive.delete(h); }
      if(!alive.size) break; }
    for(const h of alive){ const key=h+':'+D.T.join(); if(seen.has(key)) continue; seen.add(key); nf++; yield {fr:'dv',D,h,E,cap:h==='count'?(capOk.mod?'mod':'sat'):null,vmin,vmax,cost:D.cost+HS.indexOf(h)/10}; } }
  say(`  DV: ${nf} consistent (${Date.now()-t0}ms)`); }
function simDV(p,l){ let m=0; for(let i=0;i<l.length;i++) for(let j=i+1;j<l.length;j++) m|=1<<p.D.T[(l[i]<<4)|l[j]]; const v=hOf(p.h,m,p.E); return p.h==='count'?(p.cap==='sat'?Math.min(15,v):v&15):v; }
// no bitset: for each candidate value v, scan the pairs until D(y,x)=v
function codeDV(p){ const u=++UID, Lb=s=>'dv'+s+u; const N=2, Vc=3, I=4, J=5; const fixed=[N,Vc,I,J];
  const up=p.h!=='max'; const vs=p.h==='mex1'?1:up?p.vmin:p.vmax; const ve=p.h==='mex1'?Math.min(15,p.vmax+1):up?p.vmax:p.vmin;
  const code=[]; const r=emit(p.D.e,{y:I,x:J},fixed,code); const fr=poolOf([...fixed,r]); const s1=fr[0], s2=fr[1];
  const found=p.h==='count'?[...(p.cap==='sat'?SATINC(N,u):INC(N)),...GOTO(Lb('NV'))]:p.h==='mex1'?GOTO(Lb('NV')):[...MV(Vc,N),...GOTO(Lb('END'))];
  const notFound=p.h==='mex1'?[...MV(Vc,N),...GOTO(Lb('END'))]:GOTO(Lb('NV'));
  const done=p.h==='count'?[]:p.h==='mex1'?SET(N,(ve+1)&15):SET(N,p.E);
  return assemble([...SET(N,0),...SET(Vc,vs),
    Lb('VL'),...MV(1,I),
    Lb('OL'),...T_(I),['J',Lb('OB')],...GOTO(Lb('NF')),
    Lb('OB'),...LOADAT(I,J),
    Lb('IL'),...T_(J),['J',Lb('IB')],...GOTO(Lb('ON')),
    Lb('IB'),...code,...JEQ(r,Vc,s1,Lb('FD')),...LOADAT(J,J),...GOTO(Lb('IL')),
    Lb('ON'),...LOADAT(I,I),...GOTO(Lb('OL')),
    Lb('FD'),...found,
    Lb('NF'),...notFound,
    Lb('NV'),...SET(s1,ve),...JEQ(Vc,s1,s2,Lb('DONE')),...(up?INC(Vc):DEC(Vc)),...GOTO(Lb('VL')),
    Lb('DONE'),...done,
    Lb('END')]); }
const descDV=p=>`distinct pair values: ${p.h==='count'?'how many':p.h==='mex1'?'first missing ≥1 of':p.h} {${show(p.D.e)} : y before x}${p.h==='max'||p.h==='min'?` (none ⇒ ${p.E})`:''}`;

// ═══ the composer ═══════════════════════════════════════════════════════════════════════════════
const FRAMES=[
  {name:'pf',kinds:['list'],plans:pfPlans,sim:simPF,code:codePF,desc:descPF},
  {name:'tc',kinds:['num'],plans:tcPlans,sim:simTC,code:codeTC,desc:descTC},
  {name:'dv',kinds:['num'],plans:dvPlans,sim:simDV,code:codeDV,desc:descDV},
];
export async function tupleCompose(gen,{N=500,ms=+process.env.TUPMS||150000,say=()=>{},maxTry=+process.env.TUPTRY||24,only=null}={}){ const T0=Date.now(), DEAD=T0+ms; const late=()=>Date.now()>DEAD, left=()=>DEAD-Date.now();
  const raw=Array.from({length:N},()=>gen()); const isList=typeof raw[0].want==='string';
  const prep=e=>({l:walk(e.mem),want:e.want,w:isList?JSON.parse(e.want):null,e});
  const ex=raw.map(prep).sort((a,b)=>b.l.length-a.l.length);   // long lists first: inconsistent plans die fast
  if(isList&&!labelsOf(ex)) return {prog:null,gate:'not a subsequence'};
  if(!isList&&ex.some(e=>typeof e.want!=='number')) return {prog:null};
  const fresh=Array.from({length:600},()=>prep(gen()));
  const outOk=(f,r)=>!!r&&!r.st.length&&f.e.ok(r.mem)&&(isList||[1,...LV].every(c=>r.mem[c]===f.e.mem[c]));
  let chk=null, tried=0, cands=0; const seen=new Set();
  for(const F of FRAMES){ if(late()) break; if(!F.kinds.includes(isList?'list':'num')) continue; if(only&&!only.includes(F.name)) continue;
    for(const p of F.plans(ex,{gen,late,say,left})){ cands++; if(late()||tried>=maxTry) break;   // plans come level by level, the cheapest first within a level
      {
        if(!fresh.every(f=>{ const v=F.sim(p,f.l); return isList?same(v,f.w):v===f.want; })) continue;
        let prog; try{ prog=F.code(p); }catch(err){ say('  code: '+err.message+' · '+F.desc(p)); continue; }
        const key=JSON.stringify(prog); if(seen.has(key)) continue; seen.add(key); tried++;
        const bad=fresh.slice(0,60).filter(f=>!outOk(f,run(prog,f.e.mem,{maxSteps:600000}))).length;
        if(bad){ say(`  ✗ on the machine (${bad}/60): ${F.desc(p)}`); continue; }
        chk=chk||makeChecker(gen,300,600000); if(!chk(prog)){ say('  ✗ checker: '+F.desc(p)); continue; }
        let b2=0; for(let k=0;k<2000&&!b2;k++){ const e=prep(gen()); if(!outOk(e,run(prog,e.e.mem,{maxSteps:600000}))) b2++; }
        if(b2){ say('  ✗ 2000: '+F.desc(p)); continue; }
        return {prog,how:'שותפים-וצירופים: '+F.desc(p),cands,tried,ms:Date.now()-T0}; } } }
  return {prog:null,cands,tried,ms:Date.now()-T0}; }
export const _t={simPF,simTC,simDV,codePF,codeTC,codeDV,pfPlans,tcPlans,dvPlans,labelsOf,inferPartner,boolMasks};
