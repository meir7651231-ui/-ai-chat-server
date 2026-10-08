import fs from 'fs'; import { run } from './machine3s.mjs'; import { genFor, keepList } from './brain-all.mjs'; import { deepRelocOk, repairJumps } from './jumpfix.mjs';
const rows=fs.readFileSync('bench2-list.jsonl','utf8').trim().split('\n').map(l=>JSON.parse(l));
const passes=(p,g,n)=>{ for(let k=0;k<n;k++){ const e=g(); const z=run(p,e.mem,{maxSteps:600000}); if(!z||z.st.length||!e.ok(z.mem)) return false; } return true; };
for(const name of ['השני בקטנו','יש שני מספרים עוקבים?']){ const r=rows.find(x=>x.name===name); const g=genFor(r); const fx=repairJumps(r.prog,g);
  console.log(name,'deep(raw):',deepRelocOk(r.prog,()=>{const e=g(); return {...e,ok:m=>m[2]===e.want};}),'repaired:',!!fx, fx&&fx.length, fx&&'deep:'+deepRelocOk(fx,()=>{const e=g(); return {...e,ok:m=>m[2]===e.want};}), fx&&'wrapped strict:'+passes(keepList(fx),g,20000)); }
