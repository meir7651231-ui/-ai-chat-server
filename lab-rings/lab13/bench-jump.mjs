import { parallelBuild } from './tzoref-fast.mjs';
for(const n of ['העתק','לא (מספר)','דלג אם לא-אפס (תא0 אפס ⇒ העתק תא1)','אם (תא0 לא-אפס ⇒ תא1, אחרת תא3)']){ const r=await parallelBuild(n,{ms:60000});
  console.log(`${n}: ${r.prog?'✓ '+r.prog.length+' פקודות':'✗'} · ${r.tries} ניסיונות · ${(r.ms/1000).toFixed(1)} שניות`); if(r.prog) console.log('   ',r.prog.map(([o,k,c])=>o==='WHERE'?(c?'→'+k:'W'+k):o).join(' ')); }
process.exit(0);
