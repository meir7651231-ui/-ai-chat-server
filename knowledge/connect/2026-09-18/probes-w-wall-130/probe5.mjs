import fs from 'node:fs';
const ROOT = process.env.GEN_ROOT || process.cwd();   // הרץ מתוך שורש-הריפו, או GEN_ROOT=<path>
const OUT = process.env.PROBE_OUT || (process.env.HOME ? process.env.HOME + '/.cache/w-wall-130' : '/tmp/w-wall-130');
fs.mkdirSync(OUT, { recursive: true });
const P = await import(ROOT + '/yeshiva/purpose.mjs');
const BP = await import(ROOT + '/machtzev/generator/behavior-plan.mjs');
const SPL = JSON.parse(fs.readFileSync(ROOT + '/machtzev/generator/spec-lang.data.json','utf8'));
const SIG = [...(SPL.pSum||[]),...(SPL.pCount||[]),...(SPL.pAvg||[])];   // בלי pTable — goalNeeds לא צורך אותו
const o = JSON.parse(fs.readFileSync(OUT + '/probe1.json','utf8'));
const units = new Map(BP.scanUnits().map(u=>[u.id,u]));
const opened = new Set(JSON.parse(fs.readFileSync(ROOT + '/knowledge/connect/2026-09-18/screen-map.json','utf8'))
  .rows.filter(r=>r.opens).flatMap(r=>r.units.map(u=>u.id)));
let numAndSig=[], numNoSig=[];
for (const u of o) {
  const g = P.goalPsak(units.get(u.id).text,'מטרה');
  let hit=false;
  g.demands.forEach((dm,i)=>{
    const rq=g.requirements.filter(r=>r.demand===i);
    if (rq.some(r=>r.kind==='ישות'&&r.cls)) return;
    if (!rq.some(r=>r.kind==='∅')) return;
    if (!rq.some(r=>r.kind==='שדה'&&(r.type==='typeNum'||r.type==='typePercent'))) return;
    if (SIG.some(s=>String(dm.text).includes(s))) hit=true;
  });
  if (hit) numAndSig.push(u.id); else if (opened.has(u.id)) numNoSig.push(u.id);
}
console.log('נושאות רמז-מספר **וגם** אות-סימן-אגרגציה באותה תביעה:', numAndSig.length);
console.log('נפתחו בפועל (מהמפה):', opened.size);
console.log('נפתחו ואין להן אות-סימן בספירה הזאת:', numNoSig.length, numNoSig.join(' '));
console.log('נושאות סימן ולא נפתחו:', numAndSig.filter(x=>!opened.has(x)).join(' '));
