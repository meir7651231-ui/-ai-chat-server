// מבחן גדול: «המוח האחד» על 20 משימות חדשות — בלי שום עזרה. כל משימה: עד 6 דקות.
import { solve } from './tzoref-solve.mjs'; import { goals, goalFor } from './tzoref-goals.mjs'; import fs from 'fs';
const G=goals(); const names=Object.keys(G).filter(n=>/^[מר]\d+ /.test(n)); const rows=[];
for(const name of names){ const g=G[name]; const gen=goalFor(name,{ins:g.ins},G); const t=Date.now();
  const r=await Promise.race([solve(name,gen,g,{splitMin:3}),new Promise(res=>setTimeout(()=>res({prog:null,how:null,tried:['(נגמר הזמן)'],ms:360000}),360000))]);
  const line=`${r.prog?'✓':'✗'} ${name.padEnd(30)} ${r.prog?String(r.prog.length).padStart(4)+' פקודות':'         '} ${((Date.now()-t)/1000).toFixed(1).padStart(6)} שנ׳ · ${r.prog?r.how:'ניסה: '+r.tried.join(' ⇒ ')}`;
  console.log(line); rows.push(line); fs.writeFileSync('bigtest.log',rows.join('\n')+'\n'); }
console.log(`\nסיכום: ${rows.filter(l=>l.startsWith('✓')).length} מתוך ${rows.length} נבנו לבד`); process.exit(0);
