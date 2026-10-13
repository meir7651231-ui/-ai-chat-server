// Training data for the scan probe (list2num) - SUITE 1 ONLY (cwd = lab).
//   per task: the scan's cheap levels (= the probe) with the normal budget, their signals; if unsolved, level C2b alone with the
//   rest of the budget (= the label: would continuing have solved it?).   usage: nice -n 5 node probe/collect-list2num.mjs <out.jsonl>
import fs from 'fs'; import * as P from '../probe-signals.mjs'; import { listGen } from '../listcomp.mjs'; import { foldStaged } from '../scanfold-staged.mjs';
const OUT=process.argv[2]||'probe/train-list2num.jsonl'; const DIR='../suite'; const B={sf:150000};
const done=new Set(); try{ for(const l of fs.readFileSync(OUT,'utf8').split('\n').filter(Boolean)) done.add(JSON.parse(l).key); }catch{}
const tasks=[]; for(const f of fs.readdirSync(DIR).filter(f=>f.endsWith('.json')).sort()) for(const t of JSON.parse(fs.readFileSync(DIR+'/'+f,'utf8')).tasks) if(t.kind==='list2num') tasks.push({...t,file:f});
const only=process.env.ONLY?new Set(process.env.ONLY.split(',').map(Number)):null;
for(let i=0;i<tasks.length;i++){ const t=tasks[i]; const key=t.file+'|'+t.name; if(done.has(key)||(only&&!only.has(i))) continue;
  const gen=listGen(new Function('return ('+t.src+')')()); const row={key,name:t.name,B}; const T0=Date.now();
  const ps=P.probeScanLevels(gen,B.sf); row.probe={scan:{ok:ps.ok,sec:ps.sec,...ps.sig}};
  let full; if(ps.ok) full={ok:true,sec:ps.sec,from:'probe'}; else { const left=B.sf-(Date.now()-T0); const s=Date.now(); let r=null; if(left>5000){ try{ r=foldStaged(gen,{ms:left,levels:P.SCAN_DEAR}); }catch(e){ r={prog:null}; } } full={ok:!!(r&&r.prog),sec:(Date.now()-s)/1000,left:left/1000}; }
  row.full={scan:full}; fs.appendFileSync(OUT,JSON.stringify(row)+'\n'); console.log(i,t.name,JSON.stringify(row.probe),JSON.stringify(row.full)); }
console.log('done'); process.exit(0);
