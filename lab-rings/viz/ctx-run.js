const fs=require('fs'); const {makeEngine}=require('./core2.js'); const E=makeEngine(77); const {optimizeCtx}=require('./ctxpeep.js');
const st=JSON.parse(fs.readFileSync('core2-state.json','utf8')); E.restore(st.eng); const D=+process.argv[2]||4;
let s=99; const R=(n)=>{ s=(Math.imul(s,1103515245)+12345)&0x7fffffff; return (s>>>16)%n; };
const mems=Array.from({length:64},()=>{ const a=R(16),b=R(16),c=R(16); return [a,b,R(16),c,R(16),R(16),R(16),R(16)]; });
const tot=()=>[...E.lib.values()].reduce((a,b)=>a+b.ops.length,0); const t0=tot(); let won=0; const t=Date.now();
for(const b of [...E.lib.values()].sort((x,y)=>y.ops.length-x.ops.length)){ const chk=new E.Shrinker(b); const o=optimizeCtx(b.ops,(c)=>chk.works(c),mems,D); if(o.length<b.ops.length&&E.offer(o,'ctx')) won++; }
const L=[...E.lib.values()].map(b=>b.ops.length).sort((a,b)=>a-b);
console.log(`D=${D}: שופרו ${won} · ${t0} → ${tot()} · חציון ${L[128]} · הכי ארוכה ${L[255]} · ${((Date.now()-t)/1000).toFixed(0)} שנ'`);
if(process.argv[3]==='save') fs.writeFileSync('core2-state.json',JSON.stringify({...st,eng:E.state()}));
