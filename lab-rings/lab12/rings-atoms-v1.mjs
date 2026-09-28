// rings-atoms.mjs — מנוע עיגולים שהצינורות שלו הם 5 פעולות-היסוד בלבד (ATOMS.md): WHERE k · GO · TAKE · PUT · CALC(nand).
//   מכונה: כתובת A (WHERE), מצביע P (GO: P=A), מחסנית (TAKE דוחף mem[P] · PUT שולף ל-mem[P] · CALC שולף 2 דוחף nand).
//   עיגול פנימי = המהות: התוכניות הטובות (אחת לכל התנהגות). עיגול חיצוני = כל פנימית + צינור אחד.
//   עצירה: כל הדוגמאות נכונות, או אין הפרש (הטוב לא השתפר R סבבים) ⇒ שאלה.
//   מה שנפתר נשמר כמניפסט ונהיה צינור במטרה הבאה (עם החלפת כתובות).
import fs from 'node:fs'; import path from 'node:path';
const HERE = path.dirname(new URL(import.meta.url).pathname);
const NAMES = JSON.parse(fs.readFileSync(path.join(HERE, 'names.data.json'), 'utf8'));
let CELLS = 6;

function run(prog, input) {
  const mem = new Array(CELLS).fill(0); input.forEach((v, i) => { mem[i] = v; });
  let A = 0, P = 0; const st = [];
  for (const [op, k] of prog) {
    if (op === 'WHERE') A = k;
    else if (op === 'GO') P = A;
    else if (op === 'TAKE') st.push(mem[P]);
    else if (op === 'PUT') { if (!st.length) return null; mem[P] = st.pop(); }
    else if (op === 'CALC') { if (st.length < 2) return null; const b = st.pop(), a = st.pop(); st.push(a & b ? 0 : 1); }
  }
  return { mem, st, A, P };
}
let ATOMS = [...Array.from({ length: CELLS }, (_, k) => [['WHERE', k]]), [['GO']], [['TAKE']], [['PUT']], [['CALC']]];
const addrsOf = (prog) => [...new Set(prog.filter(([o]) => o === 'WHERE').map(([, k]) => k))];
function* perms(n, k, pre = []) { if (pre.length === k) { yield pre; return; } for (let i = 0; i < n; i++) if (!pre.includes(i)) yield* perms(n, k, [...pre, i]); }
const retarget = (prog, map) => prog.map(([o, k]) => (o === 'WHERE' ? [o, map[k]] : [o]));
function pipesFrom(lib) { const out = []; for (const m of lib) { const ad = addrsOf(m.prog); let n = 0; for (const p of perms(CELLS, ad.length)) { if (++n > 60) break; out.push({ name: m.name, prog: retarget(m.prog, Object.fromEntries(ad.map((a, i) => [a, p[i]]))) }); } } return out; }

export function solve(goal, lib, { beam = 250, maxRounds = 40, patience = 12 } = {}) {
  CELLS = goal.cells || 6; ATOMS.length = 0; ATOMS.push(...Array.from({ length: CELLS }, (_, k) => [['WHERE', k]]), [['GO']], [['TAKE']], [['PUT']], [['CALC']]);
  const ex = goal.examples; const total = ex.length * goal.outs.length;
  // הפרש = כמה רחוק מהמטרה. לא רק «מה יש בתא-הפלט», אלא «האם הערך הנדרש כבר נמצא איפשהו» (תא או מחסנית) — להעביר אותו זה צעד קטן
  const score = (prog) => { let s = 0; const sig = []; const cols = goal.outs.map(() => new Map());
    for (const [i, e] of ex.entries()) { const r = run(prog, e.in); if (!r) return null; goal.outs.forEach((c, j) => { if (r.mem[c] === e.out[j]) s++; });
      const locs = [...r.mem.map((v, k) => ['m' + k, v]), ...r.st.map((v, k) => ['s' + k, v])];
      goal.outs.forEach((c, j) => { for (const [l, v] of locs) if (v === e.out[j]) cols[j].set(l, (cols[j].get(l) || 0) + 1); });
      sig.push(r.mem.join('') + '|' + r.st.join('') + '|' + r.A + r.P); }
    const near = cols.reduce((a, m) => a + Math.max(0, ...m.values()), 0);
    return { s, near, sig: sig.join('/') }; };
  const pipes = [...ATOMS.map((p) => ({ name: null, prog: p })), ...pipesFrom(lib)];
  let inner = [{ prog: [], s: score([]).s, near: score([]).near, used: [] }]; const seen = new Set([score([]).sig]);
  let best = inner[0].s, still = 0, rounds = 0;
  for (; rounds < maxRounds; rounds++) {
    if (best === total) break;
    const outer = [];
    for (const c of inner) for (const p of pipes) { const prog = [...c.prog, ...p.prog]; const r = score(prog); if (!r || seen.has(r.sig)) continue; seen.add(r.sig); outer.push({ prog, s: r.s, near: r.near, used: p.name ? [...c.used, p.name] : c.used }); }
    if (!outer.length) break;
    // העיגול מתהפך: מה שיצא חוזר פנימה — כל ההתנהגויות החדשות, הטובות קודם, הקצרות קודם
    inner = outer.sort((a, b) => b.near - a.near || b.s - a.s || a.prog.length - b.prog.length).slice(0, beam);
    const nb = Math.max(...inner.map((c) => c.s)); if (nb > best) { best = nb; still = 0; } else if (++still >= patience) break;
  }
  const win = inner.find((c) => c.s === total);
  return { solved: !!win, prog: win ? win.prog : inner[0].prog, used: win ? win.used : [], best, total, rounds, explored: seen.size };
}
const show = (prog) => prog.map(([o, k]) => NAMES[o] + (k != null ? k : '')).join(' ');

