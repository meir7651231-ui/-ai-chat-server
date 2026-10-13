// probe-signals.mjs - CHEAP PROBES: run a builder stage for a short time and report how far it got.
//   Everything here is computed from the task's examples only (the stages only ever see gen()).
//   value : level reached, bank size, best fraction of examples one bank value already gets right (vs. the most common answer)
//   loop  : candidates tried, templates exhausted, longest prefix of the full table a candidate frame matched
//   case  : how much of the input table the split already solved (sum and largest solved node), depth, log shape
//   scan  : levels finished, candidates that fit all 48 examples / fresh ones, most examples a candidate stayed consistent on
//   + table: cheap structure of the full input->output table (num tasks; the case builder's own first look)
// Hooks used (read-only): globalThis.__PSIG.onValue (tzoref-value-fast.mjs), .onLoopMiss (numloop.mjs),
//   .onCaseNode (tzoref-case.mjs), FITPROBE (scanfold.mjs). Without __PSIG the stages behave exactly as before.
import { valueBuild } from './tzoref-value.mjs'; import { loopBuild } from './numloop.mjs'; import { caseBuild } from './tzoref-case.mjs';
import { tableOf } from './tzoref-basic.mjs'; import { foldStaged } from './scanfold-staged.mjs'; import { FITPROBE } from './scanfold.mjs';

const r3=x=>Math.round(x*1000)/1000;
const withSig=async(hooks,fn)=>{ const prev=globalThis.__PSIG; globalThis.__PSIG=hooks; try{ return await fn(); } finally{ if(prev===undefined) delete globalThis.__PSIG; else globalThis.__PSIG=prev; } };

// ---- table structure (num): K inputs, 16^K rows ----
export function tableFeatures(gen,ins){ const T=tableOf(gen,ins); if(!T) return null; const K=ins.length, N=T.length;
  const cnt=new Array(16).fill(0); for(const w of T) cnt[w]++; const nOut=cnt.filter(Boolean).length, mode=Math.max(...cnt)/N;
  const dig=(i,j)=>(i>>(4*(K-1-j)))&15;
  let copy=0; for(let j=0;j<K;j++){ let k=0; for(let i=0;i<N;i++) if(T[i]===dig(i,j)) k++; copy=Math.max(copy,k/N); }
  // sensitivity: for each output bit, how many of the 4K input bits can flip it
  let dep=0; for(let b=0;b<4;b++) for(let ib=0;ib<4*K;ib++){ const m=1<<ib; let d=false; for(let i=0;i<N&&!d;i++){ if(((T[i]^T[i^m])>>b)&1) d=true; } if(d) dep++; }
  // relevant inputs; for each input j: classes of its values with the same "rest" function (fewer = easier to split on j)
  let rel=0, cls=16; for(let j=0;j<K;j++){ const f=new Map(); for(let i=0;i<N;i++){ const v=dig(i,j); const rest=i-(v<<(4*(K-1-j))); if(!f.has(v)) f.set(v,new Array(N/16)); f.get(v)[restIdx(rest,j,K)]=T[i]; }
    const keys=new Set([...f.values()].map(a=>a.join(','))); if(keys.size>1) rel++; cls=Math.min(cls,keys.size>1?keys.size:16); }
  // smoothness: neighbours (one input +1) whose answers differ by at most 1
  let sm=0, ns=0; for(let i=0;i<N;i++) for(let j=0;j<K;j++){ if(dig(i,j)===15) continue; const i2=i+(1<<(4*(K-1-j))); ns++; if(Math.abs(T[i2]-T[i])<=1) sm++; }
  return {K,nOut,mode:r3(mode),copy:r3(copy),dep:r3(dep/(16*K)),rel,cls,smooth:r3(sm/Math.max(ns,1))}; }
function restIdx(rest,j,K){ let o=0; for(let q=0;q<K;q++){ if(q===j) continue; o=o*16+((rest>>(4*(K-1-q)))&15); } return o; }

// ---- value builder probe ----
export async function probeValue(gen,spec,ms){ const t=Date.now(); let snap=null;
  const hooks={onValue:s=>{ let best=0; for(let id=0;id<s.made;id++){ const q=s.eqOf(id); if(q>best) best=q; } const cnt=new Array(16).fill(0); for(let e=0;e<s.NN;e++) cnt[s.want[e]]++; const base=Math.max(...cnt)/s.NN;
    const b=best/s.NN; const o={lvl:s.lvl,made:s.made,best:r3(b),base:r3(base),gain:r3(base<1?(b-base)/(1-base):1)}; if(!snap||o.lvl>=snap.lvl) snap=o; }};
  const r=await withSig(hooks,()=>valueBuild(gen,{name:spec.name,ins:spec.ins,out:2,ms}));
  return {ok:!!(r&&r.prog),r,sec:(Date.now()-t)/1000,sig:{vLvl:snap?.lvl??0,vMade:snap?r3(Math.log10(1+snap.made)):0,vBest:snap?.best??0,vGain:snap?.gain??0}}; }

