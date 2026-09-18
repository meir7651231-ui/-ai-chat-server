import fs from 'node:fs';
const ROOT = process.env.GEN_ROOT || process.cwd();   // הרץ מתוך שורש-הריפו, או GEN_ROOT=<path>
const OUT = process.env.PROBE_OUT || (process.env.HOME ? process.env.HOME + '/.cache/w-wall-130' : '/tmp/w-wall-130');
fs.mkdirSync(OUT, { recursive: true });
const P = await import(ROOT + '/yeshiva/purpose.mjs');
const { scanUnits } = await import(ROOT + '/machtzev/generator/behavior-plan.mjs');
const meter = JSON.parse(fs.readFileSync(ROOT + '/knowledge/connect/2026-09-18/meter-100.json','utf8'));
const want = new Set(meter.rows.filter(r=>r.stage===1 && r.why==='אין-ישות').map(r=>r.id));
const units = scanUnits();
console.log('scanUnits:', units.length, 'matched ids:', units.filter(u=>want.has(u.id)).length);
const t0=Date.now();
const out=[];
for (const u of units) {
  if (!want.has(u.id)) continue;
  const g = P.goalPsak(u.text, 'מטרה');
  const per = g.demands.map((d,i)=>{
    const rq = g.requirements.filter(r=>r.demand===i);
    return { verb:d.verb,
      ents: rq.filter(r=>r.kind==='ישות'&&r.cls).map(r=>r.cls),
      amb: rq.filter(r=>r.kind==='ישות'&&!r.cls).length,
      nil: rq.filter(r=>r.kind==='∅').map(r=>r.word),
      hints: rq.filter(r=>r.kind==='שדה'&&r.type).map(r=>r.word+':'+r.type),
      consts: rq.filter(r=>r.kind==='קבוע').map(r=>r.word+'/'+(r.cmp||'-')+'/'+(r.type||'-')),
    };
  });
  out.push({ id:u.id, src:u.src, at:u.at, claims:per });
}
fs.writeFileSync(OUT + '/probe1.json', JSON.stringify(out,null,1));
console.log('units done:', out.length, 'ms', Date.now()-t0);
const nilN = out.flatMap(o=>o.claims).flatMap(c=>c.nil).length;
const hintN = out.flatMap(o=>o.claims).flatMap(c=>c.hints).length;
const constN = out.flatMap(o=>o.claims).flatMap(c=>c.consts).length;
console.log('∅ words:', nilN, 'type-hints:', hintN, 'consts:', constN);
console.log('claims with >=1 hint or const:', out.flatMap(o=>o.claims).filter(c=>c.hints.length||c.consts.length).length, '/', out.flatMap(o=>o.claims).length);
