// experiment.mjs <task> <mode>   mode: base (engine alone, 5 ops) · baselib (engine alone + what it learned) · guided (engine + network)
// Same examples for everyone (fixed seed). "Correct" = the same test as rings2: all examples + long lists never seen + scrambled loop.
import fs from 'node:fs';
import { run } from './machine2.mjs';
import { solve } from './rings2.mjs';
import { makeNet, train, dataFrom, solveGuided, predict, ACTS } from './guided.mjs';
const [task, mode, minutes = '20'] = process.argv.slice(2);
let seed = 11; const rnd = (k) => { seed = (seed * 1103515245 + 12345) % 2147483648; return Math.floor((seed / 2147483648) * k); };
const chain = (m, list) => { m[1] = list[0] || 0; list.forEach((a, i) => { m[a] = list[i + 1] || 0; }); return m; };
const shuffled = () => { const p = [8, 9, 10, 11, 12, 13, 14, 15]; for (let i = p.length - 1; i > 0; i--) { const j = rnd(i + 1); [p[i], p[j]] = [p[j], p[i]]; } return p; };
const listOf = (n) => () => { const m = new Array(16).fill(0); const l = shuffled().slice(0, rnd(n + 1)); chain(m, l); return { m, l }; };
const want = { 'סוף רשימה באורך עד 2': (m, l) => (l.length ? l[l.length - 1] : 0), 'חפש ברשימה': (m, l) => (l.includes(m[0]) ? 15 : 0), 'אורך רשימה': (m, l) => l.length };
const maxLen = { 'סוף רשימה באורך עד 2': 2, 'חפש ברשימה': 6, 'אורך רשימה': 6 }[task];
const mk = (n, long) => Array.from({ length: n }, () => { const { m, l } = long ? (() => { const m = new Array(16).fill(0); const l = shuffled().slice(0, 7 + rnd(2)); chain(m, l); return { m, l }; })() : listOf(maxLen)();
  if (task === 'חפש ברשימה') m[0] = 8 + rnd(8); return { mem: m, want: want[task](m, l) }; });
const g = { name: task, out: 2, examples: [...mk(task === 'סוף רשימה באורך עד 2' ? 20 : 24, false), ...mk(6, true)] }; const hold = mk(30, true);   // 6 long ones in the search, 30 other long ones held back for the test
const ok = (prog) => [...g.examples, ...hold].every((e, i) => [0, i + 7].every((sc) => { const r = run(prog, e.mem, { maxSteps: 2000, scramble: sc }); return r && r.mem[2] === e.want; }));
// Training for the network: every program in memory, except this task and its siblings (so it doesn't "peek")
const all = JSON.parse(fs.readFileSync('lib2.json', 'utf8'));
const lib = all.filter((m) => !(task.startsWith('סוף') ? m.name.startsWith('סוף') : m.name === task));
const t0 = Date.now(); let r;
if (mode === 'guided' || mode === 'nonet') {
  const K = mode === 'nonet' ? 8 : 0;   // nonet = the exact same search, with every action allowed (no network)
  const net = train(makeNet(1), dataFrom(lib, () => [{ mem: listOf(3)().m }]), 400);
  const x0 = predict(net, (() => { const x = new Array(25).fill(0); x[8] = 1; x[17] = 1; x[18] = 1; x[23] = 1; x[24] = 1; return x; })());
  console.log('what the network suggests as the first step:', x0.map((p, i) => [ACTS[i], Math.round(p * 100)]).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([a, p]) => `${a} ${p}%`).join(' · '));
  const deadline = t0 + (+minutes) * 60000;
  for (const opt of [{ keep: 3 }, { keep: 3, beam: 1000, patience: 20 }, { keep: 4, beam: 1000, patience: 20 }, { keep: 4, beam: 3000, patience: 25, maxRounds: 70 }]) {
    r = solveGuided(g, net, { ...opt, ...(K ? { keep: K } : {}), deadline }); if (r.solved && ok(r.prog)) { r.how = JSON.stringify(opt); break; } r.solved = false; if (Date.now() > deadline) break; }
} else {
  r = solve(g, mode === 'baselib' ? lib : [], { beam: 600 }); if (r.solved && !ok(r.prog)) r.solved = false;
}
console.log(JSON.stringify({ task, mode, solved: r.solved, best: r.best, total: r.total, len: r.prog.length, sec: Math.round((Date.now() - t0) / 1000), checked: r.runs ?? r.explored, how: r.how || '' }));
if (r.solved) console.log(r.prog.map(([o, k, t]) => (o === 'WHERE' ? (t === 'code' ? '→' + k : 'לאן' + k) : o)).join(' '));