// ---- loop frame probe (small slices so every template gets a turn) ----
export async function probeLoop(gen,spec,ms,slice=1000){ const t=Date.now(); let best=0, N=1, miss=0; const lines=[];
  const hooks={onLoopMiss:(i,n)=>{ miss++; N=n; if(i>best) best=i; }};
  const prev=process.env.LSLICE; process.env.LSLICE=String(slice);
  let r; try{ r=await withSig(hooks,()=>loopBuild(gen,{ins:spec.ins,ms,say:s=>lines.push(s)})); } finally{ if(prev===undefined) delete process.env.LSLICE; else process.env.LSLICE=prev; }
  const st=lines.at(-1)||''; let done=0, nt=0, cand=0; for(const m of st.matchAll(/: (\d+) מועמדים\/[\d.]+ שנ׳( \(לא נגמר\))?/g)){ nt++; cand+=+m[1]; if(!m[2]) done++; }
  return {ok:!!(r&&r.prog),r,sec:(Date.now()-t)/1000,sig:{lTried:r3(Math.log10(1+(r?.tried??cand))),lDone:nt?r3(done/nt):(r&&r.prog?1:0),lPre:r3(best/N),lMiss:r3(Math.log10(1+miss))}}; }

// ---- case split probe ----
export async function probeCase(gen,spec,ms){ const t=Date.now(); let N=1, sum=0, big=0, deep=0; const lines=[];
  const tf=tableFeatures(gen,spec.ins); if(tf) N=16**spec.ins.length;
  const hooks={onCaseNode:(n,d)=>{ if(d>=1){ sum+=n; if(n>big) big=n; } if(d>deep) deep=d; }};
  const r=await withSig(hooks,()=>caseBuild(gen,{ins:spec.ins,ms,say:s=>lines.push(s)}));
  const depth=Math.max(0,...lines.map(l=>(l.match(/^ */)[0].length)/2));
  return {ok:!!(r&&r.prog),r,sec:(Date.now()-t)/1000,sig:{cCov:r3(Math.min(1,sum/N)),cBig:r3(big/N),cDeep:Math.max(deep,depth),cLog:lines.length,cVt:r3((r?.vms||0)/Math.max(1,ms))},table:tf}; }

// ---- scan (fold with memory) probe by time (first design; replaced by probeScanLevels below) ----
export async function probeScan(gen,ms){ const t=Date.now(); const lv=[]; FITPROBE.best=0;
  const r=foldStaged(gen,{ms,say:s=>{ const m=s.match(/^ *רמה (\S+) נגמרה/); if(m) lv.push(m[1]); }});
  return {ok:!!(r&&r.prog),r,sec:(Date.now()-t)/1000,sig:{sLv:lv.length,sCand:r3(Math.log10(1+(r?.cands||0))),sValid:r?.valid||0,sFit:r3(FITPROBE.best/48)}}; }

// ---- scan probe by LEVELS: the probe = the scan's cheap levels (everything except C2b, which is where unsolved tasks burn
//      most of their budget); the continuation = level C2b alone with the rest of the budget. Same level order as the full scan.
export const SCAN_CHEAP=['A','B','C1','D','C2a','E','F','G'], SCAN_DEAR=['C2b'];
export function probeScanLevels(gen,ms){ const t=Date.now(); const lv={}; FITPROBE.best=0;
  const r=foldStaged(gen,{ms,levels:SCAN_CHEAP,say:s=>{ const m=s.match(/^ *רמה (\S+) נגמרה \((\d+)ms\)/); if(m) lv[m[1]]=+m[2]; }});
  const sec=(Date.now()-t)/1000; const done=Object.keys(lv).length;
  return {ok:!!(r&&r.prog),r,sec,sig:{sLv:done,sAll:done===SCAN_CHEAP.length?1:0,sCand:r3(Math.log10(1+(r?.cands||0))),sValid:r?.valid||0,sFit:r3(FITPROBE.best/48),sSec:r3(Math.log10(1+sec)),sB:r3(Math.log10(1+(lv.B||0)/1000)),sE:r3(Math.log10(1+(lv.E||0)/1000))}}; }
