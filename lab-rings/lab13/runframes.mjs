// «רצפים-וקטעים» runframes.mjs (KEY=runs): runs, spans and adjacent pairs — list2list and list2num.
// I write only skeletons + search. Every hole (the relation R between neighbours, the member set S, the predicate P,
// the score of a pair, which end/which output, the empty/no-match result) is chosen by the machine from the examples:
//   R  — read from the examples (two-element lists show R directly; ~4000 drawn so all 56 ordered pairs appear),
//        confirmed on every example, then matched against the shelf (relations of the scanner library: B(y,x), B(K(y),K(x)), …,
//        either way round or negated); no match ⇒ a 2-input table built by the value builder (shelved only after success).
//   S/P — a subset of 8..15 found by simulation over all 256 subsets; tool = a shelf condition (any one-variable closure of the
//        shelf), else a learned «תנאי: …» (same name and goal as the brain's learnCond).
//   score — a shelf two-input op (either argument order); max/min and first/last tie chosen by simulation.
// Frames:
//   RUN  (binary) maximal runs while R(prev,x) holds.  list2list: first longest run / last longest run / the run starting at l[0].
//                 list2num: longest length / number of runs / length of the first run / of the last run / start of the first (last) longest.
//   RUN  (unary)  runs of members of S.  list2list: first / last longest member run.  list2num: longest / number of runs / start.
//   SPAN          between the first and the last element with P:  output = l.slice(a,b), a ∈ {0, first, first+1, last, last+1},
//                 b ∈ {first, first+1, last, last+1, n}; list2num: b−a (0 if b ≤ a). No match: [] or the whole list / a learned constant.
//   ADJ           the neighbouring pair with the max/min score (ties: first/last). list2list: drop it / keep it / drop its first /
//                 drop its second / swap it. Lists shorter than 2 are returned unchanged.
// Gates (list2list): the output must be a contiguous slice (RUN, SPAN, ADJ keep), or the input minus one contiguous block (ADJ drop),
//   or the input with one neighbouring pair swapped (ADJ swap) — otherwise the stage returns at once.
// Pipeline: simulate in JS on 1000 examples (+4000 for R) ⇒ code ⇒ 60 on the machine ⇒ checker (300, 600000 steps) ⇒ 2000 runs.
import fs from 'fs'; import { run } from './machine3s.mjs'; import { makeChecker, movable } from './tzoref.mjs';
import { valueBuild } from './tzoref-value.mjs'; import { lib } from './scanfold.mjs'; import { relations } from './pairframes.mjs';
import { deepRelocOk, repairJumps } from './jumpfix.mjs';
import * as L from './greedylib.mjs';
const { assemble, T_, P_, MV, SET, GOTO, INC, DEC, JLT, CONST, P15, callTool, walk, uid, AT, LOADAT, STOREAT } = L;
const R_=k=>Math.floor(Math.random()*k); const J=JSON.stringify;
const LV=[8,9,10,11,12,13,14,15];
const same=(a,b)=>a.length===b.length&&a.every((v,i)=>v===b[i]);
const V=v=>({v}), N_=(f,...a)=>({f,a});
const showE=e=>e.v!=null?e.v:`${e.f.name}(${e.a.map(showE).join(', ')})`;
const PAIRS=LV.flatMap(y=>LV.filter(x=>x!==y).map(x=>[y,x]));   // the 56 ordered pairs of distinct list values

// ─── 1. machine-code bricks ─────────────────────────────────────────────────────────────
// expression (shelf tools over variables) ⇒ code; returns the cell holding the result
function emitExpr(e,varCell,pool,code,temps,fixed){ if(e.v!=null) return varCell(e.v);
  const args=e.a.map(a=>emitExpr(a,varCell,pool,code,temps,fixed));
  for(let j=0;j<args.length;j++) if(args.indexOf(args[j])!==j){ const t=pool.shift(); if(t==null) throw new Error('no temp cell'); code.push(...MV(args[j],t)); temps.add(t); args[j]=t; }
  const t=pool.shift(); if(t==null) throw new Error('no temp cell'); const c=callTool(e.f,args,t,new Set([...fixed,...temps])); if(!c) throw new Error('no room for a tool'); code.push(...c);
  for(const a of args) if(temps.has(a)){ temps.delete(a); pool.unshift(a); } temps.add(t); return t; }
// jump to lab when the expression is non-zero (neg: when it is zero). Variables live in vars{name:cell}; every cell of keep is
// saved on the stack around the computation and restored on both branches (the tools may use any other cell).
function predJump(e,vars,keep,lab,neg){ const u=uid(); const vc=Object.values(vars); const save=keep.filter(c=>!vc.includes(c));
  const pool=[0,2,3,4,5,6,7].filter(c=>!vc.includes(c)); const code=[]; const temps=new Set();
  const r=emitExpr(e,v=>{ if(vars[v]==null) throw new Error('variable '+v); return vars[v]; },pool,code,temps,new Set(vc));
  const restore=[...save].reverse().flatMap(c=>P_(c));
  return [...save.flatMap(c=>T_(c)),...code,...T_(r),['J','py'+u],...restore,...GOTO(neg?lab:'pz'+u),'py'+u,...restore,...(neg?[]:GOTO(lab)),'pz'+u]; }
