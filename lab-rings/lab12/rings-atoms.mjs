// rings-atoms.mjs — מנוע עיגולים שהצינורות שלו הם 5 פעולות-היסוד בלבד (ATOMS.md): WHERE k · GO · TAKE · PUT · CALC(nand).
//   מכונה: כתובת A (WHERE), מצביע P (GO: P=A), מחסנית (TAKE דוחף mem[P] · PUT שולף ל-mem[P] · CALC שולף 2 דוחף nand).
//   עיגול פנימי = המהות: התוכניות הטובות (אחת לכל התנהגות). עיגול חיצוני = כל פנימית + צינור אחד.
//   עצירה: כל הדוגמאות נכונות, או אין הפרש (הטוב לא השתפר R סבבים) ⇒ שאלה.
//   מה שנפתר נשמר כמניפסט ונהיה צינור במטרה הבאה (עם החלפת כתובות).
import fs from 'node:fs'; import path from 'node:path';
const HERE = path.dirname(new URL(import.meta.url).pathname);
const NAMES = JSON.parse(fs.readFileSync(path.join(HERE, 'names.data.json'), 'utf8'));
let CELLS = 6;

export function run(prog, input) {
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
// צינור שנלמד יודע מה הוא מקבל (ins) ומה הוא מחזיר (outs). מנסים אותו רק כך: קלטים ⇐ תאים כלשהם (קודם לפי הסדר),
//   פלטים ⇐ תאים שאינם קלטי-המטרה, תאי-עבודה ⇐ התאים הפנויים. לא «כל צירוף של כל הכתובות».
function* choose(pool, k, pre = []) { if (pre.length === k) { yield pre; return; } for (const c of pool) if (!pre.includes(c) && (pre.length === 0 || c > pre[pre.length - 1])) yield* choose(pool, k, [...pre, c]); }
function* orderings(pool, k, pre = []) { if (pre.length === k) { yield pre; return; } for (const c of pool) if (!pre.includes(c)) yield* orderings(pool, k, [...pre, c]); }
export function pipesFrom(lib, nIn) { const out = [], all = Array.from({ length: CELLS }, (_, k) => k), free = all.filter((c) => c >= nIn);
  for (const m of lib) { const scratch = addrsOf(m.prog).filter((a) => !m.ins.includes(a) && !m.outs.includes(a)); const seen = new Set(); let n = 0;
    const tryMap = (ins) => { for (const outs of orderings(free.filter((c) => !ins.includes(c)), m.outs.length)) { const used = [...ins, ...outs]; const sc = [...free.filter((c) => !used.includes(c)).reverse(), ...all.filter((c) => c < nIn && !used.includes(c))].slice(0, scratch.length);   // תאי-עבודה: קודם תאים פנויים, לא קלטי-המטרה if (sc.length < scratch.length) continue;
      const map = {}; m.ins.forEach((a, i) => { map[a] = ins[i]; }); m.outs.forEach((a, i) => { map[a] = outs[i]; }); scratch.forEach((a, i) => { map[a] = sc[i]; });
      const k = JSON.stringify(map); if (seen.has(k)) continue; seen.add(k); out.push({ name: m.name, prog: retarget(m.prog, map) }); if (++n >= 1500) return true; } return false; };
    let stop = false; for (const ins of choose(all, m.ins.length)) if ((stop = tryMap(ins))) break;
    if (!stop && m.ins.length <= 2) for (const ins of orderings(all, m.ins.length)) if (tryMap(ins)) break; }   // 3+ קלטים: רק לפי הסדר
  return out; }

export function solve(goal, lib, { beam = 400, maxRounds = 40, patience = 12, maxLen = Infinity } = {}) {
  CELLS = goal.cells || 6; ATOMS.length = 0; ATOMS.push(...Array.from({ length: CELLS }, (_, k) => [['WHERE', k]]), [['GO']], [['TAKE']], [['PUT']], [['CALC']]);
  const ex = goal.examples; const total = ex.length * goal.outs.length;
  // הפרש = כמה רחוק מהמטרה. לא רק «מה יש בתא-הפלט», אלא «האם הערך הנדרש כבר נמצא איפשהו» (תא או מחסנית) — להעביר אותו זה צעד קטן
  // קלט שהמטרה תלויה בו: הפיכת הביט משנה את הפלט בדוגמה כלשהי
  const key = (b) => b.join('');
  const byIn = new Map(ex.map((e) => [key(e.in), e.out.join('')]));
  const needed = ex[0].in.map((_, i) => ex.some((e) => { const f = [...e.in]; f[i] = 1 - f[i]; const o = byIn.get(key(f)); return o != null && o !== e.out.join(''); }));
  const inCol = ex[0].in.map((_, i) => ex.map((e) => e.in[i]).join(''));
  const outCol = goal.outs.map((_, j) => ex.map((e) => e.out[j]).join(''));
  const score = (prog) => { const runs = []; for (const e of ex) { const r = run(prog, e.in); if (!r) return null; runs.push(r); }
    const col = (k) => runs.map((r) => r.mem[k]).join('');
    const cells = Array.from({ length: CELLS }, (_, k) => col(k));
    const depth = Math.min(...runs.map((r) => r.st.length));
    const stk = Array.from({ length: depth }, (_, d) => runs.map((r) => r.st[r.st.length - 1 - d]).join(''));
    const have = new Set([...cells, ...stk]);
    // שופט 1: כמה נכון בתאי-הפלט
    let s = 0; goal.outs.forEach((c, j) => { for (let i = 0; i < ex.length; i++) if (runs[i].mem[c] === ex[i].out[j]) s++; });
    // שופט 2: כמה מהערכים הנדרשים כבר קיימים איפשהו (תא או מחסנית), וכמה קרוב הכי-קרוב
    let near = 0; for (const oc of outCol) { let b = 0; for (const h of have) { let m = 0; for (let i = 0; i < oc.length; i++) if (h[i] === oc[i]) m++; if (m > b) b = m; } near += b; }
    // הריגה: קלט שהמטרה צריכה נעלם מכל מקום ⇒ המידע אבד, אין דרך חזרה
    // הריגה: המידע אבד באמת רק אם שתי דוגמאות שצריכות תשובה שונה נראות זהות לגמרי (כל התאים + המחסנית) — אז אין דרך חזרה
    if (s < total) { const seenState = new Map();
      for (let i = 0; i < ex.length; i++) { const st = runs[i].mem.join('') + '|' + runs[i].st.join(''); const o = ex[i].out.join(''); const prev = seenState.get(st); if (prev != null && prev !== o) return null; seenState.set(st, o); } }
    // איחוד: מה שחשוב = אילו ערכים קיימים (בלי חשיבות לאיזה תא-עבודה), מה במחסנית, ומה בתאי-הפלט
    const sig = cells.join(',') + '|' + stk.join(',') + '|' + runs[0].A + runs[0].P;
    return { s, near, sig }; };
  const pipes = [...ATOMS.map((p) => ({ name: null, prog: p })), ...pipesFrom(lib, ex[0].in.length)];
  let inner = [{ prog: [], s: score([]).s, near: score([]).near, used: [] }]; const seen = new Set([score([]).sig]);
  let best = inner[0].s, still = 0, rounds = 0;
  for (; rounds < maxRounds; rounds++) {
    if (best === total) break;
    const outer = [];
    for (const c of inner) for (const p of pipes) { const prog = [...c.prog, ...p.prog]; if (prog.length >= maxLen) continue; const r = score(prog); if (!r || seen.has(r.sig)) continue; seen.add(r.sig); outer.push({ prog, s: r.s, near: r.near, used: p.name ? [...c.used, p.name] : c.used }); }
    if (!outer.length) break;
    // העיגול מתהפך: מה שיצא חוזר פנימה — כל ההתנהגויות החדשות, הטובות קודם, הקצרות קודם
    { const byShort = [...outer].sort((a, b) => b.near - a.near || b.s - a.s || a.prog.length - b.prog.length);
      const byLearned = [...outer].sort((a, b) => b.near - a.near || b.s - a.s || b.used.length - a.used.length || a.prog.length - b.prog.length);
      const pick = new Set(); for (let i = 0; pick.size < beam && (i < byShort.length || i < byLearned.length); i++) { if (byShort[i]) pick.add(byShort[i]); if (byLearned[i] && pick.size < beam) pick.add(byLearned[i]); }
      inner = [...pick].sort((a, b) => b.near - a.near || b.s - a.s); }   // חצי-חצי: קצרים + משתמשים-במה-שנלמד
    const nb = Math.max(...inner.map((c) => c.s)); if (nb > best) { best = nb; still = 0; } else if (++still >= patience) break;
  }
  const win = inner.find((c) => c.s === total);
  return { solved: !!win, prog: win ? win.prog : inner[0].prog, used: win ? win.used : [], best, total, rounds, explored: seen.size };
}
export function shrink(prog, goal) {
  CELLS = goal.cells || 6;
  const ok = (p) => goal.examples.every((e) => { const r = run(p, e.in); return r && goal.outs.every((c, j) => r.mem[c] === e.out[j]); });
  let cur = prog, changed = true;
  while (changed) { changed = false;
    for (let i = cur.length - 1; i >= 0; i--) { const t = [...cur.slice(0, i), ...cur.slice(i + 1)]; if (ok(t)) { cur = t; changed = true; } }
    for (let i = cur.length - 2; i >= 0; i--) { const t = [...cur.slice(0, i), ...cur.slice(i + 2)]; if (ok(t)) { cur = t; changed = true; } }
    // החלפה: קטע של 2–8 צעדים ⇐ רצף קצר יותר (0–3 צעדים) מכל הפעולות. לא רק מחיקה — קיצור-דרך
    const atoms = [...Array.from({ length: CELLS }, (_, k) => ['WHERE', k]), ['GO'], ['TAKE'], ['PUT'], ['CALC']];
    const seqs = [[]]; for (let L = 1; L <= 3; L++) for (const q of seqs.filter((x) => x.length === L - 1)) for (const a of atoms) seqs.push([...q, a]);
    outer: for (let w = 8; w >= 2; w--) for (let i = 0; i + w <= cur.length; i++) for (const q of seqs) { if (q.length >= w) break;
      const t = [...cur.slice(0, i), ...q, ...cur.slice(i + w)]; if (ok(t)) { cur = t; changed = true; break outer; } } }
  return cur; }
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
    if (r.solved && mode === 'learn') { const before = r.prog.length; r.prog = shrink(r.prog, g); console.log(`   🧹 ניקוי: ${before} ⇐ ${r.prog.length} פעולות`);
      const t1 = Date.now(); let improved = true, tries = 0;
      while (improved && tries++ < 4) { improved = false;
        for (const [label, L] of [['רק 5 הפעולות', []], ['בלי ' + [...new Set(r.used)].join(', '), lib.filter((m) => !r.used.includes(m.name))]]) {
          const q = solve(g, L, { maxLen: r.prog.length, patience: 8 }); if (!q.solved) continue;
          const sp = shrink(q.prog, g); if (sp.length < r.prog.length) { console.log(`   🔁 חיפוש חוזר (${label}): ${r.prog.length} ⇐ ${sp.length} פעולות`); r.prog = sp; r.used = q.used; improved = true; } } }
      console.log(`   ⏱️ שיפור: ${Date.now() - t1}ms · סופי ${r.prog.length} פעולות`); }
    if (r.solved) lib.push({ name: g.name, ins: g.examples[0].in.map((_, i) => i), outs: g.outs, prog: [['WHERE', 0], ['GO'], ...r.prog] }); }   // עצמאי: מתחיל מהכתובת שלו, לא מהמצב שלפניו
  fs.writeFileSync(path.join(HERE, `manifest-${mode}.json`), JSON.stringify(lib.map((m) => ({ name: m.name, prog: show(m.prog) })), null, 1));
  fs.writeFileSync(path.join(HERE, `run-${mode}.json`), JSON.stringify(rep, null, 1));
}
