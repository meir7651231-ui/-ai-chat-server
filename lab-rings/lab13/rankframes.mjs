// rankframes.mjs (KEY=ranks) — stage «דירוג-ומחלקות»: ranking by a context key, arg-best by class frequency, k passes of a sort.
// I write only skeletons (frames) + search. Every hole (statistic, key tool, class function, labels, tie order, k, comparison,
// direction, empty-list constant) is chosen by the machine from the examples: shelf tools (by their tables), closures of a shelf
// 2-input tool with a constant, or a table read from the examples and built by the value builder (keysort buildKey).
//   CK (list2list)  stable sort by (k1,k2), each with its own direction.
//                   k1 = f(x,S): f a shelf 2-input tool (both argument orders), S a statistic of the ORIGINAL list (first/last/min/max/n/second,
//                        or a shelf list⇒number tool), computed once and kept on the stack;
//                   k1 = cnt_K(x) = #{y: K(y)=K(x)}, K a class function: the partition of 8..15 (4140) is read from the examples.
//                   k2 = none (stable) or a static key read from the k1-ties.   Code: [S ⇒ stack] ⇒ insertion pass by k2 ⇒ insertion pass by k1.
//   AB (list2num)   the element with the best (cnt_K max/min, tie rule first/last/learned class precedence) ⇒ its label L(x) / x / index /
//                   the k1 value / how many elements reach it; empty list ⇒ a learned constant.
//   KP (list2list)  k passes of selection-with-swap or of bubble, «better» = a shelf comparison (order, negation); k learned by simulation.
// Pipeline (like the other families): JS simulation on the examples ⇒ 3000 fresh examples (JS) ⇒ machine code ⇒ 60 on the machine ⇒
//   makeChecker(gen,300,600000) ⇒ 2000 runs with maxSteps 600000. CK with recounted keys is O(n^3) tool calls, so no 50k-step finalCheck.
import fs from 'fs'; import { run } from './machine3s.mjs'; import { makeChecker } from './tzoref.mjs';
import { T_, P_, MV, CONST, SET, INC, JNE, JLT, assemble } from './greedylib.mjs';
import { scanTools, shift, dataCells, remap } from './scan-tools.mjs'; import { shelfParts } from './statscan.mjs';
import { buildKey, levelsFrom } from './keysort.mjs'; import { valueBuild } from './tzoref-value.mjs'; import { relocate } from './chainsafe.mjs';
const R=k=>Math.floor(Math.random()*k); const J=JSON.stringify;
const VALS=[8,9,10,11,12,13,14,15];
const walk=m=>{ const o=[]; let a=m[1]; for(let i=0;a&&i<10;i++){ o.push(a); a=m[a]; } return o; };

// ─── 1. bricks ───────────────────────────────────────────────────────────────
let UID=0; const U_=()=>++UID;
const GOTO=l=>[['WHERE',0],['GO'],['TAKE'],['TAKE'],['CALC'],['TAKE'],['CALC'],['J',l]];   // unconditional (15 on the stack); sets the pointer first
const AT=c=>[...T_(c),['WHERE@'],['GO']];                                                     // P ⇐ mem[c]
const NEXTX=c=>[...AT(c),['TAKE'],...P_(c)];                                                  // c ⇐ mem[c]
const CELLS=[0,2,3,4,5,6,7];
// a tool in place: inputs ⇒ inCells, output ⇒ outC, its scratch cells ⇒ free cells, else live cells saved on the stack around it
function callT(f,inCells,outC,live){ if(f.prog.some(x=>x[0]==='WHERE@')) return null; const map={}; f.ins.forEach((c,i)=>{ map[c]=inCells[i]; }); map[f.out]=outC;
  const taken=new Set([...inCells,outC]); const scratch=dataCells(f.prog).filter(c=>map[c]==null);
  const free=CELLS.filter(c=>!taken.has(c)&&!live.has(c)), busy=CELLS.filter(c=>!taken.has(c)&&live.has(c)); const save=[];
  for(const c of scratch){ if(c>7) return null; if(free.length) map[c]=free.shift(); else if(busy.length){ const b=busy.shift(); map[c]=b; save.push(b); } else return null; }
  if(Object.values(map).some(c=>c>7||c===1&&!inCells.includes(1))) return null;
  return [...save.flatMap(T_),{code:[['WHERE',0],['GO'],...shift(remap(f.prog,map),2)]},...[...save].reverse().flatMap(P_)]; }
const need=x=>{ if(!x) throw new Error('no room for a tool'); return x; };

// ─── 2. keys: a JS model (for the search) and machine code (src cell ⇒ dst cell, live cells kept) ───────────────
// static key: a unary tool (or identity)
const keyTool=(t)=>t.id?{name:'x',sim:x=>x,code:(s,d)=>MV(s,d)}:{name:t.name,sim:x=>t.T[x],code:(s,d,live)=>need(callT(t,[s],d,live))};
// context key f(x,S): S is on top of the stack — pop it into a free cell, call f, push it back
const keyCtx=(f,order,stat)=>({name:`${f.name}(${order==='xS'?'x,'+stat.name:stat.name+',x'})`,ctx:true,stat,
  sim:(x,c)=>order==='xS'?f.T[(x<<4)|c.S]:f.T[(c.S<<4)|x],
  code:(s,d,live)=>{ const a=CELLS.find(c=>c!==s&&c!==d&&!live.has(c)); if(a==null) throw new Error('no cell for S');
    return [...P_(a),...need(callT(f,order==='xS'?[s,a]:[a,s],d,new Set([...live,a,s]))),...T_(a)]; }});
