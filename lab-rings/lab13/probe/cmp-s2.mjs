// compare a suite-2 run (probe/s2-<tag>-<kind>.jsonl) with the baseline fast2-s2-<kind>.jsonl: solved, lost/new, time (sum of ms), CPU (bash time)
import fs from 'fs'; const tag=process.argv[2]||'p1';
const rd=f=>{ try{ return fs.readFileSync(f,'utf8').trim().split('\n').filter(Boolean).map(JSON.parse); }catch{ return []; } };
let TB=0, TN=0, CPU=0, SB=0, SN=0, NB=0, NN=0;
for(const k of ['num','list2num','list2list']){ const B=rd(`fast2-s2-${k}.jsonl`), N=rd(`probe/s2-${tag}-${k}.jsonl`); const bm=new Map(B.map(r=>[r.key,r]));
  const lost=[], gained=[]; let tb=0, tn=0; for(const r of N){ const b=bm.get(r.key); if(!b) continue; tb+=b.ms; tn+=r.ms; const okN=r.ok&&r.reloc!==false, okB=b.ok&&b.reloc!==false; if(okB&&!okN) lost.push(r.name); if(!okB&&okN) gained.push(r.name); }
  let cpu=null; try{ const t=fs.readFileSync(`probe/s2-${tag}-${k}.time`,'utf8'); const m=t.match(/real ([\d.]+) user ([\d.]+) sys ([\d.]+)/); if(m) cpu={real:+m[1],user:+m[2],sys:+m[3]}; }catch{}
  const sb=B.filter(r=>r.ok).length, sn=N.filter(r=>r.ok&&r.reloc!==false).length; SB+=sb; SN+=sn; NB+=B.length; NN+=N.length; TB+=tb; TN+=tn; if(cpu) CPU+=cpu.user+cpu.sys;
  console.log(`${k.padEnd(9)} rows ${N.length}/${B.length} · solved ${sn} (base ${sb}) · lost ${lost.length}${lost.length?' '+lost.join(', '):''} · new ${gained.length}${gained.length?' '+gained.join(', '):''} · task time ${(tn/3600e3).toFixed(3)} h (base ${(tb/3600e3).toFixed(3)} h, x${(tb/Math.max(tn,1)).toFixed(2)})${cpu?` · process CPU ${((cpu.user+cpu.sys)/3600).toFixed(3)} h, wall ${(cpu.real/3600).toFixed(3)} h`:''}`);
  const st={}; for(const r of N) for(const t of r.tried||[]){ const m=t.match(/^(.+?)([✓✗])\((\d+)s\)/); if(!m) continue; const s=st[m[1]]=st[m[1]]||{ok:0,okS:0,bad:0,badS:0}; if(m[2]==='✓'){ s.ok++; s.okS+=+m[3]; } else { s.bad++; s.badS+=+m[3]; } }
  for(const [n,s] of Object.entries(st)) console.log('     ',n.padEnd(24),JSON.stringify(s)); }
console.log(`TOTAL solved ${SN}/${NN} (base ${SB}/${NB}) · task time ${(TN/3600e3).toFixed(3)} h vs base ${(TB/3600e3).toFixed(3)} h (x${(TB/Math.max(TN,1)).toFixed(2)}) · process CPU ${(CPU/3600).toFixed(3)} h`);