if (import.meta.url === 'file://' + process.argv[1]) {
  const bits = (n) => Array.from({ length: 2 ** n }, (_, i) => Array.from({ length: n }, (_, j) => (i >> (n - 1 - j)) & 1));
  const G = (name, n, outs, f, cells) => ({ name, outs, cells: cells || Math.max(6, n + outs.length + 2), examples: bits(n).map((b) => ({ in: b, out: f(...b) })) });
  const num = (...b) => b.reduce((a, x) => a * 2 + x, 0);
  const LADDER = [
    G('העתק', 1, [2], (a) => [a]),
    G('לא', 1, [2], (a) => [1 - a]),
    G('וגם', 2, [2], (a, b) => [a & b]),
    G('או', 2, [2], (a, b) => [a | b]),
    G('שונה (XOR)', 2, [2], (a, b) => [a ^ b]),
    G('חצי-מחבר (סכום, נשא)', 2, [2, 3], (a, b) => [a ^ b, a & b]),
    G('מחבר-מלא (3 ביטים ⇒ סכום, נשא)', 3, [3, 4], (a, b, c) => [a ^ b ^ c, (a & b) | (c & (a ^ b))]),
    G('שווה (ביט)', 2, [2], (a, b) => [a === b ? 1 : 0]),
    G('בורר (אם ג אז א אחרת ב)', 3, [3], (a, b, c) => [c ? a : b]),
    G('שווה (מספר של 2 ביטים)', 4, [4], (a1, a0, b1, b0) => [num(a1, a0) === num(b1, b0) ? 1 : 0]),
    G('מחבר מספרים (2 ביטים + 2 ביטים)', 4, [4, 5, 6], (a1, a0, b1, b0) => { const s = num(a1, a0) + num(b1, b0); return [(s >> 2) & 1, (s >> 1) & 1, s & 1]; }),
    G('גדול-מ (מספר של 2 ביטים)', 4, [4], (a1, a0, b1, b0) => [num(a1, a0) > num(b1, b0) ? 1 : 0]),
    G('חפש ברשימה (האם x ברשימה של 2)', 6, [6], (x1, x0, p1, p0, q1, q0) => [num(x1, x0) === num(p1, p0) || num(x1, x0) === num(q1, q0) ? 1 : 0]),
  ];
  const mode = process.argv[2] || 'learn'; const lib = []; const rep = [];
  for (const g of LADDER) { const t = Date.now(); const r = solve(g, mode === 'learn' ? lib : []);
    const line = `${r.solved ? '✓' : '✗'} ${g.name} · ${r.best}/${r.total} · סבבים ${r.rounds} · נבדקו ${r.explored} · ${Date.now() - t}ms${r.used.length ? ' · השתמש ב: ' + r.used.join(', ') : ''}`;
    console.log(line); if (r.solved) console.log('   ' + show(r.prog)); rep.push({ goal: g.name, ...r, prog: show(r.prog) });
    if (r.solved) lib.push({ name: g.name, prog: [['WHERE', 0], ['GO'], ...r.prog] }); }   // עצמאי: מתחיל מהכתובת שלו, לא מהמצב שלפניו
  fs.writeFileSync(path.join(HERE, `manifest-${mode}.json`), JSON.stringify(lib.map((m) => ({ name: m.name, prog: show(m.prog) })), null, 1));
  fs.writeFileSync(path.join(HERE, `run-${mode}.json`), JSON.stringify(rep, null, 1));
}
