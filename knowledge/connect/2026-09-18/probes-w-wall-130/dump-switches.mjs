// שקילות-בייטים: toSwitches + goalNeeds על **כל** 315 יחידות-המדידה.
import fs from 'node:fs';
const ROOT = process.argv[2];
const T = await import(ROOT + '/machtzev/generator/tzinor.mjs');
const BP = await import(ROOT + '/machtzev/generator/behavior-plan.mjs');
const P = await import(ROOT + '/yeshiva/purpose.mjs');
const out = [];
for (const u of BP.scanUnits()) {
  let sw = null, gn = null;
  try { sw = T.toSwitches(u.text, u.at); } catch (e) { sw = { err: String(e.message) }; }
  try { const g = P.goalNeeds(u.text, 'מטרה'); gn = { needs: Object.keys(g.needs).sort(), owner: g.owner.map(o => o.kind + '|' + o.question) }; }
  catch (e) { gn = { err: String(e.message) }; }
  out.push({ id: u.id, sw, gn });
}
process.stdout.write(JSON.stringify(out, null, 1));
