// tasks.mjs — list tasks (fixed seed) and the correctness test
import fs from 'node:fs';
import { run } from './machine2.mjs';
let seed = 11; const rnd = (k) => { seed = (seed * 1103515245 + 12345) % 2147483648; return Math.floor((seed / 2147483648) * k); };
const chain = (m, list) => { m[1] = list[0] || 0; list.forEach((a, i) => { m[a] = list[i + 1] || 0; }); return m; };
const shuffled = () => { const p = [8, 9, 10, 11, 12, 13, 14, 15]; for (let i = p.length - 1; i > 0; i--) { const j = rnd(i + 1); [p[i], p[j]] = [p[j], p[i]]; } return p; };
export const TASKS = { 'צעד ברשימה': (m, l) => l[0] || 0, 'סוף רשימה': (m, l) => (l.length ? l[l.length - 1] : 0), 'אורך רשימה': (m, l) => l.length,
  'ראשון ועוד 1': (m, l) => ((l[0] || 0) + 1) & 15, 'שני ברשימה': (m, l) => l[1] || 0, 'חפש ברשימה': (m, l) => (l.includes(m[0]) ? 15 : 0) };
export function makeTask(task) {
  const upTo = task.match(/עד (\d)/); const maxL = upTo ? +upTo[1] : 6; const fn = TASKS[task.replace(/ עד \d/, '')];
  const mk = (n, long) => Array.from({ length: n }, () => { const m = new Array(16).fill(0); const l = shuffled().slice(0, long ? (upTo ? maxL : 7 + rnd(2)) : rnd(maxL + 1)); chain(m, l); if (task === 'חפש ברשימה') m[0] = 8 + rnd(8); return { mem: m, want: fn(m, l) }; });
  const g = { name: task, out: 2, examples: [...mk(24, false), ...mk(6, true)] }; const hold = mk(30, true);
  const ok = (prog) => [...g.examples, ...hold].every((e, i) => [0, i + 7].every((sc) => { const r = run(prog, e.mem, { maxSteps: 3000, scramble: sc }); return r && r.mem[2] === e.want; }));
  return { g, ok }; }
