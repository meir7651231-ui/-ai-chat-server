import { WEEKS_PER_MONTH, lessonsInTerm } from './lessons-in-term.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
// 1) שבועי
ok(lessonsInTerm(2, 'week', 'weekly') === 2, 'דוגמה 1: (2,week,weekly) ≠ 2');
// 2) דו-שבועי = perWeek×2
ok(lessonsInTerm(2, 'week', 'biweekly') === 4, 'דוגמה 2: (2,week,biweekly) ≠ 4');
// 3) המרה שבוע→חודש
ok(lessonsInTerm(1, 'week', 'monthly') === 52 / 12, 'דוגמה 3: (1,week,monthly) ≠ 52/12');
ok(WEEKS_PER_MONTH === 52 / 12, 'הקבוע WEEKS_PER_MONTH ≠ 52/12');
// 4) מספר-חודשים
ok(lessonsInTerm(4, 'month', 'months', 3) === 12, 'דוגמה 4: (4,month,months,3) ≠ 12');
// 5) שנתי + חצי-שנתי
ok(lessonsInTerm(4, 'month', 'year') === 48, 'דוגמה 5: (4,month,year) ≠ 48');
ok(lessonsInTerm(4, 'month', 'half_year') === 24, 'דוגמה 5: (4,month,half_year) ≠ 24');
// 6) חד-פעמי מתעלם מתדירות
ok(lessonsInTerm(99, 'week', 'once') === 1, 'דוגמה 6: once ≠ 1');
// 7) קצוות: NaN / שלילי / term לא-מוכר
ok(lessonsInTerm(NaN, 'week', 'weekly') === 0, 'דוגמה 7: NaN ≠ 0');
ok(lessonsInTerm(-3, 'week', 'weekly') === 0, 'דוגמה 7: שלילי ≠ 0');
ok(lessonsInTerm(2, 'week', 'nonsense') === 0, 'דוגמה 7: term לא-מוכר ≠ 0');
if (f) process.exit(1);
console.log('✓ lessons-in-term: 7 דוגמאות-חוזה — ירוק');
