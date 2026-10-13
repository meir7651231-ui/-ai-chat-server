// equivalence: original search (VSLOW=1) vs fast search, same seed, same task, same limits (time never binds) -> same expr, made, prog
// usage: node vprobe/value-equiv.mjs <config> [taskFilter]   config: a=maxSize3 · b=maxSize4,maxBank150000,keep200 · c=maxSize5,maxBank60000,keep120
import fs from 'fs'; import { execFileSync } from 'child_process';
const S='/tmp/claude-0/-home-user/f7fc857c-d0a9-5552-9b86-ed0f0b4bc3b7/scratchpad'; const LAB=process.cwd();
const cfg={a:['3','3000000','3000'],b:['4','150000','200'],c:['5','60000','120']}[process.argv[2]||'a'];
const tasks=[]; for(const d of ['suite','suite2']) for(const f of fs.readdirSync(S+'/'+d).filter(f=>f.endsWith('.json'))) for(const t of JSON.parse(fs.readFileSync(S+'/'+d+'/'+f,'utf8')).tasks) if(t.kind==='num') tasks.push([d,f,t.name]);
const only=process.argv[3]?new RegExp(process.argv[3]):null; let same=0, diff=0, n=0;
const CF='vprobe/slow-cache.json'; let cache={}; try{ cache=JSON.parse(fs.readFileSync(CF,'utf8')); }catch{}   // the original engine does not change: cache its outputs
for(const [d,f,name] of tasks){ if(only&&!only.test(d+'/'+f+'/'+name)) continue; n++; if(process.env.EVERY&&n%+process.env.EVERY) continue;
  const seed=String(1000+n); const run=slow=>JSON.parse(execFileSync('nice',['-n','5','node','vprobe/vb-det.mjs',seed,S+'/'+d,f,name,...cfg],{env:{...process.env,LAB,...(slow?{VSLOW:'1'}:{})},encoding:'utf8',maxBuffer:1e8}).trim().split('\n').pop());
  const ck=[process.argv[2]||'a',seed,d,f,name].join('|'); const a=cache[ck]||run(true); if(!cache[ck]){ cache[ck]=a; fs.writeFileSync(CF,JSON.stringify(cache)); } const b=run(false); const eq=a.expr===b.expr&&a.made===b.made&&a.prog===b.prog&&a.why===b.why; eq?same++:diff++;
  console.log(`${eq?'SAME':'DIFF'} ${d}/${f} ${name} | expr ${a.expr===b.expr?'=':'≠'} made ${a.made}/${b.made} prog ${a.prog===b.prog?'=':'≠'} | slow ${a.real}ms fast ${b.real}ms (search ${b.freal}ms, model ${b.model}ms) | ${(a.expr||'-').slice(0,60)}`);
  if(!eq) console.log('   slow:',JSON.stringify(a).slice(0,300),'\n   fast:',JSON.stringify(b).slice(0,300)); }
console.log(`equal ${same}/${same+diff}`);
