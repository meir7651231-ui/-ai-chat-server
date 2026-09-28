import * as E from './rings-atoms.mjs';
const bits = (n) => Array.from({ length: 2 ** n }, (_, i) => Array.from({ length: n }, (_, j) => (i >> (n - 1 - j)) & 1));
const G = (name, n, outs, f) => ({ name, outs, cells: Math.max(6, n + outs.length + 2), examples: bits(n).map((b) => ({ in: b, out: f(...b) })) });
const L = [G('copy', 1, [2], (a) => [a]), G('not', 1, [2], (a) => [1 - a]), G('and', 2, [2], (a, b) => [a & b]), G('or', 2, [2], (a, b) => [a | b]), G('xor', 2, [2], (a, b) => [a ^ b]), G('eqbit', 2, [2], (a, b) => [a === b ? 1 : 0])];
const lib = [];
for (const g of L) { const r = E.solve(g, lib); console.log(g.name, r.solved); if (r.solved) lib.push({ name: g.name, ins: g.examples[0].in.map((_, i) => i), outs: g.outs, prog: [['WHERE', 0], ['GO'], ...r.prog] }); }
const eq2 = G('eq2', 4, [4], (a1, a0, b1, b0) => [a1 === b1 && a0 === b0 ? 1 : 0]);
E.solve({ ...eq2, examples: eq2.examples.slice(0, 1) }, []);   // קובע CELLS=7
const pipes = E.pipesFrom(lib, 4);
const find = (name, ins, out) => pipes.filter((p) => p.name === name).find((p) => { const m = lib.find((x) => x.name === name); return true && JSON.stringify(p.prog.filter(([o]) => o === 'WHERE').map(([, k]) => k)).length && p.__ins === undefined; });
// בונים ידנית: לכל גרסה של eqbit על (0,2) ועל (1,3) ו-and — בודקים אם יש צירוף נכון
const byName = (n) => pipes.filter((p) => p.name === n);
console.log('גרסאות: eqbit', byName('eqbit').length, 'and', byName('and').length, 'cells', 7);
let found = 0;
for (const p1 of byName('eqbit')) for (const p2 of byName('eqbit')) for (const p3 of byName('and')) { const prog = [...p1.prog, ...p2.prog, ...p3.prog];
  if (eq2.examples.every((e) => { const r = E.run(prog, e.in); return r && r.mem[4] === e.out[0]; })) { found++; if (found === 1) console.log('נמצא צירוף נכון באורך', prog.length); } if (found) break; }
console.log('צירופים נכונים:', found);
