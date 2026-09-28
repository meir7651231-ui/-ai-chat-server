// an independent check: 500 new lists (length 0–8, random addresses), with and without scrambling
import fs from 'node:fs';
import { run } from './machine2.mjs';
import { variants, assemble } from './pieces.mjs';
const vs = variants(JSON.parse(fs.readFileSync('lib2.json', 'utf8')).filter((m) => !m.name.startsWith('סוף') && !m.name.startsWith('חפש')));
const V = (l) => vs.find((v) => v.label === l);
const ps = [V('קבוע 1(0→3)'), { jump: true, cell: 3, skip: 2 }, V('חיבור מספרים(2,3→2)'), V('קח מהכתובת שבתא(1→1)'), { jump: true, cell: 1, to: 2 }];
const prog = assemble(ps); let seed = 999; const rnd = (k) => { seed = (seed * 1103515245 + 12345) % 2147483648; return Math.floor((seed / 2147483648) * k); };
let good = 0, N = 500;
for (let t = 0; t < N; t++) { const p = [8, 9, 10, 11, 12, 13, 14, 15]; for (let i = 7; i > 0; i--) { const j = rnd(i + 1); [p[i], p[j]] = [p[j], p[i]]; }
  const l = p.slice(0, rnd(9)); const m = new Array(16).fill(0); m[1] = l[0] || 0; l.forEach((a, i) => { m[a] = l[i + 1] || 0; });
  if ([0, 1 + t].every((sc) => { const r = run(prog, m, { maxSteps: 5000, scramble: sc }); return r && r.mem[2] === l.length; })) good++; }
console.log(`correct on ${good}/${N} new lists · ${prog.length} steps`);
fs.writeFileSync('length-solution.json', JSON.stringify({ name: 'אורך רשימה', pieces: ps.map((p) => p.label || (p.skip ? `אם ${p.cell}≠0 ⇒ דלג ${p.skip}` : `אם ${p.cell}≠0 ⇒ חלק ${p.to + 1}`)), prog }, null, 1));
