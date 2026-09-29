// קיצור עמוק: משנים את התוכנית בלי להאריך (החלפה/הזזה/מחיקה), כל שינוי נבדק; כשנפתחת מחיקה — לוקחים. ואחר כך המקצר הרגיל.
const fs=require('fs'); const {makeEngine}=require('./core2.js'); const E=makeEngine(777);
const st=JSON.parse(fs.readFileSync('core2-state.json','utf8')); E.restore(st.eng);
const SEC=+process.argv[2]||4; let s=12345; const R=(n)=>{ s=(Math.imul(s,1103515245)+12345)&0x7fffffff; return (s>>>16)%n; };
const ATOM=[...[0,1,2,3,4,5,6,7].map(k=>["W",k]),["GO"],["TAKE"],["PUT"],["CALC"]];
const tot=()=>[...E.lib.values()].reduce((a,b)=>a+b.ops.length,0); const t0=tot(); let n=0,won=0;
const order=[...E.lib.values()].sort((a,b)=>b.ops.length-a.ops.length);
for(const b0 of order){ const S=new E.Shrinker(b0); let cur=b0.ops.slice(), best=cur.slice(); const end=Date.now()+SEC*1000;
  while(Date.now()<end){ const c=cur.slice(), L=c.length, m=R(6), i=R(L);
    if(m===0) c.splice(i,1); else if(m===1) c[i]=ATOM[R(12)]; else if(m===2&&L>1){ const j=R(L); const [x]=c.splice(i,1); c.splice(j,0,x); }
    else if(m===3){ const w=2+R(5); c.splice(i,w,...Array.from({length:R(Math.min(w,3))},()=>ATOM[R(12)])); }
    else if(m===4&&L>1){ const j=R(L); [c[i],c[j]]=[c[j],c[i]]; } else c.splice(i,1);
    if(c.length>cur.length||!S.works(c)) continue; cur=c; if(cur.length<best.length) best=cur.slice(); }
  const S2=new E.Shrinker({tt:b0.tt,ops:best}); while(!S2.done) S2.step(1e9); if(S2.ops.length<best.length) best=S2.ops;
  if(best.length<b0.ops.length&&E.offer(best,'deep')){ won++; } n++;
  if(n%32===0){ console.log(`${n}/256 · שופרו ${won} · סה"כ ${tot()}`); fs.writeFileSync('core2-state.json',JSON.stringify({...st,eng:E.state()})); } }
fs.writeFileSync('core2-state.json',JSON.stringify({...st,eng:E.state()}));
const L=[...E.lib.values()].map(b=>b.ops.length).sort((a,b)=>a-b); console.log('סוף: שופרו',won,'·',t0,'→',tot(),'· min',L[0],'median',L[128],'max',L[255]);
