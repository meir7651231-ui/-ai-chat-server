// בדיקה: המנוע המהיר (run) נותן בדיוק אותה תוצאה כמו המנוע המקורי (runSlow) — על כל כלי במדף, כל פתרון-מבחן, ותוכניות אקראיות ומשובשות
import fs from 'fs'; import { run, runSlow } from './machine3s.mjs';
const R=k=>Math.floor(Math.random()*k); const OPS=['WHERE','WHERE@','GO','JUMP','TAKE','PUT','ADD','SHR','CALC'];
const progs=[]; const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); for(const b of sh.named) progs.push(b.prog); for(const l of sh.logic||[]) progs.push(l.prog);
for(const f of fs.readdirSync('.').filter(f=>/^bench[345]-.*\.jsonl$/.test(f))) for(const l of fs.readFileSync(f,'utf8').trim().split('\n')){ const r=JSON.parse(l); if(r.prog) progs.push(r.prog); }
const rand=()=>Array.from({length:5+R(40)},()=>{ const o=OPS[R(9)]; return o==='WHERE'?(Math.random()<0.2?['WHERE',R(45),'code']:['WHERE',R(16)]):[o]; });
const mutate=p=>{ const q=p.map(x=>x.slice()); for(let k=0;k<1+R(3);k++){ const i=R(q.length); const o=OPS[R(9)]; q[i]=o==='WHERE'?['WHERE',R(16)]:[o]; } return q; };
let n=0, bad=0; const t0=Date.now(); let tf=0, ts=0;
for(let round=0;round<+(process.argv[2]||3);round++) for(const p0 of progs){ for(const p of [p0,mutate(p0),rand()]) for(let k=0;k<4;k++){ const m=Array.from({length:16},()=>R(16)); const o={maxSteps:[50,2000,600000][R(3)],scramble:R(2)?0:1+R(1e6)};
    let a=performance.now(); const x=run(p,m,o); tf+=performance.now()-a; a=performance.now(); const y=runSlow(p,m,o); ts+=performance.now()-a; n++; if(JSON.stringify(x)!==JSON.stringify(y)){ if(bad++<3) console.log('DIFF',JSON.stringify(p).slice(0,200),JSON.stringify(x).slice(0,150),JSON.stringify(y).slice(0,150)); } } }
console.log(`השוואות: ${n} · הבדלים: ${bad} · מהיר ${(tf/1000).toFixed(1)}s מול מקורי ${(ts/1000).toFixed(1)}s ⇒ פי ${(ts/tf).toFixed(1)}`);
