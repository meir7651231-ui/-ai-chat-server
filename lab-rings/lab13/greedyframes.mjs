// «חמדני» greedyframes.mjs (KEY=greedy): greedy / budget / small-DP frames. I write only skeletons + search;
// every slot (budget K, order, comparison direction, pass limit, offset c, output mode, shelf tool) is chosen by the machine
// from the examples: each frame is simulated in JS over all its slot values on ~1000 examples, only consistent plans are
// assembled into machine code and checked on the machine (60 ⇒ checker 300 ⇒ 2000).
import { run } from './machine3s.mjs'; import { makeChecker } from './tzoref.mjs';
import * as L from './greedylib.mjs';
const { assemble, T_, P_, MV, SET, GOTO, INC, DEC, JNE, JEQ, JLT, ADDW, SUBW, INC2, JLTW, JEQW, ANDK, AT, LOADAT, STOREAT, CONST, P15, callTool, walk } = L;
const J=JSON.stringify; const same=(a,b)=>a.length===b.length&&a.every((v,i)=>v===b[i]);
const VALS=[8,9,10,11,12,13,14,15];

// ════ F5. bubble passes with a swap budget (list2list) ═══════════════════════════════════════════
// slots: K (0..15 swaps), passes (1 / until no swap), dir (swap when a>b / a<b)
function simBubble(l,p){ const r=[...l]; let k=p.K; for(;;){ let sw=false; for(let i=0;i+1<r.length;i++){ if(k===0) return r; if(p.dir==='asc'?r[i]>r[i+1]:r[i]<r[i+1]){ [r[i],r[i+1]]=[r[i+1],r[i]]; k--; sw=true; } } if(p.passes===1||!sw) return r; } }
function plansBubble(ex){ const out=[]; for(const dir of ['asc','desc']) for(const passes of [1,0]) for(let K=0;K<=15;K++){
    if(ex.every(e=>same(simBubble(e.l,{K,passes,dir}),e.w))) out.push({frame:'bubble',K,passes,dir,cost:1+(passes?0:0.1)+K/100}); }
  // a frame that never changes anything explains nothing
  return out.filter(p=>ex.some(e=>!same(e.l,e.w))); }
function codeBubble(p){ const K=4,Q=3,A=5,B=6,S=7,F=0;
  return assemble([...SET(K,p.K),
    'PASS',...SET(Q,1),...SET(F,0),
    'IN',...LOADAT(Q,A),...T_(A),['J','I1'],...GOTO('ENDP'),
    'I1',...T_(A),['WHERE@'],['GO'],['TAKE'],...P_(B),...T_(B),['J','I2'],...GOTO('ENDP'),
    'I2',...T_(K),['J','I3'],...GOTO('END'),
    'I3',...(p.dir==='asc'?JLT(B,A,S,'SWAP'):JLT(A,B,S,'SWAP')),...MV(A,Q),...GOTO('IN'),
    'SWAP',...STOREAT(Q,B),...T_(B),['WHERE@'],['GO'],['TAKE'],...T_(A),['WHERE@'],['GO'],['PUT'],...T_(A),...T_(B),['WHERE@'],['GO'],['PUT'],
      ...DEC(K),...SET(F,1),...MV(B,Q),...GOTO('IN'),
    'ENDP',...(p.passes===1?[]:[...T_(F),['J','PASS']]),
    'END']); }
const descBubble=p=>`מעברי-בועה ${p.passes===1?'(מעבר אחד)':'(עד שאין החלפה)'} · תקציב ${p.K} החלפות · ${p.dir==='asc'?'מחליף כש-א>ב':'מחליף כש-א<ב'}`;

// ════ F1. selection in a learned VALUE order (ascending / descending over the list's values) ═══════════════
// each item, in that order, either «fits» or not:  budget: g(x) ≤ B (B ⇐ B − g(x), B starts at K, two cells)
//                                                    pos+/pos−: its position is after/before the last fitting one
// on a miss: skip (go on) / stop (all later ones miss).  list2list: keep the fitting (or the missing) ones in the ORIGINAL order.
// list2num: how many fit / how many missed / remaining budget (low, high nibble).
function simOrder(l,p){ const n=l.length; const order=[...l].sort((a,b)=>p.order==='asc'?a-b:b-a); const pos=new Map(l.map((x,i)=>[x,i+1]));
  let B=p.K, last=p.cond==='pos+'?0:15, stopped=false; const fit=new Set(); let nf=0, nm=0;
  for(const x of order){ let ok=false; if(!stopped){ if(p.cond==='budget'){ const v=p.g.f(x); if(B>=v){ B-=v; ok=true; } } else { const q=pos.get(x); if(p.cond==='pos+'?q>last:q<last){ last=q; ok=true; } } }
    if(ok){ fit.add(x); nf++; } else { nm++; if(p.mode==='stop') stopped=true; } }
  return {fit,nf,nm,B}; }
