const fs=require('fs'); const {makeEngine}=require('./core2.js'); const E=makeEngine(11);
const st=JSON.parse(fs.readFileSync('core2-state.json')); E.restore(st.eng);
const tot=()=>[...E.lib.values()].reduce((a,b)=>a+b.ops.length,0); const t0=tot(); console.log('before',E.lib.size,t0);
for(let round=1;round<=3;round++){ let gained=0;
  for(const b of [...E.lib.values()].sort((a,b)=>b.ops.length-a.ops.length)){ const S=new E.Shrinker(b); while(!S.done) S.step(1e9);
    if(S.ops.length<b.ops.length && E.offer(S.ops,'shrink')) gained+=b.ops.length-S.ops.length; }
  console.log('round',round,'saved',gained,'total',tot()); if(!gained) break; }
fs.writeFileSync('core2-state.json',JSON.stringify({...st,eng:E.state()}));
fs.rmSync('outbox4',{recursive:true,force:true}); fs.mkdirSync('outbox4');
for(const b of E.lib.values()) fs.writeFileSync(`outbox4/t${b.tt}.json`,JSON.stringify({name:b.name,tt:b.tt,ops:b.ops,len:b.ops.length,src:'server',at:new Date().toISOString()}));
const L=[...E.lib.values()].map(b=>b.ops.length).sort((a,b)=>a-b); console.log('min',L[0],'median',L[128],'max',L[255],'total',tot(),'from',t0);
