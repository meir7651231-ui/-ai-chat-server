import { overrideColumn } from './override-column.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const mkRows = () => [['שם', 'הערות'], ['א', 'ישן'], ['ב', 'x']];
// 1) דריסה בסיסית
const r1src = mkRows();
const r1 = overrideColumn(r1src, 1, { 1: 'חדש' });
ok(JSON.stringify(r1) === JSON.stringify([['שם', 'הערות'], ['א', 'חדש'], ['ב', 'x']]), 'דוגמה 1');
// 2) כותרת חסינה (גם כשמנסים לדרוס אינדקס 0)
const r2src = mkRows();
const r2 = overrideColumn(r2src, 1, { 0: 'פריצה', 2: 'y' });
ok(r2[0] === r2src[0], 'דוגמה 2: כותרת לא באותה רפרנס');
ok(JSON.stringify(r2[0]) === JSON.stringify(['שם', 'הערות']), 'דוגמה 2: כותרת נדרסה');
ok(JSON.stringify(r2[2]) === JSON.stringify(['ב', 'y']), 'דוגמה 2: שורה 2 לא נדרסה');
// 3) colIdx שלילי ⇒ הקלט עצמו
const r3src = mkRows();
ok(overrideColumn(r3src, -1, { 1: 'z' }) === r3src, 'דוגמה 3: לא הוחזר הקלט עצמו');
// 4) אפס דריסות ⇒ כל שורה באותה רפרנס
const r4src = mkRows();
const r4 = overrideColumn(r4src, 1, {});
ok(r4.length === 3 && r4.every((row, i) => row === r4src[i]), 'דוגמה 4: הועתקו שורות לחינם');
// 5) אי-מוטציה של הקלט
ok(r1src[1][1] === 'ישן', 'דוגמה 5: הקלט שונה במקום');
// 6) דריסה לערך-ריק תופסת (רק undefined מדולג)
const r6 = overrideColumn(mkRows(), 1, { 1: '' });
ok(JSON.stringify(r6[1]) === JSON.stringify(['א', '']), 'דוגמה 6: ערך-ריק לא נדרס');
if (f) process.exit(1);
console.log('✓ override-column: 6 דוגמאות-חוזה — ירוק');
