// rings2.mjs — מנוע העיגולים על המכונה השנייה (לאן-מחושב + לך-לשורה). אותה שיטה כמו lab12/rings-atoms.mjs:
//   עיגול פנימי = הטובים · חיצוני = כל פנימי + צינור אחד · שני שופטים · הריגה (מידע אבד) · איחוד · מה שנלמד = צינור.
//   צינורות-בסיס: לאן k (תאים 0–7) · לאן@ · לך · קח · שים · חשב · «לך-לשורה c» (= לאן c + לך-אם-לא-אפס), c = כל שורה עד אורך+12, או «סוף».
import fs from 'node:fs'; import path from 'node:path';
import { run } from './machine2.mjs';
import { shortest } from './exact.mjs';
import { spawnSync } from 'node:child_process';
const HERE = path.dirname(new URL(import.meta.url).pathname);
const NAMES = { ...JSON.parse(fs.readFileSync(path.join(HERE, 'names.data.json'), 'utf8')), 'WHERE@': 'לאן@', JUMP: 'לך-לשורה', ADD: 'חשב+' };
const WORK = 8, END = 1000;
const base = (len) => [...Array.from({ length: WORK }, (_, k) => [['WHERE', k]]), [['WHERE@']], [['GO']], [['TAKE']], [['PUT']], [['CALC']], [['ADD']],
  ...Array.from({ length: len + 13 }, (_, c) => [['WHERE', c, 'code'], ['JUMP']]), [['WHERE', END, 'code'], ['JUMP']]];
// חלק שנלמד: כתובות-קוד יחסיות (מוזזות לפי המקום), כתובות-נתונים ממופות לתאי המטרה
function place(piece, offset, map) { return piece.prog.map(([o, k, t]) => (o !== 'WHERE' ? [o] : t === 'code' ? ['WHERE', k === END ? END : k + offset, 'code'] : ['WHERE', map[k] ?? k])); }
function* orderings(pool, k, pre = []) { if (pre.length === k) { yield pre; return; } for (const c of pool) if (!pre.includes(c)) yield* orderings(pool, k, [...pre, c]); }
function learnedPipes(lib, len) { const out = [], all = Array.from({ length: WORK }, (_, k) => k);
  for (const m of lib) { let n = 0; for (const ins of orderings(all, m.ins.length)) for (const o of all.filter((c) => !ins.includes(c))) {
    const map = {}; m.ins.forEach((a, i) => { map[a] = ins[i]; }); map[m.out] = o; const scratch = m.data.filter((a) => map[a] == null); const free = all.filter((c) => !Object.values(map).includes(c)).reverse();
    if (free.length < scratch.length) continue; scratch.forEach((a, i) => { map[a] = free[i]; }); out.push({ name: m.name, prog: place(m, len, map) }); if (++n >= 300) break; } }
  return out; }

