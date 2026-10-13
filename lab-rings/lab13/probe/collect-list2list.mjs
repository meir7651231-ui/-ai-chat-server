// Extra suite-1 history for the time-only probe of the decide-frames stage (מסגרות-החלטה): run it on EVERY suite-1 list2list task
// with its normal (learned) budget and record "stage✓/✗(Ns)" like the bench files do. SUITE 1 ONLY. (cwd = lab)
import fs from 'fs'; import { genFor } from '../brain-all.mjs'; import { ifCompose } from '../ifcomp.mjs'; import { learnedBudget } from '../stagestats.mjs';
const OUT=process.argv[2]||'probe/train-list2list.jsonl'; const DIR='../suite';
const done=new Set(); try{ for(const l of fs.readFileSync(OUT,'utf8').split('\n').filter(Boolean)) done.add(JSON.parse(l).key); }catch{}
const ms=Math.min(240000,learnedBudget('מסגרות-החלטה')||240000);
for(const f of fs.readdirSync(DIR).filter(f=>f.endsWith('.json')).sort()) for(const t of JSON.parse(fs.readFileSync(DIR+'/'+f,'utf8')).tasks){ if(t.kind!=='list2list') continue; const key=f+'|'+t.name; if(done.has(key)) continue;
  const gen=genFor(t); const s=Date.now(); let r=null; try{ r=ifCompose(gen,{ms}); }catch{} const sec=(Date.now()-s)/1000;
  const row={key,name:t.name,kind:'list2list',ms,tried:[`מסגרות-החלטה${r&&r.prog?'✓':'✗'}(${sec.toFixed(0)}s)`]}; fs.appendFileSync(OUT,JSON.stringify(row)+'\n'); console.log(row.name,row.tried[0]); }
console.log('done'); process.exit(0);
