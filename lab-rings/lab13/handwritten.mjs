// הכי קצר שלי (כתוב ביד) ל-2 החלקים החסרים. נבדק כמו במנוע: תאים מלוכלכים + ערבוב בכל חזרה + רשימות 0..8
import { run, asm } from './machine2.mjs';
export const LENGTH = asm(`WHERE 0; GO; TAKE; TAKE; CALC; WHERE 2; GO; PUT;
 WHERE 1; GO; TAKE; TAKE; WHERE 0; GO; TAKE; TAKE; CALC; WHERE @T; JUMP;
 B: WHERE 0; GO; TAKE; TAKE; CALC; WHERE 2; GO; TAKE; ADD; PUT; WHERE @; GO; TAKE; TAKE;
 T: WHERE @B; JUMP; WHERE 2; GO; TAKE; TAKE; CALC; PUT`);
export const SEARCH = asm(`WHERE 0; GO; TAKE; WHERE 2; GO; PUT;
 WHERE 1; GO; TAKE; WHERE 0; GO; TAKE; WHERE @M; JUMP;
 L: WHERE 2; GO; PUT; TAKE; WHERE @; GO; TAKE;
 M: WHERE 3; GO; PUT; TAKE;
 WHERE 0; GO; TAKE; WHERE 3; GO; TAKE; CALC; WHERE 4; GO; PUT;
 WHERE 3; GO; TAKE; WHERE 4; GO; TAKE; CALC;
 WHERE 0; GO; TAKE; WHERE 4; GO; TAKE; CALC;
 CALC; WHERE @L; JUMP;
 WHERE 2; GO; TAKE; WHERE @S; JUMP; WHERE @E; JUMP;
 S: TAKE; TAKE; TAKE; CALC; CALC; PUT; E:`);
let s = 11; const rnd = (k) => { s = (s * 1103515245 + 12345) % 2147483648; return Math.floor((s / 2147483648) * k); };
const INPUT = [0, 1, 8, 9, 10, 11, 12, 13, 14, 15];
function test(prog, want, key) { let ok = 0, N = 0;
  for (let i = 0; i < 3000; i++) { const p = [8, 9, 10, 11, 12, 13, 14, 15]; for (let j = 7; j > 0; j--) { const r = rnd(j + 1); [p[j], p[r]] = [p[r], p[j]]; }
    const l = p.slice(0, rnd(9)); const m = new Array(16).fill(0); m[1] = l[0] || 0; l.forEach((a, j) => { m[a] = l[j + 1] || 0; });
    if (key) m[0] = 8 + rnd(8);
    for (let k = 0; k < 16; k++) if (!INPUT.includes(k)) m[k] = rnd(16);            // מלוכלך
    for (const sc of [0, 1 + rnd(1e6)]) { N++; const q = run(prog, m, { maxSteps: 2000, scramble: sc }); if (q && q.mem[2] === want(l, m)) ok++; } }
  return `${ok}/${N}`; }
console.log('אורך רשימה:', LENGTH.length, 'פעולות ·', test(LENGTH, (l) => l.length));
console.log('חפש ברשימה:', SEARCH.length, 'פעולות ·', test(SEARCH, (l, m) => (l.includes(m[0]) ? 15 : 0), true));
