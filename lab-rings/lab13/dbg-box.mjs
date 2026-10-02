import fs from 'fs'; import * as BS from './tzoref-basic.mjs'; import * as TZ from './tzoref.mjs'; import * as TT from './tzoref-tables.mjs'; import { goals, goalFor } from './tzoref-goals.mjs';
const G=goals(); const MAC=JSON.parse(fs.readFileSync('tzoref-macros.json','utf8')); const sh=TZ.loadShelf(); const blocks=new Map(sh.named.map(b=>[b.name,b]));
for(const name of process.argv.slice(2)){ const g=G[name]; const gen=goalFor(name,{ins:g.ins},G); const chk=TZ.makeChecker(gen,300); const T=BS.tableOf(gen,g.ins);
  const ops=TT.partTables(sh.named.filter(b=>!b.bad&&b.name!==name)).filter(t=>t.k<=2&&!t.partial&&!/^עזר/.test(t.name)).map(t=>({name:t.name,k:t.k,T:t.T,w:MAC[t.name]?Math.max(1,Math.round(MAC[t.name].size/3)):Math.max(1,Math.round((blocks.get(t.name)?.prog.length||30)/25))}));
  if(g.ins.length===3) for(const t of (await import('./tzoref-value.mjs')).tables3(sh.named.filter(b=>!b.bad&&b.name!==name))) ops.push({name:t.name,k:3,T:t.T,w:2});
  const r=BS.basicBuild(T,{ins:g.ins,ops,ms:20000,multi:12}); if(!r.expr){ console.log(name,': לא נמצא',r.ms,'ms'); continue; }
  let ok=0, best=null, bx=null; for(const ex of r.all) for(let t=0;t<15;t++){ const q=BS.hasM(ex,MAC)?BS.compileH(ex,{out:g.out??2,ins:g.ins,blocks,placements:TZ.placements,rnd:t>0,MAC}):(t?null:BS.compile(ex,g.out??2,MAC)); if(q&&chk(q)){ ok++; if(!best||q.length<best.length){ best=q; bx=ex; } } }
  console.log(name,':',r.all.length,'פתרונות · הכי קצר:',bx?BS.showB(bx):'-','· אורך',best?.length,'·',r.ms,'ms'); }
process.exit(0);