// the list becomes l.slice(a, a+len) (len ≥ 1): Q walks a links from cell 1, Z walks len more; cut after Z; cell 1 ⇐ the node after Q
function sliceCode(A,Lc,Q,Z){ const u=uid(), l=s=>s+'sl'+u;
  return [...SET(Q,1),
    l('a'),...T_(A),['J',l('a1')],...GOTO(l('b')),
    l('a1'),...LOADAT(Q,Q),...DEC(A),...GOTO(l('a')),
    l('b'),...MV(Q,Z),
    l('c'),...T_(Lc),['J',l('c1')],...GOTO(l('d')),
    l('c1'),...LOADAT(Z,Z),...DEC(Lc),...GOTO(l('c')),
    l('d'),...AT(Q),['TAKE'],...CONST[0],...AT(Z),['PUT'],...P_(1)]; }
const ADD1=c=>[...T_(c),...CONST[1],['ADD']];   // pushes c+1

// ─── 2. the frames: JS model + code ─────────────────────────────────────────────────────
// RUN — state per step (binary: c=1 at a break; unary: c=0 outside S)
function simRun(l,p){ const n=l.length; const un=p.unary;
  if(!n) return p.list?[]:p.e;
  let c=0,b=0,bsF=0,bsL=0,k=0,first=null;
  for(let i=0;i<n;i++){
    if(un){ if(p.S[l[i]]){ c++; if(c===1) k++; } else c=0; }
    else if(i===0){ c=1; k=1; }
    else if(p.R[(l[i-1]<<4)|l[i]]) c++; else { if(first===null) first=c; c=1; k++; }
    if(c>b){ b=c; bsF=i-c+1; } if(c>0&&c===b) bsL=i-c+1; }
  if(first===null) first=c;
  switch(p.mode){ case 'longest': return b; case 'runs': return k; case 'firstLen': return first; case 'lastLen': return c; case 'bestF': return bsF; case 'bestL': return bsL;
    case 'sliceF': return l.slice(bsF,bsF+b); case 'sliceL': return l.slice(bsL,bsL+b); case 'first': return l.slice(0,first); }
  return null; }
const RUN_MODES={ list:{bin:['sliceF','sliceL','first'],un:['sliceF','sliceL']}, num:{bin:['longest','runs','firstLen','lastLen','bestF','bestL'],un:['longest','runs','bestF','bestL']} };
const STRICT=new Set(['longest','bestF','sliceF']);
function codeRun(p){ const u=uid(), l=s=>s+'r'+u; const isL=p.list, un=p.unary, m=p.mode;
  const needB=['longest','bestF','bestL','sliceF','sliceL'].includes(m), needI=['bestF','bestL','sliceF','sliceL'].includes(m), needK=m==='runs', needC=un||(m!=='runs'&&m!=='first');
  const outReg={longest:'B',runs:'K',firstLen:'C',lastLen:'C',bestF:'BS',bestL:'BS'}[m];
  const names=['X',...(un?[]:['P']),...(needC?['C']:[]),...(needB?['B']:[]),...(needI?['I','BS']:[]),...(needK?['K']:[])];
  const pool=[3,4,5,6,7,0,2]; const R={}; if(!isL){ R[outReg]=2; pool.splice(pool.indexOf(2),1); }
  for(const n of names) if(R[n]==null) R[n]=pool.shift(); const S=pool.shift(); if(S==null) throw new Error('no scratch cell');
  const keep=names.map(n=>R[n]);
  const test=lab=>un?predJump(p.pred.e,{a:R.X},keep,lab,p.pred.neg):predJump(p.rel.e,{y:R.P,x:R.X},keep,lab,p.rel.neg);
  const strict=STRICT.has(m);
  const upd=()=>{ if(!needB) return []; const v=uid(), up=l('up'+v), no=l('no'+v);
    return [...(strict?[...JLT(R.B,R.C,S,up),...GOTO(no)]:JLT(R.C,R.B,S,no)),up,...MV(R.C,R.B),
      ...(needI?[...T_(R.I),...T_(R.C),...T_(R.C),['CALC'],['ADD'],...CONST[2],['ADD'],...P_(R.BS)]:[]),no]; };   // BS ⇐ I − C + 1
  const out=[...T_(1),['J',l('ne')],...(isL?[]:SET(2,p.e)),...GOTO(l('end')),l('ne'),...MV(1,R.X)];
  if(un){ for(const k of ['C','B','I','BS','K']) if(R[k]!=null) out.push(...SET(R[k],0));
    out.push(l('loop'),...T_(R.X),['J',l('body')],...GOTO(l('fin')),
      l('body'),...test(l('mem')),...SET(R.C,0),...GOTO(l('nx')),
      l('mem'),...INC(R.C),...(needK?[...T_(R.C),...P15,['ADD'],['J',l('nk')],...INC(R.K),l('nk')]:[]),...upd(),
      l('nx'),...LOADAT(R.X,R.X),...(needI?INC(R.I):[]),...GOTO(l('loop'))); }
  else { for(const [k,v] of [['C',1],['B',1],['I',0],['BS',0],['K',1]]) if(R[k]!=null) out.push(...SET(R[k],v));
    out.push(l('loop'),...MV(R.X,R.P),...LOADAT(R.X,R.X),...T_(R.X),['J',l('body')],...GOTO(l('fin')),
      l('body'),...(needI?INC(R.I):[]),...test(l('cont')));
    if(m==='firstLen') out.push(...GOTO(l('fin')));
    else if(m==='first') out.push(...CONST[0],...AT(R.P),['PUT'],...GOTO(l('end')));
    else out.push(...(needC?SET(R.C,1):[]),...(needK?INC(R.K):[]),...(strict?[]:upd()),...GOTO(l('loop')));
    out.push(l('cont'),...(needC?INC(R.C):[]),...upd(),...GOTO(l('loop'))); }
  out.push(l('fin'));
  if(m==='sliceF'||m==='sliceL'){ const Q=R.X, Z=R.P??R.C; out.push(...T_(R.B),['J',l('sl')],...SET(1,0),...GOTO(l('end')),l('sl'),...sliceCode(R.BS,R.B,Q,Z)); }
  out.push(l('end')); return assemble(out); }
