import { ptrBuild, ptrCompile } from './tzoref-ptr.mjs'; import { shorten, finalCheck, loadShelf } from './tzoref.mjs'; import { goals, goalFor } from './tzoref-goals.mjs';
const G=goals(); const nm=process.argv[2]; const gen=goalFor(nm,{},G); const r=ptrBuild(gen); const p=ptrCompile(r);
const s=shorten(p,gen,{minutes:+process.env.MIN||3,quiet:1,tag:nm}).prog; const fc=finalCheck(s,gen); const cur=loadShelf().named.find(b=>b.name===nm);
console.log(`${nm}: במדף ${cur?.prog.length} (נכתב ביד) · הצורף ${p.length} ⇒ קוצר ${s.length} · בדיקה ${fc.n-fc.bad}/${fc.n}`); process.exit(0);
