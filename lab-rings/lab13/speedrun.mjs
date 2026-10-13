// speedrun.mjs - the fixed speed measurement.
//   usage:  nice -n 5 node /tmp/claude-0/-home-user/f7fc857c-d0a9-5552-9b86-ed0f0b4bc3b7/scratchpad/speedrun.mjs <labdir> <out.jsonl>
//   Runs every task of speedset.json (next to this file) through <labdir>/brain-all.mjs solveAny, sequentially, in one process,
//   after resetting the lab to the same start state for everyone:
//     shelf3.json / tzoref-learned-goals.json  <- frozen copies of shelf3.before-bench100.json / tzoref-learned-goals.before-bench100.json
//     the machine's mutable history + caches   <- frozen copies in speedset-state/ (stage-stats.jsonl, numloop-prims.json, scan-tables-cache.json, ...)
//                                               (SPEEDRUN_KEEPSTATE=1 skips this second part; the shelf reset always happens)
//   Per task: wall ms and CPU seconds around solveAny only (process.cpuUsage covers the main thread + worker threads;
//   waited-for child processes are added from /proc/self/stat cutime+cstime).
//   Every solution is then re-verified OUTSIDE the timing with a frozen reference copy (speedset-ref/): 20000 strict examples
//   (list unchanged for list2num, empty stack) and deepRelocOk(n=200). valid = ok && strict && reloc.
//   Appends one row per task to <out.jsonl>: {name,kind,ok,ms,cpu,stage,reloc,strict,valid,from,file,...,run}.
//   At the end prints a table and, if speedset-baseline.jsonl exists (and is not <out.jsonl>), the comparison against it.
//   Options (env): SPEEDRUN_ONLY=0,3,7 (task indices; subset runs are flagged subset:true) · SPEEDRUN_KEEPSTATE=1 · SPEEDSET=<other set file>.
import fs from 'fs'; import path from 'path'; import os from 'os'; import { fileURLToPath, pathToFileURL } from 'url'; import { performance } from 'perf_hooks'; import crypto from 'crypto';
const HERE=path.dirname(fileURLToPath(import.meta.url));
const [labArg,outArg]=process.argv.slice(2);
if(!labArg||!outArg){ console.error('usage: node speedrun.mjs <labdir> <out.jsonl>'); process.exit(2); }
const LAB=path.resolve(labArg), OUT=path.resolve(outArg);
const SET=path.resolve(process.env.SPEEDSET||path.join(HERE,'speedset.json')), STATE=path.join(HERE,'speedset-state'), REF=path.join(HERE,'speedset-ref');
const BASE=path.join(HERE,'speedset-baseline.jsonl');
if(fs.realpathSync(LAB)===fs.realpathSync(path.join(HERE,'lab13'))){ console.error('refusing to run in lab13 itself (it must not be edited) - make a copy first'); process.exit(2); }
if(!fs.existsSync(path.join(LAB,'brain-all.mjs'))){ console.error('no brain-all.mjs in '+LAB); process.exit(2); }
try{ if(os.getPriority()<5) os.setPriority(5); }catch{}

// ---- 1. reset the lab to the common start state ----
const md5=f=>{ try{ return crypto.createHash('md5').update(fs.readFileSync(f)).digest('hex'); }catch{ return null; } };
for(const [frozen,live] of [['shelf3.before-bench100.json','shelf3.json'],['tzoref-learned-goals.before-bench100.json','tzoref-learned-goals.json']]){
  const fz=path.join(STATE,frozen), own=path.join(LAB,frozen);
  if(fs.existsSync(own)&&md5(own)!==md5(fz)) console.warn(`WARNING: ${own} differs from the frozen copy - using the frozen copy`);
  fs.copyFileSync(fz,path.join(LAB,live)); }