function gOpts(U){ const out=[{kind:'x',name:'x',f:x=>x,cost:0}]; const seen=new Set([VALS.join()]);
  for(const t of U){ const k=VALS.map(x=>t.T[x]); if(k.some(v=>v<0)) continue; const s=k.join(); if(seen.has(s)) continue; seen.add(s); out.push({kind:'tool',tool:t,name:t.name,f:x=>t.T[x],cost:1+t.prog.length/500}); }
  return out; }
function plansOrder(ex,ctx){ const out=[]; const isList=ctx.isList; const G=isList?gOpts(ctx.U):[{kind:'x',name:'x',f:x=>x,cost:0}];
  const conds=[]; for(const order of ['asc','desc']) for(const mode of ['skip','stop']){ conds.push({cond:'pos+',order,mode,g:G[0],K:0}); conds.push({cond:'pos-',order,mode,g:G[0],K:0});
    for(const g of G){ const mx=Math.min(255,8*Math.max(...VALS.map(g.f))); for(let K=0;K<=mx;K++) conds.push({cond:'budget',order,mode,g,K}); } }
  const outs=isList?['fit','miss']:['nf','nm','blo','bhi'];
  for(const c of conds){ if(c.cond!=='budget'&&!isList&&c.mode==='skip'&&false) continue;
    for(const o of outs){ if(c.cond!=='budget'&&(o==='blo'||o==='bhi')) continue; let ok=true, anyMiss=false, anyFit=false;
      for(const e of ex){ const r=simOrder(e.l,c); if(r.nm) anyMiss=true; if(r.nf) anyFit=true;
        if(isList){ const want=e.l.filter(x=>o==='fit'?r.fit.has(x):!r.fit.has(x)); if(!same(want,e.w)){ ok=false; break; } }
        else { const v=o==='nf'?r.nf:o==='nm'?r.nm:o==='blo'?r.B&15:(r.B>>4)&15; if(v!==e.want){ ok=false; break; } } }
      if(ok&&anyMiss&&anyFit) out.push({frame:'order',...c,out:o,cost:2+c.g.cost+(c.mode==='stop'?0.1:0)+(c.cond==='budget'?c.K/1000:0.5)}); } }
  return out; }
// cells: V value · Q walker (holds a link-cell address) · X = mem[link] · S scratch · BL,BH budget / Pc,La positions · C g(x) · N out (2)
function codeOrder(p){ const isList=p.out==='fit'||p.out==='miss'; const V=3,Q=4,X=0,S=7; const BL=5,BH=6, Pc=5,La=6; const C=isList?2:null, N=2;
  const budget=p.cond==='budget'; const parts=[];
  if(budget) parts.push(...SET(BL,p.K&15),...SET(BH,p.K>>4)); else parts.push(...SET(La,p.cond==='pos+'?0:15));
  if(!isList) parts.push(...SET(N,0));
  parts.push(...SET(V,p.order==='asc'?8:15));
  // find V: Q ⇐ predecessor link cell, Pc ⇐ position (1-based)
  const find=(tag,notfound)=>[...SET(Q,1),...(budget?[]:SET(Pc,0)),
    'F'+tag,...LOADAT(Q,X),...T_(X),['J','F1'+tag],...GOTO(notfound),
    'F1'+tag,...(budget?[]:INC(Pc)),...JEQ(X,V,S,'FD'+tag),...MV(X,Q),...GOTO('F'+tag),'FD'+tag];
  const nextV=(loop)=>p.order==='asc'?[...INC(V),...T_(V),['J',loop]]:[...DEC(V),...T_(V),['SHR'],['SHR'],['SHR'],['J',loop]];
  const unlink=[...T_(V),['WHERE@'],['GO'],['TAKE'],...AT(Q),['PUT']];   // mem[link] ⇐ mem[V]
  const onFit=isList?(p.out==='fit'?[]:unlink):(p.out==='nf'?INC(N):[]);
  const onMiss=isList?(p.out==='fit'?unlink:[]):(p.out==='nm'?INC(N):[]);
  let test;
  if(budget){ const gc=p.g.kind==='x'?null:callTool(p.g.tool,[V],C,new Set([V,Q,BL,BH])); if(p.g.kind!=='x'&&!gc) throw new Error('אין מקום ל-g');
    test=[...(gc||[]),...SUBW(BL,BH,p.g.kind==='x'?V:C,S,'MISS')]; }
  else test=[...(p.cond==='pos+'?JLT(La,Pc,S,'OKP'):JLT(Pc,La,S,'OKP')),...GOTO('MISS'),'OKP',...MV(Pc,La)];
  parts.push('VL',...find('a','NX'),...test,...onFit,...GOTO('NX'),
    'MISS',...onMiss,...(p.mode==='stop'?GOTO('NXS'):[]),
    'NX',...nextV('VL'),...GOTO('END'));
  if(p.mode==='stop') parts.push('NXS',...nextV('VS'),...GOTO('END'),
    'VS',...find('b','NXS'),...onMiss,...GOTO('NXS'));
  parts.push('END');
  if(budget&&!isList&&(p.out==='blo'||p.out==='bhi')) parts.push(...MV(p.out==='blo'?BL:BH,2));
  return assemble(parts); }
