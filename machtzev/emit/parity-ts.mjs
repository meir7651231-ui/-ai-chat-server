#!/usr/bin/env node
/** 🌉 parity-ts · שוויון TS⇔Dart על מודול-מחלקות שלם (מנוע-המערכות): אותו מקור TS ⇒ (א) JS (transpile) ⇒ ריצה · (ב) emitTs ⇒ Dart ⇒ ריצה.
 *  אותם תרחישים (טקסט-JS אחד, מומר באותו ממיר) ⇒ כל מספר מודפס חייב להיות זהה. ה-JS = אמת (עיקרון fuzz-parity).
 *  מקור: SYSTEMS_ENGINE (ברירת-מחדל /home/user/systems-engine) · אין מקור/אין Dart ⇒ exit 2 (צהוב, לא ירוק-מזויף).
 *  שימוש: node machtzev/emit/parity-ts.mjs [--keep <dir>] */
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import { execSync } from 'node:child_process';
import { emitTs } from './ast-js-to-dart.mjs';
import { requireTs } from '../lib-ts.mjs';
import { resolveDart } from '../dart-bin.mjs';
const ts = requireTs();
const SE = process.env.SYSTEMS_ENGINE || '/home/user/systems-engine'; const P = path.join(SE, 'packages');
const DART = process.env.DART || resolveDart();   // פותר-הכלים האחד (L34)
if (!fs.existsSync(path.join(P, 'core/src/rng.ts'))) { console.log(`⚠️ parity-ts: אין מנוע-מערכות ב-${SE} (SYSTEMS_ENGINE)`); process.exit(2); }
if (!DART || !fs.existsSync(DART)) { console.log('⚠️ parity-ts: אין Dart (DART)'); process.exit(2); }
const files = ['core/src/rng.ts', 'core/src/sim.ts', 'core/src/stats.ts', 'core/src/stock.ts', 'core/src/node.ts', 'core/src/atoms.ts', 'core/src/model.ts', ...fs.readdirSync(path.join(P, 'dynamics/src')).filter((f) => f.endsWith('.ts') && f !== 'index.ts').sort().map((f) => 'dynamics/src/' + f)];
const src = files.map((f) => fs.readFileSync(path.join(P, f), 'utf8')).join('\n');
const H = fs.readFileSync(new URL('./parity-ast.mjs', import.meta.url), 'utf8').match(/const H = `([^]*?)`;/)[1];   // שקעי-השפה של הממיר (_i32 · _JsObj · _sort …)
// תרחישים: אקראיות · תור M/M/1 · צוואר-בקבוק · מודל-ממפרט (build) · שרשרת-אספקה · שיירת-מכוניות · מלאי-וזרימה + החלקה
const scen = `
const rr = new Rng(42); out(rr.next()); out(new Rng(0).next()); out(new Rng(5).fork('זרם').next()); out(new Rng(11).normal(10, 2));
out(sample({ kind: 'choice', values: [1, 2, 3], weights: [1, 1, 5] }, new Rng(8))); out(meanOf({ kind: 'pareto', scale: 1, alpha: 2 }));
const gate = threshold({ low: 3, high: 8, on: 1 }); out([2, 5, 9, 5, 2].map((x) => gate(x)).join(','));

const mm1 = (a, s, seed) => { const m = new Model(seed); m.source('in', { interarrival: { kind: 'exp', mean: a } }); m.station('s', { service: { kind: 'exp', mean: s } }); m.sink('out'); m.chain('in', 's', 'out'); return m; };
const r1 = mm1(1, 0.8, 7).run(5000, 100).report(); out(r1.completed); out(r1.created); out(r1.avgWip); out(r1.avgLead); out(r1.p95Lead); out(r1.nodes.length);
const line = (a, b, c) => { const m = new Model(11); m.source('in', { interarrival: 0.5 }); m.station('a', { service: { kind: 'exp', mean: a }, capacity: 5, blocking: true }); m.station('b', { service: { kind: 'exp', mean: b }, capacity: 5, blocking: true }); m.station('c', { service: { kind: 'exp', mean: c }, capacity: 5, blocking: true }); m.sink('out'); m.chain('in', 'a', 'b', 'c', 'out'); m.run(3000, 100); return m.report(); };
const r2 = line(1, 2, 1); out(r2.completed); out(r2.lost); out(r2.avgLead);
const m3 = build({ seed: 5, nodes: [{ id: 'gate', type: 'source', to: 'check', interarrival: { kind: 'exp', mean: 0.5 } }, { id: 'check', type: 'station', to: ['out'], servers: 3, service: { kind: 'lognormal', mean: 1.2, sd: 0.4 } }, { id: 'out', type: 'sink' }] });
const r3 = m3.run(2000, 100).report(); out(r3.completed); out(r3.avgLead); out(r3.p95Lead);
const sim4 = new Sim(3); const sc = new SupplyChain(sim4, { demand: (t, rng) => (t < 5 ? 4 : 8) + rng.uniform(0, 1) }); sim4.run(40); out(sc.amplification(5).join(',')); out(sc.stages[3].placed.length);
const sim5 = new Sim(9); const cc = new CarChain(sim5, { cars: 8, leader: (t) => (t < 10 ? 20 : 5), reactionTime: 0.6 }); sim5.run(30); out(cc.minGap); out(cc.collisions);
const sim6 = new Sim(1); const dyn = new Dynamics(sim6, 0.5); const tank = dyn.stock('tank', { initial: 10, min: 0 }); dyn.flow('fill', { to: tank, rate: (t) => 3 }); dyn.flow('drain', { from: tank, rate: (t) => tank.level * 0.2 }); const ser = dyn.record(tank); const sm = new Smooth(sim6, () => tank.level, 4); sim6.run(50); out(tank.level); out(sm.value); out(ser.v.length); out(ser.v[7]);
`;
const js = ts.transpileModule(src, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText.replace(/^import .*$/mg, '').replace(/^export \{[^}]*\};?$/mg, '').replace(/^export /mg, '');
const want = []; new Function('out', js + scen)((v) => want.push(String(v)));
const dart = H + '\n' + emitTs(src + '\nfunction __main(out) {' + scen + '}') + "\nString _fmt(v) { if (v is double && v.isFinite && v == v.truncateToDouble()) return v.toInt().toString(); if (v is double && v.isInfinite) return v > 0 ? 'Infinity' : '-Infinity'; return v.toString(); }\nvoid main(){ _moduleInit(); __main((v) => print(v is String ? v.split(',').map((x) => _fmt(num.tryParse(x) ?? x)).join(',') : _fmt(v))); }\n";
const ki = process.argv.indexOf('--keep'); const dir = ki > -1 ? process.argv[ki + 1] : fs.mkdtempSync(path.join(os.tmpdir(), 'pts-')); fs.mkdirSync(dir, { recursive: true });
const f = path.join(dir, 'systems_engine_parity.dart'); fs.writeFileSync(f, dart);
let got; try { got = execSync(`${DART} run ${f} 2>&1`, { encoding: 'utf8' }); } catch (e) { got = String(e.stdout || e.message); }
got = got.split('\n').filter((l) => l && !/Woah|superuser|^\s*\/$|📎/.test(l));
let bad = 0; want.forEach((v, i) => { if (!(v === got[i] || Number(v) === Number(got[i]))) { bad++; console.log(`✗ #${i} js=${v.slice(0, 80)} dart=${String(got[i]).slice(0, 80)}`); } });
if (ki < 0) fs.rmSync(dir, { recursive: true, force: true });
console.log(bad ? `✗ parity-ts: ${bad}/${want.length} שונים (${files.length} קבצי-TS)` : `✓ parity-ts: ${want.length}/${want.length} ערכים זהים JS⇔Dart · ${files.length} קבצי-TS · ${src.split('\n').length} שורות`);
process.exit(bad ? 1 : 0);