// cnt_K(y) = how many elements z (over the parts: lists by head cell, single cells) have K(z) = K(y)
function cntCode(K,src,dst,parts,live){ const partCells=parts.map(p=>p.cell); const keepSrc=live.has(src);
  let pool=CELLS.filter(c=>c!==dst&&c!==src&&!live.has(c)); const spill=[];
  const spillable=[...live].filter(c=>c!==1&&c!==src&&c!==dst&&!partCells.includes(c)&&CELLS.includes(c));
  const avail=()=>pool.length+(keepSrc?0:1);
  while(avail()<4&&spillable.length){ const c=spillable.pop(); spill.push(c); pool.push(c); }
  if(avail()<4) throw new Error('no cells for cnt');
  const KY=pool.shift(); if(!keepSrc) pool.push(src); const [V,t,s]=pool;
  const liveNow=new Set([...[...live].filter(c=>!spill.includes(c)),...partCells]);
  const u=U_(); const out=[...spill.flatMap(T_), ...need(callT(K,[src],KY,new Set([...liveNow,src]))), ...SET(dst,0)];
  const L2=new Set([...liveNow,KY,dst]);
  parts.forEach((p,j)=>{ const lb=`cn${u}_${j}`;
    if(p.kind==='list') out.push(...MV(p.cell,V), lb, ...T_(V),['J',lb+'b'],...GOTO(lb+'e'), lb+'b', ...need(callT(K,[V],t,new Set([...L2,V]))), ...JNE(t,KY,s,lb+'s'), ...INC(dst), lb+'s', ...NEXTX(V), ...GOTO(lb), lb+'e');
    else out.push(...need(callT(K,[p.cell],t,L2)), ...JNE(t,KY,s,lb+'s'), ...INC(dst), lb+'s'); });
  out.push(...[...spill].reverse().flatMap(P_)); return out; }
const keyCnt=(K,parts)=>({name:`cnt[${K.name}]`,cnt:true,sim:(x,c)=>c.cnt[x],code:(s,d,live)=>cntCode(K,s,d,parts,live)});

// statistics of the list (S): built-in frames or a shelf list⇒number tool; result pushed on the stack
const STATS={
  first:{sim:l=>l[0]||0, code:()=>T_(1)},
  second:{sim:l=>l[1]||0, code:()=>{ const u=U_(); return [...T_(1),['J','s2'+u],...SET(2,0),...GOTO('s2e'+u),'s2'+u,...AT(1),['TAKE'],...P_(2),'s2e'+u,...T_(2)]; }},
  last:{sim:l=>l.length?l[l.length-1]:0, code:()=>{ const u=U_(); return [...SET(2,0),...MV(1,3),'sl'+u,...T_(3),['J','slb'+u],...GOTO('sle'+u),'slb'+u,...MV(3,2),...NEXTX(3),...GOTO('sl'+u),'sle'+u,...T_(2)]; }},
  n:{sim:l=>l.length, code:()=>{ const u=U_(); return [...SET(2,0),...MV(1,3),'sn'+u,...T_(3),['J','snb'+u],...GOTO('sne'+u),'snb'+u,...INC(2),...NEXTX(3),...GOTO('sn'+u),'sne'+u,...T_(2)]; }},
  max:{sim:l=>l.length?Math.max(...l):0, code:()=>{ const u=U_(); return [...SET(2,0),...MV(1,3),'sx'+u,...T_(3),['J','sxb'+u],...GOTO('sxe'+u),'sxb'+u,...JLT(2,3,0,'sxu'+u),...GOTO('sxn'+u),'sxu'+u,...MV(3,2),'sxn'+u,...NEXTX(3),...GOTO('sx'+u),'sxe'+u,...T_(2)]; }},
  min:{sim:l=>l.length?Math.min(...l):15, code:()=>{ const u=U_(); return [...SET(2,15),...MV(1,3),'sm'+u,...T_(3),['J','smb'+u],...GOTO('sme'+u),'smb'+u,...JLT(3,2,0,'smu'+u),...GOTO('smn'+u),'smu'+u,...MV(3,2),'smn'+u,...NEXTX(3),...GOTO('sm'+u),'sme'+u,...T_(2)]; }},
};
const statOf=(k)=>({name:k,kind:'builtin',val:(l)=>STATS[k].sim(l),code:STATS[k].code});

// ─── 3. frames ───────────────────────────────────────────────────────────────
// stable insertion pass by a key: cells 1 = sorted, 3 = rest, 4 = x, 5 = key(x), 6 = link (address holding cur), 7 = key(cur)
function sortPass(key,dir){ const u=U_(), L=s=>s+u;
  return [...MV(1,3),...SET(1,0),
    L('OUT'),...T_(3),['J',L('HAVE')],...GOTO(L('EXIT')),
    L('HAVE'),...MV(3,4),...AT(4),['TAKE'],...P_(3), ...key.code(4,5,new Set([1,3,4])), ...SET(6,1),
    L('WALK'),...AT(6),['TAKE'],['J',L('CMP')],...GOTO(L('INS')),
    L('CMP'),...AT(6),['TAKE'],...P_(0), ...key.code(0,7,new Set([1,3,4,5,6])),
      ...(dir==='asc'?JLT(5,7,0,L('INS')):JLT(7,5,0,L('INS'))),
      ...AT(6),['TAKE'],...P_(6),...GOTO(L('WALK')),
    L('INS'),...AT(6),['TAKE'],...AT(4),['PUT'],...T_(4),...AT(6),['PUT'],...GOTO(L('OUT')),
    L('EXIT')]; }
function ckCode(p){ const parts=[]; const stat=p.k1.ctx?p.k1.stat:null;
  if(stat) parts.push(...(stat.kind==='builtin'?stat.code():[{code:[['WHERE',0],['GO'],...shift(stat.prog,2)]},...T_(2)]));
  if(p.k2) parts.push(...sortPass(p.k2.key,p.k2.dir));
  parts.push(...sortPass(p.k1,p.d1));
  if(stat) parts.push(...P_(0));
  return assemble(parts); }