const descOrder=p=>`בחירה לפי סדר ${p.order==='asc'?'עולה':'יורד'} · ${p.cond==='budget'?`תקציב ${p.K} · g=${p.g.name}`:p.cond==='pos+'?'המקום אחרי הקודם':'המקום לפני הקודם'} · ${p.mode==='stop'?'עצור בפספוס':'דלג על פספוס'} ⇒ ${{fit:'הנבחרים בסדר המקורי',miss:'שלא נבחרו',nf:'כמה נבחרו',nm:'כמה לא נבחרו',blo:'נשאר (נמוך)',bhi:'נשאר (גבוה)'}[p.out]}`;

// ════ F2. greedy from both ends (list2list, output in PICK order) ══════════════════════════════════
// slots: rule (take the smaller end / the larger end; equal = the same item), budget K (two cells): stop when it does not fit.
function simEnds(l,p){ let i=0, j=l.length-1, B=p.K; const r=[]; while(i<=j){ const left=p.rule==='min'?l[i]<=l[j]:l[i]>=l[j]; const x=left?l[i]:l[j]; if(B<x) break; B-=x; r.push(x); if(left) i++; else j--; } return r; }
function plansEnds(ex){ const out=[]; for(const rule of ['min','max']) for(let K=0;K<=128;K++){ let ok=true, cut=false, moved=false;
    for(const e of ex){ const r=simEnds(e.l,{rule,K}); if(!same(r,e.w)){ ok=false; break; } if(r.length<e.l.length) cut=true; if(r.length>1&&!same(r,e.l.slice(0,r.length))) moved=true; }
    if(ok&&cut&&moved) out.push({frame:'ends',rule,K,cost:3+K/1000}); }
  return out; }
function codeEnds(p){ const Lc=3,Rc=4,OT=5,BL=6,BH=7,S=0;
  const append=c=>[...T_(c),...T_(OT),['WHERE@'],['GO'],['PUT'],...MV(c,OT)];   // mem[tail] ⇐ c ; tail ⇐ c
  return assemble([...T_(1),...P_(Lc),...T_(Lc),['J','NE'],...GOTO('END'),
    'NE',...MV(Lc,Rc),'RW',...T_(Rc),['WHERE@'],['GO'],['TAKE'],...P_(S),...T_(S),['J','RW1'],...GOTO('RD'),'RW1',...MV(S,Rc),...GOTO('RW'),
    'RD',...SET(OT,1),...SET(BL,p.K&15),...SET(BH,p.K>>4),
    'LOOP',...(p.rule==='min'?JLT(Rc,Lc,S,'RIGHT'):JLT(Lc,Rc,S,'RIGHT')),
    'LEFT',...SUBW(BL,BH,Lc,S,'STOP'),...append(Lc),...JEQ(Lc,Rc,S,'STOP'),...T_(Lc),['WHERE@'],['GO'],['TAKE'],...P_(Lc),...GOTO('LOOP'),
    'RIGHT',...SUBW(BL,BH,Rc,S,'STOP'),...append(Rc),
      ...T_(BL),...T_(BH),...MV(Lc,BL),'PW',...T_(BL),['WHERE@'],['GO'],['TAKE'],...P_(BH),...JEQ(BH,Rc,S,'PF'),...MV(BH,BL),...GOTO('PW'),
      'PF',...MV(BL,Rc),...P_(BH),...P_(BL),...GOTO('LOOP'),
    'STOP',...CONST[0],...T_(OT),['WHERE@'],['GO'],['PUT'],
    'END']); }
const descEnds=p=>`מהקצוות: ${p.rule==='min'?'הקצה הקטן':'הקצה הגדול'} · תקציב ${p.K} · עצור כשלא נכנס ⇒ בסדר הלקיחה`;

// ════ F3. two bins (two workers / two teams) ═════════════════════════════════════════════════
// items in a learned order (the list's / ascending / descending values) go to bin A or bin B; state D = 128 + ΣA − ΣB (two cells).
// route slot: by balance (A when A≤B / A<B) or by a learned position pattern of period m (2..4).
// list2list (list order): keep bin A's items / bin B's.  list2num: |ΣA−ΣB| (low nibble) / how many in A.
function simBins(l,p){ const items=p.order==='list'?l:[...l].sort((a,b)=>p.order==='asc'?a-b:b-a); let D=0; const A=new Set();
  items.forEach((x,i)=>{ const toA=p.route==='le'?D<=0:p.route==='lt'?D<0:((p.bits>>(i%p.m))&1)===1; if(toA){ D+=x; A.add(x); } else D-=x; });
  return {D,A}; }
function plansBins(ex,ctx){ const out=[]; const routes=[{route:'le'},{route:'lt'}]; for(let m=2;m<=4;m++) for(let bits=1;bits<(1<<m)-1;bits++){ if(m===4&&(bits===5||bits===10)) continue; if(m===4&&(bits&3)===((bits>>2)&3)) continue; routes.push({route:'pat',m,bits}); }
  const orders=ctx.isList?['list']:['list','asc','desc']; const outs=ctx.isList?['A','B']:['abs','nA'];
  for(const order of orders) for(const r of routes) for(const o of outs){ const p={frame:'bins',order,...r,out:o}; let ok=true;
    for(const e of ex){ const z=simBins(e.l,p); if(ctx.isList){ const want=e.l.filter(x=>o==='A'?z.A.has(x):!z.A.has(x)); if(!same(want,e.w)){ ok=false; break; } }
      else { const v=o==='abs'?Math.abs(z.D)&15:z.A.size&15; if(v!==e.want){ ok=false; break; } } }
    if(ok) out.push({...p,cost:3+(order==='list'?0:0.2)+(r.route==='pat'?0.3+r.m/10:0)}); }
  return out; }