const restored=[];
if(!process.env.SPEEDRUN_KEEPSTATE) for(const f of fs.readdirSync(STATE)){ if(/before-bench100/.test(f)) continue; fs.copyFileSync(path.join(STATE,f),path.join(LAB,f)); restored.push(f); }
const ENVK=['NUMMS','VMS','LOOPMS','CASEMS','POMS','SCANMS','HFMS','PICKMS','WIDEMS','POSMS','IFPMS','CUTMS','IFMS','KSMS','IFEMS','BSRESERVE','STAGEOFF','LOOPFIRST','NUMOFF','LOOSELIST','LADDER_CAP','LADDER_CAPS','MAXTOOL','SHELVE'];
const envSet=Object.fromEntries(ENVK.filter(k=>process.env[k]!==undefined).map(k=>[k,process.env[k]]));
if(Object.keys(envSet).length) console.warn('WARNING: search env overrides are set:',JSON.stringify(envSet));

// ---- 2. load the lab (cwd = lab: the machine reads its files relative to cwd) and the frozen verifier ----
process.chdir(LAB);
const B=await import(pathToFileURL(path.join(LAB,'brain-all.mjs')).href);
const RJ=await import(pathToFileURL(path.join(REF,'jumpfix.mjs')).href), RM=await import(pathToFileURL(path.join(REF,'machine3s.mjs')).href), RG=await import(pathToFileURL(path.join(REF,'refgen.mjs')).href);
let CLK=100; try{ CLK=+(await import('child_process')).execSync('getconf CLK_TCK').toString().trim()||100; }catch{}
const childSec=()=>{ try{ const s=fs.readFileSync('/proc/self/stat','utf8'); const f=s.slice(s.lastIndexOf(')')+2).split(' '); return ((+f[13])+(+f[14]))/CLK; }catch{ return 0; } };
const strictOk=(prog,spec,n=20000)=>{ const g=RG.genFor(spec); for(let k=0;k<n;k++){ const e=g(); const z=RM.run(prog,e.mem,{maxSteps:600000}); if(!z||z.st.length||!e.ok(z.mem)) return false; } return true; };

// ---- 3. run ----
const {tasks}=JSON.parse(fs.readFileSync(SET,'utf8'));
const only=process.env.SPEEDRUN_ONLY?new Set(process.env.SPEEDRUN_ONLY.split(',').map(Number)):null;
const RUN=new Date().toISOString(); const rows=[]; const keyOf=r=>(r.from||'')+'|'+(r.file||'')+'|'+r.name;
console.log(`speedrun ${RUN} · lab ${LAB} · ${tasks.length} tasks${only?' (subset '+[...only]+')':''} · restored ${restored.length} state files${process.env.SPEEDRUN_KEEPSTATE?' (KEEPSTATE)':''}`);
for(let i=0;i<tasks.length;i++){ if(only&&!only.has(i)) continue; const t=tasks[i];
  const k0=childSec(), c0=process.cpuUsage(), t0=performance.now();
  let r; try{ r=await B.solveAny(t); }catch(e){ r={ok:false,prog:null,stage:null,err:String(e&&e.stack||e).slice(0,300),tried:[]}; }
  const ms=Math.round(performance.now()-t0), cu=process.cpuUsage(c0), kc=childSec()-k0;
  const cpu=+((cu.user+cu.system)/1e6+kc).toFixed(2);
  let strict=null, reloc=null; if(r.ok&&r.prog){ strict=strictOk(r.prog,t); reloc=RJ.deepRelocOk(r.prog,RG.genFor(t),{n:200}); }
  const valid=!!(r.ok&&strict&&reloc);
  const {prog,ms:solveMs,...rest}=r;
  const row={name:t.name,kind:t.kind,ok:!!r.ok,ms,cpu,stage:r.stage||null,reloc,strict,valid,from:t.from,file:t.file,idx:i,
    cpuUser:+(cu.user/1e6).toFixed(2),cpuSys:+(cu.system/1e6).toFixed(2),cpuChildren:+kc.toFixed(2),solveMs,len:r.len??null,how:r.how??null,bad:r.bad??null,tried:r.tried||[],err:r.err,
    heapMB:Math.round(process.memoryUsage().heapUsed/1e6),maxRssMB:Math.round(process.resourceUsage().maxRSS/1e3),
    run:RUN,lab:LAB,subset:!!only||undefined,env:Object.keys(envSet).length?envSet:undefined,prog:prog||null};
  fs.appendFileSync(OUT,JSON.stringify(row)+'\n'); rows.push(row);
  console.log(`${valid?'OK ':r.ok?'BAD':' - '} #${String(i).padStart(2)} ${t.kind.padEnd(9)} ${(ms/1000).toFixed(1).padStart(6)}s wall ${cpu.toFixed(1).padStart(6)}s cpu  ${(r.stage||'-')}${r.ok&&!strict?' [STRICT FAIL]':''}${r.ok&&!reloc?' [NOT RELOCATABLE]':''} | ${t.name} | ${(r.tried||[]).join(' ')}`); }

