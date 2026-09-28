// הוכחה שהמכונה יכולה עכשיו: חיפוש ברשימה באורך כלשהו — לולאה + כתובת מחושבת. את התוכנית הזאת כתבתי ביד (לא המנוע), כדי לבדוק שהמכונה מסוגלת.
//   זיכרון: תא0 = x · תא1 = ראש-הרשימה · תא2 = פלט (15 = נמצא, 0 = לא) · תאים 3–7 עבודה · 8–15 = איברי הרשימה.
//   רשימה = שרשרת: כל איבר הוא כתובת, ובתא שלו כתובת האיבר הבא (0 = סוף).
import { run, asm } from './machine2.mjs';
const P = asm(`
  WHERE 1; GO; TAKE; WHERE 3; GO; PUT
  WHERE 0; GO; TAKE; TAKE; CALC; TAKE; CALC; WHERE 4; GO; PUT
L: WHERE 3; GO; TAKE; WHERE @BODY; JUMP
  WHERE 4; GO; TAKE; WHERE @END; JUMP
BODY: WHERE 3; GO; TAKE; WHERE 0; GO; TAKE; CALC; WHERE 6; GO; PUT
  WHERE 3; GO; TAKE; WHERE 6; GO; TAKE; CALC; WHERE 7; GO; PUT
  WHERE 0; GO; TAKE; WHERE 6; GO; TAKE; CALC
  WHERE 7; GO; TAKE; CALC
  WHERE @NEXT; JUMP
  WHERE 4; GO; TAKE; WHERE 2; GO; PUT
  WHERE 4; GO; TAKE; WHERE @END; JUMP
NEXT: WHERE 3; GO; TAKE; WHERE @; GO; TAKE; WHERE 3; GO; PUT
  WHERE 4; GO; TAKE; WHERE @L; JUMP
END:`);
console.log('אורך התוכנית:', P.length, 'פעולות');
const mk = (x, list) => { const m = new Array(16).fill(0); m[0] = x; m[1] = list[0] || 0; list.forEach((a, i) => { m[a] = list[i + 1] || 0; }); return m; };
let ok = 0, n = 0;
for (let t = 0; t < 2000; t++) { const len = t % 9; const pool = [8, 9, 10, 11, 12, 13, 14, 15].sort(() => Math.random() - 0.5); const list = pool.slice(0, len); const x = 8 + Math.floor(Math.random() * 8);
  const r = run(P, mk(x, list)); const want = list.includes(x) ? 15 : 0; n++; if (r && r.mem[2] === want) ok++; }
console.log(`רשימות באורך 0 עד 8: ${ok}/${n} נכון`);
const r = run(P, mk(13, [9, 12, 8, 15, 13, 10])); console.log('דוגמה: x=13 ברשימה [9,12,8,15,13,10] ⇒', r.mem[2] === 15 ? 'נמצא' : 'לא נמצא', `(${r.steps} צעדים)`);
