// school.mjs — a school: tasks from easy to hard. The engine solves each task; the network learns from all the solutions so far,
// and helps with the next task. The network only *prefers* — it doesn't block (an extra list in the search, not a filter).
import fs from 'node:fs';
import { variants, searchPieces, assemble } from './pieces.mjs';
import { makeTask } from './tasks.mjs';
import { trainedPrior } from './pnet.mjs';
const useNet = process.argv[2] !== 'nonet';
const LESSONS = ['צעד ברשימה', 'שני ברשימה', 'ראשון ועוד 1', 'סוף רשימה', 'אורך רשימה עד 1', 'אורך רשימה עד 2', 'אורך רשימה עד 3', 'אורך רשימה', 'חפש ברשימה'];
const vs = variants(JSON.parse(fs.readFileSync('lib2.json', 'utf8')).filter((m) => !m.name.startsWith('סוף') && !m.name.startsWith('חפש')));
// progress is saved to a file after every lesson — if the machine restarts, we continue from where we stopped
const SAVE = `school-${useNet ? 'net' : 'nonet'}.json`; const done = fs.existsSync(SAVE) ? JSON.parse(fs.readFileSync(SAVE, 'utf8')) : {};
const solved = Object.values(done).filter((x) => x.kinds);
let ran = 0;
for (const task of LESSONS) {
  if (task in done) { console.log(done[task].line + ' (from the file)'); continue; }
  if (ran++ >= 1) break;   // one lesson per run (the machine restarts)
  const { g, ok } = makeTask(task); const t0 = Date.now(); const deadline = t0 + 7 * 60000;
  const net = useNet && solved.length ? trainedPrior(task, 4, solved.map((x) => x.kinds)) : null; let r;
  for (const beam of [100, 300, 1000]) { r = searchPieces(g, vs, { beam, deadline, rank: net ? net.probs : null }); if (r.solved && ok(assemble(r.ps))) break; r.solved = false; if (Date.now() > deadline) break; }
  const sec = Math.round((Date.now() - t0) / 1000);
  console.log(`${r.solved ? '✓' : '✗'} ${task} · ${sec}s · ${r.runs} checked${r.solved ? ' · ' + r.ps.map((p) => p.label).join(' · ') : ''}`);
  const line = `${r.solved ? '✓' : '✗'} ${task} · ${sec}s · ${r.runs} checked${r.solved ? ' · ' + r.ps.map((p) => p.label).join(' · ') : ''}`;
  done[task] = { line, kinds: r.solved ? r.ps.map((p) => p.kind) : null }; fs.writeFileSync(SAVE, JSON.stringify(done));
  if (r.solved) solved.push({ task, kinds: r.ps.map((p) => p.kind) });
}
