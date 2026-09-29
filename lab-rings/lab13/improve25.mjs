import fs from 'fs'; import { makeSpecs } from './specs.mjs'; import { checker, shrink, anneal } from './tools2.mjs';
const MS=+process.argv[2]||3000; const {S}=makeSpecs(11); const lib=JSON.parse(fs.readFileSync('lib2.json','utf8')); const out=[]; let before=0, after=0;
for(const b of lib){ const gen=S[b.name]; if(!gen){ console.log('אין מבחן:',b.name); out.push(b); continue; }
  const fast=checker(gen,40), full=checker(gen,300), fresh=checker(gen,3000); const ok=(p)=>fast(p)&&full(p);
  if(!fresh(b.prog)){ console.log('✗ המקור לא עובר את המבחן:',b.name); out.push(b); continue; }
  const t=Date.now(); let p=shrink(b.prog,ok); p=anneal(p,ok,MS,4,7); const good=fresh(p);
  before+=b.prog.length; after+=good?p.length:b.prog.length;
  console.log(`${good?'✓':'✗'} ${b.name}: ${b.prog.length} → ${p.length}${good?'':' (נכשל בבדיקה החדשה — נשאר המקור)'} · ${((Date.now()-t)/1000).toFixed(0)}s`);
  out.push(good&&p.length<b.prog.length?{...b,prog:p,by:(b.by||'')+' · קוצר במנוע החדש'}:b); }
console.log(`סה"כ: ${before} → ${after}`); fs.writeFileSync('lib3.json',JSON.stringify(out));
