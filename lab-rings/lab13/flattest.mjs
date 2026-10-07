// (1) לכל כלי-סולם: שומרים מתכון (expr). (2) לכל משימת-סולם: הידור רגיל מול «פריסה ושיתוף» — אורך + בדיקה
import fs from 'fs'; import { valueBuild, show } from './tzoref-value.mjs'; import { goals, goalFor } from './tzoref-goals.mjs'; import * as TZ from './tzoref.mjs'; import { flatten, compileDAG, countNodes, treeSize } from './tzoref-flat.mjs';
const G=goals(); const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8'));
const names=sh.named.filter(b=>/^ש[123] /.test(b.name)).map(b=>b.name);
const lvOf=n=>{ const m=n.match(/^ש(\d)/); return m?+m[1]:0; }; const fns=e=>e.cell!=null?[]:[e.f,...[e.a,e.b,e.c].filter(Boolean).flatMap(fns)];
const circ=b=>b.expr&&fns(b.expr).some(f=>lvOf(f)>=lvOf(b.name));
if(process.env.REC){ for(const n of names){ const b=sh.named.find(x=>x.name===n); if(b.expr&&!circ(b)) continue; const g=G[n]; const gen=goalFor(n,{ins:g.ins},G); const ban=names.filter(m=>lvOf(m)>=lvOf(n)); delete b.expr; const v=valueBuild(gen,{name:n,ins:g.ins,out:2,ms:90000,ban}); if(v.expr){ b.expr=v.expr; console.log('מתכון',n,'=',show(v.expr).slice(0,100)); } else console.log('✗ אין מתכון',n); }
  fs.writeFileSync('shelf3.json',JSON.stringify(sh)); }
const blocks=new Map(sh.named.map(b=>[b.name,b]));
for(const n of names){ const b=blocks.get(n); if(!b.expr) continue; const g=G[n]; const gen=goalFor(n,{ins:g.ins},G); const chk=TZ.makeChecker(gen,300);
  const fl=flatten(b.expr,blocks); let best=null; for(let t=0;t<60;t++){ const p=compileDAG(fl,{ins:g.ins,out:2,blocks,placements:TZ.placements,rnd:t>0}); if(p&&chk(p)&&(!best||p.length<best.length)) best=p; }
  const fc=best?TZ.finalCheck(best,gen,5000):null;
  console.log(`${n}: במדף ${b.prog.length} · פריסה: עץ ${treeSize(fl)} חלקים ⇒ ${countNodes(fl)} שונים · הידור-גרף ${best?best.length+(fc.bad?' ✗':' ✓'):'נכשל'}`); }
process.exit(0);
