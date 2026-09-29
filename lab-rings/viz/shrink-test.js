const {makeEngine}=require('./core2.js'); const E=makeEngine(3); const lib=JSON.parse(require('fs').readFileSync('compose-lib.json'));
for(const b of lib) E.offer(b.ops,b.src);
const longest=[...E.lib.values()].sort((a,b)=>b.len-a.len).slice(0,3);
for(const b of longest){ const S=new E.Shrinker(b); const t0=Date.now(); while(!S.done){ S.step(1e9); } const ok=E.offer(S.ops,'shrink');
  console.log(b.name, S.start,'⇐',S.ops.length,'פעולות ·',S.tried,'ניסיונות ·',Math.round((Date.now()-t0)/100)/10+'s', ok?'✓ נשמר':''); }
