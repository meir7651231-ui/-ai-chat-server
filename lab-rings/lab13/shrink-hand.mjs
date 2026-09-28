import { run } from './machine2.mjs'; import { shrink } from './rings2.mjs'; import { LENGTH, SEARCH } from './handwritten.mjs';
let s = 99; const rnd = (k) => { s = (s * 1103515245 + 12345) % 2147483648; return Math.floor((s / 2147483648) * k); };
const INPUT = [0, 1, 8, 9, 10, 11, 12, 13, 14, 15];
const make = (want, key) => { const ex = []; for (let i = 0; i < 300; i++) { const p = [8, 9, 10, 11, 12, 13, 14, 15]; for (let j = 7; j > 0; j--) { const r = rnd(j + 1); [p[j], p[r]] = [p[r], p[j]]; }
  const l = p.slice(0, i < 20 ? i % 9 : rnd(9)); const m = new Array(16).fill(0); m[1] = l[0] || 0; l.forEach((a, j) => { m[a] = l[j + 1] || 0; }); if (key) m[0] = 8 + rnd(8);
  for (let k = 0; k < 16; k++) if (!INPUT.includes(k)) m[k] = rnd(16); ex.push({ mem: m, want: want(l, m) }); } return { out: 2, examples: ex }; };
const END = 1000;
// asm נותן קפיצות כמספר-שורה; shrink מצפה לתווית 'code' על «לאן» שמוביל ל«לך-לשורה»
const tag = (prog) => { const out = prog.map((x) => [...x]); let last = -1; out.forEach(([o], i) => { if (o === 'WHERE') last = i; else if (o === 'WHERE@') last = -1; else if (o === 'JUMP' && last >= 0) { const k = out[last][1]; out[last] = ['WHERE', k >= out.length ? END : k, 'code']; } }); return out; };
const fix = (p) => p.map(([o, k, t]) => (o === 'WHERE' && t === 'code' ? ['WHERE', k === END ? 9999 : k] : o === 'WHERE' ? ['WHERE', k] : [o]));
for (const [name, P, g] of [['אורך רשימה', LENGTH, make((l) => l.length)], ['חפש ברשימה', SEARCH, make((l, m) => (l.includes(m[0]) ? 15 : 0), true)]]) {
  const t = Date.now(); const sp = fix(shrink(tag(P), g)); const g2 = make(name === 'אורך רשימה' ? (l) => l.length : (l, m) => (l.includes(m[0]) ? 15 : 0), name !== 'אורך רשימה');
  const ok = g2.examples.every((e, i) => [0, i + 3].every((sc) => { const r = run(sp, e.mem, { maxSteps: 2000, scramble: sc }); return r && r.mem[2] === e.want; }));
  console.log(name, P.length, '⇐', sp.length, 'פעולות · בדיקה חדשה:', ok ? '✓' : '✗', Math.round((Date.now() - t) / 1000) + 's'); }
