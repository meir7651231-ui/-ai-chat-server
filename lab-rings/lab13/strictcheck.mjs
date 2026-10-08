// בדיקה קשוחה: פתרונות «רשימה⇒מספר» — האם הרשימה נשארה שלמה?
import fs from 'fs'; import { run } from './machine3s.mjs'; import { genFor } from './brain-all.mjs';
const walk=m=>{ const o=[]; let a=m[1]; for(let i=0;a&&i<10;i++){ o.push(a); a=m[a]; } return o; };
const file=process.argv[2]||'bench2-list.jsonl'; const rows=fs.readFileSync(file,'utf8').trim().split('\n').map(l=>JSON.parse(l));
let ok=0, broke=0;
for(const r of rows){ if(r.kind!=='list2num'||!r.ok||!r.prog) continue; const gen=genFor(r); let bad=0;
  const pre=[['WHERE',0],['GO'],['WHERE',0]]; // אותה קידומת כמו הבודק
  for(let k=0;k<3000;k++){ const e=gen(); const before=JSON.stringify(walk(e.mem)); const z=run(r.prog,e.mem,{maxSteps:600000}); if(!z||!e.ok(z.mem)||JSON.stringify(walk(z.mem))!==before){ bad++; } }
  if(bad) broke++; else ok++; console.log((bad?'✗ הורס ':'✓ שלם  ')+r.name+'  · '+r.stage+(bad?`  (${bad}/3000)`:'')); }
console.log(`שלמים: ${ok} · הורסים: ${broke}`);
