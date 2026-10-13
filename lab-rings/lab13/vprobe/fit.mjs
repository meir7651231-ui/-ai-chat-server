// fit the cost model of the ORIGINAL value-builder search: dt(ms) = sum coef_k * feature_k (non-negative least squares)
// features: per-NN-scaled counts (s=NN/96) for steps whose cost grows with the vector length
// usage: node vprobe/fit.mjs calib.jsonl [validate.jsonl]
import fs from 'fs';
export const FEATS=['ev1','ev2','ev3','addNew','addDup','addFull','inv','invKey','cover','coverD','pair','trip','close','sortNL','csortNL','candH','sortH','candM'];
export const SCALED=new Set(['ev1','ev2','ev3','addNew','addDup','addFull','invKey','cover','close']);
// candH: candidate steps x heap (GB) of the original engine at that moment (its garbage collector costs more on a bigger heap); sortH: same for sorting
export const feat=(d,NN,heapMB=0,made=0)=>{ const H=heapMB/1000; const cand=((d.ev1||0)+(d.ev2||0)+(d.ev3||0)+(d.addNew||0)+(d.addDup||0)+(d.addFull||0))*NN/96;
  return FEATS.map(k=>k==='candM'?cand*Math.log2(made+2):k==='candH'?cand*H:k==='sortH'?((d.sortNL||0)+(d.csortNL||0))*H:(d[k]||0)*(SCALED.has(k)?NN/96:1)); };
const load=f=>fs.readFileSync(f,'utf8').split('\n').filter(Boolean).map(JSON.parse);
function nnls(X,y,iters=20000){ // projected coordinate descent
  const n=X.length, m=X[0].length; const scale=Array.from({length:m},(_,j)=>Math.sqrt(X.reduce((a,r)=>a+r[j]*r[j],0))||1);
  const Z=X.map(r=>r.map((v,j)=>v/scale[j])); const b=new Float64Array(m); const r=Float64Array.from(y);
  for(let it=0;it<iters;it++){ let ch=0; for(let j=0;j<m;j++){ let g=0, h=0; for(let i=0;i<n;i++){ g+=Z[i][j]*r[i]; h+=Z[i][j]*Z[i][j]; } if(!h) continue; let nb=Math.max(0,b[j]+g/h); const d=nb-b[j]; if(d){ for(let i=0;i<n;i++) r[i]-=d*Z[i][j]; b[j]=nb; ch+=Math.abs(d); } } if(ch<1e-9) break; }
  return Array.from(b,(v,j)=>v/scale[j]); }
if(import.meta.url==='file://'+process.argv[1]){
  const rows=load(process.argv[2]); const X=rows.map(r=>feat(r.d,r.NN,r.heap,r.made)), y=rows.map(r=>r.dt);
  const c=nnls(X,y); const pred=rows.map((r,i)=>X[i].reduce((a,v,j)=>a+v*c[j],0));
  console.log('coef (ms per unit):'); FEATS.forEach((k,j)=>console.log('  ',k.padEnd(8),c[j].toExponential(3)));
  const by=(R,P)=>{ const t={}; let blk=0, prev=null; R.forEach((r,i)=>{ if(r.task!==prev){ blk++; prev=r.task; } const k=r.task+'#'+blk; t[k]=t[k]||{a:0,p:0}; t[k].a+=r.dt; t[k].p+=P[i]; }); return t; };
  const show=(R,P,tag)=>{ const t=by(R,P); let A=0,PP=0; for(const [k,v] of Object.entries(t)){ A+=v.a; PP+=v.p; console.log(`  ${tag} ${k.padEnd(28)} actual ${(v.a/1000).toFixed(1)}s model ${(v.p/1000).toFixed(1)}s ratio ${(v.p/v.a).toFixed(3)}`); } console.log(`  ${tag} TOTAL actual ${(A/1000).toFixed(1)}s model ${(PP/1000).toFixed(1)}s ratio ${(PP/A).toFixed(3)}`);
    const ph={}; R.forEach((r,i)=>{ ph[r.ph]=ph[r.ph]||{a:0,p:0}; ph[r.ph].a+=r.dt; ph[r.ph].p+=P[i]; }); for(const [k,v] of Object.entries(ph)) console.log(`    phase ${k.padEnd(6)} actual ${(v.a/1000).toFixed(1)}s model ${(v.p/1000).toFixed(1)}s`);
    if(process.env.TASKPH){ const q={}; R.forEach((r,i)=>{ if(!r.task.includes(process.env.TASKPH)) return; const k=r.ph; q[k]=q[k]||{a:0,p:0,n:0}; q[k].a+=r.dt; q[k].p+=P[i]; q[k].n++; }); console.log('  ',process.env.TASKPH,JSON.stringify(q)); } };
  show(rows,pred,'fit');
  if(process.argv[3]){ const V=load(process.argv[3]); const PV=V.map(r=>feat(r.d,r.NN,r.heap,r.made).reduce((a,v,j)=>a+v*c[j],0)); show(V,PV,'val'); }
  fs.writeFileSync('vprobe/coef.json',JSON.stringify(Object.fromEntries(FEATS.map((k,j)=>[k,c[j]])),null,1)); }