// arg-best: 3 = walker, 4 = best, 5 = k1(best), 6 = k1(cur); ties ⇒ first / last / rank tool
function abCode(p){ const u=U_(), L=s=>s+u; const E=L('END'); const k1=p.k1;
  const out=[...T_(1),['J',L('NE')],...SET(2,p.e),...GOTO(E),
    L('NE'),...MV(1,3),...MV(3,4),...k1.code(4,5,new Set([1,3,4])),
    L('LOOP'),...NEXTX(3),...T_(3),['J',L('BODY')],...GOTO(L('FIN')),
    L('BODY'),...k1.code(3,6,new Set([1,3,4,5])),
      ...(p.dir==='max'?JLT(5,6,0,L('TAKE')):JLT(6,5,0,L('TAKE'))),
      ...JNE(5,6,0,L('LOOP'))];
  if(p.tie==='first') out.push(...GOTO(L('LOOP')));
  else if(p.tie==='last') out.push(...GOTO(L('TAKE')));
  else { const live=new Set([1,3,4,5,6]); out.push(...p.rank.key.code(3,0,live),...p.rank.key.code(4,2,new Set([...live,0])),...(p.rank.dir==='asc'?JLT(0,2,7,L('TAKE')):JLT(2,0,7,L('TAKE'))),...GOTO(L('LOOP'))); }
  out.push(L('TAKE'),...MV(3,4),...MV(6,5),...GOTO(L('LOOP')), L('FIN'));
  if(p.out==='label') out.push(...p.lab.code(4,2,new Set()));
  else if(p.out==='x') out.push(...MV(4,2));
  else if(p.out==='k1') out.push(...MV(5,2));
  else if(p.out==='idx') out.push(...SET(2,0),...MV(1,3),L('Q'),...JNE(3,4,7,L('QN')),...GOTO(E),L('QN'),...NEXTX(3),...INC(2),...GOTO(L('Q')));
  else if(p.out==='count') out.push(...SET(4,0),...MV(1,3),L('C'),...T_(3),['J',L('CB')],...GOTO(L('CE')),L('CB'),...k1.code(3,6,new Set([1,3,4,5])),...JNE(5,6,0,L('CS')),...INC(4),L('CS'),...NEXTX(3),...GOTO(L('C')),L('CE'),...MV(4,2));
  out.push(E); return assemble(out); }
// k passes of selection-with-swap (the swap idiom of statscan classSortFrame; the pass counter lives on the stack)
//   3 = p (link before position), 4 = u = mem[p], 5 = best, 6 = pb (link before best), 7 = q, 0 = s
function selCode(p){ const u=U_(), L=s=>s+u; const live=new Set([3,4,5,6,7,0]); const args=p.rel.order==='ab'?[0,5]:[5,0];
  return assemble([...SET(2,p.k),...T_(2),...SET(3,1),
    L('OUT'),...P_(2),...T_(2),['J',L('C1')],...GOTO(L('EXIT')),
    L('C1'),...T_(2),...CONST[15],['ADD'],
      ...AT(3),['TAKE'],...P_(4),...T_(4),['J',L('SEL')],...GOTO(L('EXITP')),
    L('SEL'),...MV(4,5),...MV(3,6),...MV(4,7),
    L('IN'),...AT(7),['TAKE'],...P_(0),...T_(0),['J',L('IN2')],...GOTO(L('DONE')),
    L('IN2'),...need(callT(p.rel.tool,args,2,live)),...T_(2),['J',p.rel.neg?L('ADVQ'):L('BEST')],...GOTO(p.rel.neg?L('BEST'):L('ADVQ')),
    L('BEST'),...MV(0,5),...MV(7,6),
    L('ADVQ'),...MV(0,7),...GOTO(L('IN')),
    L('DONE'),...JNE(5,4,2,L('SWAP')),...MV(4,3),...GOTO(L('OUT')),
    L('SWAP'),...JNE(6,4,2,L('FAR')),
      ...AT(5),['TAKE'],...P_(0), ...T_(5),...AT(3),['PUT'], ...T_(4),...AT(5),['PUT'], ...T_(0),...AT(4),['PUT'], ...MV(5,3),...GOTO(L('OUT')),
    L('FAR'),...AT(4),['TAKE'],...P_(7), ...AT(5),['TAKE'],...P_(0), ...T_(5),...AT(3),['PUT'], ...T_(7),...AT(5),['PUT'], ...T_(4),...AT(6),['PUT'], ...T_(0),...AT(4),['PUT'], ...MV(5,3),...GOTO(L('OUT')),
    L('EXITP'),...P_(2),
    L('EXIT')]); }
// k full bubble passes: 3 = p (link), 4 = a = mem[p], 5 = b = mem[a]; better(b,a) ⇒ swap
function bubCode(p){ const u=U_(), L=s=>s+u; const args=p.rel.order==='ab'?[5,4]:[4,5];
  return assemble([...SET(2,p.k),...T_(2),
    L('OUT'),...P_(2),...T_(2),['J',L('C1')],...GOTO(L('EXIT')),
    L('C1'),...T_(2),...CONST[15],['ADD'],...SET(3,1),
    L('IN'),...AT(3),['TAKE'],...P_(4),...T_(4),['J',L('I1')],...GOTO(L('OUT')),
    L('I1'),...AT(4),['TAKE'],...P_(5),...T_(5),['J',L('I2')],...GOTO(L('OUT')),
    L('I2'),...need(callT(p.rel.tool,args,2,new Set([3,4,5]))),...T_(2),['J',p.rel.neg?L('NO'):L('SW')],...GOTO(p.rel.neg?L('SW'):L('NO')),
    L('SW'),...T_(5),...AT(3),['PUT'], ...AT(5),['TAKE'],...AT(4),['PUT'], ...T_(4),...AT(5),['PUT'], ...MV(5,3),...GOTO(L('IN')),
    L('NO'),...MV(4,3),...GOTO(L('IN')),
    L('EXIT')]); }

// ─── 4. JS models of the frames ──────────────────────────────────────────────
function ctxOf(l,stat,P){ const c={S:stat?stat.v:0}; if(P){ const cnt=new Array(16).fill(0), k=new Array(16).fill(0); for(const x of l) k[P[x]]++; for(const x of l) cnt[x]=k[P[x]]; c.cnt=cnt; } return c; }
function keySort2(l,k1,d1,k2,d2,c){ const idx=l.map((_,i)=>i); const a=l.map(x=>k1.sim(x,c)), b=k2?l.map(x=>k2.sim(x,c)):null;
  idx.sort((i,j)=>(d1==='asc'?a[i]-a[j]:a[j]-a[i])||(b?(d2==='asc'?b[i]-b[j]:b[j]-b[i]):0)||i-j); return idx.map(i=>l[i]); }