const descRun=p=>`${p.unary?`רצף של איברים ב-${p.predName}`:`רצף כל-עוד R(קודם,x) · R=${p.relName}`} ⇒ ${{longest:'האורך הארוך ביותר',runs:'מספר הרצפים',firstLen:'אורך הרצף הראשון',lastLen:'אורך הרצף האחרון',bestF:'תחילת הארוך (הראשון)',bestL:'תחילת הארוך (האחרון)',sliceF:'הארוך ביותר (הראשון)',sliceL:'הארוך ביותר (האחרון)',first:'הרצף מההתחלה'}[p.mode]}${p.list?'':` (ריק ⇒ ${p.e})`}`;

// SPAN — first/last element with P, output l.slice(a,b)
const SRC=['zero','fi','fi1','li','li1','n'];
const srcVal=(k,fi,li,n)=>k==='zero'?0:k==='fi'?fi:k==='fi1'?fi+1:k==='li'?li:k==='li1'?li+1:n;
function simSpan(l,p){ const n=l.length; let fi=-1, li=-1; for(let i=0;i<n;i++) if(p.S[l[i]]){ if(fi<0) fi=i; li=i; }
  if(fi<0) return p.list?(p.none==='all'?[...l]:[]):p.e;
  const a=srcVal(p.a,fi,li,n), b=srcVal(p.b,fi,li,n); return p.list?(b>a?l.slice(a,b):[]):(b>a?b-a:0); }
function codeSpan(p){ const u=uid(), l=s=>s+'s'+u; const isL=p.list; const X=3, I=4, FI=5, LI=6, A=7, Bc=0, S=2;
  const out=[...MV(1,X),...SET(I,0),...SET(FI,15),...SET(LI,0),
    l('loop'),...T_(X),['J',l('body')],...GOTO(l('fin')),
    l('body'),...predJump(p.pred.e,{a:X},[I,FI,LI],l('m'),p.pred.neg),...GOTO(l('nx')),
    l('m'),...ADD1(FI),['J',l('m2')],...MV(I,FI),l('m2'),...MV(I,LI),
    l('nx'),...LOADAT(X,X),...INC(I),...GOTO(l('loop')),
    l('fin'),...ADD1(FI),['J',l('has')],...(isL?(p.none==='empty'?SET(1,0):[]):SET(2,p.e)),...GOTO(l('end')),l('has')];
  const src=(k,c)=>k==='zero'?SET(c,0):k==='n'?MV(I,c):k==='fi'?MV(FI,c):k==='li'?MV(LI,c):k==='fi1'?[...ADD1(FI),...P_(c)]:[...ADD1(LI),...P_(c)];
  out.push(...src(p.a,A),...src(p.b,Bc),...JLT(A,Bc,S,l('pos')),...(isL?SET(1,0):SET(2,0)),...GOTO(l('end')),
    l('pos'),...T_(Bc),...T_(A),...T_(A),['CALC'],['ADD'],...CONST[1],['ADD'],...P_(isL?Bc:2));   // b − a
  if(isL) out.push(...sliceCode(A,Bc,X,FI));
  out.push(l('end')); return assemble(out); }