export function solve(goal, lib, { beam = 300, maxRounds = 45, patience = 12, maxLen = Infinity } = {}) {
  const ex = goal.examples, total = ex.length;
  const score = (prog) => { const runs = []; for (const [i, e] of ex.entries()) { const r = run(prog, e.mem, { maxSteps: 600, scramble: i + 1 }); if (!r) return null; runs.push(r); }
    let s = 0, near = 0; for (let i = 0; i < ex.length; i++) { const r = runs[i]; if (r.mem[ex[i].out ?? goal.out] === ex[i].want) s++; if (r.mem.slice(0, WORK).includes(ex[i].want) || r.st.includes(ex[i].want)) near++; }
    if (s < total) { const seen = new Map(); for (let i = 0; i < ex.length; i++) { const k = runs[i].mem.join(',') + '|' + runs[i].st.join(','); const p = seen.get(k); if (p != null && p !== ex[i].want) return null; seen.set(k, ex[i].want); } }
    return { s, near, sig: runs.map((r) => r.mem.slice(0, WORK).join(',') + '|' + r.st.join(',') + '|' + r.A + ',' + r.P).join('/') }; };
  const st0 = score([]); let inner = [{ prog: [], s: st0.s, near: st0.near, used: [] }]; const seen = new Set([st0.sig]); let best = st0.s, still = 0, rounds = 0;
  for (; rounds < maxRounds && best < total; rounds++) {
    const outer = [];
    for (const c of inner) for (const p of [...base(c.prog.length).map((prog) => ({ name: null, prog })), ...learnedPipes(lib, c.prog.length)]) {
      const prog = [...c.prog, ...p.prog]; if (prog.length >= maxLen) continue; const r = score(prog); if (!r || seen.has(r.sig)) continue; seen.add(r.sig); outer.push({ prog, s: r.s, near: r.near, used: p.name ? [...c.used, p.name] : c.used }); }
    if (!outer.length) break;
    if (seen.size > 1.5e6) seen.clear();   // זיכרון: «מה כבר ראיתי» מתרוקן כשהוא מתמלא
    const a = [...outer].sort((x, y) => y.s - x.s || y.near - x.near || x.prog.length - y.prog.length), b = [...outer].sort((x, y) => y.near - x.near || y.s - x.s || x.prog.length - y.prog.length);
    const c3 = [...outer].sort((x, y) => y.s - x.s || y.near - x.near || y.used.length - x.used.length || x.prog.length - y.prog.length);   // שליש: משתמשים במה שנלמד
    const pick = new Set(); for (let i = 0; pick.size < beam && (a[i] || b[i] || c3[i]); i++) for (const q of [a[i], b[i], c3[i]]) if (q && pick.size < beam) pick.add(q); inner = [...pick];
    const nb = Math.max(...inner.map((c) => c.s)); if (nb > best) { best = nb; still = 0; } else if (++still >= patience) break; }
  const win = inner.find((c) => c.s === total);
  return { solved: !!win, prog: win ? win.prog : [], used: win ? win.used : [], best, total, rounds, explored: seen.size };
}
export function shrink(prog, goal) {
  const ok = (p) => goal.examples.every((e, i) => [0, i + 7].every((sc) => { const r = run(p, e.mem, { maxSteps: 2000, scramble: sc }); return r && r.mem[e.out ?? goal.out] === e.want; }));
  const cut = (p, i, w) => p.slice(0, i).concat(p.slice(i + w)).map(([o, k, t]) => (o === 'WHERE' && t === 'code' && k !== END ? ['WHERE', k >= i + w ? k - w : k > i ? i : k, 'code'] : [o, k, t]));
  let cur = prog, changed = true;
  while (changed) { changed = false;
    for (const w of [1, 2, 3]) for (let i = cur.length - w; i >= 0; i--) { const t = cut(cur, i, w); if (ok(t)) { cur = t; changed = true; } } }
  return cur; }
// תוכנית מהפותר: «לאן» שהערך שלו מגיע ל«לך-לשורה» = כתובת-קוד (שורה ≥ אורך = «סוף»)
function tagCode(prog) { const out = prog.map(([o, k]) => (o === 'WHERE' ? ['WHERE', k] : [o])); let last = -1;
  out.forEach(([o], i) => { if (o === 'WHERE') last = i; else if (o === 'WHERE@') last = -1; else if (o === 'JUMP' && last >= 0) { const k = out[last][1]; out[last] = ['WHERE', k >= out.length ? END : k, 'code']; } });
  return out; }
const show = (prog) => prog.map(([o, k, t]) => (o === 'WHERE' ? (t === 'code' ? (k === END ? 'לשורה:סוף' : 'לשורה:' + k) : 'לאן' + k) : NAMES[o])).join(' ').replace(/ לך-לשורה/g, '⤴');

