// deterministic valueBuild run (seeded Math.random) for equivalence tests: VSLOW=1 -> original search, else fast search
// args: seed suiteDir file taskName maxSize maxBank keep ms
let s=(+process.argv[2])>>>0; Math.random=()=>{ s=(s+0x6D2B79F5)>>>0; let t=s; t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61); return ((t^(t>>>14))>>>0)/4294967296; };
import fs from 'fs'; import { performance } from 'perf_hooks';
const LAB=process.env.LAB; process.chdir(LAB);
const [,, , dir, file, name, maxSize, maxBank, keep, ms]=process.argv;
const t=JSON.parse(fs.readFileSync(dir+'/'+file,'utf8')).tasks.find(x=>x.name===name);
const B=await import(LAB+'/brain-all.mjs'); const V=await import(LAB+'/tzoref-value.mjs');
if(keep) process.env.VKEEP=keep;
const gen=B.genFor(t); const t0=performance.now();
const r=V.valueBuild(gen,{name:t.name,ins:t.ins,out:2,ms:+ms||1e9,maxSize:+maxSize||3,maxBank:+maxBank||3000000});
const real=performance.now()-t0; const VC=await import(LAB+'/vclock.mjs');
console.log(JSON.stringify({expr:r.expr?V.show(r.expr):null,made:r.made,prog:r.prog?JSON.stringify(r.prog):null,why:r.why||null,real:Math.round(real),vms:r.ms,model:Math.round(VC.stats.model),freal:Math.round(VC.stats.real)}));
process.exit(0);
