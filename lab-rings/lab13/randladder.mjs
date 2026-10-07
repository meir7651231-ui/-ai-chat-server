// משימות אקראיות (לא אני בחרתי): פעולה אקראית על שני כלי-סולם אקראיים משלבים 3–6
process.env.NOEXIT='1';
const { LV, genOf, multiBuild } = await import('./ladder.mjs'); const { show } = await import('./tzoref-value.mjs'); const { finalCheck } = await import('./tzoref.mjs');
let s=(+(process.env.SEED||7))>>>0; const rnd=()=>{ s=(s+0x6D2B79F5)>>>0; let t=s; t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61); return ((t^(t>>>14))>>>0)/4294967296; }; const R=k=>Math.floor(rnd()*k);
const m=x=>((x%16)+16)%16; const OPS=[['ועוד',(x,y)=>m(x+y)],['פחות',(x,y)=>m(x-y)],['הקטן מבין',Math.min],['הגדול מבין',Math.max]];
const pool=[3,4,5,6].flatMap(l=>LV[l]); let ok=0; const N=+(process.env.N||10);
const K=+(process.env.K||2); const seen=new Set();
for(let t=0;t<N;t++){ let T,ops,key; do{ T=Array.from({length:K},()=>pool[R(pool.length)]); ops=Array.from({length:K-1},()=>OPS[R(OPS.length)]); key=T.map(x=>x[0]).join('|')+ops.map(o=>o[0]).join('|'); }while(seen.has(key)); seen.add(key);
  const ins=[...new Set(T.flatMap(x=>x[1]))].sort((a,b)=>a-b); const fs=T.map(X=>(...v)=>X[2](...X[1].map(c=>v[ins.indexOf(c)])));
  const f=(...v)=>{ let r=fs[0](...v); for(let i=1;i<K;i++) r=ops[i-1][1](r,fs[i](...v)); return r; };
  const name=`אקראי ${t+1}: `+T.map((x,i)=>(i?ops[i-1][0]+' ':'')+'['+x[0].slice(3,20)+']').join(' '); if(process.env.ONLY&&+process.env.ONLY!==t+1) continue; const gen=genOf(ins,f); const t0=Date.now();
  let v=null; try{ v=multiBuild(gen,{name,ins,out:2,ms:+process.env.VMS||60000,ban:[]},+(process.env.ALT||0)); }catch(e){}
  const good=v&&v.prog&&!finalCheck(v.prog,gen,3000).bad; if(good) ok++;
  console.log(`${good?'✓':'✗'} ${name}: ${good?v.prog.length+' פקודות':'לא נמצא'} · ${((Date.now()-t0)/1000).toFixed(0)} שנ׳`); }
console.log(`סך: ${ok}/${N}`); process.exit(0);