if (import.meta.url === 'file://' + process.argv[1]) {
  let seed = 7; const rnd = (k) => { seed = (seed * 1103515245 + 12345) % 2147483648; return Math.floor((seed / 2147483648) * k); };
  const chain = (m, list) => { m[1] = list[0] || 0; list.forEach((a, i) => { m[a] = list[i + 1] || 0; }); return m; };
  const shuffled = () => { const p = [8, 9, 10, 11, 12, 13, 14, 15]; for (let i = p.length - 1; i > 0; i--) { const j = rnd(i + 1); [p[i], p[j]] = [p[j], p[i]]; } return p; };
  const G = (name, n, make) => ({ name, out: 2, examples: Array.from({ length: n }, () => make()) });
  const cell = (f) => () => { const m = new Array(16).fill(0); m[0] = rnd(16); m[1] = rnd(16); m[3] = rnd(16); return { mem: m, want: f(m) }; };
  const listOf = (maxLen) => () => { const m = new Array(16).fill(0); const l = shuffled().slice(0, rnd(maxLen + 1)); chain(m, l); return { m, l }; };
  const LADDER = [
    G('העתק', 12, cell((m) => m[0])),
    G('לא (מספר)', 16, cell((m) => ~m[0] & 15)),
    G('וגם (מספרים)', 16, cell((m) => m[0] & m[1])),
    G('או (מספרים)', 16, cell((m) => m[0] | m[1])),
    G('שונה (מספרים)', 16, cell((m) => m[0] ^ m[1])),
    G('קבוע 15', 12, cell(() => 15)),
    G('קח מהכתובת שבתא', 16, () => { const m = new Array(16).fill(0); const a = 8 + rnd(8); m[0] = a; m[a] = rnd(16); return { mem: m, want: m[a] }; }),
    G('דלג אם לא-אפס (תא0 אפס ⇒ העתק תא1)', 16, () => { const m = new Array(16).fill(0); m[0] = rnd(2) ? 1 + rnd(15) : 0; m[1] = 1 + rnd(15); return { mem: m, want: m[0] ? 0 : m[1] }; }),
    G('אם (תא0 לא-אפס ⇒ תא1, אחרת תא3)', 16, () => { const m = new Array(16).fill(0); m[0] = rnd(2) ? 1 + rnd(15) : 0; m[1] = 1 + rnd(15); m[3] = 1 + rnd(15); return { mem: m, want: m[0] ? m[1] : m[3] }; }),
    G('צעד ברשימה (הראשון, או 0)', 16, () => { const { m, l } = listOf(3)(); return { mem: m, want: l[0] || 0 }; }),
    G('סוף רשימה באורך עד 2', 20, () => { const { m, l } = listOf(2)(); return { mem: m, want: l.length ? l[l.length - 1] : 0 }; }),
    G('סוף רשימה (לולאה, עד 6)', 24, () => { const { m, l } = listOf(6)(); return { mem: m, want: l.length ? l[l.length - 1] : 0 }; }),
    G('שווה (מספרים)', 16, () => { const m = new Array(16).fill(0); m[0] = rnd(16); m[1] = rnd(2) ? m[0] : rnd(16); return { mem: m, want: m[0] === m[1] ? 15 : 0 }; }),
    G('כתוב לכתובת שבתא', 16, () => { const m = new Array(16).fill(0); m[0] = 8 + rnd(8); m[1] = 1 + rnd(15); return { mem: m, want: m[1], out: m[0] }; }),
    G('קבוע 14 (15 ועוד 15)', 12, cell(() => 14)),
    G('קבוע 1', 12, cell(() => 1)),
    G('ועוד 1', 16, cell((m) => (m[0] + 1) & 15)),
    G('חיבור מספרים', 16, cell((m) => (m[0] + m[1]) & 15)),
    G('ועוד 1 באותו תא', 16, () => { const m = new Array(16).fill(0); m[2] = rnd(16); return { mem: m, want: (m[2] + 1) & 15 }; }),
    G('אורך רשימה לא-ריקה', 20, () => { let r; do { r = listOf(6)(); } while (!r.l.length); return { mem: r.m, want: r.l.length }; }),
    G('אורך רשימה (לולאה + ספירה)', 20, () => { const { m, l } = listOf(6)(); return { mem: m, want: l.length }; }),
    G('חפש ברשימה', 24, () => { const { m, l } = listOf(6)(); m[0] = 8 + rnd(8); return { mem: m, want: l.includes(m[0]) ? 15 : 0 }; }),
  ];
  const longTest = (name, prog) => { if (!/רשימה/.test(name)) return ''; let ok = 0; const N = 40;
    for (let i = 0; i < N; i++) { const m = new Array(16).fill(0); const l = shuffled().slice(0, 7 + rnd(2)); chain(m, l); m[0] = 8 + rnd(8);
      const want = /חפש/.test(name) ? (l.includes(m[0]) ? 15 : 0) : /צעד/.test(name) ? l[0] : /אורך/.test(name) ? l.length : l[l.length - 1]; const r = run(prog, m, { maxSteps: 2000 }); if (r && r.mem[2] === want) ok++; }
    return ` · רשימות ארוכות שלא ראה: ${ok}/${N}`; };
  // בדיקת-הכללה: לכל מטרת-רשימה — רשימות ארוכות (7–8) שלא בחיפוש; כל «נכון» חייב לעבור גם אותן
  const holdoutFor = (g) => { if (!/רשימה/.test(g.name)) return []; const out = [];
    for (let i = 0; i < 30; i++) { const m = new Array(16).fill(0); const l = shuffled().slice(0, 7 + rnd(2)); chain(m, l); m[0] = 8 + rnd(8);
      out.push({ mem: m, want: /חפש/.test(g.name) ? (l.includes(m[0]) ? 15 : 0) : /צעד/.test(g.name) ? l[0] : /אורך/.test(g.name) ? l.length : l[l.length - 1] }); }
    return out; };
  // תאי-קלט: רק בהם יש משמעות. כל תא אחר מתחיל «מלוכלך» (מספר אקראי) ⇒ לבנה לא סומכת על אפס שנשאר — אפשר לשים אותה בתוך לולאה
  const LISTIN = [0, 1, 8, 9, 10, 11, 12, 13, 14, 15];
  for (const g of LADDER) g.inputs = /רשימה/.test(g.name) ? LISTIN : g.name === 'ועוד 1 באותו תא' ? [2] : /קח מהכתובת/.test(g.name) ? [0, 8, 9, 10, 11, 12, 13, 14, 15] : [0, 1, 3];
  const dirty = (g, list) => list.flatMap((e) => [e, { ...e, mem: e.mem.map((v, k) => (g.inputs.includes(k) ? v : rnd(16))) }]);
  for (const g of LADDER) { g.examples = dirty(g, g.examples); g.holdout = dirty(g, holdoutFor(g)); }
  const withHold = (g) => ({ ...g, examples: [...g.examples, ...g.holdout] });
  // «הכנס לתוך»: לולאה שנלמדה + חלק שנלמד בתוך הגוף שלה (בכל מקום), כתובות-הקוד מוזזות
  function insertInto(g, lib, okAll) {
    const isLoop = (m) => m.prog.some(([o, k, t], i) => o === 'WHERE' && t === 'code' && k !== END && k < i);
    const loops = lib.filter(isLoop); const pieces = lib.filter((m) => !m.prog.some(([o]) => o === 'JUMP'));
    const all = Array.from({ length: WORK }, (_, k) => k);
    const variantsOf = (m) => { const out = []; const scratch = m.data.filter((a) => !m.ins.includes(a) && a !== m.out);
      const mk = (map) => { const used = new Set(Object.values(map)); const free = all.filter((c) => !used.has(c)).reverse(); if (free.length < scratch.length) return; const mm = { ...map }; scratch.forEach((a, i) => { mm[a] = free[i]; }); out.push({ name: m.name, prog: place(m, 0, mm) }); };
      if (m.ins.length === 1) for (const c of all) mk({ [m.ins[0]]: c, [m.out]: c });   // במקום: «ועוד 1» על אותו תא
      let n = 0; for (const ins of orderings(all, m.ins.length)) for (const o of all.filter((c) => !ins.includes(c))) { if (++n > 40) break; const map = {}; m.ins.forEach((a, i) => { map[a] = ins[i]; }); map[m.out] = o; mk(map); }
      return out; };
    const bodies = pieces.flatMap(variantsOf);
    for (const L of loops) {
      const lvars = [L.prog, ...all.filter((c) => !L.data.includes(c)).map((o) => L.prog.map(([op, k, t]) => (op === 'WHERE' && t !== 'code' && k === L.out ? ['WHERE', o] : [op, k, t].filter((x) => x !== undefined))))];
      // head: קפיצה שחוזרת בדיוק למקום ההכנסה — נשארת לפני החלק (החלק בתוך הלולאה), או עוברת אחריו
      for (const lp of lvars) for (let pos = 2; pos <= lp.length; pos++) for (const head of [false, true]) for (const S of bodies) {
        if (head && !lp.some(([op, k, t]) => op === 'WHERE' && t === 'code' && k === pos)) continue;
        const shifted = lp.map(([op, k, t]) => (op === 'WHERE' && t === 'code' && k !== END && (head ? k > pos : k >= pos) ? ['WHERE', k + S.prog.length, 'code'] : [op, k, t].filter((x) => x !== undefined)));
        const prog = [...shifted.slice(0, pos), ...S.prog, ...shifted.slice(pos)];
        if (okAll(prog)) return { prog, used: [L.name, S.name] }; } }
    return null; }
  // זיכרון קבוע: מה שנלמד נשמר לקובץ ונטען בריצה הבאה
  const LIB = path.join(HERE, 'lib2.json'); const saved = fs.existsSync(LIB) ? JSON.parse(fs.readFileSync(LIB, 'utf8')) : [];
  const lib = [];
  // נכון = על כל הדוגמאות + הארוכות, גם רגיל וגם עם ערבוב בכל חזרה-לאחור (לולאה נקייה)
  const ok = (g, prog) => [...g.examples, ...(g.holdout || [])].every((e, i) => [0, i + 7].every((sc) => { const r = run(prog, e.mem, { maxSteps: 2000, scramble: sc }); return r && r.mem[e.out ?? g.out] === e.want; }));
  for (const g of LADDER) { const t = Date.now();
    const mem = saved.find((m) => m.name === g.name);
    if (mem && ok(g, mem.prog)) { lib.push(mem); console.log(`✓ ${g.name} · מהזיכרון (${mem.prog.length} פעולות)${longTest(g.name, mem.prog)}`); continue; }
    // כמה ניסיונות: עם כל מה שנלמד · רק 5 הפעולות · עם כל מה שנלמד ויותר מקום
    let r = null, how = '';
    // קודם: חיפוש מלא (בלי לזרוק דרך) — רק 5 הפעולות, ואז גם עם החלקים שנלמדו (בלי קפיצות). מוצא ⇒ הקצר ביותר (בצעדים)
    const straight = learnedPipes(lib.filter((m) => !m.prog.some(([o]) => o === 'JUMP')), 0);
    // כלי אחד בכל פעם: חיפוש מלא עם חלק-נלמד יחיד (האחרונים קודם) — מעט אפשרויות, מהר. ואז זוגות של חלקים.
    const byName = new Map(); for (const p of straight) { if (!byName.has(p.name)) byName.set(p.name, []); byName.get(p.name).push(p); }
    const names = [...byName.keys()].reverse();
    const trials = [['חיפוש מלא, רק 5 הפעולות', []], ...names.map((n) => [`חיפוש מלא, עם «${n}»`, byName.get(n)]),
      ...names.slice(0, 5).flatMap((a, i) => names.slice(i + 1, 5).map((b) => [`חיפוש מלא, עם «${a}» ו«${b}»`, [...byName.get(a), ...byName.get(b)]]))];
    for (const [label, pieces] of trials) {
      if (/רשימה|דלג|אם/.test(g.name)) break;
      const e = shortest(g, { maxStates: pieces.length ? 6e4 : 3e5, pieces }); if (e.len != null) { r = { solved: true, prog: e.prog, used: e.used || [], best: g.examples.length, total: g.examples.length }; how = label; break; } }
    if (!r) { const q = spawnSync('python3', [path.join(HERE, 'smt_goal.py')], { cwd: HERE, input: JSON.stringify({ out: g.out, maxL: 16, T: 40, budget: 300, examples: g.examples }), encoding: 'utf8', timeout: 330000 });
      let a = null; try { a = JSON.parse((q.stdout || '').trim().split('\n').pop()); } catch {}
      if (a && a.len != null) { r = { solved: true, prog: tagCode(a.prog), used: [], best: g.examples.length, total: g.examples.length }; how = `פותר (הוכח: אין קצר מ-${a.len})`; }
      else if (a) how = `פותר: אין עד ${a.proven}`; }
    if (!r) { const q = insertInto(g, lib, (p) => ok(g, p)); if (q) { r = { solved: true, prog: q.prog, used: q.used, best: g.examples.length, total: g.examples.length }; how = `הכנס לתוך: «${q.used[1]}» בתוך «${q.used[0]}»`; } }
    if (!r) for (const [label, L, opt] of [['עם מה שנלמד', lib, {}], ['רק 5 הפעולות', [], {}], ['עם מה שנלמד, מקום כפול', lib, { beam: 600 }]]) {
      r = solve(g, L, opt); if (r.solved && ok(g, r.prog)) { how = label; break; } if (r.solved) r.solved = false; }
    let line = `${r.solved ? '✓' : '✗'} ${g.name} · ${r.best}/${r.total}`;
    if (r.solved) { const before = r.prog.length; r.prog = shrink(r.prog, withHold(g));
      for (let k = 0; k < 6; k++) { const q = solve(g, [], { maxLen: r.prog.length, patience: 8 }); if (!q.solved) break; const sp = shrink(q.prog, withHold(g)); if (sp.length >= r.prog.length || !ok(g, sp)) break; r.prog = sp; r.used = []; how += ' ⇐ קוצר רק עם 5 הפעולות'; }
      line += `${longTest(g.name, r.prog)} · ${how} · ${before}⇐${r.prog.length} פעולות`; }
    console.log(`${line} · ${Math.round((Date.now() - t) / 1000)}s${r.used.length ? ' · השתמש ב: ' + [...new Set(r.used)].join(', ') : ''}`);
    if (r.solved) { console.log('   ' + show(r.prog)); const data = [...new Set(r.prog.filter(([o, k, t]) => o === 'WHERE' && t !== 'code').map(([, k]) => k))];
      const ins = [...new Set([0, ...data])].filter((k) => k !== g.out && g.inputs.includes(k) && g.examples.some((e) => e.mem[k] !== 0));
      lib.push({ name: g.name, ins, out: g.out, data: [...new Set([0, ...data])], prog: [['WHERE', 0], ['GO'], ...r.prog.map(([o, k, tt]) => (o === 'WHERE' && tt === 'code' && k !== END ? ['WHERE', k + 2, 'code'] : [o, k, tt].filter((x) => x !== undefined)))] }); }
    fs.writeFileSync(LIB, JSON.stringify([...saved.filter((m) => !lib.some((x) => x.name === m.name)), ...lib])); }
  fs.writeFileSync(path.join(HERE, 'manifest2.json'), JSON.stringify(lib.map((m) => ({ name: m.name, prog: show(m.prog) })), null, 1));
}