const SRCN={zero:'0',fi:'ראשון',fi1:'ראשון+1',li:'אחרון',li1:'אחרון+1',n:'n'};
const descSpan=p=>`קטע לפי P=${p.predName}: [${SRCN[p.a]} … ${SRCN[p.b]}) ${p.list?'הקטע':'אורכו'} · אין ⇒ ${p.list?(p.none==='all'?'הכול':'ריק'):p.e}`;

// ADJ — neighbouring pair with the best score
function simAdj(l,p){ const n=l.length; if(n<2) return [...l]; const sc=i=>p.T[p.ord==='ab'?(l[i]<<4)|l[i+1]:(l[i+1]<<4)|l[i]];
  let b=0, bs=sc(0); for(let i=1;i+1<n;i++){ const s=sc(i); if(p.sel==='max'?(p.tie==='first'?s>bs:s>=bs):(p.tie==='first'?s<bs:s<=bs)){ b=i; bs=s; } }
  switch(p.out){ case 'drop': return [...l.slice(0,b),...l.slice(b+2)]; case 'keep': return l.slice(b,b+2); case 'dropA': return [...l.slice(0,b),...l.slice(b+1)];
    case 'dropB': return [...l.slice(0,b+1),...l.slice(b+2)]; case 'swap': return [...l.slice(0,b),l[b+1],l[b],...l.slice(b+2)]; } return null; }
function codeAdj(p){ const u=uid(), l=s=>s+'a'+u; const Q=3, X=4, Y=5, S=6, BS=7, BL=0, SC=2;
  const score=(dst,live)=>{ const c=callTool(p.tool,p.ord==='ab'?[X,Y]:[Y,X],dst,new Set(live)); if(!c) throw new Error('no room for the score'); return c; };
  const better=p.sel==='max'?(p.tie==='first'?[...JLT(BS,S,SC,l('up')),...GOTO(l('loop'))]:[...JLT(S,BS,SC,l('loop'))]):(p.tie==='first'?[...JLT(S,BS,SC,l('up')),...GOTO(l('loop'))]:[...JLT(BS,S,SC,l('loop'))]);
  const out=[...MV(1,X),...T_(X),['J',l('a1')],...GOTO(l('end')),l('a1'),...LOADAT(X,Y),...T_(Y),['J',l('a2')],...GOTO(l('end')),
    l('a2'),...SET(BL,1),...score(BS,[X,Y,BL]),...SET(Q,1),
    l('loop'),...LOADAT(Q,Q),...LOADAT(Q,X),...T_(X),['J',l('l1')],...GOTO(l('done')),
    l('l1'),...LOADAT(X,Y),...T_(Y),['J',l('l2')],...GOTO(l('done')),
    l('l2'),...score(S,[Q,X,Y,BS,BL]),...better,
    l('up'),...MV(S,BS),...MV(Q,BL),...GOTO(l('loop')),
    l('done'),...LOADAT(BL,X),...LOADAT(X,Y),...LOADAT(Y,Q)];   // X,Y = the pair, Q = the node after it
  if(p.out==='drop') out.push(...STOREAT(BL,Q));
  else if(p.out==='dropA') out.push(...STOREAT(BL,Y));
  else if(p.out==='dropB') out.push(...STOREAT(X,Q));
  else if(p.out==='keep') out.push(...CONST[0],...AT(Y),['PUT'],...MV(X,1));
  else out.push(...STOREAT(BL,Y),...STOREAT(Y,X),...STOREAT(X,Q));
  out.push(l('end')); return assemble(out); }
const descAdj=p=>`זוג-שכנים: ${p.sel==='max'?'הגבוה':'הנמוך'} לפי ${p.scoreName}${p.ord==='ba'?' (הבא, x)':''} (שוויון: ${p.tie==='first'?'הראשון':'האחרון'}) ⇒ ${{drop:'בלעדיו',keep:'רק הוא',dropA:'בלי הראשון שבו',dropB:'בלי השני שבו',swap:'מוחלף'}[p.out]}`;

// ─── 3. holes from the shelf, or learned ─────────────────────────────────────────────────
// R table (Uint8 0/1 on the 56 pairs) ⇒ a shelf relation (scanner closures over (y=prev, x)), either way round / negated
//   among equal matches: the cheapest code (total length of the tools in the expression)
const exprCost=e=>e.v!=null?0:e.f.prog.length+e.a.reduce((s,a)=>s+exprCost(a),0);
function shelfRel(R){ let best=null; for(const r of relations()){ for(const neg of [false,true]){ let ok=true; for(const [y,x] of PAIRS){ const v=r.T[(y<<4)|x]; if(v<0||((v!==0)!==neg)!==!!R[(y<<4)|x]){ ok=false; break; } }
      if(ok){ const c=exprCost(r.e)+(neg?1:0); if(!best||c<best.c) best={e:r.e,neg,c,name:showE(r.e)+(neg?' (הפוך)':'')}; } } }
  return best||shelfRelUB(R); }
