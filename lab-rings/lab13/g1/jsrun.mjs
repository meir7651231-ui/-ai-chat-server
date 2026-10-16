// JS-only search measurement (no machine code). usage: node g1/jsrun.mjs <tasks.json> <out.jsonl> <ms> <g1:0|1> [index.bin|-] [prior|-] [live:auto|1]
import fs from 'fs';
import { solveLists } from '../fg/search.mjs';
import { loadIndex } from '../fg/index.mjs';
const [tf, out, ms = '60000', g1 = '1', idxF = '-', priorF = '-', liveA = '1'] = process.argv.slice(2);
const tasks = JSON.parse(fs.readFileSync(tf, 'utf8')).tasks.filter((t) => t.kind !== 'num');
const done = new Set(fs.existsSync(out) ? fs.readFileSync(out, 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l).name) : []);
const index = idxF !== '-' ? loadIndex(idxF) : null; const prior = priorF !== '-' ? JSON.parse(fs.readFileSync(priorF, 'utf8')) : null;
for (const t of tasks) { if (done.has(t.name)) continue;
  const f = new Function('return (' + t.src + ')')(); const oracle = t.kind === 'list2num' ? (l) => f(l) & 15 : (l) => f(l);
  const r = solveLists(t.kind, oracle, { ms: +ms, index, prior, g1: g1 === '1', live: liveA === 'auto' ? 'auto' : liveA === '1' });
  fs.appendFileSync(out, JSON.stringify({ name: t.name, kind: t.kind, g1: t.g1 || null, ok: r.ok, prog: r.prog || null, ast: r.ast || null, how: r.how || null, via: r.via, ms: r.ms, cexs: r.cexs }) + '\n');
  console.log(`${r.ok ? 'OK ' : '-- '} ${(r.ms / 1000).toFixed(1)}s ${t.kind} ${t.name} :: ${r.prog || ''}`); }
