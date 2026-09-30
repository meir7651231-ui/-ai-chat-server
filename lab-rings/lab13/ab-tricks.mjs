// מבחן הוגן: אותה תוכנית-התחלה, אותו זמן קיצור (30 שנ׳) — עם מחברת-הטריקים ובלעדיה
import { goals, goalFor } from './tzoref-goals.mjs'; import { valueBuild } from './tzoref-value.mjs'; import { loopBuild } from './tzoref-loop.mjs'; import { applyTricks } from './tzoref-tricks.mjs'; import { makeChecker } from './tzoref.mjs';
const G=goals(); const name=process.argv[2]; const g=G[name]; const gen=goalFor(name,{ins:g.ins},G);
const r=g.ins?valueBuild(gen,{name,ins:g.ins,out:g.out??2}):loopBuild(gen,{name}); const chk=makeChecker(gen,300);
const t0=Date.now(); const a=applyTricks(r.prog,chk); console.log(JSON.stringify({name,raw:r.prog.length,tricks:a.prog.length,used:a.used,ms:Date.now()-t0,prog:r.prog}));
