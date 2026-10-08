// הפתרונות ההורסים מסבב 2: האם «שומר-רשימה» מתקן אותם? (בדיקה קשוחה, 20000 דוגמאות)
import fs from 'fs'; import { run } from './machine3s.mjs'; import { genFor, keepList } from './brain-all.mjs';
const rows=fs.readFileSync(process.argv[2]||'bench2-list.jsonl','utf8').trim().split('\n').map(l=>JSON.parse(l)); let fixed=0, still=0, fine=0;
const passes=(p,g,n)=>{ for(let k=0;k<n;k++){ const e=g(); const z=run(p,e.mem,{maxSteps:600000}); if(!z||z.st.length||!e.ok(z.mem)) return false; } return true; };
for(const r of rows){ if(r.kind!=='list2num'||!r.ok) continue; const g=genFor(r); if(passes(r.prog,g,20000)){ fine++; continue; } const w=keepList(r.prog); const ok=passes(w,g,20000); ok?fixed++:still++; console.log((ok?'✓ תוקן ':'✗ עדיין ')+r.name+`  (${r.prog.length}⇒${w.length})`); }
console.log(`שלמים מלכתחילה: ${fine} · תוקנו בעטיפה: ${fixed} · עדיין הורסים: ${still}`);