// closure U(B(y,x)) / U(B(x,y)): B a shelf two-input op, U a one-variable closure of the shelf (e.g. «זוגי?(שונה(y,x))», «חצי(חצי(הפרש מוחלט))»).
//   R must be a function of d = B(..) on the 56 pairs; then U's non-zero pattern on those d values must equal it (or its negation)
const substA=(e,n)=>e.v!=null?(e.v==='a'?n:e):{f:e.f,a:e.a.map(x=>substA(x,n))};
function shelfRelUB(R){ const {B,UC}=lib(); let best=null;
  for(const f of B) for(const ord of ['yx','xy']){ const want=new Int8Array(16).fill(-1); let ok=true;
    for(const [y,x] of PAIRS){ const d=f.T[ord==='yx'?(y<<4)|x:(x<<4)|y]; if(d<0){ ok=false; break; } const r=R[(y<<4)|x]; if(want[d]>=0&&want[d]!==r){ ok=false; break; } want[d]=r; }
    if(!ok) continue; const ds=[...Array(16).keys()].filter(d=>want[d]>=0); if(!ds.some(d=>want[d])||ds.every(d=>want[d])) continue;
    const inner=N_(f,...(ord==='yx'?[V('y'),V('x')]:[V('x'),V('y')]));
    for(const u of UC){ if(u.e.v!=null) continue; if(best&&u.size>best.size) break; for(const neg of [false,true]){ let good=true; for(const d of ds){ const v=u.tab[d]; if(v<0||((v!==0)!==neg)!==!!want[d]){ good=false; break; } }
        if(good){ const e=substA(u.e,inner); const c=exprCost(e)+(neg?1:0); if(!best||u.size<best.size||(u.size===best.size&&c<best.c)) best={e,neg,c,size:u.size,name:showE(e)+(neg?' (הפוך)':'')}; } } } }
  return best; }
// S (0/1 on 8..15) ⇒ a shelf condition (one-variable closures of the shelf), or its negation
function shelfPred(S){ const {UC}=lib(); let best=null; for(const u of UC){ if(u.e.v!=null) continue; if(best&&u.size>best.size) break; for(const neg of [false,true]){ let ok=true; for(const x of LV){ const v=u.tab[x]; if(v<0||((v!==0)!==neg)!==!!S[x]){ ok=false; break; } }
      if(ok){ const c=exprCost(u.e)+(neg?1:0); if(!best||c<best.c) best={e:u.e,neg,c,size:u.size,name:showE(u.e)+(neg?' (הפוך)':'')}; } } } return best; }
const readShelf=()=>JSON.parse(fs.readFileSync('shelf3.json','utf8'));
// a learned tool: if the shelf already has one with this name — it; else the value builder builds it from the table only
function learnTool(name,ins,dom,f,ms,say){ const b=readShelf().named.find(x=>x.name===name); if(b) return {rec:{name:b.name,ins:b.ins,out:b.out??2,prog:b.prog},fresh:false};
  if(ms<5000) return null; const gen=()=>{ const mem=Array.from({length:16},()=>R_(16)); const a=dom[R_(dom.length)]; ins.forEach((c,j)=>{ mem[c]=a[j]; }); const w=f(...a); return {mem,want:w,ok:r=>r[2]===w&&ins.every((c,j)=>r[c]===a[j])}; };
  const t0=Date.now(); say(`    בונה-הערכים לומד «${name.slice(0,60)}»…`); const v=valueBuild(gen,{name,ins,out:2,ms}); if(!v.prog){ say(`    ✗ לא נבנה (${((Date.now()-t0)/1000).toFixed(0)}s)`); return null; }
  return {rec:{name,ins,out:2,prog:v.prog},fresh:true,gen,dom,f}; }
function shelve(learned,by){ if(!learned.length) return; const sh=readShelf(); let LG={}; try{ LG=JSON.parse(fs.readFileSync('tzoref-learned-goals.json','utf8')); }catch{}
  for(const t of learned){ if(!t.fresh||sh.named.some(b=>b.name===t.rec.name)) continue; sh.named.push({name:t.rec.name,prog:t.rec.prog,ins:t.rec.ins,out:2,movable:movable(t.rec.prog,t.gen),by});
    LG[t.rec.name]=t.rec.ins.length===1?{ins:t.rec.ins,tt:Array.from({length:16},(_,v)=>v<8?0:t.f(v))}:{ins:t.rec.ins,dom:t.dom,tt:t.dom.map(a=>[a,t.f(...a)])}; }
  fs.writeFileSync('shelf3.json',JSON.stringify(sh)); fs.writeFileSync('tzoref-learned-goals.json',JSON.stringify(LG)); }
function resolveRel(R,ms,say){ const s=shelfRel(R); if(s) return {hole:s,learned:[]};
  const sig=LV.map(y=>LV.filter(x=>x!==y&&R[(y<<4)|x]).map(x=>x-8).join('')).join('.');
  const t=learnTool('יחס-רצף: '+sig,[0,1],PAIRS,(y,x)=>R[(y<<4)|x]?15:0,ms,say); if(!t) return null;
  return {hole:{e:N_(t.rec,V('y'),V('x')),neg:false,name:'נלמד '+sig},learned:[t]}; }
