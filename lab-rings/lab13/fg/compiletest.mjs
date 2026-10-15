// fg/compiletest.mjs - end-to-end check of found ASTs: compileAst (Track B, copied) + strictCheck (20000 lists, pads 0/3/17).
// usage: node fg/compiletest.mjs <out.jsonl> <run.jsonl ...>      (resumable)
import fs from 'fs';
import { compileAst, strictCheck } from './compile.mjs';
const B = '/tmp/claude-0/-home-user/f7fc857c-d0a9-5552-9b86-ed0f0b4bc3b7/scratchpad/';
const SRC = new Map([...['agg6.json', 'reorder6.json'].flatMap((fn) => JSON.parse(fs.readFileSync(B + 'suite6/' + fn, 'utf8')).tasks), ...JSON.parse(fs.readFileSync(B + 'fails/s5-fails-after-r5.json', 'utf8'))].map((t) => [t.name + '|' + t.kind, t.src]));
const [out, ...runs] = process.argv.slice(2);
const done = new Set(fs.existsSync(out) ? fs.readFileSync(out, 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l).name) : []);
for (const f of runs) for (const r of fs.readFileSync(f, 'utf8').trim().split('\n').map((l) => JSON.parse(l)).filter((r) => r.ok)) {
  if (done.has(r.name)) continue;
  const spec = { name: r.name, kind: r.kind, src: SRC.get(r.name + '|' + r.kind) }; const t0 = Date.now();
  let c; try { c = await compileAst(r.ast, spec, { quietCrash: true }); } catch (e) { c = { ok: false, reason: 'crash: ' + String(e.message || e).slice(0, 100) }; }
  let strict = null; if (c.ok) { try { strict = strictCheck(c.prog, spec); } catch (e) { strict = { ok: false, why: 'crash ' + e.message }; } }
  const row = { name: r.name, kind: r.kind, run: f.split('/').pop(), prog: r.prog, compiled: !!c.ok, len: c.prog ? c.prog.length : null, strict: strict ? (strict.ok ?? strict) : null, reason: c.ok ? null : String(c.reason || c.err || '').slice(0, 120), fallbacks: c.fallbacks || 0, ms: Date.now() - t0 };
  fs.appendFileSync(out, JSON.stringify(row) + '\n'); console.log(row.compiled ? (row.strict === true ? 'PASS' : 'STRICT-FAIL') : 'NOCOMP', (row.ms / 1000).toFixed(1) + 's', r.kind, r.name, r.prog, row.reason || '');
}
