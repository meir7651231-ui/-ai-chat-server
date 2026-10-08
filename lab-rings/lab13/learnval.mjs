// כלי-מספר חסר ⇒ נבנה מדוגמאות (בונה-ערכים) ⇒ מקוצר ⇒ בדיקה ⇒ מדף + מטרה-נלמדת
import fs from 'fs'; import { valueBuild } from './tzoref-value.mjs'; import { shorten, finalCheck, movable } from './tzoref.mjs';
const R=k=>Math.floor(Math.random()*k);
const TASKS=[['גדול מ-12?',[0],x=>x>12?15:0]];
for(const [name,ins,f] of TASKS){ const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); if(sh.named.some(b=>b.name===name)){ console.log('כבר במדף:',name); continue; }
  const gen=()=>{ const mem=Array.from({length:16},()=>R(16)); const w=f(...ins.map(c=>mem[c])); const keep=ins.map(c=>mem[c]); return {mem,want:w,ok:r=>r[2]===w&&ins.every((c,i)=>r[c]===keep[i])}; };
  const t=Date.now(); const v=valueBuild(gen,{name,ins,out:2,ms:90000}); if(!v.prog){ console.log('✗',name); continue; }
  let s=v.prog; try{ s=shorten(v.prog,gen,{minutes:2,quiet:9}).prog; }catch{} const fc=finalCheck(s,gen); if(fc.bad){ console.log('✗ (בדיקה)',name); continue; }
  const S2=JSON.parse(fs.readFileSync('shelf3.json','utf8')); S2.named.push({name,prog:s,ins,out:2,movable:movable(s,gen),by:'נלמד: חסר לתנאי'}); fs.writeFileSync('shelf3.json',JSON.stringify(S2));
  let LG={}; try{ LG=JSON.parse(fs.readFileSync('tzoref-learned-goals.json','utf8')); }catch{} LG[name]={ins,tt:Array.from({length:16**ins.length},(_,i)=>f(i))}; fs.writeFileSync('tzoref-learned-goals.json',JSON.stringify(LG));
  console.log(`✓ ${name}: נבנה ${v.prog.length} ⇒ קוצר ${s.length} · ${((Date.now()-t)/1000).toFixed(0)} שנ׳ ⇒ במדף`); }
process.exit(0);
