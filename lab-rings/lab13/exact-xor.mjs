// exact-xor.mjs — חיפוש מלא ל«שונה» (x ^ y), חסכוני בזיכרון: כל מצב = מחרוזת קצרה, הורה = מספר.
//   שכבה אחרי שכבה, איחוד מצבים זהים ⇒ הראשון שעובר את כל 256 הצירופים = הקצר ביותר שקיים.
const WORK = 8, H = '0123456789abcdef';
const TOK = [...Array.from({ length: WORK }, (_, k) => ['WHERE', k]), ['WHERE@'], ['GO'], ['TAKE'], ['PUT'], ['CALC']];
const NAME = { WHERE: 'לאן', 'WHERE@': 'לאן@', GO: 'לך', TAKE: 'קח', PUT: 'שים', CALC: 'חשב' };
let seed = 11; const rnd = (k) => { seed = (seed * 1103515245 + 12345) % 2147483648; return Math.floor((seed / 2147483648) * k); };
const EX = Array.from({ length: 8 }, () => [rnd(16), rnd(16)]);
const ALL = []; for (let a = 0; a < 16; a++) for (let b = 0; b < 16; b++) ALL.push([a, b]);
// מצב של דוגמה: 8 תאים | מחסנית | A P  (ספרות הקסה). מצב כולל = הדוגמאות מופרדות ב-/
const enc1 = (mem, st, A, P) => mem.map((v) => H[v]).join('') + '|' + st.map((v) => H[v]).join('') + '|' + H[A] + H[P];
const dec1 = (s) => { const [m, st, ap] = s.split('|'); return { mem: [...m].map((c) => parseInt(c, 16)), st: [...st].map((c) => parseInt(c, 16)), A: parseInt(ap[0], 16), P: parseInt(ap[1], 16) }; };
function step1(s, [op, k]) { const { mem, st } = s; let A = s.A, P = s.P;
  if (op === 'WHERE') A = k; else if (op === 'WHERE@') { if (!st.length) return null; A = st.pop() % WORK; } else if (op === 'GO') P = A;
  else if (op === 'TAKE') { if (st.length >= 4) return null; st.push(mem[P]); } else if (op === 'PUT') { if (!st.length) return null; mem[P] = st.pop(); }
  else { if (st.length < 2) return null; const b = st.pop(), a = st.pop(); st.push(~(a & b) & 15); }
  return enc1(mem, st, A, P); }
function runFull(prog, [a, b]) { const s = { mem: [a, b, 0, 0, 0, 0, 0, 0], st: [], A: 0, P: 0 }; for (const t of prog) { const e = step1(s, t); if (!e) return null; Object.assign(s, dec1(e)); } return s.mem[2]; }
const start = EX.map(([a, b]) => enc1([a, b, 0, 0, 0, 0, 0, 0], [], 0, 0)).join('/');
const seen = [new Set([start])]; const has = (k) => seen.some((S) => S.has(k)); const add = (k) => { let S = seen[seen.length - 1]; if (S.size > 1.5e7) { S = new Set(); seen.push(S); } S.add(k); };
const layers = [{ keys: [start], par: new Int32Array(1).fill(-1), tok: new Int8Array(1).fill(-1) }];
const progOf = (L, i) => { const p = []; while (L > 0) { p.unshift(TOK[layers[L].tok[i]]); i = layers[L].par[i]; L--; } return p; };
const t0 = Date.now(); let total = 1;
for (let L = 1; L <= 40; L++) {
  const prev = layers[L - 1], keys = [], par = [], tok = [];
  for (let i = 0; i < prev.keys.length; i++) { const parts = prev.keys[i].split('/');
    for (let ti = 0; ti < TOK.length; ti++) { const out = []; let bad = false;
      for (const p of parts) { const e = step1(dec1(p), TOK[ti]); if (!e) { bad = true; break; } out.push(e); } if (bad) continue;
      const k = out.join('/'); if (has(k)) continue; add(k); keys.push(k); par.push(i); tok.push(ti); total++;
      if (out.every((p, j) => dec1(p).mem[2] === (EX[j][0] ^ EX[j][1]))) { layers.push({ keys, par: Int32Array.from(par), tok: Int8Array.from(tok) });
        const prog = progOf(L, keys.length - 1); if (ALL.every((x) => runFull(prog, x) === (x[0] ^ x[1]))) {
          console.log(`✓ «שונה»: הכי קצר שקיים = ${L} פעולות · ${total} מצבים · ${Math.round((Date.now() - t0) / 1000)}s\n   ${prog.map(([o, k]) => NAME[o] + (k != null ? k : '')).join(' ')}`); process.exit(0); }
        layers.pop(); } } }
  layers.push({ keys, par: Int32Array.from(par), tok: Int8Array.from(tok) }); layers[L - 1].keys = L >= 2 ? [] : layers[L - 1].keys;
  console.log(`שכבה ${L}: ${keys.length} מצבים חדשים · סה"כ ${total} · ${Math.round((Date.now() - t0) / 1000)}s`);
  if (!keys.length) break;
}
