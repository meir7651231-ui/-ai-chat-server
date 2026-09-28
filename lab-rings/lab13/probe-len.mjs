import fs from 'node:fs'; import { run } from './machine2.mjs';
const lib = JSON.parse(fs.readFileSync('lib2.json', 'utf8'));
const L = lib.find((m) => m.name.startsWith('סוף רשימה (לולאה')), P = lib.find((m) => m.name === 'ועוד 1 באותו תא');
console.log('inc:', JSON.stringify({ ins: P.ins, out: P.out, data: P.data }), P.prog.length);
const loop = L.prog.map(([o, k, t]) => (o === 'WHERE' && t !== 'code' && k === 2 ? ['WHERE', 3] : [o, k, t]));
const lists = []; let s = 5; const r = (k) => { s = (s * 1103515245 + 12345) % 2147483648; return Math.floor(s / 2147483648 * k); };
for (let i = 0; i < 60; i++) { const p = [8,9,10,11,12,13,14,15].sort(() => r(3) - 1); const l = p.slice(0, 1 + r(8)); const m = new Array(16).fill(0); m[1] = l[0]; l.forEach((a, j) => { m[a] = l[j + 1] || 0; }); lists.push({ m, n: l.length }); }
for (let pos = 2; pos <= loop.length; pos++) { const body = P.prog.map(([o,k,t]) => (o === 'WHERE' && t !== 'code' && k === 1 ? ['WHERE', 7] : o === 'WHERE' && t !== 'code' && k === 0 ? ['WHERE', 6] : [o,k,t])); const sh = loop.map(([o, k, t]) => (o === 'WHERE' && t === 'code' && k > pos ? ['WHERE', k + body.length, 'code'] : [o, k, t]));
  const prog = [...sh.slice(0, pos), ...body, ...sh.slice(pos)].map((x) => x.filter((y) => y !== undefined));
  let ok = 0; for (const { m, n } of lists) { const q = run(prog, m, { maxSteps: 4000 }); if (q && q.mem[2] === n) ok++; }
  console.log('pos', pos, ok + '/60'); }
{ const pos = 5; const body = P.prog.map(([o,k,t]) => (o === 'WHERE' && t !== 'code' && k === 1 ? ['WHERE', 7] : o === 'WHERE' && t !== 'code' && k === 0 ? ['WHERE', 6] : [o,k,t]));
  const sh = loop.map(([o, k, t]) => (o === 'WHERE' && t === 'code' && k > pos ? ['WHERE', k + body.length, 'code'] : [o, k, t]));
  const prog = [...sh.slice(0, pos), ...body, ...sh.slice(pos)].map((x) => x.filter((y) => y !== undefined));
  console.log(prog.map((p) => p.join(' ')).join(' | '));
  for (const { m, n } of lists.slice(0, 6)) { const q = run(prog, m, { maxSteps: 4000 }); console.log('n', n, 'got', q && q.mem[2], 'cell3', q && q.mem[3], 'steps', q && q.steps); } }
