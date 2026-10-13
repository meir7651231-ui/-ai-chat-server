// probe-plan.mjs - the brain's stage plan, decided by CHEAP PROBES (KEY=probe).
//   num:      probe value -> loop (a few seconds each; a probe that solves = done; case is probed only if its history says the
//             probe could change the decision). Then the learned model (probe-model.mjs, fitted on the machine's own probe
//             history of suite-1 runs) gives each stage P(success with its normal budget | how far its probe got). Stages below
//             their threshold are skipped, the rest run in the order p / expected-cost. Bits (exact for any function of the
//             inputs) stays the last resort, first with the budget its own history says always sufficed, then the time left.
//   list2num: the scan stage split by levels: its cheap levels are the probe; the expensive level C2b runs only if the model says so.
//   list2list: decide frames get a 3 s time-only probe; the rest is skipped when the history says nothing ever succeeded later.
//   PROBE=0 restores the original chain. In `tried`: probe:<stage>, skipped <stage>-(p=..), plan:<stage>(p=..), skip/+C2b tags.
import { probeValue, probeLoop, probeCase, probeScanLevels, SCAN_DEAR } from './probe-signals.mjs'; import { foldStaged } from './scanfold-staged.mjs'; import * as M from './probe-model.mjs';
import fs from 'fs';
export const PROBE_ON=()=>process.env.PROBE!=='0';
const PB={value:+process.env.PVMS||15000, loop:+process.env.PLMS||6000, case:+process.env.PCMS||10000, scan:+process.env.PSMS||10000};
const NAME={value:'בונה-ערכים', loop:'מסגרת-לולאה', case:'פיצול-מקרים', scan:'סריקה-עם-זיכרון', bits:'פריסת-ביטים'};
const logRow=row=>{ if(process.env.PROBELOG==='0') return; try{ fs.appendFileSync(process.env.PROBELOG||'probe-log.jsonl',JSON.stringify(row)+'\n'); }catch{} };   // own record; NOT read by the model

// ctx from solveAny: {spec, gen, attempt, sure, tried, left, off, showExpr}
export async function probeNum(ctx){ const {spec,gen,attempt,sure,tried,left,off,showExpr}=ctx; const row={probe:{},table:null}; const T=Date.now();
  const stages=['value','loop','case'].filter(s=>!off(s==='value'?'value':s));
  const how=(s,r)=>s==='value'?(r.expr?'בונה-ערכים: '+showExpr(r.expr):'בונה-ערכים'):s==='case'?'פיצול-מקרים: '+r.how:r.how;
  const pfn={value:()=>probeValue(gen,spec,PB.value), loop:()=>probeLoop(gen,spec,PB.loop), case:()=>probeCase(gen,spec,PB.case)};
  const full={value:()=>ctx.valueFull(), loop:()=>ctx.loopFull(), case:()=>ctx.caseFull()};
  // 1. probes, in chain order. A stage whose history says it (almost) always succeeds whatever its probe shows
  //    (constant model with p >= its threshold) is not probed: the probe could not change the decision, so it runs in full in step 2.
  const noProbe=s=>{ const m=M.model(s); return m.constant&&m.n>0&&m.p([])>=m.th; };
  for(const s of stages){ if(left()<40000) break; if(noProbe(s)) continue; let pr=null;
    const r=await attempt('probe:'+NAME[s],async()=>{ pr=await pfn[s](); return pr.r&&pr.r.prog?pr.r:{prog:null}; });
    if(pr){ row.probe[s]={ok:pr.ok,sec:pr.sec,...pr.sig}; if(pr.table) row.table=pr.table; }
    const ok=s==='value'?r:sure(r); if(ok){ logRow({kind:'num',name:spec.name,row,won:s,from:'probe',sec:(Date.now()-T)/1000}); return {...ok,stage:NAME[s],how:how(s,ok)+' · probe'}; } }
  // 2. the learned model: which stages are worth their full budget, and in which order
  const plan=[]; for(const s of stages){ if(!row.probe[s]&&!noProbe(s)) continue; const m=M.predict(s,row); plan.push({s,p:m.p,cost:m.cost,th:m.th}); }
  const go=plan.filter(x=>x.p>=x.th).sort((a,b)=>b.p/b.cost-a.p/a.cost);
  for(const x of plan) if(x.p<x.th) tried.push(`${NAME[x.s]}-(p=${x.p.toFixed(2)})`);
  for(const x of go){ if(left()<30000) break; tried.push(`plan:${NAME[x.s]}(p=${x.p.toFixed(2)})`); const r=await full[x.s](); if(r){ logRow({kind:'num',name:spec.name,row,plan,won:x.s,sec:(Date.now()-T)/1000}); return r; } }
  // 3. bits: the budget its own history says always sufficed; if that fails, the rest of the time
  if(off('bits')){ logRow({kind:'num',name:spec.name,row,plan,won:null}); return null; }
  const bb=M.bitsBudget(); let r=null;
  if(bb&&left()>15000) r=await attempt(NAME.bits,()=>ctx.bitsFull(Math.min(bb,left()-10000)));
  if(!r&&left()>15000) r=await attempt(NAME.bits,()=>ctx.bitsFull(left()-10000));
  logRow({kind:'num',name:spec.name,row,plan,won:r?'bits':null,sec:(Date.now()-T)/1000}); return r; }

// list2num: the scan stage split by levels. Probe = its cheap levels (everything but C2b) with the normal budget; solved -> done.
//   Otherwise the model (signals: best #examples a candidate stayed consistent on, candidates, level times) decides whether
//   the expensive level C2b gets the rest of the budget. Runs inside attempt('סריקה-עם-זיכרון'). Same levels, same order as before.
export async function scanGate(gen,spec,fullMs){ const T=Date.now(); const pr=probeScanLevels(gen,fullMs); const row={probe:{scan:{ok:pr.ok,sec:pr.sec,...pr.sig}}};
  if(pr.ok){ logRow({kind:'list2num',name:spec.name,row,won:'scan',from:'probe'}); return {...pr.r,ptag:' cheap-levels'}; }
  const m=M.predict('scan',row); const left=fullMs-(Date.now()-T);
  if(m.p<m.th||left<5000){ logRow({kind:'list2num',name:spec.name,row,p:m.p,skip:true}); return {prog:null,ptag:` skip-C2b(p=${m.p.toFixed(2)})`}; }
  const r=foldStaged(gen,{ms:left,levels:SCAN_DEAR}); logRow({kind:'list2num',name:spec.name,row,p:m.p,won:r&&r.prog?'scan':null}); return {...r,ptag:` +C2b(p=${m.p.toFixed(2)})`}; }

// time-only gate for a cheap stage (e.g. list2list decide frames): probe = the stage for a few seconds; the suite-1 history
// says whether anything ever succeeded after that; if not (p below threshold) the rest of the budget is skipped.
export async function timeGate(stageName,kind,fn,fullMs,bMs=+process.env.PTMS||3000){ const t=Date.now(); const r=await fn(bMs); if(r&&r.prog) return {...r,ptag:' probe'};
  const m=M.timeModel(stageName,kind,Math.ceil(bMs/1000)); if(m.p<m.th) return {prog:null,ptag:` skip(p=${m.p.toFixed(2)})`};
  const r2=await fn(fullMs); return {...r2,ptag:` full(p=${m.p.toFixed(2)})`}; }