function codeBins(p){ const isList=p.out==='A'||p.out==='B'; const DL=5,DH=6,S=7; const parts=[...SET(DL,0),...SET(DH,8)];
  // route on the item in cell x ⇒ jump to 'TA' or fall to 'TB'
  const R=p.order==='list'?(isList?0:4):2;
  const route=()=>{ if(p.route==='pat') return [...ANDK(R,1),['J','RT1'],...T_(R),['SHR'],...P_(R),...GOTO('TB'),'RT1',...T_(R),['SHR'],...CONST[1<<(p.m-1)],['ADD'],...P_(R),...GOTO('TA')];
    return [...T_(DH),['SHR'],['SHR'],['SHR'],['J','RHI'],...GOTO('TA'),'RHI',...(p.route==='lt'?[]:[...T_(DL),['J','TB'],...ANDK(DH,7),['J','TB'],...GOTO('TA')]),...GOTO('TB')]; };
  if(p.route==='pat') parts.push(...SET(R,p.bits));
  if(isList){ const Q=3,X=4; parts.push(...SET(Q,1),
      'LOOP',...LOADAT(Q,X),...T_(X),['J','L1'],...GOTO('END'),'L1',...route(),
      'TA',...ADDW(DL,DH,X,S),...(p.out==='A'?MV(X,Q):[...T_(X),['WHERE@'],['GO'],['TAKE'],...AT(Q),['PUT']]),...GOTO('LOOP'),
      'TB',...SUBW(DL,DH,X,S,'END'),...(p.out==='B'?MV(X,Q):[...T_(X),['WHERE@'],['GO'],['TAKE'],...AT(Q),['PUT']]),...GOTO('LOOP'),'END');
    return assemble(parts); }
  const N=p.out==='nA'?(p.order==='list'?2:null):null; if(p.out==='nA'&&p.order!=='list') throw new Error('nA רק בסדר הרשימה');
  if(N!=null) parts.push(...SET(N,0));
  if(p.order==='list'){ const Wc=3; parts.push(...T_(1),...P_(Wc),
      'LOOP',...T_(Wc),['J','L1'],...GOTO('END'),'L1',...route(),
      'TA',...ADDW(DL,DH,Wc,S),...(N!=null?INC(N):[]),...GOTO('NX'),
      'TB',...SUBW(DL,DH,Wc,S,'END'),
      'NX',...T_(Wc),['WHERE@'],['GO'],['TAKE'],...P_(Wc),...GOTO('LOOP'),'END'); }
  else { const V=3,Q=4,X=0; parts.push(...SET(V,p.order==='asc'?8:15),
      'VL',...SET(Q,1),'F',...LOADAT(Q,X),...T_(X),['J','F1'],...GOTO('NX'),'F1',...JEQ(X,V,S,'FD'),...MV(X,Q),...GOTO('F'),
      'FD',...route(),
      'TA',...ADDW(DL,DH,V,S),...GOTO('NX'),
      'TB',...SUBW(DL,DH,V,S,'END'),
      'NX',...(p.order==='asc'?[...INC(V),...T_(V),['J','VL']]:[...DEC(V),...T_(V),['SHR'],['SHR'],['SHR'],['J','VL']]),'END'); }
  if(p.out==='abs'){ const u=L.uid(); parts.push(...T_(DH),['SHR'],['SHR'],['SHR'],['J','AP'+u],...T_(DL),...T_(DL),['CALC'],...CONST[1],['ADD'],...P_(2),...GOTO('AE'+u),'AP'+u,...MV(DL,2),'AE'+u); }
  return assemble(parts); }
const descBins=p=>`שני סלים · סדר ${{list:'הרשימה',asc:'עולה',desc:'יורד'}[p.order]} · ${p.route==='le'?'לסל א כשא≤ב':p.route==='lt'?'לסל א כשא<ב':`תבנית ${p.bits.toString(2).padStart(p.m,'0').split('').reverse().join('')} (מחזור ${p.m})`} ⇒ ${{A:'פריטי סל א',B:'פריטי סל ב',abs:'|א−ב|',nA:'כמה בסל א'}[p.out]}`;

