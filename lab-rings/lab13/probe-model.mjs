// probe-model.mjs - learns "how far a probe got -> will the stage succeed with its normal budget" from the machine's OWN probe
//   history (probe/train-*.jsonl: probes + full runs of each stage on suite-1 tasks, made by probe/collect-*.mjs).
//   One small logistic regression per stage (standardized signals, L2), fitted when first needed.
//   Threshold per stage, from leave-one-out predictions on the history:
//     num stages (bits always remains behind them): the threshold that minimizes the expected time on the history
//       (skipping a stage that would have succeeded costs a bits run; running a hopeless one costs its full budget);
//     scan (nothing reliable behind it): below the lowest leave-one-out p of any success, times a safety margin; with no success
//       at all in >=6 informative own runs: 1/(n+1) (the smoothed rate 0.5/(n+1) is below it -> skip).
//   Fewer than 8 rows or a single label: the signals can't be learned -> smoothed constant rate (then the probe is only a quick try,
//   and a stage with a constant high rate is not probed at all).
//   PROBE_FILES=<a,b> overrides the history files. The model never reads probe-log.jsonl (runtime log) or suite-2 data.
import fs from 'fs';
const FILES=(process.env.PROBE_FILES||'probe/train-num.jsonl,probe/train-list2num.jsonl').split(',');
const lg=x=>Math.log10(1+x);
// signals per stage (each from that stage's own probe; num stages also see the table structure)
export const FEATS={
  value:r=>{ const v=r.probe.value; return [v.vLvl,v.vMade,v.vBest,v.vGain]; },
  loop: r=>{ const l=r.probe.loop; return [l.lTried,l.lDone,l.lPre,l.lMiss]; },
  case: r=>{ const c=r.probe.case, t=r.table||{}; return [c.cCov,c.cBig,c.cDeep,lg(c.cLog),t.cls??16,t.dep??1,t.mode??0]; },
  scan: r=>{ const s=r.probe.scan; return [s.sFit,s.sCand,s.sSec,s.sB,s.sE]; } };   // after the cheap levels: best fit, candidates, level times
// normal budget (s) a stage burns when it fails, and the bits run that replaces a wrongly skipped num stage
const FAILCOST={value:25,loop:60,case:107,scan:150}; const BITSCOST=35;
const KINDOF={value:'num',loop:'num',case:'num',scan:'list2num'};

let ROWS=null; const rows=()=>{ if(ROWS) return ROWS; ROWS=[]; for(const f of FILES){ try{ for(const l of fs.readFileSync(f,'utf8').split('\n')){ if(l.trim()) ROWS.push(JSON.parse(l)); } }catch{} } return ROWS; };

function fitLogit(X,y,{l2=1,it=4000,lr=0.2}={}){ const n=X.length, d=X[0].length; const mu=[], sd=[];
  for(let j=0;j<d;j++){ let m=0; for(const x of X) m+=x[j]; m/=n; let v=0; for(const x of X) v+=(x[j]-m)**2; mu.push(m); sd.push(Math.sqrt(v/n)||1); }
  const Z=X.map(x=>x.map((v,j)=>(v-mu[j])/sd[j])); const w=new Array(d).fill(0); let b=0;
  for(let t=0;t<it;t++){ const gw=new Array(d).fill(0); let gb=0; for(let i=0;i<n;i++){ let s=b; for(let j=0;j<d;j++) s+=w[j]*Z[i][j]; const p=1/(1+Math.exp(-s)); const e=p-y[i]; gb+=e; for(let j=0;j<d;j++) gw[j]+=e*Z[i][j]; }
    b-=lr*gb/n; for(let j=0;j<d;j++) w[j]-=lr*(gw[j]/n+l2*w[j]/n); }
  return x=>{ let s=b; for(let j=0;j<d;j++) s+=w[j]*(x[j]-mu[j])/sd[j]; return 1/(1+Math.exp(-s)); }; }
const constModel=(y)=>{ const p=(y.filter(Boolean).length+0.5)/(y.length+1); return ()=>p; };   // all labels equal -> smoothed rate
const fit=(X,y,o)=>new Set(y).size<2?constModel(y):fitLogit(X,y,o);

