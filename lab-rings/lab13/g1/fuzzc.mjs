// brick fuzz: random G1 ASTs from the G1 index, compiled without sub-spec fallback; every compiled program is checked against
// its own AST on 30000 strict examples (garbage in free cells, pads 0/3/17) — a brick bug that the 3000-example self-check misses shows here.
import fs from 'fs';
import { loadIndex } from '../fg/index.mjs';
import { compileAst, strictGen } from '../fg/compile.mjs';
import { evalAst, show, P } from '../fg/grammar.mjs';
import { run } from '../machine3s.mjs';
const [nA = '60', seedA = '1'] = process.argv.slice(2);
const ix = loadIndex(new URL('../fg/index-g1.bin', import.meta.url).pathname);
let s = +seedA; const rnd = () => (s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x80000000;
const G1 = P.filter((p) => p.tag === 'g1').map((p) => p.name); const stat = {}; let comp = 0, bad = 0, tried = 0;
for (let k = 0; k < +nA; k++) {
  const T = rnd() < 0.5 ? 'N' : 'L'; const i = Math.floor(rnd() * Math.min(ix.counts[T], 60000)); const ast = ix.node(T, i).ast; const kind = T === 'N' ? 'list2num' : 'list2list';
  const f = (l) => { const v = evalAst(ast, [...l]); return kind === 'list2num' ? (typeof v === 'boolean' ? (v ? 1 : 0) : v) : v; };
  if (kind === 'list2list') { let okL = true; for (const l of [[], [8], [9, 8], [15, 8, 11, 10, 13, 9, 14, 12]]) { const v = f(l); if (!Array.isArray(v) || v.some((x) => x < 8 || x > 15) || new Set(v).size !== v.length || v.length > 8) okL = false; } if (!okL) continue; }
  tried++; let c; try { c = await compileAst(ast, { kind }, { noFallback: true }); } catch (e) { c = { ok: false, reason: 'crash ' + e.message }; }
  const used = G1.filter((n) => show(ast).includes(n)); for (const u of used) { stat[u] ||= { tried: 0, comp: 0 }; stat[u].tried++; if (c.ok) stat[u].comp++; }
  if (!c.ok) { if (/crash/.test(c.reason || '')) console.log('CRASH', show(ast), c.reason.slice(0, 200)); continue; }
  comp++; const gen = strictGen(kind, (l) => f(l));
  let fail = null; for (const pad of [0, 3, 17]) { const pre = Array.from({ length: Math.ceil(pad / 3) }, () => [['WHERE', 0], ['GO'], ['TAKE']]).flat().slice(0, pad); const p = [...pre, ...c.prog.map((x) => (x[0] === 'WHERE' && x[2] === 'code' ? ['WHERE', x[1] + pad, 'code'] : x))]; const junk = pre.filter((x) => x[0] === 'TAKE').length;
    for (let r = 0; r < (pad ? 3000 : 24000) && !fail; r++) { const e = gen(); const z = run(p, e.mem, { maxSteps: 600000 }); if (!z || z.st.length !== junk || !e.ok(z.mem)) fail = { pad, l: e.l, want: e.want, got: z ? (kind === 'list2num' ? z.mem[2] : null) : 'null(steps)' }; } }
  if (fail) { bad++; console.log('BAD', show(ast), JSON.stringify(fail)); }
}
console.log('tried', tried, 'compiled', comp, 'bad', bad); console.log(JSON.stringify(stat));
process.exit(0);