// ════ F4. exact search over all subsets (position masks 0 .. 2^n−1, n ≤ 8) ════════════════════════════
// every mask gets a score V (two cells) or is infeasible; the FIRST mask with the smallest V wins.
//   budget K: V = K − Σ_in x (infeasible if it would go below 0)          — best fill not above K
//   balance:  V = 128 + Σ_out x − Σ_in x (feasible if V ≥ 128)            — closest split with the chosen side not larger
//   chain±:   members must rise (fall) along the list; V = 15 − #members  — longest monotone subsequence
// list2list: the winning mask's items (or the others) in original order.  list2num: per kind — V low/high nibble, «V = 128?» flag, #members.
function scoreMask(l,m,p){ const n=l.length; if(p.kind==='budget'){ let V=p.K; for(let i=0;i<n;i++) if(m>>i&1){ V-=l[i]; if(V<0) return null; } return V; }
  if(p.kind==='balance'){ let V=128; for(let i=0;i<n;i++) V+=(m>>i&1)?-l[i]:l[i]; return V>=128?V:null; }
  let last=p.kind==='chain+'?0:16, c=0; for(let i=0;i<n;i++) if(m>>i&1){ if(p.kind==='chain+'?l[i]>last:l[i]<last){ last=l[i]; c++; } else return null; } return 15-c; }
function simSubset(l,p){ let best=255, bm=0; for(let m=0;m<(1<<l.length);m++){ const V=scoreMask(l,m,p); if(V!=null&&V<best){ best=V; bm=m; } } return {best,bm}; }
function plansSubset(ex,ctx){ const out=[]; const kinds=[{kind:'balance'},{kind:'chain+'},{kind:'chain-'}]; for(let K=1;K<=200;K++) kinds.push({kind:'budget',K});
  const outs=ctx.isList?['in','out']:['flag','vlo','vhi','cnt'];
  const cache=new Map();   // per example per kind
  for(const k of kinds){ if(Date.now()>ctx.DEAD) break; for(const o of outs){ if(o==='cnt'&&!k.kind.startsWith('chain')) continue; if(o==='flag'&&k.kind!=='balance') continue;
      let ok=true, fl=new Map(), nontriv=false;
      for(const e of ex){ const z=simSubset(e.l,k);
        if(ctx.isList){ const w=e.l.filter((x,i)=>((z.bm>>i)&1)===(o==='in'?1:0)); if(!same(w,e.w)){ ok=false; break; } if(z.bm&&z.bm!==(1<<e.l.length)-1) nontriv=true; }
        else if(o==='flag'){ const f=z.best===128?1:0; if(fl.has(f)&&fl.get(f)!==e.want){ ok=false; break; } fl.set(f,e.want); }
        else { const v=o==='vlo'?z.best&15:o==='vhi'?z.best>>4:(15-z.best)&15; if(v!==e.want){ ok=false; break; } nontriv=true; } }
      if(o==='flag'){ nontriv=fl.size===2; if(ok&&nontriv) out.push({frame:'subset',...k,out:o,a:fl.get(1),b:fl.get(0),cost:5}); continue; }
      if(ok&&nontriv) out.push({frame:'subset',...k,out:o,cost:5+(k.K||0)/1000}); } }
  return out; }
