// lifted-add.mjs — «חשב+» במכונה השנייה = המחבר-המלא שהמנוע למד לבד במכונה הראשונה (lab12, מ-«לא-וגם» בלבד), מופעל ביט אחרי ביט.
//   אין כאן + של JavaScript: כל ביט של הסכום יוצא מהרצת התוכנית שנלמדה על תאי-ביט.
import fs from 'node:fs'; import path from 'node:path';
const HERE = path.dirname(new URL(import.meta.url).pathname);
const R = { 'לאן': 'WHERE', 'לך': 'GO', 'קח': 'TAKE', 'שים': 'PUT', 'חשב': 'CALC' };
const FA = fs.readFileSync(path.join(HERE, 'fulladder-m1.txt'), 'utf8').trim().split(/\s+/).map((t) => { const m = t.match(/^(\D+)(\d*)$/); return m[2] ? [R[m[1]], +m[2]] : [R[m[1]]]; });
function runBits(prog, input, cells = 7) { // המכונה הראשונה: תאים של ביט אחד
  const mem = new Array(cells).fill(0); input.forEach((v, i) => { mem[i] = v; }); let A = 0, P = 0; const st = [];
  for (const [op, k] of prog) { if (op === 'WHERE') A = k; else if (op === 'GO') P = A; else if (op === 'TAKE') st.push(mem[P]); else if (op === 'PUT') mem[P] = st.pop(); else { const b = st.pop(), a = st.pop(); st.push(a & b ? 0 : 1); } }
  return mem; }
export function add4(a, b) { let carry = 0, sum = 0;
  for (let i = 0; i < 4; i++) { const m = runBits(FA, [(a >> i) & 1, (b >> i) & 1, carry]); sum |= m[3] << i; carry = m[4]; }
  return sum; }
if (import.meta.url === 'file://' + process.argv[1]) { let ok = 0; for (let a = 0; a < 16; a++) for (let b = 0; b < 16; b++) if (add4(a, b) === ((a + b) & 15)) ok++;
  console.log(`המחבר שנלמד (${FA.length} פעולות לביט), מופעל 4 פעמים: ${ok}/256 חיבורים נכונים`); }