function selPasses(l,k,better){ const r=[...l]; for(let p=0;p<k&&p<r.length;p++){ let m=p; for(let i=p+1;i<r.length;i++) if(better(r[i],r[m])) m=i; const t=r[p]; r[p]=r[m]; r[m]=t; } return r; }
function bubPasses(l,k,better){ const r=[...l]; for(let p=0;p<k;p++) for(let i=0;i+1<r.length;i++) if(better(r[i+1],r[i])){ const t=r[i]; r[i]=r[i+1]; r[i+1]=t; } return r; }
function argBest(l,P,p){ if(!l.length) return p.e; const k=new Array(16).fill(0); for(const x of l) k[P[x]]++; const cnt=x=>k[P[x]];
  let b=l[0], bi=0; for(let i=1;i<l.length;i++){ const x=l[i], cx=cnt(x), cb=cnt(b);
    let take=p.dir==='max'?cx>cb:cx<cb; if(!take&&cx===cb){ if(p.tie==='last') take=true; else if(p.tie==='prec'){ const rx=p.rank.sim(x), rb=p.rank.sim(b); take=p.rank.dir==='asc'?rx<rb:rx>rb; } }
    if(take){ b=x; bi=i; } }
  if(p.out==='label') return p.lab.sim(b); if(p.out==='x') return b; if(p.out==='k1') return cnt(b); if(p.out==='idx') return bi;
  let n=0; for(const x of l) if(cnt(x)===cnt(b)) n++; return n&15; }

// ─── 5. the tool library: unary tools, closures of 2-input tools with a constant, 2-input tools ────────────────
let LIB=null, LIBK='';
function library(){ const st=scanTools(); const k=st.U.map(t=>t.name).join('|')+'#'+st.B.map(t=>t.name).join('|'); if(LIB&&LIBK===k) return LIB;
  const ok=t=>!t.prog.some(x=>x[0]==='WHERE@')&&dataCells(t.prog).every(c=>c<8);
  const sig=T=>VALS.map(v=>T[v]).join(',');
  const U=[{name:'x',id:true,T:Int8Array.from({length:16},(_,i)=>i),cost:0}], seen=new Set([sig(U[0].T)]);
  for(const t of st.U){ if(!ok(t)) continue; const s=sig(t.T); if(VALS.some(v=>t.T[v]<0)||seen.has(s)) continue; seen.add(s); U.push({...t,cost:1+t.prog.length/100}); }
  const B=st.B.filter(ok);
  // closures: f(x,c) / f(c,x) as a one-input program (the constant is written into f's other input cell, which becomes scratch)
  const C=[];
  for(const f of B){ if(f.ins.length!==2) continue; for(let c=0;c<16;c++) for(const side of [0,1]){ const T=new Int8Array(16); let bad=false;
      for(let x=0;x<16;x++){ const v=side===0?f.T[(x<<4)|c]:f.T[(c<<4)|x]; T[x]=v; if(v<0&&x>=8) bad=true; } if(bad) continue; const s=sig(T); if(seen.has(s)) continue; seen.add(s);
      const xin=f.ins[side], cin=f.ins[1-side]; const pre=SET(cin,c); const prog=[...pre,...shift(f.prog,pre.length)];
      C.push({name:`${f.name}(${side===0?'x,'+c:c+',x'})`,ins:[xin],out:f.out,prog,T,cost:2+f.prog.length/100}); } }
  C.sort((a,b)=>a.cost-b.cost);
  LIB={U,C,B,unary:[...U,...C]}; LIBK=k; return LIB; }
// canonical form of a partition (class ids by first appearance over 8..15)
const canon=a=>{ const m=new Map(); return a.map(v=>{ if(!m.has(v)) m.set(v,m.size); return m.get(v); }).join(','); };
function partitions(){ const out=[]; const cls=new Array(8); const rec=(i,k)=>{ if(i===8){ out.push(cls.slice()); return; } for(let c=0;c<=k;c++){ cls[i]=c; rec(i+1,Math.max(k,c+1)); } }; rec(0,0); return out; }
let PARTS=null; const allParts=()=>PARTS||(PARTS=partitions().map(p=>{ const P=new Int8Array(16); VALS.forEach((v,i)=>{ P[v]=p[i]; }); return {P,nc:Math.max(...p)+1}; }));
// a unary tool inducing the partition P (same classes on 8..15)
function toolForPartition(P,lib){ const want=canon(VALS.map(v=>P[v])); return lib.unary.find(t=>canon(VALS.map(v=>t.T[v]))===want)||null; }
// a unary tool equal to tab on the given values (partial table)
function toolForTable(tab,lib){ const ks=[...tab.keys()]; return lib.unary.find(t=>ks.every(v=>t.T[v]===tab.get(v)))||null; }
// a learned table: the value builder builds it (keysort buildKey); a learned tool must run in few steps
function learnedTool(tab,{ms,maxCost=1500,say}){ const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); const k=buildKey(sh,tab,{ms,maxCost,rounds:3,say}); if(!k) return null;
  const T=new Int8Array(16).fill(-1); for(const [v,c] of tab) T[v]=c; return {name:'table['+[...tab].map(([v,c])=>v+':'+c).join(' ')+']',ins:[0],out:2,prog:k.prog,T,cost:5,learned:true}; }
// rank keys for a set of strict «before» constraints (a,b,strict): key(a) ≤ key(b) (< when strict), asc or desc
function keyFits(T,cons,dir){ for(const [a,b,s] of cons){ const x=T[a], y=T[b]; if(x<0||y<0) return false; if(dir==='asc'?(s?x>=y:x>y):(s?x<=y:x<y)) return false; } return true; }

// ─── 6. learning CK ──────────────────────────────────────────────────────────
// k1 values along each output must be monotone; the k1-ties give the constraints on k2
//   strength = how many adjacent output pairs k1 orders strictly (a k1 that is almost constant explains nothing)
function k1Fits(ex,vals,dir){ const cons=new Map(); let strength=0;
  for(let e=0;e<ex.length;e++){ const o=ex[e].o, v=vals[e], pos=ex[e].pos; for(let i=1;i<o.length;i++){ const a=v[o[i-1]], b=v[o[i]]; if(dir==='asc'?a>b:a<b) return null;
      if(a===b){ const x=o[i-1], y=o[i]; const s=pos[x]>pos[y]?1:0; const k=x*16+y; cons.set(k,Math.max(cons.get(k)||0,s)); } else strength++; } }
  const c=[...cons].map(([k,s])=>[k>>4,k&15,s]); c.strength=strength; c.strict=c.filter(x=>x[2]).length; return c; }
