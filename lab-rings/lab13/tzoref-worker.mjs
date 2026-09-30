// עובד (ליבה אחת) שנשאר דלוק: מקבל משימה אחרי משימה. דגל-עצירה משותף — כשליבה אחרת מצאה, כולן עוצרות.
import { parentPort, workerData } from 'worker_threads';
import { fastBuild } from './tzoref-fast.mjs'; import { swarBuild } from './tzoref-swar.mjs'; import { goals, goalFor } from './tzoref-goals.mjs'; import { makeChecker } from './tzoref.mjs';
const G=goals();
function job({ name, pieces, width, ms, ngram, N, stop, tables, ins, lab, rules, sw, maxLen }){ const gen=goalFor(name,{ins:G[name]?.ins},G); const chk=makeChecker(gen,300);   // אותו בודק כמו בשאר הצורף (כולל «הקלט לא משתנה»)
  return (process.env.NOSWAR?null:swarBuild(gen,{pieces,widths:[width],ms,ngram,check:chk,stop,tables,ins,lab:lab??5,rules:rules??true,sw,maxLen:maxLen||128}))||fastBuild(gen,{pieces,widths:[width],ms,ngram,N:N||14,check:chk}); }
if(workerData&&workerData.name){ parentPort.postMessage(job(workerData)||{prog:null,tries:0}); }   // מצב ישן: משימה אחת
else parentPort.on('message',(m)=>{ const r=job({...m,stop:new Int32Array(m.stopBuf)})||{prog:null,tries:0}; parentPort.postMessage({id:m.id,...r}); });
