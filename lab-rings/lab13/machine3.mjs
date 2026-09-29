import { add4 } from './lifted-add.mjs';
import { shr4 } from './lifted-shr.mjs';
// machine3 — עותק של machine2 עם «הזז ימינה» (SHR). כמו החיבור: לא פעולת-יסוד חדשה, אלא תוכנית שנכתבה מחמש פעולות-היסוד במכונה של הספרות (lifted-shr.mjs), מורמת לכאן.
// machine2.mjs — אותן 5 פעולות-יסוד (ATOMS.md), עם שני החלקים שחסרו במכונה הראשונה:
//   «לאן» מחושב:  WHERE@  — הכתובת נלקחת מראש המחסנית (לא רק מספר קבוע)
//   «לך» לשורה:   JUMP    — לך לשורה A בתוכנית, אם בראש המחסנית יש לא-אפס (אם = חשב + לך)
//   תאים מחזיקים מספר 0..15. חשב = «לא-וגם» על כל ביט (NAND).
export const BITS = 15;
// scramble: בדיקת «לולאה נקייה» — בכל חזרה לאחור, הכתובת והמצביע מתערבבים. לולאה שסומכת על מה שנשאר מהסיבוב הקודם — נשברת.
export function run(prog, mem0, { cells = 16, maxSteps = 2000, scramble = 0 } = {}) {
  const mem = new Array(cells).fill(0); mem0.forEach((v, i) => { mem[i] = v; });
  let A = 0, P = 0, pc = 0, steps = 0; const st = []; let sd = scramble;
  const rnd = () => { sd = (sd * 1103515245 + 12345) % 2147483648; return Math.floor((sd / 2147483648) * cells); };
  while (pc < prog.length) {
    if (++steps > maxSteps) return null;                       // לא נגמר ⇒ נכשל
    const [op, k] = prog[pc++];
    if (op === 'WHERE') A = k;
    else if (op === 'WHERE@') { if (!st.length) return null; A = st.pop() % cells; }
    else if (op === 'GO') P = A;
    else if (op === 'JUMP') { if (!st.length) return null; if (st.pop() !== 0) { const back = A < pc; pc = A; if (scramble && back) { A = rnd(); P = rnd(); } } }
    else if (op === 'TAKE') st.push(mem[P]);
    else if (op === 'PUT') { if (!st.length) return null; mem[P] = st.pop(); }
    else if (op === 'ADD') { if (st.length < 2) return null; const b = st.pop(), a = st.pop(); st.push(add4(a, b)); }   // «חשב+»: המחבר שנלמד במכונה הראשונה
    else if (op === 'SHR') { if (!st.length) return null; st.push(shr4(st.pop())); }   // «הזז ימינה» הנלמד — lifted-shr.mjs
    else if (op === 'CALC') { if (st.length < 2) return null; const b = st.pop(), a = st.pop(); st.push(~(a & b) & BITS); }
  }
  return { mem, st, steps, A, P };
}
// כתיבה נוחה: "WHERE 3; GO; TAKE; WHERE @L; JUMP" · תוויות "L:" ⇒ מספר-שורה
export function asm(src) {
  const parts = src.split(/[;\n]/).map((x) => x.trim()).filter(Boolean); const labels = {}, out = [];
  for (const p0 of parts) { let p = p0; const m = p.match(/^(\w+):\s*(.*)$/); if (m) { labels[m[1]] = out.length; p = m[2]; } if (p) out.push(p); }
  return out.map((p) => { const [op, a] = p.split(/\s+/); if (op === 'WHERE' && a === '@') return ['WHERE@'];
    if (op === 'WHERE') return ['WHERE', a.startsWith('@') ? labels[a.slice(1)] : +a]; return [op]; });
}