function resolvePred(S,ms,say){ const s=shelfPred(S); if(s) return {hole:s,learned:[]};
  const name='תנאי: '+LV.filter(v=>S[v]).join(',');   // same name and goal as the brain's learnCond
  const t=learnTool(name,[0],LV.map(v=>[v]),v=>S[v]?15:0,ms,say); if(!t) return null;
  return {hole:{e:N_(t.rec,V('a')),neg:false,name},learned:[t]}; }

// ─── 4. plans from the examples ──────────────────────────────────────────────────────────
const eqOut=(got,x)=>x.w?Array.isArray(got)&&same(got,x.w):(got&15)===x.want;
const fitsAll=(sim,p,exs)=>{ for(const x of exs) if(!eqOut(sim(x.l,p),x)) return false; return true; };
// a constant for the examples where cond holds (they must agree); none ⇒ 0
const edge=(exs,cond)=>{ let e=null; for(const x of exs) if(cond(x.l)){ if(e==null) e=x.want; else if(e!==x.want) return null; } return e??0; };
const maskOf=m=>{ const S=new Uint8Array(16); for(const v of LV) S[v]=(m>>(v-8))&1; return S; };
const isContig=(l,w)=>{ if(!w.length) return true; const a=l.indexOf(w[0]); return a>=0&&same(l.slice(a,a+w.length),w); };
const isMinusBlock=(l,w)=>{ if(w.length>l.length) return false; let i=0; while(i<w.length&&w[i]===l[i]) i++; const k=l.length-w.length; return same(w.slice(i),l.slice(i+k)); };
const isAdjSwap=(l,w)=>{ if(w.length!==l.length) return false; const d=[]; for(let i=0;i<l.length;i++) if(l[i]!==w[i]) d.push(i); return !d.length||(d.length===2&&d[1]===d[0]+1&&l[d[0]]===w[d[1]]&&l[d[1]]===w[d[0]]); };

function* spanPlans(ex,isL){ const combos=[]; for(const a of ['zero','fi','fi1','li','li1']) for(const b of ['fi','fi1','li','li1','n']){ if(a===b||(a==='zero'&&b==='n')) continue; combos.push({a,b}); }
  const cost=c=>(c.a==='fi'&&c.b==='li1'?0:1)+(c.a.length+c.b.length)/10;
  combos.sort((x,y)=>cost(x)-cost(y));
  for(const c of combos) for(let m=1;m<255;m++){ const S=maskOf(m);
    if(isL){ for(const none of ['empty','all']){ const p={fr:'span',list:true,S,mask:m,...c,none}; if(fitsAll(simSpan,p,ex)) yield p; } }
    else { const e=edge(ex,l=>!l.some(x=>S[x])); if(e==null) continue; const p={fr:'span',list:false,S,mask:m,...c,e}; if(fitsAll(simSpan,p,ex)) yield p; } } }
function* runUnaryPlans(ex,isL){ for(const mode of RUN_MODES[isL?'list':'num'].un){ const e=isL?null:edge(ex,l=>!l.length); if(!isL&&e==null) continue;
    for(let m=1;m<255;m++){ const p={fr:'run',unary:true,list:isL,mode,S:maskOf(m),mask:m,e}; if(fitsAll(simRun,p,ex)) yield p; } } }
// R from the examples: a two-element list shows R(a,b) directly whenever the two possible answers differ
function inferRel(exs,mode,isL,e){ const R=new Int8Array(256).fill(-1); const T1=new Uint8Array(256).fill(1), T0=new Uint8Array(256);
  for(const x of exs){ if(x.l.length!==2) continue; const gy=eqOut(simRun(x.l,{mode,list:isL,R:T1,e}),x), gn=eqOut(simRun(x.l,{mode,list:isL,R:T0,e}),x);
    if(!gy&&!gn) return null; if(gy&&gn) continue; const k=(x.l[0]<<4)|x.l[1], v=gy?1:0; if(R[k]>=0&&R[k]!==v) return null; R[k]=v; }
  return R; }
