// run the instrumented ORIGINAL engine (vprobe/value-calib.mjs) on tasks; append per-phase rows {ph,NN,dt,d(counters),heap} to OUT
// args: OUT ms dir:file:name [dir:file:name ...]   (VSEED optional)
import fs from 'fs';
if(process.env.VSEED){ let s=(+process.env.VSEED)>>>0; Math.random=()=>{ s=(s+0x6D2B79F5)>>>0; let t=s; t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61); return ((t^(t>>>14))>>>0)/4294967296; }; }
const LAB=process.env.LAB; process.chdir(LAB);
const [OUT,ms,...specs]=process.argv.slice(2);
const B=await import(LAB+'/brain-all.mjs'); const V=await import(LAB+'/'+(process.env.VMOD||'vprobe/value-calib.mjs'));
for(const sp of specs){ const [dir,file,name]=sp.split(':'); const t=JSON.parse(fs.readFileSync(dir+'/'+file,'utf8')).tasks.find(x=>x.name===name);
  globalThis.__CAL=[]; const gen=B.genFor(t); const t0=Date.now(); const r=V.valueBuild(gen,{name:t.name,ins:t.ins,out:2,ms:+ms});
  const w=Date.now()-t0; fs.appendFileSync(OUT,globalThis.__CAL.map(x=>JSON.stringify({task:name,...x})).join('\n')+'\n');
  console.log(`${name}: ${r.prog?'found':'none'} wall ${(w/1000).toFixed(1)}s rows ${globalThis.__CAL.length} phase-sum ${(globalThis.__CAL.reduce((a,x)=>a+x.dt,0)/1000).toFixed(1)}s`); }
process.exit(0);
