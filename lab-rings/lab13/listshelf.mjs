// כל משימות-הרשימה האמיתיות (ר1–ר10) נכנסות למדף: נבנות ⇒ מתקצרות ⇒ בדיקה מלאה
import { solve } from './tzoref-solve.mjs'; import { goals, goalFor } from './tzoref-goals.mjs'; import { shorten, finalCheck } from './tzoref.mjs'; import fs from 'fs';
const G=goals(); const names=Object.keys(G).filter(n=>/^ר\d+ /.test(n));
for(const name of names){ let sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); if(sh.named.some(b=>b.name===name)){ console.log('כבר במדף:',name); continue; }
  const g=G[name]; const gen=goalFor(name,{ins:g.ins},G); const t=Date.now();
  const r=await Promise.race([solve(name,gen,g,{splitMin:3}),new Promise(res=>setTimeout(()=>res({prog:null}),360000))]);
  if(!r.prog){ console.log('✗',name); continue; } let s=r.prog; try{ s=shorten(r.prog,gen,{minutes:+process.env.MIN||2,quiet:9}).prog; }catch{}
  const fc=finalCheck(s,gen); if(fc.bad){ console.log('✗ (בדיקה)',name); continue; }
  sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); sh.named.push({name,prog:s,ins:g.ins||[],out:2,by:'רשימות'}); fs.writeFileSync('shelf3.json',JSON.stringify(sh));
  console.log(`✓ ${name}: נבנה ${r.prog.length} ⇒ קוצר ${s.prog?s.prog.length:s.length} · ${((Date.now()-t)/1000).toFixed(0)} שנ׳ ⇒ במדף`); }
process.exit(0);