function* runBinaryPlans(ex,more,isL,say){ const all=[...ex,...more()];
  for(const mode of RUN_MODES[isL?'list':'num'].bin){ const e=isL?null:edge(all,l=>!l.length); if(!isL&&e==null) continue;
    const R=inferRel(all,mode,isL,e); if(!R) continue; const unk=PAIRS.filter(([y,x])=>R[(y<<4)|x]<0);
    if(unk.length<=8){ for(let m=0;m<(1<<unk.length);m++){ const T=new Uint8Array(256); for(const [y,x] of PAIRS) T[(y<<4)|x]=R[(y<<4)|x]>0?1:0; unk.forEach(([y,x],j)=>{ T[(y<<4)|x]=(m>>j)&1; });
        if(!PAIRS.some(([y,x])=>T[(y<<4)|x])||PAIRS.every(([y,x])=>T[(y<<4)|x])) continue;   // R always / never holds: not a run frame
        const p={fr:'run',unary:false,list:isL,mode,R:T,e}; if(fitsAll(simRun,p,all)) yield p; } continue; }
    // the answer on two-element lists does not show R (e.g. the start of the longest run): R from the shelf's relations only
    if(unk.length<PAIRS.length) continue;
    if(!all.every(x=>x.l.length>2?x.want<x.l.length:x.want===(x.l.length?0:e))) continue;   // a start index: 0 on short lists, < n always
    for(const r of relations()){ if(!r.bool) continue; for(const neg of [false,true]){ const T=new Uint8Array(256); for(const [y,x] of PAIRS) T[(y<<4)|x]=((r.T[(y<<4)|x]!==0)!==neg)?1:0;
        const p={fr:'run',unary:false,list:isL,mode,R:T,e,lib:{e:r.e,neg,name:showE(r.e)+(neg?' (הפוך)':'')}}; if(fitsAll(simRun,p,all)) yield p; } } } }
function* adjPlans(ex,gate){ const {B}=lib(); const seen=new Set(); const scores=[];
  for(const f of B) for(const ord of ['ab','ba']){ let ok=true; const key=[]; for(const [a,b] of PAIRS){ const v=f.T[ord==='ab'?(a<<4)|b:(b<<4)|a]; if(v<0){ ok=false; break; } key.push(v); } if(!ok) continue; const k=key.join(','); if(seen.has(k)) continue; seen.add(k);
    scores.push({tool:f,T:f.T,ord,scoreName:f.name,cost:f.prog.length}); }
  scores.sort((a,b)=>a.cost-b.cost);
  const outs=[...(gate.minus?['drop','dropA','dropB']:[]),...(gate.contig?['keep']:[]),...(gate.swap?['swap']:[])];
  for(const s of scores) for(const sel of ['max','min']) for(const tie of ['first','last']) for(const out of outs){ const p={fr:'adj',...s,sel,tie,out}; if(fitsAll(simAdj,p,ex)) yield p; } }

// ─── 5. the stage ────────────────────────────────────────────────────────────────────────
export async function runsCompose(gen,{ms=+process.env.RUNSMS||120000,say=()=>{},N=1000,maxTry=12}={}){ const T0=Date.now(), DEAD=T0+ms; const left=()=>DEAD-Date.now();
  const raw=Array.from({length:N},()=>gen()); const isL=typeof raw[0].want==='string';
  const ex=raw.map(e=>{ const l=walk(e.mem); if(isL){ let w; try{ w=JSON.parse(e.want); }catch{ w=null; } return {l,w,e}; } return {l,want:e.want&15,e}; });
  let gate={contig:false,minus:false,swap:false};
  if(isL){ if(!ex.every(x=>Array.isArray(x.w)&&x.w.every(v=>x.l.includes(v)))) return {prog:null,why:'הפלט אינו מאיברי הקלט',ms:Date.now()-T0};
    if(ex.every(x=>same(x.l,x.w))) return {prog:null,why:'אין שינוי',ms:Date.now()-T0};
    gate={contig:ex.every(x=>isContig(x.l,x.w)),minus:ex.every(x=>isMinusBlock(x.l,x.w)),swap:ex.every(x=>isAdjSwap(x.l,x.w))};
    if(!gate.contig&&!gate.minus&&!gate.swap) return {prog:null,why:'הפלט אינו קטע / הקלט פחות קטע / החלפת שכנים',ms:Date.now()-T0}; }
  ex.sort((a,b)=>b.l.length-a.l.length);   // long lists first: wrong plans die fast
  let MORE=null; const more=()=>MORE||(MORE=Array.from({length:4000},()=>{ const e=gen(); const l=walk(e.mem); return isL?{l,w:JSON.parse(e.want)}:{l,want:e.want&15}; }));
  const families=[];
  if(!isL||gate.contig) families.push(['span',()=>spanPlans(ex,isL)]);
  if(isL&&(gate.minus||gate.contig||gate.swap)) families.push(['adj',()=>adjPlans(ex,gate)]);
  if(!isL||gate.contig){ families.push(['run1',()=>runUnaryPlans(ex,isL)]); families.push(['run2',()=>runBinaryPlans(ex,more,isL,say)]); }
  let chk=null, tried=0, cands=0; const seen=new Set();
  const verifyMore=(sim,p)=>fitsAll(sim,p,more());
  for(const [fam,mk] of families){ if(left()<0||tried>=maxTry) break; const t=Date.now(); let nf=0;
    for(const p0 of mk()){ if(left()<0||tried>=maxTry) break; cands++; nf++; let p=p0;
      const sim=p.fr==='span'?simSpan:p.fr==='run'?simRun:simAdj; if(!verifyMore(sim,p)){ say(`  ${fam}: נפל ב-4000 דוגמאות נוספות`); continue; }
      let learned=[];
      try{ if(p.fr==='span'||(p.fr==='run'&&p.unary)){ const z=resolvePred(p.S,Math.min(90000,left()-10000),say); if(!z) continue; p={...p,pred:z.hole,predName:z.hole.name}; learned=z.learned; }
        else if(p.fr==='run'){ const z=p.lib?{hole:p.lib,learned:[]}:resolveRel(p.R,Math.min(90000,left()-10000),say); if(!z) continue; p={...p,rel:z.hole,relName:z.hole.name}; learned=z.learned; } }
      catch(err){ say('  חריץ: '+err.message); continue; }
      const desc=p.fr==='span'?descSpan(p):p.fr==='run'?descRun(p):descAdj(p);
      let prog; try{ prog=p.fr==='span'?codeSpan(p):p.fr==='run'?codeRun(p):codeAdj(p); }catch(err){ say('  קוד: '+err.message+' · '+desc); continue; }
      const key=J(prog); if(seen.has(key)) continue; seen.add(key); tried++;
      const bad=ex.slice(0,60).filter(x=>{ const r=run(prog,x.e.mem,{maxSteps:600000}); return !r||r.st.length||!x.e.ok(r.mem); }).length;
      if(bad){ say(`  ✗ במכונה (${bad}/60): ${desc}`); continue; }
      chk=chk||makeChecker(gen,300,600000); if(!chk(prog)){ say('  ✗ בבודק: '+desc); continue; }
      let b2=0; for(let k=0;k<2000&&!b2;k++){ const e=gen(); const r=run(prog,e.mem,{maxSteps:600000}); if(!r||r.st.length||!e.ok(r.mem)) b2++; }
      if(b2){ say('  ✗ בבדיקה (2000): '+desc); continue; }
      if(!deepRelocOk(prog,gen)){ const f=repairJumps(prog,gen); if(!f||!deepRelocOk(f,gen)||!chk(f)){ say('  ✗ לא נייד: '+desc); continue; } prog=f; }
      shelve(learned,'נלמד: רצפים-וקטעים');
      return {prog,how:'רצפים-וקטעים: '+desc,cands,tried,ms:Date.now()-T0}; }
    say(`רצפים/${fam}: ${nf} מועמדים · ${Date.now()-t}ms`); }
  return {prog:null,cands,tried,ms:Date.now()-T0}; }
