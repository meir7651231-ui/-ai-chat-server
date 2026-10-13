import { add4 } from './lifted-add.mjs';
import { shr4 } from './lifted-shr.mjs';
// machine3 — עותק של machine2 עם «הזז ימינה» (SHR). כמו החיבור: לא פעולת-יסוד חדשה, אלא תוכנית שנכתבה מחמש פעולות-היסוד במכונה של הספרות (lifted-shr.mjs), מורמת לכאן.
// machine2.mjs — אותן 5 פעולות-יסוד (ATOMS.md), עם שני החלקים שחסרו במכונה הראשונה:
//   «לאן» מחושב:  WHERE@  — הכתובת נלקחת מראש המחסנית (לא רק מספר קבוע)
//   «לך» לשורה:   JUMP    — לך לשורה A בתוכנית, אם בראש המחסנית יש לא-אפס (אם = חשב + לך)
//   תאים מחזיקים מספר 0..15. חשב = «לא-וגם» על כל ביט (NAND).
export const BITS = 15;
// scramble: בדיקת «לולאה נקייה» — בכל חזרה לאחור, הכתובת והמצביע מתערבבים. לולאה שסומכת על מה שנשאר מהסיבוב הקודם — נשברת.
// מנוע-הרצה מהיר: אותם כללים בדיוק, אבל התוכנית מתורגמת פעם אחת למספרים (מטמון לכל מערך-תוכנית), והמחסנית היא מערך מספרים.
//   runSlow = המנוע המקורי (נשאר להשוואה: machine3s-fuzz.mjs בודק שהשניים זהים).
const OPS = { WHERE: 0, 'WHERE@': 1, GO: 2, JUMP: 3, TAKE: 4, PUT: 5, ADD: 6, SHR: 7, CALC: 8 };
let CODE = new Int32Array(1 << 12);
function encode(prog) {   // מתרגמים בכל הרצה (בלי מטמון): יש בונים שמשנים תוכנית במקום ומריצים שוב
  if (CODE.length < prog.length * 2) CODE = new Int32Array(prog.length * 4); const c = CODE; for (let i = 0; i < prog.length; i++) { const x = prog[i]; const o = OPS[x[0]]; c[2 * i] = o === undefined ? 9 : o; c[2 * i + 1] = x[1] | 0; }
  return c; }
let STK = new Int32Array(1 << 16);
export function run(prog, mem0, { cells = 16, maxSteps = 2000, scramble = 0 } = {}) {
  const code = encode(prog), n = prog.length; const mem = new Array(cells).fill(0); for (let i = 0; i < mem0.length; i++) mem[i] = mem0[i];
  let A = 0, P = 0, pc = 0, steps = 0, sp = 0, sd = scramble;
  const rnd = () => { sd = (sd * 1103515245 + 12345) % 2147483648; return Math.floor((sd / 2147483648) * cells); };
  while (pc < n) {
    if (++steps > maxSteps) return null;
    const o = code[2 * pc], k = code[2 * pc + 1]; pc++;
    if (sp + 2 >= STK.length) { const b = new Int32Array(STK.length * 2); b.set(STK); STK = b; }
    switch (o) {
      case 0: A = k; break;
      case 1: if (!sp) return null; A = STK[--sp] % cells; break;
      case 2: P = A; break;
      case 3: if (!sp) return null; if (STK[--sp] !== 0) { const back = A < pc; pc = A; if (scramble && back) { A = rnd(); P = rnd(); } } break;
      case 4: if (P >= cells) return null; STK[sp++] = mem[P]; break;
      case 5: if (!sp || P >= cells) return null; mem[P] = STK[--sp]; break;
      case 6: { if (sp < 2) return null; const b = STK[--sp], a = STK[--sp]; STK[sp++] = add4(a, b); break; }
      case 7: if (!sp) return null; STK[sp - 1] = shr4(STK[sp - 1]); break;
      case 8: { if (sp < 2) return null; const b = STK[--sp], a = STK[--sp]; STK[sp++] = ~(a & b) & BITS; break; }
      default: break;
    }
  }
  return { mem, st: Array.from(STK.subarray(0, sp)), steps, A, P };
}
export function runSlow(prog, mem0, { cells = 16, maxSteps = 2000, scramble = 0 } = {}) {
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
    else if (op === 'TAKE') { if (P >= cells) return null; st.push(mem[P]); }
    else if (op === 'PUT') { if (!st.length || P >= cells) return null; mem[P] = st.pop(); }
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
