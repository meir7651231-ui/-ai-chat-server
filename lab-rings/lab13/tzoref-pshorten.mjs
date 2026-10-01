// מקצר מהיר: 4 עובדים במקביל, כל אחד מסלול אחר; לוקחים את הקצר. אחר-כך — עוד סבב מהתוצאה הטובה (כולם מתחילים ממנה).
import fs from 'fs'; import { spawn } from 'child_process';
export async function pshorten(name,prog,{minutes=1,rounds=2,workers=4,tag='p'}={}){ let best=prog;
  for(let r=0;r<rounds;r++){ const file=`/tmp/claude-0/-home-user/f7fc857c-d0a9-5552-9b86-ed0f0b4bc3b7/scratchpad/lab13/.ps-${tag}-${r}.json`; fs.writeFileSync(file,JSON.stringify(best));
    const outs=await Promise.all(Array.from({length:workers},()=>new Promise(res=>{ let o=''; const c=spawn(process.execPath,['--max-old-space-size=2500','shorten-worker.mjs',name,file,String(minutes/rounds)],{cwd:'/tmp/claude-0/-home-user/f7fc857c-d0a9-5552-9b86-ed0f0b4bc3b7/scratchpad/lab13'});
      c.stdout.on('data',d=>o+=d); c.on('close',()=>{ const l=o.split('\n').find(x=>x.startsWith('RESULT')); res(l?JSON.parse(l.slice(6)):null); }); })));
    for(const q of outs) if(q&&q.length<best.length) best=q; }
  return best; }
