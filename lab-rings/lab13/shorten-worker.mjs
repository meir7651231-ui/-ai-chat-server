// עובד-קיצור אחד: מקבל תוכנית ומשימה, מקצר, ומדפיס את התוצאה (כל עובד — מסלול אקראי אחר)
import fs from 'fs'; import { shorten } from './tzoref.mjs'; import { goals, goalFor } from './tzoref-goals.mjs';
const [,, name, file, min]=process.argv; const G=goals(); const g=G[name]; const gen=goalFor(name,{ins:g.ins},G);
const p=JSON.parse(fs.readFileSync(file,'utf8')); let s=p; try{ s=shorten(p,gen,{minutes:+min,quiet:9}).prog; }catch{}
console.log('RESULT'+JSON.stringify(s)); process.exit(0);
