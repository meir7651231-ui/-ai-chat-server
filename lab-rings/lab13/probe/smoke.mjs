// smoke test: solveAny on speedset tasks (cwd = lab): node probe/smoke.mjs 5,9,20
import fs from 'fs'; import { solveAny } from '../brain-all.mjs';
const S=JSON.parse(fs.readFileSync('../speedset.json','utf8')).tasks; const ids=(process.argv[2]||'5').split(',').map(Number);
for(const i of ids){ const t=S[i]; const t0=Date.now(); const r=await solveAny(t); console.log(i,t.kind,t.name,r.ok?'OK':'--',((Date.now()-t0)/1000).toFixed(1)+'s',r.stage,r.len,'|',r.tried.join(' ')); }
process.exit(0);
