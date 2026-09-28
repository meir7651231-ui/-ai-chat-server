// edit.mjs — a new capability for the engine: fixing a program that already works.
// Takes solutions it already found (for other tasks), and tries small changes to them: insert a piece anywhere
// (including in the middle, inside a loop), replace a piece, delete a piece. Up to 3 changes. The same judge.
//   node edit.mjs <task> [minutes]
import fs from 'node:fs';
import { run } from './machine2.mjs';
import { variants, searchPieces, assemble } from './pieces.mjs';
import { makeTask } from './tasks.mjs';
const [task, minutes = '8', beamArg = '60'] = process.argv.slice(2); const BEAM = +beamArg;
const END = 1000, CELLS = 6;
const vs = variants(JSON.parse(fs.readFileSync('lib2.json', 'utf8')).filter((m) => !m.name.startsWith('סוף') && !m.name.startsWith('חפש')));
const byLabel = new Map(vs.map((v) => [v.label, v]));
const jumpOf = (label) => { let m = label.match(/^אם (\d)≠0 ⇒ סוף$/); if (m) return { kind: 'קפוץ לסוף', jump: true, cell: +m[1], to: END, label };
  m = label.match(/^אם (\d)≠0 ⇒ דלג (\d)$/); if (m) return { kind: 'דלג קדימה', jump: true, cell: +m[1], skip: +m[2], label };
  m = label.match(/^אם (\d)≠0 ⇒ חלק (\d+)$/); if (m) return { kind: 'קפוץ אחורה', jump: true, cell: +m[1], to: +m[2] - 1, label }; return null; };
const fromLine = (line) => line.split(' · ').slice(3).map((l) => l.replace(/ \(from the file\)$/, '')).map((l) => byLabel.get(l) || jumpOf(l));
// ---- the starting programs: every solution the engine found for *another* task (from the school's files)
const starts = [];
for (const f of ['school-net.json', 'school-nonet.json']) if (fs.existsSync(f)) for (const [t, v] of Object.entries(JSON.parse(fs.readFileSync(f, 'utf8'))))
  if (t !== task && v.line.startsWith('✓')) { const ps = fromLine(v.line); if (ps.every(Boolean)) starts.push({ from: t, ps }); }
// and the solutions from the whole-piece experiment (pexp_*.log)
for (const f of fs.readdirSync('.').filter((f) => /^pexp_.*\.log$/.test(f))) { const L = fs.readFileSync(f, 'utf8').split('\n');
  L.forEach((l, i) => { if (!l.startsWith('{')) return; const j = JSON.parse(l); if (!j.solved || j.task === task) return;
    const ps = L[i + 1].trim().split(/\s+·\s+/).map((x) => byLabel.get(x) || jumpOf(x)); if (ps.every(Boolean)) starts.push({ from: j.task + ' (חלקים)', ps }); }); }
// ---- the change options
const JUMPS = [...Array.from({ length: CELLS }, (_, c) => jumpOf(`אם ${c}≠0 ⇒ סוף`)), ...[1, 2, 3].flatMap((k) => Array.from({ length: CELLS }, (_, c) => jumpOf(`אם ${c}≠0 ⇒ דלג ${k}`)))];
const backJumps = (n) => Array.from({ length: n }, (_, b) => Array.from({ length: CELLS }, (_, c) => jumpOf(`אם ${c}≠0 ⇒ חלק ${b + 1}`))).flat();
const shiftTo = (p, at, d) => (p.jump && p.to !== END && p.to != null && p.to >= at ? { ...p, to: p.to + d, label: p.label.replace(/חלק \d+/, `חלק ${p.to + d + 1}`) } : p);
function* edits(ps) {
  const pool = [...vs, ...JUMPS, ...backJumps(ps.length + 1)];
  for (let at = 0; at <= ps.length; at++) for (const q of pool) { const moved = ps.map((p) => shiftTo(p, at, 1)); yield { ps: [...moved.slice(0, at), q, ...moved.slice(at)], what: `הכנס «${q.label}» במקום ${at + 1}` }; }
  for (let at = 0; at < ps.length; at++) for (const q of pool) if (q.label !== ps[at].label) yield { ps: [...ps.slice(0, at), q, ...ps.slice(at + 1)], what: `החלף חלק ${at + 1} ב«${q.label}»` };
  for (let at = 0; at < ps.length; at++) { const rest = [...ps.slice(0, at), ...ps.slice(at + 1)].map((p) => shiftTo(p, at + 1, -1)); if (rest.some((p) => p.jump && p.to === at)) continue; yield { ps: rest, what: `מחק חלק ${at + 1}` }; }
}
const { g, ok } = makeTask(task); const ex = g.examples, total = ex.length; const t0 = Date.now(), deadline = t0 + (+minutes) * 60000; let runs = 0;
const score = (ps) => { runs++; const prog = assemble(ps); let s = 0, near = 0; const sig = [];
  for (const [i, e] of ex.entries()) { const r = run(prog, e.mem, { maxSteps: 900, scramble: i % 2 ? i + 1 : 0 }); if (!r) return null; if (r.mem[2] === e.want) s++; if (r.mem.slice(0, 8).includes(e.want)) near++; sig.push(r.mem.slice(0, 8).join(',')); }
  return { s, near, sig: sig.join('/') }; };
