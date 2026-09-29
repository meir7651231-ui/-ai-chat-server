const {makeEngine}=require('./endless-core.js'); const E=makeEngine(7); const shelf=[]; const t00=Date.now(); const queue=[]; const waiting=[];
let n=0; while(Date.now()-t00<300000){ n++;
  // a task that failed comes back after 3 others
  let T; const due=waiting.findIndex(w=>w.at<=n); if(due>=0){ T=waiting.splice(due,1)[0].T; } else T=E.nextTask();
  const g={...T,ex:E.examples(T.fn),hold:E.examples(T.fn,200)}; const S=new E.Search(g,shelf); let res,t0=Date.now();
  for(;;){ const r=S.step(1e9); if(r){res=r; if(r.best||r.ring>=9||Date.now()-t0>45000) break;} }
  if(res.best){ const ops=[["W",0],["GO"],...res.best.ops]; shelf.push({name:g.name,ins:g.ins,ops,data:E.dataOf(ops)}); }
  else { T.tries=(T.tries||0)+1; waiting.push({T,at:n+3}); }
  console.log(n,(res.best?"✓":"✗"),g.name.padEnd(10),"try",(T.tries||0)+(res.best?1:0),"ring",res.ring,Math.round((Date.now()-t0)/100)/10+"s",res.best?res.best.prog.map(t=>t.name).join(" · "):""); }
console.log("learned",shelf.length,shelf.map(b=>b.name).join(", "));
