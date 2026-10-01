import { loopBuild } from './tzoref-loop.mjs'; import { goals, goalFor } from './tzoref-goals.mjs';
const G=goals(); const name='סכום רשימה'; const gen=goalFor(name,{},G); const r=loopBuild(gen,{name}); console.log(r.all.map(x=>x.skel+' '+x.prog.length).join(' | '));
const e=gen(); console.log('דוגמה:',e.mem.join(','),'⇒',e.want);
process.exit(0);