console.log(`starting points: ${starts.length} programs the engine already solved (${[...new Set(starts.map((x) => x.from))].join(', ')})`);
let layer = starts.map((x, k) => ({ ps: x.ps, root: k, how: [`מתחיל מ«${x.from}»`], ...score(x.ps) })).filter((x) => x.s != null); const seen = new Set(layer.map((x) => x.sig));
let found = null; const STATE = `edit-state-${task.replace(/ /g, '_')}-${BEAM}.json`; let depth0 = 1;
const pack = (ps) => ps.map((p) => p.label); const unpack = (ls) => ls.map((l) => byLabel.get(l) || jumpOf(l));
if (fs.existsSync(STATE)) { const st = JSON.parse(fs.readFileSync(STATE, 'utf8')); depth0 = st.depth + 1; layer = st.layer.map((x) => ({ ...x, ps: unpack(x.ps) })); console.log(`continuing from the file: after change ${st.depth}, ${layer.length} programs`); }
for (let depth = depth0; depth <= 3 && !found && Date.now() < deadline; depth++) {
  const next = [];
  for (const c of layer) { for (const e of edits(c.ps)) { const r = score(e.ps); if (!r) continue;
      if (r.s === total && ok(assemble(e.ps))) { found = { ps: e.ps, how: [...c.how, e.what] }; break; }
      if (seen.has(r.sig)) continue; seen.add(r.sig); next.push({ ps: e.ps, root: c.root, how: [...c.how, e.what], ...r }); }
    if (found || Date.now() > deadline) break; }
  // every starting program gets its own share of places — so one doesn't push out all the others
  const pick = []; const per = Math.max(4, Math.floor(BEAM / starts.length));
  for (let k = 0; k < starts.length; k++) { const mine = next.filter((x) => x.root === k); const a = [...mine].sort((x, y) => y.s - x.s || y.near - x.near), b = [...mine].sort((x, y) => y.near - x.near || y.s - x.s);
    const got = new Set(); for (let i = 0; got.size < per && (a[i] || b[i]); i++) for (const q of [a[i], b[i]]) if (q && got.size < per) got.add(q); pick.push(...got); }
  layer = pick.sort((x, y) => y.s - x.s);
  if (Date.now() < deadline) fs.writeFileSync(STATE, JSON.stringify({ depth, layer: layer.map((x) => ({ ...x, ps: pack(x.ps) })) }));
  console.log(`  change ${depth}: best ${layer[0] ? layer[0].s : 0}/${total} · ${runs} checked · ${Math.round((Date.now() - t0) / 1000)}s`); }
if (found) { console.log(`✓ ${task} · ${Math.round((Date.now() - t0) / 1000)}s · ${runs} checked`); found.how.forEach((h) => console.log('   ' + h));
  console.log('   the program: ' + found.ps.map((p) => p.label).join('  ·  ') + `  (${assemble(found.ps).length} steps)`); }
else console.log(`✗ ${task} · ${Math.round((Date.now() - t0) / 1000)}s · ${runs} checked`);
