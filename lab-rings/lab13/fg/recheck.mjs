// fg/recheck.mjs - independent re-check of accepted programs: parse the printed program and compare with the oracle on
// every valid list (distinct values 8..15, length 0..8 = 109,601 lists). usage: node fg/recheck.mjs <run.jsonl> <set>
import fs from 'fs';
import { parse, evalAst } from './grammar.mjs';
const B = '/tmp/claude-0/-home-user/f7fc857c-d0a9-5552-9b86-ed0f0b4bc3b7/scratchpad/';
const [runF, set] = process.argv.slice(2);
const src = new Map((set === 's6' ? ['agg6.json', 'reorder6.json'].flatMap((fn) => JSON.parse(fs.readFileSync(B + 'suite6/' + fn, 'utf8')).tasks) : JSON.parse(fs.readFileSync(B + 'fails/s5-fails-after-r5.json', 'utf8'))).map((t) => [t.name + '|' + t.kind, t.src]));
const lists = []; const cur = []; const used = new Array(16).fill(false);
(function rec() { lists.push(cur.slice()); if (cur.length === 8) return; for (let v = 8; v <= 15; v++) if (!used[v]) { used[v] = true; cur.push(v); rec(); cur.pop(); used[v] = false; } })();
let ok = 0, bad = 0;
for (const r of fs.readFileSync(runF, 'utf8').trim().split('\n').map((l) => JSON.parse(l)).filter((r) => r.ok)) {
  const f = new Function('return (' + src.get(r.name + '|' + r.kind) + ')')(); const ast = parse(r.prog); let fails = 0;
  for (const l of lists) { const w = r.kind === 'list2num' ? f([...l]) & 15 : f([...l]); let v; try { v = evalAst(ast, l); } catch { v = null; } if (JSON.stringify(v) !== JSON.stringify(w)) fails++; }
  if (fails) { bad++; console.log('FAIL', r.name, fails, r.prog); } else ok++;
}
console.log(JSON.stringify({ lists: lists.length, accepted: ok + bad, pass: ok, fail: bad }));
