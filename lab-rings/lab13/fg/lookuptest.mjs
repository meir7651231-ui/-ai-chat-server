// fg/lookuptest.mjs - direct index lookup only (signature -> AST), timed per task; answers checked exhaustively afterwards.
// usage: node fg/lookuptest.mjs <index.bin> <out.jsonl> [set=s6]
import fs from 'fs';
import { loadIndex } from './index.mjs';
import { makeTask, targetOf } from './search.mjs';
import { compile, show } from './grammar.mjs';
const B = '/tmp/claude-0/-home-user/f7fc857c-d0a9-5552-9b86-ed0f0b4bc3b7/scratchpad/';
const [idxF, out, set = 's6'] = process.argv.slice(2);
const tasks = set === 's6' ? ['agg6.json', 'reorder6.json'].flatMap((fn) => JSON.parse(fs.readFileSync(B + 'suite6/' + fn, 'utf8')).tasks.filter((t) => t.kind !== 'num')) : JSON.parse(fs.readFileSync(B + 'fails/s5-fails-after-r5.json', 'utf8'));
let t0 = Date.now(); const ix = loadIndex(idxF); const loadMs = Date.now() - t0;
let ok = 0, under1 = 0; const rows = [];
for (const t of tasks) {
  const f = new Function('return (' + t.src + ')')(); const oracle = t.kind === 'list2num' ? (l) => f(l) & 15 : (l) => f(l);
  const task = makeTask(t.kind, oracle);
  t0 = Date.now(); const cands = ix.direct(t.kind, targetOf(task, ix.probes)); const ms = Date.now() - t0;
  let good = null; for (const [a] of cands) { if (!task.exhaustive(compile(a, []))) { good = show(a); break; } }
  if (good) { ok++; if (ms < 1000) under1++; }
  rows.push({ name: t.name, kind: t.kind, lookupMs: ms, cands: cands.length, ok: !!good, prog: good });
}
fs.writeFileSync(out, rows.map((r) => JSON.stringify(r)).join('\n') + '\n');
const ms = rows.map((r) => r.lookupMs).sort((a, b) => a - b);
console.log(JSON.stringify({ tasks: tasks.length, answered: ok, answeredUnder1s: under1, loadMs, lookupMsMax: ms.at(-1), lookupMsMedian: ms[ms.length >> 1] }));