function codeSubset(p){ const mL=3,mH=4,VL=5,VH=6,Wc=0,S=7,T=2; const chain=p.kind.startsWith('chain'); const Lv=T; const parts=[];
  const cellBit=i=>[i<4?mL:mH,1<<(i%4)];
  const initV=()=>p.kind==='budget'?[...SET(VL,p.K&15),...SET(VH,p.K>>4)]:p.kind==='balance'?[...SET(VL,0),...SET(VH,8)]:[...SET(VL,15),...SET(VH,0),...SET(Lv,0)];
  // one pass over all masks; at each feasible mask: evalCode (best on the stack: …, bestL, bestH)
  const pass=(tag,evalCode)=>{ const q=[...SET(mL,0),...SET(mH,0),'M'+tag,...initV(),...T_(1),...P_(Wc)];
    for(let i=0;i<8;i++){ const [c,b]=cellBit(i);
      q.push('P'+tag+i,...T_(Wc),['J','Q'+tag+i],...GOTO('X'+tag+i),'Q'+tag+i,...ANDK(c,b),['J','IN'+tag+i]);
      if(p.kind==='balance') q.push(...ADDW(VL,VH,Wc,S),...GOTO('N'+tag+i));
      else q.push(...GOTO('N'+tag+i));
      q.push('IN'+tag+i);
      if(p.kind==='budget') q.push(...SUBW(VL,VH,Wc,S,'NM'+tag));
      else if(p.kind==='balance') q.push(...SUBW(VL,VH,Wc,S,'NM'+tag));
      else q.push(...(p.kind==='chain+'?JLT(Lv,Wc,S,'CH'+tag+i):[...T_(Lv),['J','CC'+tag+i],...GOTO('CH'+tag+i),'CC'+tag+i,...JLT(Wc,Lv,S,'CH'+tag+i)]),...GOTO('NM'+tag),'CH'+tag+i,...MV(Wc,Lv),...DEC(VL));
      q.push('N'+tag+i,...T_(Wc),['WHERE@'],['GO'],['TAKE'],...P_(Wc)); }
    q.push(...GOTO('X'+tag+8));
    for(let i=0;i<=8;i++){ q.push('X'+tag+i); if(i<4) q.push(...ANDK(mL,15&~((1<<i)-1)),['J','FIN'+tag],...T_(mH),['J','FIN'+tag]); else if(i<8) q.push(...ANDK(mH,15&~((1<<(i-4))-1)),['J','FIN'+tag]); q.push(...GOTO('EV'+tag)); }
    q.push('EV'+tag,...(p.kind==='balance'?[...T_(VH),['SHR'],['SHR'],['SHR'],['J','EO'+tag],...GOTO('NM'+tag),'EO'+tag]:[]),...evalCode,
      'NM'+tag,...INC2(mL,mH),...T_(mL),['J','M'+tag],...T_(mH),['J','M'+tag],'FIN'+tag); return q; };
  // pass 1: keep the smallest V on the stack (pop into Wc,T; push back the smaller)
  parts.push(...SET(VL,15),...T_(VL),...T_(VL),
    ...pass('a',[...P_(Wc),...P_(T),...JLTW(VL,VH,T,Wc,S,'BT'),...T_(T),...T_(Wc),...GOTO('NMa'),'BT',...T_(VL),...T_(VH)]));
  if(p.out==='in'||p.out==='out'){   // pass 2: first mask whose V equals the best ⇒ filter the list by it
    parts.push(...pass('b',[...P_(Wc),...P_(T),...JEQW(VL,VH,T,Wc,S,'FOUND'),...T_(T),...T_(Wc),...GOTO('NMb')]),
      'FOUND'); const Q=VL, X=VH;
    parts.push(...SET(Q,1)); for(let i=0;i<8;i++){ const [c,b]=cellBit(i); parts.push(...LOADAT(Q,X),...T_(X),['J','G'+i],...GOTO('END'),'G'+i,...ANDK(c,b),['J','K'+i]);
      if(p.out==='in') parts.push(...T_(X),['WHERE@'],['GO'],['TAKE'],...AT(Q),['PUT'],...GOTO('D'+i),'K'+i,...MV(X,Q),'D'+i);
      else parts.push(...MV(X,Q),...GOTO('D'+i),'K'+i,...T_(X),['WHERE@'],['GO'],['TAKE'],...AT(Q),['PUT'],'D'+i); }
    parts.push('END'); return assemble(parts); }
  parts.push(...P_(VH),...P_(VL));
  if(p.out==='flag'){ parts.push(...ANDK(VH,7),['J','F0'],...T_(VL),['J','F0'],...SET(2,p.a),...GOTO('FE'),'F0',...SET(2,p.b),'FE'); }
  else if(p.out==='vlo') parts.push(...MV(VL,2)); else if(p.out==='vhi') parts.push(...MV(VH,2));
  else parts.push(...T_(VL),...T_(VL),['CALC'],...P_(2));
  return assemble(parts); }
const descSubset=p=>`חיפוש מלא על תת-קבוצות · ${p.kind==='budget'?`תקציב ${p.K} (המילוי הקרוב ביותר)`:p.kind==='balance'?'איזון: הצד שנבחר לא גדול מהשני':p.kind==='chain+'?'הנבחרים עולים לאורך הרשימה':'הנבחרים יורדים לאורך הרשימה'} ⇒ ${{in:'הנבחרים',out:'שלא נבחרו',flag:`איזון מדויק? ${p.a}:${p.b}`,vlo:'שארית (נמוך)',vhi:'שארית (גבוה)',cnt:'כמה נבחרו'}[p.out]}`;

// ════ F7. best contiguous slice (all slices i..j, n ≤ 8) ═════════════════════════════════════════
// slice score Σ g(x), g = x − c or c − x (c learned 0..15); the FIRST slice (by start, then end) with the largest total > 0 wins.
// list2list: that slice (empty if no slice is positive).  list2num: the best total (low nibble).
function simSlice(l,p){ let b=0, bi=0, bj=0; for(let i=0;i<l.length;i++){ let s=0; for(let j=i;j<l.length;j++){ s+=p.sg>0?l[j]-p.c:p.c-l[j]; if(s>b){ b=s; bi=i; bj=j+1; } } } return {b,bi,bj}; }
function plansSlice(ex,ctx){ const out=[]; for(const sg of [1,-1]) for(let c=0;c<=15;c++) for(const o of ctx.isList?['slice']:['best']){ let ok=true, part=false;
      for(const e of ex){ const z=simSlice(e.l,{sg,c}); if(ctx.isList){ const w=e.l.slice(z.bi,z.bj); if(!same(w,e.w)){ ok=false; break; } if(w.length&&w.length<e.l.length) part=true; } else { if((z.b&15)!==e.want){ ok=false; break; } part=part||z.b>0; } }
      if(ok&&part) out.push({frame:'slice',sg,c,out:o,cost:4+c/100}); }
  return out; }
