// pexp.mjs <task> <mode> [minutes]   mode: nonet · net
import fs from 'node:fs';
import { variants, searchPieces, assemble } from './pieces.mjs';
import { makeTask } from './tasks.mjs';
import { trainedPrior } from './pnet.mjs';
const [task, mode, minutes = '10'] = process.argv.slice(2);
{
  const vs = variants(JSON.parse(fs.readFileSync('lib2.json', 'utf8')).filter((m) => !m.name.startsWith('סוף') && !m.name.startsWith('חפש')));
  const { g, ok } = makeTask(task); const t0 = Date.now(); const deadline = t0 + (+minutes) * 60000; let r, net = null;
  if (mode === 'net') net = trainedPrior(task);
  for (const beam of [100, 300, 1000]) { r = searchPieces(g, vs, { beam, deadline, prior: net }); if (r.solved && ok(assemble(r.ps))) break; if (r.solved) { r.solved = false; r.overfit = true; } if (Date.now() > deadline) break; }
  console.log(JSON.stringify({ task, mode, solved: r.solved, sec: Math.round((Date.now() - t0) / 1000), checked: r.runs, overfit: !!r.overfit }));
  if (r.solved) { console.log('   ' + r.ps.map((p) => p.label).join('  ·  ')); console.log('   ' + assemble(r.ps).length + ' צעדים'); }
}
