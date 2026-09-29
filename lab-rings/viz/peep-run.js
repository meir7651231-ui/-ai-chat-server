const fs=require('fs'); const {makeEngine}=require('./core2.js'); const E=makeEngine(31); const PH=require('./peephole.js');
const st=JSON.parse(fs.readFileSync('core2-state.json','utf8')); E.restore(st.eng); const K=+process.argv[2]||5;
let t=Date.now(); const best=PH.build(K); console.log(`טבלה: ${best.size} התנהגויות שונות מרצפים עד ${K} · ${((Date.now()-t)/1000).toFixed(1)} שנ'`);
const tot=()=>[...E.lib.values()].reduce((a,b)=>a+b.ops.length,0); const t0=tot(); let won=0; t=Date.now();
for(const b of [...E.lib.values()]){ const chk=new E.Shrinker(b); const o=PH.optimize(b.ops,(c)=>chk.works(c),best); if(o.length<b.ops.length&&E.offer(o,'peephole')) won++; }
console.log(`שופרו ${won} · ${t0} → ${tot()} · ${((Date.now()-t)/1000).toFixed(1)} שנ'`);
if(process.argv[3]==='save') fs.writeFileSync('core2-state.json',JSON.stringify({...st,eng:E.state()}));
