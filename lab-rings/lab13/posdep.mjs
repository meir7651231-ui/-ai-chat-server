// סקר: אילו כלים במדף «תלויי-מקום» — עובדים רק כשיש בדיוק 3 פקודות לפניהם (כמו בבודק), ונשברים במקום אחר
import fs from 'fs'; import { run } from './machine3s.mjs'; import { goals, goalFor } from './tzoref-goals.mjs';
const G=goals(); const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8'));
const pre=(p,n)=>{ const P=[]; for(let i=0;i<n;i++) P.push(i%2?['GO']:['WHERE',0]); return [...P,...p.map(x=>x[2]==='code'?['WHERE',x[1]+n,'code']:x)]; };
const out=[]; let dep=0;
for(const b of sh.named){ const g=goalFor(b.name,b,G); if(!g) continue; let ok3=0, okX=0; const T=150;
  for(let t=0;t<T;t++){ const e=g(); const r3=run(pre(b.prog,4),e.mem,{maxSteps:300000}); if(r3&&!r3.st.length&&e.ok(r3.mem)) ok3++; const n=10+2*(t%5); const rx=run(pre(b.prog,n),e.mem,{maxSteps:300000}); if(rx&&!rx.st.length&&e.ok(rx.mem)) okX++; }
  if(okX<T){ dep++; out.push(`${b.name} | ${b.prog.length} פקודות | ליד ההתחלה ${ok3}/${T} · במקום אחר ${okX}/${T}`); } }
console.log(out.join('\n')); console.log(`תלויי-מקום: ${dep} מתוך ${sh.named.length}`); process.exit(0);