const MODELS={};
export function model(stage){ if(MODELS[stage]) return MODELS[stage];
  const D=rows().filter(r=>r.probe&&r.probe[stage]&&r.probe[stage].ok===false&&r.full&&r.full[stage]&&!(r.full[stage].left<30));   // a continuation that got <30 s says nothing
  if(!D.length){ return MODELS[stage]={n:0,p:()=>1,th:0,succ:FAILCOST[stage],constant:true}; }   // no history: keep the stage (= old behaviour)
  const X=D.map(FEATS[stage]), y=D.map(r=>r.full[stage].ok?1:0);
  // few rows, or one label only: the signals cannot be learned -> smoothed success rate (the probe then only serves as a quick try)
  const small=D.length<8||new Set(y).size<2; const fitS=small?(X1,y1)=>constModel(y1):fit;
  const f=fitS(X,y); const loo=X.map((x,i)=>fitS(X.filter((_,j)=>j!==i),y.filter((_,j)=>j!==i))(x));
  const succT=D.filter(r=>r.full[stage].ok).map(r=>r.full[stage].sec); const succ=succT.length?succT.reduce((a,b)=>a+b,0)/succT.length:FAILCOST[stage];
  let th;
  if(KINDOF[stage]==='num'){ // expected time on the history for a threshold: run (p>=th): success time or full budget; skip: a bits run if it would have succeeded
    const cost=t=>D.reduce((s,r,i)=>s+(loo[i]>=t?(y[i]?r.full[stage].sec:FAILCOST[stage]):(y[i]?BITSCOST:0)),0);
    const cands=[0,...[...new Set(loo)].sort((a,b)=>a-b),1.01]; th=0; let best=cost(0); for(const t of cands){ const c=cost(t); if(c<best-1e-9){ best=c; th=t; } } }
  else { const pos=loo.filter((p,i)=>y[i]); th=pos.length?Math.min(...pos)*(+process.env.PROBE_MARGIN||0.5):(D.length>=6?1/(D.length+1):0); }   // never succeeded in >=8 own runs -> skip (smoothed p=0.5/(n+1) is below 1/(n+1))
  return MODELS[stage]={n:D.length,pos:y.filter(Boolean).length,p:f,th,loo,y,succ,names:D.map(r=>r.name),constant:small}; }

export function predict(stage,row){ const m=model(stage); let p=1; try{ p=m.constant?m.p([]):m.p(FEATS[stage](row)); }catch{ p=1; }
  if(!Number.isFinite(p)) p=1; const cost=p*m.succ+(1-p)*FAILCOST[stage]; return {p,th:m.th,cost,n:m.n}; }

// bits: the budget (ms) that sufficed on every own bits run in the history; null = no such evidence (use all the time left)
export function bitsBudget(){ const R=rows().filter(r=>r.full&&r.full.bits); if(R.length<8) return null; if(!R.every(r=>r.full.bits.ok)) return null; return R[0].B?.bits||null; }

if((process.argv[1]||'').endsWith('probe-model.mjs')){ for(const s of Object.keys(FEATS)){ const m=model(s); console.log(s,'n',m.n,'pos',m.pos,'th',m.th?.toFixed?.(3),'succ',m.succ?.toFixed?.(1),m.constant?'constant p='+m.p([]).toFixed(3):'logistic');
    if(m.loo) m.loo.forEach((p,i)=>console.log('   ',m.y[i]?'+':'-',p.toFixed(3),p>=m.th?'run ':'skip',m.names[i])); }
  console.log('bits budget',bitsBudget()); }

// Time-only probe (for cheap stages without richer signals): the probe = the stage run for b seconds.
//   From the suite-1 run history (bench3/4/5-<kind>.jsonl, field tried: "<stage>✓/✗(Ns)"):
//   P(success with the full budget | not solved within b s) = (successes later than b + 0.5) / (runs not solved within b + 1).
const HIST=(process.env.PROBE_HIST||'bench3-{k}.jsonl,bench4-{k}.jsonl,bench5-{k}.jsonl,probe/train-{k}.jsonl').split(',');
const TM={};
export function timeModel(stageName,kind,bSec){ const key=stageName+'|'+kind+'|'+bSec; if(TM[key]) return TM[key]; let late=0, n=0, all=0;
  for(const f of HIST){ let txt=''; try{ txt=fs.readFileSync(f.replace('{k}',kind),'utf8'); }catch{ continue; }
    for(const l of txt.split('\n')){ if(!l.trim()) continue; const r=JSON.parse(l); for(const t of r.tried||[]){ const m=t.match(/^(.+?)([✓✗])\((\d+)s\)/); if(!m||m[1]!==stageName) continue; all++;
        const ok=m[2]==='✓', sec=+m[3]; if(ok&&sec<=bSec) continue; n++; if(ok) late++; } } }
  const p=(late+0.5)/(n+1); const th=+process.env.PROBE_TIME_TH||0.05;
  return TM[key]={p,th:n>=10?th:0,n,late,all}; }   // fewer than 10 informative runs -> never skip