// quick monotonicity screen without allocation: which directions survive, and does k1 vary at all
function screen(ex,kOf){ let asc=true, desc=true, varies=false;
  for(let j=0;j<ex.length;j++){ const o=ex[j].o; let prev=kOf(j,o[0]); for(let i=1;i<o.length;i++){ const c=kOf(j,o[i]); if(c<prev) asc=false; else if(c>prev){ desc=false; } if(c!==prev) varies=true; prev=c; } if(!asc&&!desc) return null; }
  if(!varies) return null; return [...(asc?['asc']:[]),...(desc?['desc']:[])]; }
function* ckK1(ex,lib,stats,{say}){
  // (a) f(x,S): S a statistic, f a shelf 2-input tool in both argument orders
  for(const st of process.env.RANKTEST_NOB?[]:stats){ const Sv=ex.map(e=>st.vals[e.i]); if(Sv.some(v=>v<0)) continue; const Sset=[...new Set(Sv)];   // RANKTEST_NOB: test switch (hide the shelf 2-input tools)
    for(const f of lib.B) for(const order of ['xS','Sx']){ const T=f.T; const t=order==='xS'?(x,S)=>T[(x<<4)|S]:(x,S)=>T[(S<<4)|x];
      let bad=false; const rows=new Set(); for(const S of Sset){ const r=VALS.map(x=>t(x,S)); if(r.some(v=>v<0)){ bad=true; break; } rows.add(r.join(',')); } if(bad||rows.size<2) continue;   // must depend on S
      const dirs=screen(ex,(j,x)=>t(x,Sv[j])); if(!dirs) continue;
      const vals=ex.map((e,j)=>{ const a=new Int8Array(16); for(const x of e.l) a[x]=t(x,Sv[j]); return a; });
      for(const dir of dirs){ const cons=k1Fits(ex,vals,dir); if(cons) yield {k1:keyCtx(f,order,st),d1:dir,cons,stat:st}; } } }
  // (b) cnt_K: K a partition of 8..15
  const cb=new Int8Array(8);
  for(const {P,nc} of allParts()){ if(nc<2||nc>7) continue; let last=-1;
    const dirs=screen(ex,(j,x)=>{ if(j!==last){ cb.fill(0); for(const y of ex[j].l) cb[P[y]]++; last=j; } return cb[P[x]]; }); if(!dirs) continue;
    const vals=ex.map(e=>{ const k=new Array(nc).fill(0); for(const x of e.l) k[P[x]]++; const a=new Int8Array(16); for(const x of e.l) a[x]=k[P[x]]; return a; });
    for(const dir of dirs){ const cons=k1Fits(ex,vals,dir); if(cons) yield {P,nc,d1:dir==='asc'?'asc':'desc',cons}; } } }
// k2 from the tie constraints: none / a unary tool or closure (asc/desc) / a learned level table
function ckK2(cons,lib,{ms,say,P}){ if(!cons.some(c=>c[2])) return [{k2:null}];
  const out=[]; const pref=P?[...lib.unary].sort((a,b)=>(canon(VALS.map(v=>a.T[v]))===canon(VALS.map(v=>P[v]))?0:1)-(canon(VALS.map(v=>b.T[v]))===canon(VALS.map(v=>P[v]))?0:1)):lib.unary;
  for(const t of pref) for(const dir of ['asc','desc']) if(keyFits(t.T,cons,dir)){ out.push({k2:{key:keyTool(t),dir,tool:t}}); if(out.length>=3) return out; }
  if(out.length||ms<5000) return out;
  // levels: longest path over the constraints (strict = +1)
  const V=[...new Set(cons.flatMap(c=>[c[0],c[1]]))]; const K=new Map(V.map(v=>[v,0]));
  for(let it=0;;it++){ let ch=false; for(const [a,b,s] of cons) if(K.get(a)+s>K.get(b)){ K.set(b,K.get(a)+s); ch=true; } if(!ch) break; if(it>V.length+1) return out; }
  const t=learnedTool(K,{ms,say}); if(t) out.push({k2:{key:keyTool(t),dir:'asc',tool:t}}); return out; }
function ckVerifyJS(cd,list){ for(const e of list){ const c=ctxOf(e.l,cd.stat?{v:e.S[cd.stat.idx]}:null,cd.P); const k1=cd.P?{sim:(x,c)=>c.cnt[x]}:cd.k1; const r=keySort2(e.l,k1,cd.d1,cd.k2&&cd.k2.key,cd.k2&&cd.k2.dir,c); if(J(r)!==J(e.o)) return false; } return true; }

