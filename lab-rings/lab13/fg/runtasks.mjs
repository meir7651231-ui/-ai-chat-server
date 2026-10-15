// fg/runtasks.mjs - JS-only measurement of the grammar search (no machine code): the task is only an oracle.
// usage: node fg/runtasks.mjs <set> <out.jsonl> <msPerTask> [index.bin|-] [prior.json|-] [live:auto|1|0] [from] [to]
//   set: s5fails | s6 | suite:<dir>      rows already in out.jsonl are skipped (resumable)
import fs from 'fs';
import { solveLists } from './search.mjs';
import { loadIndex } from './index.mjs';
const B = '/tmp/claude-0/-home-user/f7fc857c-d0a9-5552-9b86-ed0f0b4bc3b7/scratchpad/';
const [set, out, msA = '120000', idxF = '-', priorF = '-', liveA = 'auto', fromA = '0', toA = '9999'] = process.argv.slice(2);
const listTasks = (dir, files) => files.flatMap((fn) => (JSON.parse(fs.readFileSync(B + dir + '/' + fn, 'utf8')).tasks || []).filter((t) => t.kind === 'list2num' || t.kind === 'list2list').map((t) => ({ ...t, file: fn })));
let tasks;
if (set === 's5fails') tasks = JSON.parse(fs.readFileSync(B + 'fails/s5-fails-after-r5.json', 'utf8'));
else if (set === 's6') tasks = listTasks('suite6', ['agg6.json', 'reorder6.json']);
else if (set.startsWith('suite:')) { const d = set.slice(6); tasks = listTasks(d, fs.readdirSync(B + d).filter((f) => f.endsWith('.json') && !f.startsWith('fails'))); }
tasks = tasks.slice(+fromA, +toA);
const done = new Set(fs.existsSync(out) ? fs.readFileSync(out, 'utf8').trim().split('\n').filter(Boolean).map((l) => { const r = JSON.parse(l); return r.file + '|' + r.name; }) : []);
const t0 = Date.now(); const index = idxF !== '-' ? loadIndex(idxF) : null; const loadMs = Date.now() - t0;
const prior = priorF !== '-' ? JSON.parse(fs.readFileSync(priorF, 'utf8')) : null;
console.error('index load', loadMs, 'ms');
for (const t of tasks) {
  if (done.has(t.file + '|' + t.name)) continue;
  const f = new Function('return (' + t.src + ')')();
  const oracle = t.kind === 'list2num' ? (l) => f(l) & 15 : (l) => f(l);   // the machine's answer: 4 bits / a list of cells
  const r = solveLists(t.kind, oracle, { ms: +msA, index, prior, live: liveA === 'auto' ? 'auto' : liveA === '1' });
  const row = { file: t.file, name: t.name, kind: t.kind, ok: r.ok, prog: r.prog || null, ast: r.ast || null, how: r.how || null, via: r.via, ms: r.ms, cls: r.cls, cexs: r.cexs, stats: r.stats, rejected: r.rejected };
  fs.appendFileSync(out, JSON.stringify(row) + '\n');
  if (r.ok) fs.appendFileSync(process.env.FGFOUND || new URL('./found.jsonl', import.meta.url).pathname, JSON.stringify({ src: 'run:' + out.split('/').pop(), name: t.name, kind: t.kind, prog: r.prog, ast: r.ast, how: r.how, via: r.via, ms: r.ms, at: new Date().toISOString() }) + '\n');
  console.log(`${r.ok ? 'OK ' : '-- '} ${(r.ms / 1000).toFixed(1)}s ${r.via || ''} ${t.kind} ${t.name} :: ${r.prog || ''}`);
}
