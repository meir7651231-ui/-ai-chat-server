// held-out report: node g1/heldreport.mjs <runPrefix e.g. runs/G1-H> [refPrefix for a G0 (FG1=0) run]
// per task: production it was written for, AST found by the grammar stage (pass G0/G1), compiled (stage 'דקדוק' solved it), solved by the machine (any stage).
import fs from 'fs';
const [pre, ref] = process.argv.slice(2);
const held = JSON.parse(fs.readFileSync(new URL('./heldout/g1held.json', import.meta.url), 'utf8')).tasks;
const rows = (p) => { const m = new Map(); for (const k of ['list2list', 'list2num']) { const f = p + '-' + k + '.jsonl'; if (!fs.existsSync(f)) continue; for (const l of fs.readFileSync(f, 'utf8').split('\n').filter(Boolean)) { const r = JSON.parse(l); m.set(r.name, r); } } return m; };
const found = (p) => { const m = new Map(); const f = p + '-found.jsonl'; if (!fs.existsSync(f)) return m; for (const l of fs.readFileSync(f, 'utf8').split('\n').filter(Boolean)) { const r = JSON.parse(l); m.set(r.name, r); } return m; };
const R = rows(pre), F = found(pre), RR = ref ? rows(ref) : null;
const byProd = {}; let nF = 0, nC = 0, nS = 0, nRef = 0, n = 0, ms = 0;
for (const t of held) {
  const r = R.get(t.name); if (!r) { console.log('MISSING ' + t.name); continue; } n++;
  const f = F.get(t.name); const comp = r.ok && r.stage === 'דקדוק'; const fd = !!f;
  if (fd) nF++; if (comp) nC++; if (r.ok) nS++; ms += r.ms;
  const rr = RR && RR.get(t.name); if (rr && rr.ok) nRef++;
  const b = (byProd[t.g1] ||= { n: 0, f: 0, c: 0, s: 0, ref: 0 }); b.n++; if (fd) b.f++; if (comp) b.c++; if (r.ok) b.s++; if (rr && rr.ok) b.ref++;
  console.log(`${r.ok ? 'SOLVED' : 'FAILED'} ${fd ? 'found(' + f.pass + ')' : 'notfound'} ${comp ? 'compiled' : (fd ? 'NOT-compiled' : '-')} ${r.kind} ${t.g1} | ${t.name} | ${r.stage || '-'} ${Math.round(r.ms / 1000)}s${rr ? ' | G0-only: ' + (rr.ok ? 'solved by ' + rr.stage : 'failed') : ''}${fd ? ' | ' + f.prog.slice(0, 80) : ''}`);
}
console.log(`\nheld-out ${n}: found ${nF}, compiled by the grammar stage ${nC}, solved by the machine ${nS}${RR ? `; G0-only machine ${nRef}` : ''}; time ${(ms / 60000).toFixed(1)} min`);
for (const [p, b] of Object.entries(byProd)) console.log(`  ${p}: ${b.n} tasks, found ${b.f}, compiled ${b.c}, solved ${b.s}${RR ? ', G0-only solved ' + b.ref : ''}`);
