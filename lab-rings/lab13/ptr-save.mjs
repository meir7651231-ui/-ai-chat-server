import fs from 'fs'; import { ptrBuild, ptrCompile } from './tzoref-ptr.mjs'; import { shorten, finalCheck, loadShelf } from './tzoref.mjs'; import { goals, goalFor } from './tzoref-goals.mjs';
const G=goals(); const nm=process.argv[2]; const gen=goalFor(nm,{},G); let best=null;
for(let k=0;k<+(process.env.K||2);k++){ const r=ptrBuild(gen); const s=shorten(ptrCompile(r),gen,{minutes:+process.env.MIN||3,quiet:1,tag:nm}).prog; if(!best||s.length<best.length) best=s; }
const fc=finalCheck(best,gen); const sh=loadShelf(); const cur=sh.named.find(b=>b.name===nm);
console.log(`${nm}: במדף ${cur.prog.length} · הצורף ${best.length} · בדיקה ${fc.n-fc.bad}/${fc.n}`);
if(!fc.bad&&best.length<cur.prog.length){ cur.prog=best; cur.by='הצורף · בונה-חצים (לבד)'; fs.writeFileSync('shelf3.json',JSON.stringify(sh)); console.log('⇒ נכנס למדף'); } process.exit(0);