// ─── 7. learning AB (list2num): partition × direction × output × tie rule, read from the examples (cf. plan-r5 infer) ───────
function* abPlans(ex){ const ne=ex.filter(e=>e.l.length); let e0=null; for(const e of ex) if(!e.l.length){ if(e0==null) e0=e.w; else if(e0!==e.w) return; } e0=e0??0;
  for(const {P,nc} of allParts()){ if(nc<2||nc>7) continue;
    for(const dir of ['max','min']){
      // live modes
      const M={k1:true,count:true,xf:true,xl:true,if:true,il:true,lf:new Int8Array(nc).fill(-1),ll:new Int8Array(nc).fill(-1),lp:new Int8Array(nc).fill(-1),xp:true,ip:true};
      const lpTies=[], xpE=new Set(), ipE=new Set(); let alive=11;
      const kill=k=>{ if(M[k]!==false){ M[k]=false; alive--; } };
      for(const e of ne){ const l=e.l, w=e.w; const k=new Array(nc).fill(0); for(const x of l) k[P[x]]++;
        let m=dir==='max'?0:99; for(let q=0;q<nc;q++) if(k[q]) m=dir==='max'?Math.max(m,k[q]):Math.min(m,k[q]);
        const top=[]; for(let q=0;q<nc;q++) if(k[q]===m) top.push(q);
        let fi=-1, li=-1; for(let i=0;i<l.length;i++) if(k[P[l[i]]]===m){ if(fi<0) fi=i; li=i; }
        if(M.k1&&w!==m) kill('k1'); if(M.count&&w!==((m*top.length)&15)) kill('count');
        if(M.xf&&w!==l[fi]) kill('xf'); if(M.xl&&w!==l[li]) kill('xl'); if(M.if&&w!==fi) kill('if'); if(M.il&&w!==li) kill('il');
        for(const [key,i] of [['lf',fi],['ll',li]]) if(M[key]){ const q=P[l[i]]; if(M[key][q]<0) M[key][q]=w; else if(M[key][q]!==w) kill(key); }
        if(M.lp){ if(top.length===1){ const q=top[0]; if(M.lp[q]<0) M.lp[q]=w; else if(M.lp[q]!==w) kill('lp'); } else lpTies.push({top,w}); }
        // x-prec / idx-prec: the answer is the first element of its class, and its class is in top
        if(M.xp){ const q=P[w]; const i=l.indexOf(w); if(i<0||k[q]!==m||l.findIndex(x=>P[x]===q)!==i) kill('xp'); else for(const r of top) if(r!==q) xpE.add(q*8+r); }
        if(M.ip){ const x=l[w]; if(x==null) kill('ip'); else { const q=P[x]; if(k[q]!==m||l.findIndex(z=>P[z]===q)!==w) kill('ip'); else for(const r of top) if(r!==q) ipE.add(q*8+r); } }
        if(!alive) break; }
      if(!alive) continue;
      const base={P,nc,dir,e:e0};
      if(M.k1) yield {...base,out:'k1',tie:'first'};
      if(M.count) yield {...base,out:'count',tie:'first'};
      if(M.xf) yield {...base,out:'x',tie:'first'}; if(M.xl) yield {...base,out:'x',tie:'last'};
      if(M.if) yield {...base,out:'idx',tie:'first'}; if(M.il) yield {...base,out:'idx',tie:'last'};
      if(M.lf) yield {...base,out:'label',tie:'first',L:M.lf}; if(M.ll) yield {...base,out:'label',tie:'last',L:M.ll};
      if(M.lp){ const L=M.lp; const E=new Set(); let ok=true;
        for(const t of lpTies){ const win=t.top.filter(q=>L[q]===t.w); if(win.length!==1||t.top.some(q=>L[q]<0)){ ok=false; break; } for(const q of t.top) if(q!==win[0]) E.add(win[0]*8+q); }
        if(ok){ const rank=topo(nc,E); if(rank) yield {...base,out:'label',tie:E.size?'prec':'first',L,rank,edges:E}; } }
      for(const [key,E] of [['xp',xpE],['ip',ipE]]) if(M[key]&&E.size){ const rank=topo(nc,E); if(rank) yield {...base,out:key==='xp'?'x':'idx',tie:'prec',rank,edges:E}; } } } }
// topological order of the classes (edge a*8+b: a before b); null if cyclic
function topo(nc,E){ const indeg=new Array(nc).fill(0), adj=Array.from({length:nc},()=>[]); for(const e of E){ const a=e>>3, b=e&7; adj[a].push(b); indeg[b]++; }
  const q=[], rank=new Array(nc).fill(-1); for(let c=0;c<nc;c++) if(!indeg[c]) q.push(c); let r=0; while(q.length){ q.sort((a,b)=>a-b); const c=q.shift(); rank[c]=r++; for(const b of adj[c]) if(--indeg[b]===0) q.push(b); }
  return r===nc?rank:null; }

// ─── 8. machine checks ───────────────────────────────────────────────────────
function machineOk(prog,gen,quickEx,{say,desc}){ for(const e of quickEx){ const r=run(prog,e.mem,{maxSteps:600000}); if(!r||r.st.length||!e.ok(r.mem)){ say('  ✗ on the machine: '+desc); return false; } }
  const chk=makeChecker(gen,300,600000); if(!chk(prog)){ say('  ✗ checker: '+desc); return false; }
  for(let t=0;t<2000;t++){ const e=gen(); const r=run(prog,e.mem,{maxSteps:600000}); if(!r||r.st.length||!e.ok(r.mem)){ say('  ✗ 2000 runs: '+desc); return false; } }
  return true; }

