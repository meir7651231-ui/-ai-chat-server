// שיפור המנוע: (1) מותר לעלות קצת — שינוי שמאריך מתקבל לפעמים, לפי «חום» שיורד; שומרים תמיד את הקצרה שנראתה.
// (3) הרבה נקודות התחלה — התוכנית הנוכחית, הנוסחה «ביד», וגרסאות מנוערות. כל שינוי נבדק (24 מהירות ואז 240).
const fs=require('fs'); const {makeEngine}=require('./core2.js'); const E=makeEngine(4242);
const st=JSON.parse(fs.readFileSync('core2-state.json','utf8')); E.restore(st.eng);
const SEC=+process.argv[2]||1, STARTS=+process.argv[3]||4; let s=+process.argv[4]||987; const R=(n)=>{ s=(Math.imul(s,1103515245)+12345)&0x7fffffff; return (s>>>16)%n; }, U=()=>R(1e6)/1e6;
const ATOM=[...[0,1,2,3,4,5,6,7].map(k=>["W",k]),["GO"],["TAKE"],["PUT"],["CALC"]];
// הנוסחה ביד
const cost=new Array(256).fill(1e9), how=new Array(256).fill(null); [[240,0],[204,1],[170,3]].forEach(([t,k])=>{cost[t]=3;how[t]={leaf:k};});
for(let ch=true;ch;){ ch=false; for(let x=0;x<256;x++) if(cost[x]<1e9) for(let y=x;y<256;y++) if(cost[y]<1e9){ const t=(~(x&y))&255,c=cost[x]+cost[y]+1; if(c<cost[t]){cost[t]=c;how[t]={x,y};ch=true;} } }
const emit=(t)=>{ const h=how[t]; return h.leaf!=null?[["W",h.leaf],["GO"],["TAKE"]]:[...emit(h.x),...emit(h.y),["CALC"]]; };
function mutate(c){ c=c.slice(); const L=c.length, m=R(7), i=R(L);
  if(m===0) c.splice(i,1); else if(m===1) c[i]=ATOM[R(12)]; else if(m===2){ const j=R(L); const [x]=c.splice(i,1); c.splice(j,0,x); }
  else if(m===3){ const w=2+R(4); c.splice(i,w,...Array.from({length:R(Math.min(w,3))},()=>ATOM[R(12)])); }
  else if(m===4){ const j=R(L); [c[i],c[j]]=[c[j],c[i]]; } else if(m===5) c.splice(i,0,ATOM[R(12)]); else c.splice(i,1,ATOM[R(12)],ATOM[R(12)]);
  return c; }
const tot=()=>[...E.lib.values()].reduce((a,b)=>a+b.ops.length,0); const t0=tot(); let won=0,n=0;
for(const b0 of [...E.lib.values()].sort((a,b)=>b.ops.length-a.ops.length)){ const chk=new E.Shrinker(b0); let best=b0.ops.slice();
  const hand=[...emit(b0.tt),["W",2],["GO"],["PUT"]]; const starts=[best]; if(chk.works(hand)) starts.push(hand);
  while(starts.length<STARTS){ let c=best; for(let k=0;k<30;k++){ const d=mutate(c); if(d.length<=best.length+6&&chk.works(d)) c=d; } starts.push(c); }
  for(const st0 of starts){ let cur=st0; const end=Date.now()+SEC*1000/starts.length, T0=1.2; const tStart=Date.now();
    while(Date.now()<end){ const T=T0*(1-(Date.now()-tStart)/(end-tStart))+0.05; const c=mutate(cur); const d=c.length-cur.length;
      if(d>0&&U()>Math.exp(-d/T)) continue; if(c.length>best.length+8||!chk.works(c)) continue; cur=c; if(cur.length<best.length) best=cur.slice(); } }
  const S=new E.Shrinker({tt:b0.tt,ops:best}); while(!S.done) S.step(1e9); best=S.ops;
  if(best.length<b0.ops.length&&E.offer(best,'anneal')) won++; n++;
  if(n%64===0){ console.log(`${n}/256 · שופרו ${won} · סה"כ ${tot()}`); fs.writeFileSync('core2-state.json',JSON.stringify({...st,eng:E.state()})); } }
fs.writeFileSync('core2-state.json',JSON.stringify({...st,eng:E.state()}));
const L=[...E.lib.values()].map(b=>b.ops.length).sort((a,b)=>a-b); console.log('סוף: שופרו',won,'·',t0,'→',tot(),'· min',L[0],'median',L[128],'max',L[255]);
