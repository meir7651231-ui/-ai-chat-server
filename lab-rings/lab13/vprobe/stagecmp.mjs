// per-stage seconds (from the tried field) summed over the speed set: baseline vs run(s)
import fs from 'fs';
const load=f=>fs.readFileSync(f,'utf8').split('\n').filter(Boolean).map(JSON.parse);
const files=process.argv.slice(2); const sets=files.map(load);
const agg=rows=>{ const m={}; for(const r of rows) for(const t of r.tried||[]){ const x=t.match(/^(.+?)([✓✗])\((\d+)s\)/); if(!x) continue; const k=r.kind+' '+x[1]; m[k]=m[k]||{s:0,n:0,w:0}; m[k].s+=+x[3]; m[k].n++; if(x[2]==='✓') m[k].w++; } return m; };
const A=sets.map(agg); const keys=[...new Set(A.flatMap(a=>Object.keys(a)))].sort();
console.log('stage'.padEnd(34)+files.map(f=>f.split('/').pop().slice(0,22).padStart(24)).join(''));
for(const k of keys) console.log(k.padEnd(34)+A.map(a=>a[k]?`${a[k].s}s (${a[k].w}/${a[k].n})`.padStart(24):''.padStart(24)).join(''));
