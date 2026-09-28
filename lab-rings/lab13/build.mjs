// מסלול קבוע לבנייה גדולה: אני כותב ⇒ המנוע מקצר (הפוך) ⇒ נבדק על רשימות חדשות ⇒ נשמר בזיכרון
import fs from 'node:fs'; import { run, asm } from './machine2.mjs';
let s = 99; const rnd = (k) => { s = (s * 1103515245 + 12345) % 2147483648; return Math.floor((s / 2147483648) * k); };
const INPUT = [0, 1, 8, 9, 10, 11, 12, 13, 14, 15];
const make = (n, want, key) => { const ex = []; for (let i = 0; i < n; i++) { const p = [8, 9, 10, 11, 12, 13, 14, 15]; for (let j = 7; j > 0; j--) { const r = rnd(j + 1); [p[j], p[r]] = [p[r], p[j]]; }
  const l = p.slice(0, i < 18 ? i % 9 : rnd(9)); const m = new Array(16).fill(0); m[1] = l[0] || 0; l.forEach((a, j) => { m[a] = l[j + 1] || 0; }); if (key) m[0] = 8 + rnd(8);
  for (let k = 0; k < 16; k++) if (!INPUT.includes(k)) m[k] = rnd(16); ex.push({ mem: m, want: want(l, m), sc: 1 + rnd(1e6) }); } return ex; };
const tag = (p) => { const out = p.map(([o, k]) => [o, k, false]); let last = -1; out.forEach(([o], i) => { if (o === 'WHERE') last = i; else if (o === 'WHERE@') last = -1; else if (o === 'JUMP' && last >= 0) out[last][2] = true; }); return out; };
const plain = (p) => p.map(([o, k]) => (o === 'WHERE' ? ['WHERE', k] : [o]));
const works = (p, ex) => { const q = plain(p); for (const e of ex) for (const sc of [0, e.sc]) { const r = run(q, e.mem, { maxSteps: 3000, scramble: sc }); if (!r || !(typeof e.want === 'function' ? e.want(r.mem) : r.mem[2] === e.want)) return false; } return true; };
const ALPHA = [...[0, 1, 2, 3, 4, 5, 6, 7].map((k) => ['WHERE', k, false]), ['WHERE@'], ['GO'], ['TAKE'], ['PUT'], ['CALC'], ['ADD']];
function* seqs(n) { if (n === 0) { yield []; return; } for (const a of ALPHA) for (const rest of seqs(n - 1)) yield [a, ...rest]; }
const replace = (p, i, w, rep) => { const d = rep.length - w; return [...p.slice(0, i), ...rep, ...p.slice(i + w)].map(([o, k, c]) => (c ? [o, k > i ? k + d : k, c] : [o, k, c])); };
function shorten(p, fast, full) { let better = true;
  while (better) { better = false;
    for (let w = 6; w >= 1 && !better; w--) for (let i = 0; i + w <= p.length && !better; i++) {
      if (p.slice(i, i + w).some(([o, , c]) => o === 'JUMP' || c) || p.some(([, k, c]) => c && k > i && k < i + w)) continue;
      for (let r = 0; r < Math.min(w, 5) && !better; r++) for (const rep of seqs(r)) { const q = replace(p, i, w, rep); if (works(q, fast) && works(q, full)) { p = q; better = true; break; } } } }
  return p; }
export function build(name, src, want, key = false) { const t = Date.now(); const P = tag(asm(src));
  const fast = make(40, want, key), full = make(400, want, key), fresh = make(3000, want, key);
  if (!works(P, full)) { console.log(`✗ ${name}: מה שכתבתי לא עובד`); return null; }
  const p = shorten(P, fast, full); const ok = works(p, fresh);
  console.log(`${ok ? '✓' : '✗'} ${name}: כתבתי ${P.length} ⇐ המנוע קיצר ל-${p.length} · 3000 רשימות חדשות: ${ok ? 'עובד' : 'נכשל'} · ${Math.round((Date.now() - t) / 1000)}s`);
  if (ok) { const lib = JSON.parse(fs.readFileSync('lib2.json', 'utf8')); const prog = [['WHERE', 0], ['GO'], ...p.map(([o, k, c]) => (o === 'WHERE' ? (c ? ['WHERE', k + 2, 'code'] : ['WHERE', k]) : [o]))];
    const data = [...new Set([0, ...prog.filter(([o, , t2]) => o === 'WHERE' && t2 !== 'code').map(([, k]) => k)])];
    fs.writeFileSync('lib2.json', JSON.stringify([...lib.filter((m) => m.name !== name), { name, ins: [0, 1], out: 2, data, prog, by: 'כתוב ביד, קוצר במנוע' }])); }
  return p; }