// ---- 4. summary + comparison with the baseline ----
const sum=(a,f)=>a.reduce((s,x)=>s+f(x),0);
console.log(`\nTOTAL this run: valid ${rows.filter(r=>r.valid).length}/${rows.length} · wall ${(sum(rows,r=>r.ms)/1000).toFixed(1)}s · cpu ${sum(rows,r=>r.cpu).toFixed(1)}s`);
if(fs.existsSync(BASE)&&path.resolve(BASE)!==OUT){
  const base=new Map(); for(const l of fs.readFileSync(BASE,'utf8').split('\n').filter(Boolean)){ const j=JSON.parse(l); base.set(keyOf(j),j); }   // last row per task wins
  let lost=0, gained=0; const P=[], C=[];
  console.log('\n idx kind      base:ok    wall     cpu | now:ok    wall     cpu | cpu ratio | name');
  for(const r of rows){ const b=base.get(keyOf(r)); if(!b){ console.log('   (no baseline row) '+r.name); continue; } P.push(b); C.push(r);
    const flag=b.valid&&!r.valid?'  LOST':!b.valid&&r.valid?'  NEW':'';
    if(b.valid&&!r.valid) lost++; if(!b.valid&&r.valid) gained++;
    console.log(` ${String(r.idx).padStart(3)} ${r.kind.padEnd(9)} ${b.valid?'yes':' no'} ${(b.ms/1000).toFixed(1).padStart(8)} ${b.cpu.toFixed(1).padStart(7)} | ${r.valid?'yes':' no'} ${(r.ms/1000).toFixed(1).padStart(8)} ${r.cpu.toFixed(1).padStart(7)} | ${(r.cpu/Math.max(b.cpu,0.01)).toFixed(2).padStart(9)} | ${r.name}${flag}`); }
  const bw=sum(P,x=>x.ms)/1000, bc=sum(P,x=>x.cpu), cw=sum(C,x=>x.ms)/1000, cc=sum(C,x=>x.cpu);
  console.log(`\nBASELINE: valid ${P.filter(x=>x.valid).length}/${P.length} · wall ${bw.toFixed(1)}s · cpu ${bc.toFixed(1)}s`);
  console.log(`NOW     : valid ${C.filter(x=>x.valid).length}/${C.length} · wall ${cw.toFixed(1)}s · cpu ${cc.toFixed(1)}s`);
  console.log(`wall x${(bw/Math.max(cw,0.001)).toFixed(2)} faster · cpu x${(bc/Math.max(cc,0.001)).toFixed(2)} faster · lost ${lost} · new ${gained}`);
  console.log(lost?'VERDICT: DOES NOT COUNT - baseline-solved tasks were lost':'VERDICT: no baseline-solved task lost'+(C.filter(x=>x.valid).length>=P.filter(x=>x.valid).length?'':' (but fewer tasks solved overall)')); }
process.exit(0);
