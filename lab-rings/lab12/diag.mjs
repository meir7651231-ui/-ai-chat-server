// אבחון: לוקח תוכנית «שונה» שעבדה בריצה הראשונה, ובודק בכל צעד שלה אם כלל-ההריגה החדש היה זורק אותה
import fs from 'node:fs';
const N = JSON.parse(fs.readFileSync('names.data.json', 'utf8')); const R = Object.fromEntries(Object.entries(N).map(([k, v]) => [v, k]));
const line = fs.readFileSync('ladder.log', 'utf8').split('\n'); const i = line.findIndex((l) => l.includes('שונה (XOR)')); const txt = line[i + 1].trim();
const prog = txt.split(' ').map((t) => { const m = t.match(/^(\D+)(\d*)$/); return m[2] ? [R[m[1]], +m[2]] : [R[m[1]]]; });
const CELLS = 6; const ex = [[0, 0], [0, 1], [1, 0], [1, 1]].map((b) => ({ in: b, out: [b[0] ^ b[1]] }));
function run(p, input) { const mem = new Array(CELLS).fill(0); input.forEach((v, k) => { mem[k] = v; }); let A = 0, P = 0; const st = [];
  for (const [op, k] of p) { if (op === 'WHERE') A = k; else if (op === 'GO') P = A; else if (op === 'TAKE') st.push(mem[P]); else if (op === 'PUT') { if (!st.length) return null; mem[P] = st.pop(); } else { if (st.length < 2) return null; const b = st.pop(), a = st.pop(); st.push(a & b ? 0 : 1); } } return { mem, st }; }
const inCol = [0, 1].map((k) => ex.map((e) => e.in[k]).join('')), inv = (c) => [...c].map((x) => (x === '1' ? '0' : '1')).join('');
console.log('תוכנית:', txt.split(' ').length, 'צעדים');
for (let n = 1; n <= prog.length; n++) { const runs = ex.map((e) => run(prog.slice(0, n), e.in)); if (runs.some((r) => !r)) continue;
  const cells = Array.from({ length: CELLS }, (_, k) => runs.map((r) => r.mem[k]).join('')); const d = Math.min(...runs.map((r) => r.st.length));
  const have = new Set([...cells, ...Array.from({ length: d }, (_, j) => runs.map((r) => r.st[r.st.length - 1 - j]).join(''))]);
  const lost = inCol.map((c, k) => (!have.has(c) && !have.has(inv(c)) ? 'קלט' + k : null)).filter(Boolean);
  if (lost.length) { console.log(`צעד ${n} (${txt.split(' ')[n - 1]}): נזרק — ${lost.join(',')} אבד. התאים: ${cells.join(' ')}`); break; } }
