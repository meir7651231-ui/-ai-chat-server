const {makeEngine}=require('./endless-core.js'); const E=makeEngine(7); const shelf=[]; const t00=Date.now();
for(let n=0;n<24;n++){ const T=E.nextTask(); const g={...T,ex:E.examples(T.fn),hold:E.examples(T.fn,200)}; const use=shelf;
  const S=new E.Search(g,use); let res, t0=Date.now(); for(;;){ const r=S.step(1e9); if(r){res=r; if(r.best||r.ring>=7||Date.now()-t0>45000) break;} }
  const data=res.best?E.dataOf(res.best.ops):[];
  if(res.best){ const ops=[["W",0],["GO"],...res.best.ops]; shelf.push({name:g.name,ins:g.ins,ops,data:E.dataOf(ops)}); }
  console.log((res.best?"✓":"✗"),g.name.padEnd(10),"ring",res.ring,"tokens",S.tokens.length,Math.round((Date.now()-t0)/100)/10+"s",res.best?res.best.prog.map(t=>t.name).join(" · "):"best "+res.kept[0].ok+"/16"); }
console.log("total",Math.round((Date.now()-t00)/1000),"s");
