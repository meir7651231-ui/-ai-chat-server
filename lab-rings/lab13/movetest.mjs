import fs from 'fs'; import * as TZ from './tzoref.mjs'; import { goals, goalFor } from './tzoref-goals.mjs'; import { movePass } from './movepass.mjs';
const G=goals(); const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); const re=new RegExp(process.env.RE||'^ש[1234] ');
let tot0=0,tot1=0; const SAVE=process.env.SAVE==='1';
for(const b of sh.named.filter(b=>re.test(b.name))){ const g=G[b.name]; if(!g){ console.log('אין יעד',b.name); continue; } const gen=goalFor(b.name,{ins:g.ins},G);
  const fast=TZ.makeChecker(gen,40), full=TZ.makeChecker(gen,300); const ok=q=>fast(q)&&full(q); const t=Date.now();
  const q=movePass(b.prog,ok); const fc=TZ.finalCheck(q,gen,20000); const good=!fc.bad&&q.length<b.prog.length;
  tot0+=b.prog.length; tot1+=good?q.length:b.prog.length;
  console.log(`${b.name}: ${b.prog.length} ⇒ ${q.length}${fc.bad?' ✗בדיקה':''} · ${((Date.now()-t)/1000).toFixed(0)} שנ׳`);
  if(good&&SAVE) b.prog=q; }
console.log(`סך: ${tot0} ⇒ ${tot1}`); if(SAVE){ fs.copyFileSync('shelf3.json','shelf3.before-movepass.json'); fs.writeFileSync('shelf3.json',JSON.stringify(sh)); console.log('נשמר'); }
process.exit(0);
