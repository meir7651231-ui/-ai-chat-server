// Training data for the probes, num kind - SUITE 1 ONLY (cwd = lab).
//   per task: probes (value/loop/case, short) + their signals, then the label: does the stage succeed with its normal budget
//   (a probe that already solved = success at that time), plus a short bits run (time + length).
//   usage: nice -n 5 node probe/collect-num.mjs <out.jsonl>   (resumable; appends one row per task)
import fs from 'fs'; import { genFor } from '../brain-all.mjs'; import * as P from '../probe-signals.mjs';
import { valueBuild } from '../tzoref-value.mjs'; import { loopBuild } from '../numloop.mjs'; import { caseBuild } from '../tzoref-case.mjs'; import { bitsliceSolve } from '../bitslice.mjs';
const OUT=process.argv[2]||'probe/train-num.jsonl'; const DIR='../suite';
const B={vp:+process.env.VP||15000,lp:+process.env.LP||6000,cp:+process.env.CP||10000,vf:90000,lf:60000,cf:107000,bits:20000};
const done=new Set(); try{ for(const l of fs.readFileSync(OUT,'utf8').split('\n').filter(Boolean)) done.add(JSON.parse(l).key); }catch{}
const tasks=[]; for(const f of fs.readdirSync(DIR).filter(f=>f.endsWith('.json')).sort()) for(const t of JSON.parse(fs.readFileSync(DIR+'/'+f,'utf8')).tasks) if(t.kind==='num') tasks.push({...t,file:f});
const only=process.env.ONLY?new Set(process.env.ONLY.split(',').map(Number)):null;
for(let i=0;i<tasks.length;i++){ const t=tasks[i]; const key=t.file+'|'+t.name; if(done.has(key)||(only&&!only.has(i))) continue; const gen=genFor(t); const row={key,name:t.name,K:t.ins.length,B};
  const timed=async f=>{ const s=Date.now(); let r=null; try{ r=await f(); }catch(e){ r={prog:null,err:String(e.message||e).slice(0,80)}; } return {ok:!!(r&&r.prog),sec:(Date.now()-s)/1000,len:r?.prog?.length??null}; };
  const pv=await P.probeValue(gen,t,B.vp); const pl=await P.probeLoop(gen,t,B.lp); const pc=await P.probeCase(gen,t,B.cp);
  row.table=pc.table; row.probe={value:{ok:pv.ok,sec:pv.sec,...pv.sig},loop:{ok:pl.ok,sec:pl.sec,...pl.sig},case:{ok:pc.ok,sec:pc.sec,...pc.sig}};
  row.full={ value: pv.ok?{ok:true,sec:pv.sec,from:'probe'}:await timed(()=>valueBuild(gen,{name:t.name,ins:t.ins,out:2,ms:B.vf})),
             loop:  pl.ok?{ok:true,sec:pl.sec,from:'probe'}:await timed(()=>loopBuild(gen,{ins:t.ins,ms:B.lf})),
             case:  pc.ok?{ok:true,sec:pc.sec,from:'probe'}:await timed(()=>caseBuild(gen,{ins:t.ins,ms:B.cf})),
             bits:  await timed(()=>bitsliceSolve(gen,{ins:t.ins,ms:B.bits})) };
  fs.appendFileSync(OUT,JSON.stringify(row)+'\n');
  console.log(i,t.name,JSON.stringify(row.probe),JSON.stringify(row.full)); }
console.log('done'); process.exit(0);