function codeSlice(p){ const Jc=3,SL=4,SH=5,BL=6,BH=7,S=0,Kc=2; const parts=[...SET(Kc,p.c),...SET(BL,0),...SET(BH,8)];
  const step=()=>p.sg>0?[...ADDW(SL,SH,Jc,S),...SUBW(SL,SH,Kc,S,'END')]:[...ADDW(SL,SH,Kc,S),...SUBW(SL,SH,Jc,S,'END')];
  // the i-node lives on the stack while the j-loop runs
  const loops=(tag,onPos)=>[...T_(1),
    'O'+tag,...P_(Jc),...T_(Jc),['J','O1'+tag],...GOTO('OE'+tag),'O1'+tag,...T_(Jc),...SET(SL,0),...SET(SH,8),
    'I'+tag,...step(),...onPos,...T_(Jc),['WHERE@'],['GO'],['TAKE'],...P_(Jc),...T_(Jc),['J','I'+tag],
    ...P_(Jc),...T_(Jc),['WHERE@'],['GO'],['TAKE'],...GOTO('O'+tag),'OE'+tag];
  parts.push(...loops('a',[...JLTW(BL,BH,SL,SH,S,'BT'),...GOTO('NB'),'BT',...MV(SL,BL),...MV(SH,BH),'NB']));
  if(p.out==='best'){ parts.push(...MV(BL,2),'END'); return assemble(parts); }
  parts.push(...T_(BL),['J','P2'],...ANDK(BH,7),['J','P2'],...CONST[0],...G_1(),['PUT'],...GOTO('END'),
    'P2',...loops('b',[...JEQW(SL,SH,BL,BH,S,'FOUND')]),...GOTO('END'),
    'FOUND',...CONST[0],...T_(Jc),['WHERE@'],['GO'],['PUT'],...G_1(),['PUT'],'END');
  return assemble(parts); }
const G_1=()=>[['WHERE',1],['GO']];
const descSlice=p=>`הרצף הטוב ביותר · ציון ${p.sg>0?`x−${p.c}`:`${p.c}−x`} · הראשון מבין השווים ⇒ ${p.out==='slice'?'הרצף':'הציון'}`;

// ════ F6. per item: combine a prefix fold, a suffix fold and the item; accumulate ══════════════════
// a_i = f1(x_0..x_i), b_i = f2(x_i..x_n−1) (f1,f2: idempotent+commutative+associative shelf tools), c_i = B2(B1(a_i,b_i), x_i) (or B2(x_i, ·)),
// answer = B3-fold of the c_i from 0 (B3: commutative+associative shelf tool). All five slots are shelf tools picked from the examples.
function toolProps(B){ const t=B.T, f=(a,b)=>t[a*16+b]; const all=[...Array(16).keys()]; let comm=true, idem=true, assoc=true;
  for(const a of all){ if(f(a,a)!==a) idem=false; for(const b of all){ if(f(a,b)<0) return null; if(f(a,b)!==f(b,a)) comm=false; } }
  if(comm) for(const a of all) for(const b of all) for(const c of [0,3,8,12,15]) if(f(f(a,b),c)!==f(a,f(b,c))) assoc=false;
  return {comm,idem,assoc}; }
function plansFolds(ex,ctx){ const out=[]; const B=ctx.B.map(t=>({t,p:toolProps(t)})).filter(x=>x.p); const F=B.filter(x=>x.p.idem&&x.p.comm&&x.p.assoc).map(x=>x.t), A=B.filter(x=>x.p.comm&&x.p.assoc).map(x=>x.t), ALL=B.map(x=>x.t);
  const T2=(t,a,b)=>t.T[a*16+b]; const exs=ex.filter(e=>e.l.length>=2).slice(0,400); if(!exs.length) return out;
  for(const f1 of F) for(const f2 of F){ const ab=exs.map(e=>{ const n=e.l.length, a=[], b=[]; let m=e.l[0]; for(let i=0;i<n;i++){ m=T2(f1,m,e.l[i]); a.push(m); } m=e.l[n-1]; for(let i=n-1;i>=0;i--){ m=T2(f2,m,e.l[i]); b[i]=m; } return {a,b}; });
    for(const b1 of ALL){ const u=ab.map(z=>z.a.map((a,i)=>T2(b1,a,z.b[i])));
      for(const b2 of ALL) for(const sw of [0,1]) for(const b3 of A){ let ok=true;
        for(let k=0;k<exs.length;k++){ const e=exs[k], uk=u[k]; let acc=0; for(let i=0;i<e.l.length;i++){ const c=sw?T2(b2,e.l[i],uk[i]):T2(b2,uk[i],e.l[i]); acc=T2(b3,acc,c); } if(acc!==e.want){ ok=false; break; } }
        if(ok){ const p={frame:'folds',f1,f2,b1,b2,sw,b3}; if(ex.every(e=>simFolds(e.l,p)===e.want)) out.push({...p,cost:6+(f1.prog.length+f2.prog.length+b1.prog.length+b2.prog.length+b3.prog.length)/1000}); if(out.length>20) return out; } } } }
  return out; }