export const _runs={simRun,simSpan,simAdj,codeRun,codeSpan,codeAdj,inferRel,shelfRel,shelfPred,resolveRel,resolvePred,shelve};

// CLI: node runframes.mjs <tasks.json[,more.json]> [name|name…] — runs the stage alone, then 20000 strict checks + portability
if((process.argv[1]||'').endsWith('runframes.mjs')){ const { listGen }=await import('./listcomp.mjs'); const { llGen }=await import('./listlist.mjs'); const { finalCheck }=await import('./tzoref.mjs');
  // the brain's strict checks (not imported: brain-all imports this module): list2num — answer in cell 2 AND cell 1, 8..15 unchanged
  const LC=[1,8,9,10,11,12,13,14,15]; const genFor=t=>{ const f=new Function('return ('+t.src+')')(); if(t.kind==='list2list') return llGen(f); const g=listGen(f); return ()=>{ const e=g(); const k=LC.map(c=>e.mem[c]); return {...e,ok:r=>r[2]===e.want&&LC.every((c,i)=>r[c]===k[i])}; }; };
  const file=process.argv[2]; const only=process.argv[3]?new Set(process.argv[3].split('|')):null; const S=[];
  for(const f of file.split(',')){ const j=JSON.parse(fs.readFileSync(f,'utf8')); for(const t of (j.tasks||j)) if((t.kind==='list2list'||t.kind==='list2num')&&(!only||only.has(t.name))) S.push(t); }
  let ok=0; for(const t of S){ const strict=genFor(t); const gen=t.kind==='list2num'?listGen(new Function('return ('+t.src+')')()):strict; const t0=Date.now();
    const r=await runsCompose(gen,{say:process.env.V?console.log:()=>{}}); const sec=(Date.now()-t0)/1000;
    let fc=null, dr=null; if(r.prog){ fc=finalCheck(r.prog,strict,20000).bad; dr=deepRelocOk(r.prog,strict,{n:200}); } const good=!!r.prog&&fc===0&&dr; if(good) ok++;
    console.log(`${good?'✓':'✗'} [${t.kind}] ${t.name}: ${r.prog?`${r.prog.length} פקודות · ${r.how} · בדיקה-קשוחה ${fc}/20000 · נייד ${dr}`:'לא נמצא'+(r.why?' ('+r.why+')':'')} · ${sec.toFixed(1)} שנ׳`); }
  console.log(`סך: ${ok}/${S.length}`); process.exit(0); }