// ─── 9. the stage ────────────────────────────────────────────────────────────
export async function rankCompose(gen,{N=400,ms=+process.env.RANKMS||180000,say=()=>{},maxTry=12}={}){ const T0=Date.now(), DEAD=T0+ms; const left=()=>DEAD-Date.now();
  const raw=Array.from({length:N},()=>gen()); if(typeof raw[0].want==='number') return abSearch(gen,raw,{T0,DEAD,left,say,maxTry});
  const ex=raw.map((e,i)=>{ const l=walk(e.mem), o=JSON.parse(e.want); const pos=new Int8Array(16).fill(-1); l.forEach((x,k)=>{ pos[x]=k; }); return {i,l,o,pos,e}; });
  for(const x of ex) if(x.l.length!==x.o.length||J([...x.l].sort())!==J([...x.o].sort())) return {prog:null,why:'not a permutation',ms:Date.now()-T0};
  if(ex.every(x=>J(x.l)===J(x.o))) return {prog:null,why:'no change',ms:Date.now()-T0};
  const lib=library(); let tried=0, cands=0;
  const more=Array.from({length:3000},()=>{ const e=gen(); return {l:walk(e.mem),o:JSON.parse(e.want),e}; });
  const quick=raw.slice(0,60);
  const tryProg=(prog,desc)=>{ tried++; return machineOk(prog,gen,quick,{say,desc}); };
  // ── KP: k passes of selection / bubble with a shelf comparison
  { const rels=[]; const seen=new Set();
    for(const f of lib.B) for(const order of ['ab','ba']) for(const neg of [false,true]){ const b=(x,y)=>{ const v=order==='ab'?f.T[(x<<4)|y]:f.T[(y<<4)|x]; return v<0?null:(!!v)!==neg; };
      let s=''; let bad=false; for(const x of VALS) for(const y of VALS){ const v=b(x,y); if(v===null){ bad=true; break; } s+=v?1:0; } if(bad||seen.has(s)) continue; seen.add(s); rels.push({tool:f,order,neg,better:b,name:`${neg?'not ':''}${f.name}${order==='ba'?' (swapped)':''}`}); }
    const plans=[]; for(const variant of ['sel','bub']) for(let k=1;k<=7;k++) for(const rel of rels){ const sim=l=>variant==='sel'?selPasses(l,k,rel.better):bubPasses(l,k,rel.better);
      if(ex.every(x=>J(sim(x.l))===J(x.o))&&more.every(x=>J(sim(x.l))===J(x.o))) plans.push({variant,k,rel}); }
    for(const p of plans){ if(tried>=maxTry||left()<5000) break; cands++; const desc=`${p.k} ${p.variant==='sel'?'selection':'bubble'} passes, better=${p.rel.name}`;
      let prog; try{ prog=p.variant==='sel'?selCode(p):bubCode(p); }catch(err){ say('  code: '+err.message); continue; }
      if(tryProg(prog,desc)) return {prog,how:'ranks KP: '+desc,cands,tried,ms:Date.now()-T0}; } }
  // ── CK: statistics (built-in frames first, then shelf list⇒number tools)
  const stats=[]; for(const k of Object.keys(STATS)){ const st=statOf(k); st.vals=raw.map(e=>st.val(walk(e.mem))); st.idx=stats.length; stats.push(st); }
  const addShelfStats=()=>{ let sp; try{ sp=shelfParts(JSON.parse(fs.readFileSync('shelf3.json','utf8'))); }catch{ return; } const sigs=new Set(stats.map(s=>s.vals.join(',')));
    for(const s of sp.stats){ const vals=raw.map(e=>{ const r=run(s.prog,e.mem,{maxSteps:300000}); return r&&!r.st.length?r.mem[2]&15:-1; }); if(vals.some(v=>v<0)) continue; const k=vals.join(','); if(sigs.has(k)) continue; sigs.add(k);
      stats.push({name:s.name,kind:'shelf',prog:s.prog,vals,idx:stats.length}); } };
  const statVal=(st,e)=>st.kind==='builtin'?st.val(walk(e.mem)):(()=>{ const r=run(st.prog,e.mem,{maxSteps:300000}); return r&&!r.st.length?r.mem[2]&15:-1; })();
  const sortEx=ex.filter(x=>x.l.length>1);
  // a static key alone (stable or reversed ties) explains the outputs ⇒ that is keysort's family, not a context key
  { const Ls=ex.map(x=>x.l), Os=ex.map(x=>x.o); if(levelsFrom(Ls,Os,'stable')||levelsFrom(Ls,Os,'anti')) return {prog:null,why:'static key sort',cands,tried,ms:Date.now()-T0}; }
  const pairs=sortEx.reduce((a,x)=>a+x.o.length-1,0); let learnK2=2, learnK=2;
  const tryCK=async(useStats)=>{ const all=[]; let n=0;
    for(const cd of ckK1(sortEx,lib,useStats,{say})){ if((++n&63)===0&&left()<8000) break; if(cd.cons.strength<Math.max(3,pairs*0.02)) continue; cd.order=all.length; all.push(cd); }
    all.sort((a,b)=>a.cons.strict-b.cons.strict||a.order-b.order);   // the more k1 explains, the less is left for k2
    for(const cd0 of all){ if(tried>=maxTry||left()<8000) return null; cands++;
      if(cd0.stat){ const st=cd0.stat; for(const e of ex){ if(!e.S) e.S=[]; e.S[st.idx]=st.vals[e.i]; } for(const e of more){ if(!e.S) e.S=[]; if(e.S[st.idx]==null) e.S[st.idx]=statVal(st,e.e); } }
      const k2s=ckK2(cd0.cons,lib,{ms:learnK2>0?Math.min(45000,left()-10000):0,say,P:cd0.P}); if(k2s.some(k=>k.k2&&k.k2.tool.learned)) learnK2--;
      for(const k2 of k2s){
        // cnt: the class tool K is found for the partition
        let cd={...cd0,...k2};
        if(cd.P){ let K=toolForPartition(cd.P,lib); if(!K&&learnK>0&&left()>15000){ learnK--; const tab=new Map(VALS.map(v=>[v,cd.P[v]])); K=learnedTool(tab,{ms:Math.min(45000,left()-10000),say}); } if(!K) continue;
          cd.k1=keyCnt(K,[{kind:'list',cell:1},{kind:'list',cell:3},{kind:'single',cell:4}]); cd.K=K; }
        if(!ckVerifyJS(cd,ex)||!ckVerifyJS(cd,more.filter(e=>e.l.length>1))) continue;
        const desc=`k1=${cd.P?'cnt['+cd.K.name+']':cd.k1.name} ${cd.d1}${cd.k2?`, k2=${cd.k2.key.name} ${cd.k2.dir}`:', ties stable'}`;
        let prog; try{ prog=ckCode(cd); }catch(err){ say('  code: '+err.message); continue; }
        if(tryProg(prog,desc)) return {prog,how:'ranks CK: '+desc,cands,tried,ms:Date.now()-T0}; } }
    return null; };
  let r=await tryCK(stats); if(r) return r;
  addShelfStats(); const extra=stats.filter(s=>s.kind==='shelf'); if(extra.length&&left()>8000){ r=await tryCK(extra); if(r) return r; }
  // no shelf 2-input tool induces the order: per value of S, a static key (keysort levelsFrom) ⇒ a 2-input level table key(x,S) ⇒ the value builder
  for(const st of stats){ if(tried>=maxTry||left()<20000) break; const tab=ctxLevels(sortEx,st); if(!tab) continue; cands++;
    const tool=learned2(tab,{ms:Math.min(45000,left()-15000),say}); if(!tool) break;   // one attempt: the value builder is the expensive part
    const cd={k1:keyCtx(tool,'xS',st),d1:'asc',stat:st,k2:null};
    for(const e of ex){ if(!e.S) e.S=[]; e.S[st.idx]=st.vals[e.i]; } for(const e of more){ if(!e.S) e.S=[]; if(e.S[st.idx]==null) e.S[st.idx]=statVal(st,e.e); }
    if(!ckVerifyJS(cd,ex)||!ckVerifyJS(cd,more.filter(e=>e.l.length>1))) break;
    const desc=`k1=${tool.name}(x,${st.name}) asc, ties stable`; let prog; try{ prog=ckCode(cd); }catch(err){ say('  code: '+err.message); break; }
    if(tryProg(prog,desc)) return {prog,how:'ranks CK: '+desc,cands,tried,ms:Date.now()-T0}; break; }
  return {prog:null,cands,tried,ms:Date.now()-T0}; }
// per value of S: the stable static key of that group (levels); consistent for every group and really depending on S ⇒ table (x<<4|S) ⇒ level
function ctxLevels(ex,st){ const groups=new Map(); for(const e of ex){ const S=st.vals[e.i]; if(S<0) return null; if(!groups.has(S)) groups.set(S,[]); groups.get(S).push(e); }
  const tab=new Map(), rows=new Set();
  for(const [S,g] of groups){ if(g.length<4) return null; const L=levelsFrom(g.map(e=>e.l),g.map(e=>e.o),'stable'); if(!L) return null; for(const v of L.V) tab.set((v<<4)|S,L.K.get(v)); rows.add(VALS.map(v=>L.K.has(v)?L.K.get(v):'?').join(',')); }
  if(rows.size<2) return null; return tab; }
