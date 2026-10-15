// reloc.mjs - make a shelf tool movable when it jumps to a FIXED line through a plain (unmarked) address.
// lab13/jumpfix.repairJumps inserts "WHERE target (code)" before the jump, which breaks the tool when the landing line itself
// reads A (e.g. lands on GO) or when the jump falls through. Here, generically:
//   jump J with plain source v  ⇒  WHERE tramp (code) ; JUMP ; WHERE v          (fall-through keeps A = v as before)
//   tramp: WHERE v ; <landing lines up to the first line that sets A again> ; GOTO that line
// The landing segment is replayed with A = v exactly as in the original; nothing here knows what the tool computes.
import { add4 } from '../lifted-add.mjs'; import { shr4 } from '../lifted-shr.mjs';
const P15 = [['TAKE'], ['TAKE'], ['CALC'], ['TAKE'], ['CALC']];
function trace(prog, mem0, maxSteps = 600000) { const mem = mem0.slice(); let A = 0, P = 0, pc = 0, steps = 0, src = 'plain'; const st = []; const J = new Map();
  while (pc < prog.length) { if (++steps > maxSteps) return null; const at = pc; const [op, k, c] = prog[pc++];
    if (op === 'WHERE') { A = k; src = c === 'code' ? 'code' : 'plain'; } else if (op === 'WHERE@') { if (!st.length) return null; A = st.pop() % 16; src = 'data'; } else if (op === 'GO') P = A;
    else if (op === 'JUMP') { if (!st.length) return null; if (st.pop() !== 0) { if (!J.has(at)) J.set(at, new Set()); J.get(at).add(src + ':' + A); pc = A; } }
    else if (op === 'TAKE') { if (P >= 16) return null; st.push(mem[P]); } else if (op === 'PUT') { if (!st.length) return null; mem[P] = st.pop(); }
    else if (op === 'ADD') { const b = st.pop(), a = st.pop(); st.push(add4(a, b)); } else if (op === 'SHR') st.push(shr4(st.pop()));
    else if (op === 'CALC') { const b = st.pop(), a = st.pop(); st.push(~(a & b) & 15); } }
  return J; }
export function relocFix(prog, gen, N = 400) {
  const all = new Map(); for (let t = 0; t < N; t++) { const J = trace(prog, gen().mem); if (!J) return null; for (const [at, s] of J) { if (!all.has(at)) all.set(at, new Set()); for (const x of s) all.get(at).add(x); } }
  const fix = new Map(); for (const [at, s] of all) { const v = [...s]; if (v.every((x) => x.startsWith('code:'))) continue; if (v.some((x) => x.startsWith('data:')) || v.length !== 1) return null; fix.set(at, +v[0].split(':')[1]); }
  if (!fix.size) return prog;
  // symbolic program: items {ins} or {codeRef: label}; labels = original line numbers 'L<i>' and trampolines 'T<at>'
  const out = []; const labelAt = {};
  const emit = (ins, lab) => { if (lab) labelAt[lab] = out.length; out.push(ins); };
  prog.forEach((x, i) => {
    const lab = 'L' + i;
    if (fix.has(i)) { emit({ ref: 'T' + i }, lab); emit({ ins: x }); emit({ ins: ['WHERE', fix.get(i)] }); }
    else emit(x[2] === 'code' && x[1] >= 0 ? { ref: 'L' + x[1] } : { ins: x }, lab); });
  labelAt['L' + prog.length] = out.length;
  emit({ ins: [] , pad: true });   // placeholder removed below (end marker)
  out.pop(); const END = 'L' + prog.length;
  // jump over the trampolines at the end
  emit({ ins: P15[0] }); for (const x of P15.slice(1)) emit({ ins: x }); emit({ ref: 'E' }); emit({ ins: ['JUMP'] });
  for (const [at, v] of fix) {
    let s = v; const seg = []; while (s < prog.length && prog[s][0] !== 'WHERE' && prog[s][0] !== 'WHERE@') { if (prog[s][0] === 'JUMP') return null; seg.push(prog[s]); s++; }
    emit({ ins: ['WHERE', v] }, 'T' + at); for (const x of seg) emit({ ins: x });
    for (const x of P15) emit({ ins: x }); emit({ ref: 'L' + s }); emit({ ins: ['JUMP'] });
  }
  labelAt.E = out.length;
  if (labelAt[END] !== undefined && END !== 'E') { /* falling off the original end lands on the skip-jump above, which jumps to E */ }
  return out.map((o) => (o.ref ? ['WHERE', labelAt[o.ref], 'code'] : o.ins));
}
