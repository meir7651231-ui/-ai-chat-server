// קריאה ישירה של דרישות-המנוע (goalPsak) — לא ניבוי של גזירת-חוזה.
import fs from 'node:fs';
const ROOT = process.env.GEN_ROOT || process.cwd();   // הרץ מתוך שורש-הריפו, או GEN_ROOT=<path>
const OUT = process.env.PROBE_OUT || (process.env.HOME ? process.env.HOME + '/.cache/w-wall-130' : '/tmp/w-wall-130');
fs.mkdirSync(OUT, { recursive: true });
const P = await import(ROOT + '/yeshiva/purpose.mjs');
const BP = await import(ROOT + '/machtzev/generator/behavior-plan.mjs');
const o = JSON.parse(fs.readFileSync(OUT + '/probe1.json','utf8'));
const units = new Map(BP.scanUnits().map(u=>[u.id,u]));
const c = { typeDate:0, typeNumOrPct:0, cmpConst:0, none:0 };
for (const u of o) {
  const g = P.goalPsak(units.get(u.id).text,'מטרה');
  let d=false,n=false,t=false;
  g.demands.forEach((dm,i)=>{
    const rq=g.requirements.filter(r=>r.demand===i);
    if (rq.some(r=>r.kind==='ישות'&&r.cls)) return;
    if (!rq.some(r=>r.kind==='∅')) return;
    if (rq.some(r=>r.kind==='שדה'&&r.type==='typeDate')) d=true;
    if (rq.some(r=>r.kind==='שדה'&&(r.type==='typeNum'||r.type==='typePercent'))) n=true;
    if (rq.some(r=>r.kind==='קבוע'&&r.cmp)) t=true;
  });
  if(d)c.typeDate++; if(n)c.typeNumOrPct++; if(t)c.cmpConst++; if(!d&&!n&&!t)c.none++;
}
console.log('מ-73, בתביעה חסרת-ישות שיש בה גם מילת-∅, כמה נושאות:');
console.log('  רמז-תאריך      (typeDate)            :', c.typeDate);
console.log('  רמז-מספר/אחוז  (typeNum/typePercent) :', c.typeNumOrPct);
console.log('  קבוע-עם-משווה                        :', c.cmpConst);
console.log('  אף אחד מהשלושה                        :', c.none);