function simFolds(l,p){ const T2=(t,a,b)=>t.T[a*16+b]; const n=l.length; let acc=0, a=l[0]; for(let i=0;i<n;i++){ a=T2(p.f1,a,l[i]); let b=l[i]; for(let j=i;j<n;j++) b=T2(p.f2,b,l[j]); const u=T2(p.b1,a,b); const c=p.sw?T2(p.b2,l[i],u):T2(p.b2,u,l[i]); acc=T2(p.b3,acc,c); } return acc; }
function codeFolds(p){ const Pi=3,ML=4,Qj=5,MR=6,ACC=2,C=0,T7=7; const ct=(t,ins,o,live)=>{ const c=callTool(t,ins,o,new Set(live)); if(!c) throw new Error('אין מקום לכלי'); return c; };
  return assemble([...SET(ACC,0),...T_(1),...P_(Pi),...T_(Pi),['J','GO'],...GOTO('END'),'GO',...MV(Pi,ML),
    'LOOP',...ct(p.f1,[ML,Pi],C,[Pi,ML,ACC]),...MV(C,ML),...MV(Pi,MR),...MV(Pi,Qj),
    'IN',...ct(p.f2,[MR,Qj],C,[Pi,ML,ACC,Qj,MR]),...MV(C,MR),...T_(Qj),['WHERE@'],['GO'],['TAKE'],...P_(Qj),...T_(Qj),['J','IN'],
    ...ct(p.b1,[ML,MR],C,[Pi,ML,ACC]),...(p.sw?ct(p.b2,[Pi,C],T7,[Pi,ML,ACC]):ct(p.b2,[C,Pi],T7,[Pi,ML,ACC])),...ct(p.b3,[ACC,T7],C,[Pi,ML]),...MV(C,ACC),
    ...T_(Pi),['WHERE@'],['GO'],['TAKE'],...P_(Pi),...T_(Pi),['J','LOOP'],'END']); }
const descFolds=p=>`לכל איבר: ${p.b1.name}(${p.f1.name} עד כאן, ${p.f2.name} מכאן) ⇒ ${p.b2.name}${p.sw?' (x, ·)':' (·, x)'} ⇒ צבירה ב-${p.b3.name}`;

// ════ the composer ════════════════════════════════════════════════════════════════════════
const FRAMES=[
  {name:'bubble',kinds:['list'],plans:plansBubble,code:codeBubble,desc:descBubble},
  {name:'ends',kinds:['list'],plans:plansEnds,code:codeEnds,desc:descEnds},
  {name:'bins',kinds:['list','num'],plans:plansBins,code:codeBins,desc:descBins},
  {name:'order',kinds:['list','num'],plans:plansOrder,code:codeOrder,desc:descOrder},
  {name:'slice',kinds:['list','num'],plans:plansSlice,code:codeSlice,desc:descSlice},
  {name:'folds',kinds:['num'],plans:plansFolds,code:codeFolds,desc:descFolds},
  {name:'subset',kinds:['list','num'],plans:plansSubset,code:codeSubset,desc:descSubset},
];
export function greedyCompose(gen,{N=1000,ms=+process.env.GREEDYMS||120000,say=()=>{},maxTry=30,only=null}={}){ const T0=Date.now(), DEAD=T0+ms;
  const raw=Array.from({length:N},()=>gen()); const isList=typeof raw[0].want==='string';
  const ex=raw.map(e=>({l:walk(e.mem),want:e.want,w:isList?JSON.parse(e.want):null,e}));
  const ord=[...ex].sort((a,b)=>b.l.length-a.l.length);   // long lists first: inconsistent plans die fast
  const {U,B}=L.scanTools();
  let chk=null, tried=0, cands=0; const seen=new Set();
  for(const F of FRAMES){ if(Date.now()>DEAD) break; if(!F.kinds.includes(isList?'list':'num')) continue; if(only&&!only.includes(F.name)) continue;
    let plans; const t=Date.now(); try{ plans=F.plans(ord,{isList,DEAD,U,B}); }catch(err){ say(`  ${F.name}: ${err.message}`); continue; }
    say(`חמדני/${F.name}: ${plans.length} מועמדים · ${((Date.now()-t)/1000).toFixed(1)} שנ׳`); cands+=plans.length;
    plans.sort((a,b)=>a.cost-b.cost);
    for(const p of plans){ if(Date.now()>DEAD||tried>=maxTry) break; let prog; try{ prog=F.code(p); }catch(err){ say('  קוד: '+err.message); continue; }
      const key=J(prog); if(seen.has(key)) continue; seen.add(key); tried++;
      const bad=ex.slice(0,60).filter(f=>{ const r=run(prog,f.e.mem,{maxSteps:600000}); return !r||r.st.length||!f.e.ok(r.mem); }).length;
      if(bad){ say(`  ✗ במכונה (${bad}/60): ${F.desc(p)}`); continue; }
      chk=chk||makeChecker(gen,300,600000); if(!chk(prog)){ say('  ✗ בבודק: '+F.desc(p)); continue; }
      let b2=0; for(let k=0;k<2000&&!b2;k++){ const e=gen(); const r=run(prog,e.mem,{maxSteps:600000}); if(!r||r.st.length||!e.ok(r.mem)) b2++; }
      if(b2){ say('  ✗ בבדיקה (2000): '+F.desc(p)); continue; }
      return {prog,how:'חמדני: '+F.desc(p),cands,tried,ms:Date.now()-T0}; } }
  return {prog:null,cands,tried,ms:Date.now()-T0}; }
export const _t={codeSubset,simSubset,codeSlice,simSlice};
