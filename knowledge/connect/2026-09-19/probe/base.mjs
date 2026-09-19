// baseline: שלבים 1–2 לכל יחידה, בתהליך (אפס מנוע חדש — קורא את scanUnits/scanOne הקיימים)
import fs from 'node:fs';
const { scanUnits, scanOne } = await import('../../../../machtzev/generator/behavior-plan.mjs');
const units = scanUnits();
const out = [];
for (const u of units) { const r = await scanOne(u); out.push(r); }
fs.writeFileSync(process.argv[2], JSON.stringify(out));
const why = (r) => r.error ? 'קריסה' : r.noBehavior ? 'אין תביעת-התנהגות' : (r.ownerKinds||[]).length ? (r.ownerKinds||[]).join('/') : (r.needs? 'שלב2' : 'תביעה בלי חוזה');
const c = {}; for (const r of out) c[why(r)] = (c[why(r)]||0)+1;
console.log('units', out.length, 'stage2(needs>0)', out.filter(r=>r.needs>0).length);
console.log(Object.entries(c).sort((a,b)=>b[1]-a[1]).map(([k,v])=>v+' '+k).join('\n'));
