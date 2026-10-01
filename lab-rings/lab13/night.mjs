// «קיצור-לילה»: עובר על הלבנים הארוכות במדף, מנסה לקצר כל אחת מהגרסה שכבר במדף; שומר רק אם קצר יותר ועבר 20,000 בדיקות
import fs from 'fs'; import { shorten, finalCheck } from './tzoref.mjs'; import { goals, goalFor } from './tzoref-goals.mjs';
const G=goals(); const MIN=+process.env.MIN||2, TOP=+process.env.TOP||30;
const sh0=JSON.parse(fs.readFileSync('shelf3.json','utf8')); const list=sh0.named.filter(b=>G[b.name]&&!b.bad).sort((a,b)=>b.prog.length-a.prog.length).slice(0,TOP).map(b=>b.name);
let saved=0; for(const name of list){ const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); const b=sh.named.find(x=>x.name===name); const g=G[name]; let gen; try{ gen=goalFor(name,{ins:g.ins},G); }catch{ continue; }
  let s; try{ s=shorten(b.prog,gen,{minutes:MIN,quiet:9}); }catch(e){ console.log(`✗ ${name}: ${e.message}`); continue; }
  if(s.prog.length<b.prog.length){ const fc=finalCheck(s.prog,gen); if(!fc.bad){ b.prog=s.prog; fs.writeFileSync('shelf3.json',JSON.stringify(sh)); saved+=b.prog.length; console.log(`✓ ${name}: ${s.prog.length+0} (היה ${JSON.parse(fs.readFileSync(''+(process.env.BK||'shelf3.before-night.json')+'','utf8')).named.find(x=>x.name===name).prog.length})`); continue; } }
  console.log(`· ${name}: נשאר ${b.prog.length}`); }
process.exit(0);
