// «אם» מחלקים («העתק», «דלג» — שהצורף בנה בעצמו): הבונה הישן מול «8 במכה» עם חלקים-עם-קפיצה
import { buildJ, placements, makeChecker } from './tzoref.mjs'; import { swarBuild } from './tzoref-swar.mjs'; import { goals, goalFor } from './tzoref-goals.mjs';
const G=goals(); const lib=[{name:'העתק',prog:[['WHERE',0],['GO'],['TAKE'],['WHERE',2],['GO'],['PUT']],ins:[0],out:2},
  {name:'דלג',prog:[['WHERE',0],['GO'],['TAKE'],['WHERE',11,'code'],['JUMP'],['WHERE',1],['GO'],['TAKE'],['WHERE',2],['GO'],['PUT']],ins:[0,1],out:2}];
const pieces=lib.flatMap(b=>placements(b,1000)); console.log('צינורות מחלקים:',pieces.length);
for(const n of ['אם (תא0 לא-אפס ⇒ תא1, אחרת תא3)','דלג אם לא-אפס (תא0 אפס ⇒ העתק תא1)','העתק']){ const gen=goalFor(n,null,G); const chk=makeChecker(gen,300);
  const t=Date.now(); const b=swarBuild(gen,{pieces,ms:60000,check:chk}); const tb=Date.now()-t;
  const t2=Date.now(); const a=buildJ(gen,{pieces,ms:60000}); const ta=Date.now()-t2;
  console.log(`${n.slice(0,24).padEnd(24)} ישן: ${a.prog?a.prog.length+' פק׳':'✗'} ${(ta/1000).toFixed(2)} שנ׳ (${(a.tries/1e6).toFixed(2)} מיליון ניסיונות) · 8-במכה+חלקים: ${b.prog?b.prog.length+' פק׳':'✗'} ${(tb/1000).toFixed(2)} שנ׳ (${b.tries} ניסיונות)${b.used?.length?' · מ: '+b.used.join(' + '):''}`); }
