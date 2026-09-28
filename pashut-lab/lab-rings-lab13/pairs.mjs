// edit.mjs — a new capability for the engine: fixing a program that already works.
// Takes solutions it already found (for other tasks), and tries small changes to them: insert a piece anywhere
// (including in the middle, inside a loop), replace a piece, delete a piece. Up to 3 changes. The same judge.
//   node edit.mjs <task> [minutes]
import fs from 'node:fs';
import { run } from './machine2.mjs';
import { variants, searchPieces, assemble } from './pieces.mjs';
import { makeTask } from './tasks.mjs';
const [task, minutes = '9', startName = 'סוף רשימה (חלקים)'] = process.argv.slice(2);
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

// pairs.mjs — the lesson from lab13/exact.mjs: don't throw away paths. From one starting program, try *every* pair of changes.
// Programs that reach exactly the same state merge (like exact.mjs). Fast: a program with more than 4 mistakes is dropped right away.
const { g, ok } = makeTask(task); const ex = g.examples, total = ex.length; const t0 = Date.now(), deadline = t0 + (+minutes) * 60000; let runs = 0;
const quick = (ps, maxWrong) => { runs++; const prog = assemble(ps); let wrong = 0; const sig = [];
  for (const [i, e] of ex.entries()) { const r = run(prog, e.mem, { maxSteps: 900, scramble: i % 2 ? i + 1 : 0 }); if (!r) return null; if (r.mem[2] !== e.want && ++wrong > maxWrong) return null; sig.push(r.mem.slice(0, 8).join(',')); }
  return { s: total - wrong, sig: sig.join('/') }; };
const start = starts.find((x) => x.from === startName); if (!start) { console.log('no starting point', startName); process.exit(1); }
const STATE = `pairs-${task.replace(/ /g, '_')}.json`;
let st = fs.existsSync(STATE) ? JSON.parse(fs.readFileSync(STATE, 'utf8')) : null;
const pack = (ps) => ps.map((p) => p.label); const unpack = (ls) => ls.map((l) => byLabel.get(l) || jumpOf(l));
if (!st) { // change 1: all of them, merging identical states
  const one = new Map(); for (const e of edits(start.ps)) { const r = quick(e.ps, total); if (r && !one.has(r.sig)) one.set(r.sig, { ps: pack(e.ps), how: [e.what] }); }
  st = { level1: [...one.values()], next: 0, good: [] }; fs.writeFileSync(STATE, JSON.stringify(st));
  console.log(`change 1: ${st.level1.length} different programs (after merging identical ones) · ${Math.round((Date.now() - t0) / 1000)}s`); }
// change 2: every program from change 1 × every change. Keep what made at most 4 mistakes.
for (; st.next < st.level1.length && Date.now() < deadline; st.next++) { const c = st.level1[st.next]; const ps0 = unpack(c.ps);
  for (const e of edits(ps0)) { const r = quick(e.ps, 4); if (!r) continue;
    if (r.s === total && ok(assemble(e.ps))) { console.log(`✓ ${task} after 2 changes · ${Math.round((Date.now() - t0) / 1000)}s`); console.log('   ' + [...c.how, e.what].join('  ⇐  ')); console.log('   ' + e.ps.map((p) => p.label).join(' · ') + ` (${assemble(e.ps).length} steps)`); process.exit(0); }
    st.good.push({ ps: pack(e.ps), how: [...c.how, e.what], s: r.s }); }
  if (st.next % 50 === 0) fs.writeFileSync(STATE, JSON.stringify(st)); }
fs.writeFileSync(STATE, JSON.stringify(st));
console.log(`change 2: ${st.next}/${st.level1.length} done · ${st.good.length} programs with at most 4 mistakes · ${runs} checked this run · ${Math.round((Date.now() - t0) / 1000)}s`);
if (st.next < st.level1.length) process.exit(0);
// change 3: only from the good ones (the best first)
const good = [...new Map(st.good.map((x) => [x.ps.join('|'), x])).values()].sort((a, b) => b.s - a.s);
console.log(`change 3: from the ${good.length} best: ${good.slice(0, 3).map((x) => x.s + '/' + total).join(', ')}`);
for (const c of good) { if (Date.now() > deadline) break; const ps0 = unpack(c.ps);
  for (const e of edits(ps0)) { const r = quick(e.ps, 0); if (!r) continue; if (ok(assemble(e.ps))) {
    console.log(`✓ ${task} after 3 changes · ${Math.round((Date.now() - t0) / 1000)}s`); console.log('   ' + [...c.how, e.what].join('  ⇐  ')); console.log('   ' + e.ps.map((p) => p.label).join(' · ') + ` (${assemble(e.ps).length} steps)`); process.exit(0); } } }
console.log(`✗ not found after 3 changes · ${Math.round((Date.now() - t0) / 1000)}s`);
