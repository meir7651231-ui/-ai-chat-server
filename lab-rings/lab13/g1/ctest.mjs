// compile + strict check of found ASTs. usage: node g1/ctest.mjs <tasks.json[,tasks2.json]> <found.jsonl|'prog-string'> [name] [--nosub]
import fs from 'fs';
import { compileAst, strictCheck } from '../fg/compile.mjs';
import { parse } from '../fg/grammar.mjs';
const [tf, src, only, flag] = process.argv.slice(2);
const T = new Map(tf.split(',').flatMap((f) => JSON.parse(fs.readFileSync(f, 'utf8')).tasks).map((t) => [t.name, t]));
let rows;
if (fs.existsSync(src)) rows = fs.readFileSync(src, 'utf8').trim().split('\n').map((l) => JSON.parse(l)).filter((r) => r.ok);
else rows = [{ name: only, ast: parse(src), prog: src }];
for (const r of rows) {
  if (only && r.name !== only) continue; const t = T.get(r.name); if (!t) { console.log('?? no task', r.name); continue; }
  const t0 = Date.now(); let c;
  try { c = await compileAst(r.ast, { name: t.name, kind: t.kind, src: t.src }, { noFallback: flag === '--nosub' }); } catch (e) { c = { ok: false, reason: 'crash ' + e.stack }; }
  let st = null; if (c.ok) st = strictCheck(c.prog, t);
  console.log(c.ok ? (st.ok ? 'PASS' : 'STRICT-FAIL ' + JSON.stringify(st)) : 'NOCOMP', ((Date.now() - t0) / 1000).toFixed(1) + 's', c.len || '', t.kind, r.name, r.prog, c.ok ? (c.fallbacks ? '[sub ' + c.parts.map((p) => p.stage).join(',') + ']' : '') : (c.reason || '').slice(0, 300));
}
process.exit(0);
