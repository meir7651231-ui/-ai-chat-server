// ריצה ארוכה אצלי: אותו מנוע כמו בעמוד, בלי סוף. שומר אחרי כל משימה ל-endless-state.json וממשיך משם אם הופעל שוב.
const fs=require('fs'); const {makeEngine}=require('./endless-core.js'); const E=makeEngine(7);
const F='endless-state.json'; let shelf=[], waiting=[], n=0, tried=0, log=[];
if(fs.existsSync(F)){ const o=JSON.parse(fs.readFileSync(F,'utf8')); E.restore(o.eng); shelf=o.shelf.map(b=>({...b,data:E.dataOf(b.ops)})); waiting=o.waiting; n=o.n; tried=o.tried; log=o.log||[]; console.log('ממשיך: ',shelf.length,'לבנים,',n,'משימות'); }
const save=()=>fs.writeFileSync(F,JSON.stringify({eng:E.state(),shelf:shelf.map(({name,ins,ops,len,ring,at})=>({name,ins,ops,len,ring,at})),waiting,n,tried,log:log.slice(-500)}));
for(;;){ n++; let T; const due=waiting.findIndex(w=>w.at<=n); if(due>=0){ const w=waiting.splice(due,1)[0]; T=E.fromKey(w.key); T.tries=w.tries; } else { T=E.nextTask(tt=>tt%2===1); T.tries=0; }   // השרת: טבלאות אי-זוגיות + כל הניסיונות החוזרים
  if(shelf.some(b=>b.name===T.name)){ n--; continue; }   // כבר במדף (למשל הגיע מהדפדפן)
  const g={...T,ex:E.examples(T.fn),hold:E.examples(T.fn,200)}; const S=new E.Search(g,shelf); let res,t0=Date.now();
  for(;;){ const r=S.step(1e9); if(r){ res=r; tried+=r.tried; if(r.best||r.ring>=9||Date.now()-t0>90000) break; } }
  const sec=Math.round((Date.now()-t0)/100)/10;
  if(res.best){ const ops=[["W",0],["GO"],...res.best.ops]; shelf.push({name:g.name,ins:g.ins,ops,len:res.best.prog.length,ring:res.ring,at:n,data:E.dataOf(ops)});
    const id=E.keyOf(g.name); if(id){ fs.mkdirSync('outbox',{recursive:true}); fs.writeFileSync('outbox/'+id+'.json',JSON.stringify({name:g.name,ins:g.ins,ops,len:res.best.prog.length,src:'server',at:new Date().toISOString()})); } }
  else waiting.push({key:T.key,tries:T.tries+1,at:n+3+(T.tries+1)*2});
  const line=`${new Date().toISOString().slice(11,19)} #${n} ${res.best?'✓':'↻'} ${g.name} · ניסיון ${T.tries+1} · עיגול ${res.ring} · ${sec}s · ${S.tokens.length} אפשרויות${res.best?' · '+res.best.prog.map(t=>t.name).join(' · '):''}`;
  log.push(line); console.log(line); console.log(`   מדף ${shelf.length} · ממתינות ${waiting.length} · נבדקו ${(tried/1e6).toFixed(1)}M`); save(); }
