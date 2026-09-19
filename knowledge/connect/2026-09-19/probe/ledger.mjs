// ledger-run: כל יחידה ⇒ goalPsak, והפסקים נקראים מהפנקס שהמנוע עצמו כותב (אפס פותר שני)
import fs from 'node:fs';
process.env.YESHIVA_LEDGER = process.argv[2];
process.env.YESHIVA_LEDGER_CAP = '500000';
try { fs.unlinkSync(process.argv[2]); } catch {}
const { scanUnits } = await import('../../../../machtzev/generator/behavior-plan.mjs');
const Y = await import('../../../../yeshiva/purpose.mjs');
const units = scanUnits();
const rows = [];
for (const u of units) {
  let p = null, err = null;
  try { p = Y.goalPsak(u.text, `U:${u.id}`); } catch (e) { err = String(e.message).slice(0,120); }
  rows.push({ id: u.id, at: u.at, text: u.text, err,
    demands: p ? (p.demands||[]).length : 0,
    reqs: p ? (p.requirements||[]).length : 0 });
}
fs.writeFileSync(process.argv[3], JSON.stringify(rows));
const R = await import('../../../../yeshiva/rminhu.mjs');
console.log('units', rows.length, 'ledger', JSON.stringify(R.reported()));