// a 2-input table (x in cell 0, S in cell 1 ⇒ cell 2) built by the value builder; its full table is read back from the program
function learned2(tab,{ms,say}){ if(ms<5000) return null; const K=[...tab.keys()];
  const g=()=>{ const k=K[R(K.length)]; const mem=Array.from({length:16},()=>R(16)); mem[0]=k>>4; mem[1]=k&15; const w=tab.get(k), m0=mem.slice(); return {mem,want:w,ok:r=>r[2]===w&&r[0]===m0[0]&&r[1]===m0[1]&&VALS.every(c=>r[c]===m0[c])}; };
  const name='ctx-key: '+[...tab].map(([k,v])=>`${k>>4}.${k&15}→${v}`).join(',');
  const v=valueBuild(g,{name,ins:[0,1],out:2,ms}); if(!v.prog) return null; const prog=relocate(v.prog); if(!prog) return null;
  const T=new Int8Array(256).fill(-1); for(let a=0;a<16;a++) for(let b=0;b<16;b++){ let y=null; for(let t=0;t<2;t++){ const m=Array.from({length:16},()=>R(16)); m[0]=a; m[1]=b; const r=run(prog,m,{maxSteps:20000}); if(!r||r.st.length||r.mem[0]!==a||r.mem[1]!==b||VALS.some(c=>r.mem[c]!==m[c])){ y=-1; break; } if(y===null) y=r.mem[2]; else if(y!==r.mem[2]){ y=-1; break; } } T[(a<<4)|b]=y; }
  for(const [k,w] of tab) if(T[k]!==w) return null;
  return {name:'learned 2-input key',ins:[0,1],out:2,prog,T,learned:true}; }

async function abSearch(gen,raw,{T0,DEAD,left,say,maxTry}){ const ex=raw.map(e=>({l:walk(e.mem),w:e.want&15,e}));
  if(new Set(ex.map(e=>e.w)).size<2) return {prog:null,why:'constant',ms:Date.now()-T0};
  const lib=library(); const more=Array.from({length:3000},()=>{ const e=gen(); return {l:walk(e.mem),w:e.want&15}; }); const quick=raw.slice(0,60);
  let tried=0, cands=0, learnN=3; const plans=[];   // learnN: at most 3 value-builder tables per task
  const learn=(tab)=>{ if(learnN<=0||left()<15000) return null; learnN--; return learnedTool(tab,{ms:Math.min(60000,left()-10000),say}); };
  for(const p of abPlans(ex)){ plans.push(p); if(plans.length>=200) break; }
  // JS check on fresh examples (labels/ranks as learned; unknown labels never chosen)
  const simL=p=>p.L?{sim:x=>p.L[p.P[x]]}:null, simR=p=>p.rank?{sim:x=>p.rank[p.P[x]],dir:'asc'}:null;
  const good=plans.filter(p=>more.every(e=>argBest(e.l,p.P,{...p,lab:simL(p),rank:simR(p)})===e.w));
  good.sort((a,b)=>a.nc-b.nc);
  for(const p of good){ if(tried>=maxTry||left()<8000) break; cands++;
    // tools: label L (exact on its known classes), class K (inducing the partition), rank (consistent with the learned precedence)
    let lab=null; if(p.out==='label'){ const tab=new Map(); for(const v of VALS) if(p.L[p.P[v]]>=0) tab.set(v,p.L[p.P[v]]); lab=toolForTable(tab,lib);
      if(!lab) lab=learn(tab); if(!lab) continue; }
    let K=null; if(lab&&canon(VALS.map(v=>lab.T[v]))===canon(VALS.map(v=>p.P[v]))) K=lab; if(!K) K=toolForPartition(p.P,lib);
    if(!K) K=learn(new Map(VALS.map(v=>[v,p.P[v]]))); if(!K) continue;
    let rank=null; if(p.tie==='prec'){ const cons=[]; for(const e of p.edges){ const a=e>>3, b=e&7; for(const x of VALS) for(const y of VALS) if(p.P[x]===a&&p.P[y]===b) cons.push([x,y,1]); }
      const sameCls=p.out!=='label'; const cands2=[lab,K,...lib.unary].filter(Boolean);
      for(const t of cands2){ if(rank) break; if(sameCls&&canon(VALS.map(v=>t.T[v]))!==canon(VALS.map(v=>p.P[v]))&&!VALS.every(x=>VALS.every(y=>p.P[x]!==p.P[y]||t.T[x]===t.T[y]))) continue;
        for(const dir of ['asc','desc']) if(keyFits(t.T,cons,dir)){ rank={key:keyTool(t),dir,sim:x=>t.T[x],tool:t}; break; } }
      if(!rank){ const t=learn(new Map(VALS.map(v=>[v,p.rank[p.P[v]]]))); if(t) rank={key:keyTool(t),dir:'asc',sim:x=>t.T[x],tool:t}; }
      if(!rank) continue; }
    const plan={...p,k1:keyCnt(K,[{kind:'list',cell:1}]),lab:lab?{...keyTool(lab),sim:x=>lab.T[x]}:null,rank};
    if(!more.every(e=>argBest(e.l,p.P,plan)===e.w)) continue;
    const desc=`best by cnt[${K.name}] ${p.dir}, ties ${p.tie}${rank?' ('+rank.key.name+' '+rank.dir+')':''} ⇒ ${p.out}${lab?' '+lab.name:''} (empty ⇒ ${p.e})`;
    let prog; try{ prog=abCode(plan); }catch(err){ say('  code: '+err.message); continue; }
    tried++; if(machineOk(prog,gen,quick,{say,desc})) return {prog,how:'ranks AB: '+desc,cands,tried,ms:Date.now()-T0}; }
  return {prog:null,cands,tried,plans:plans.length,ms:Date.now()-T0}; }
export const _rank={selPasses,bubPasses,keySort2,argBest,abPlans,library,partitions,ckCode,abCode,selCode,bubCode,sortPass,STATS};
