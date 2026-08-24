import { leaderboard } from './leaderboard.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };

// שקעים חוזיים (מדמים את שכני-המקור)
const totals = { c1: 300, c2: 100, c4: 700 };
const boxCounts = { c1: 2, c2: 1, c4: 3 };
let socketCalls = 0;
const coordinatorTotal = (boxes, id) => { socketCalls++; return totals[id] ?? 0; };
const coordinatorBoxes = (boxes, id) => { socketCalls++; return Array.from({ length: boxCounts[id] ?? 0 }, (_, i) => ({ id: id + '-b' + i })); };

const C = [
  { id: 'c1', score: 50, active: true },
  { id: 'c2', score: 80, active: true },
  { id: 'c3', score: 99, active: false },
  { id: 'c4', score: 50, active: true },
];
const rows = leaderboard(C, [], coordinatorTotal, coordinatorBoxes);

// 1) הסדר: score יורד, תיקו מוכרע ב-total יורד
const order = rows.map((r) => r.coordinator.id).join(',');
ok(order === 'c2,c4,c1', '1: הסדר ≠ c2,c4,c1 (קיבלנו ' + order + ')');

// 2) לא-פעיל לא מופיע — גם עם ה-score הגבוה ביותר
ok(rows.length === 3 && !rows.some((r) => r.coordinator.id === 'c3'), '2: c3 הלא-פעיל הופיע');

// 3) שורת-c4 נושאת את ערכי-השקעים כלשונם
const r4 = rows.find((r) => r.coordinator.id === 'c4');
ok(r4.total === 700 && r4.boxCount === 3, '3: שורת-c4 ≠ {total:700, boxCount:3}');

// 4) רכזים ריקים ⇒ [] והשקעים לא נקראים
socketCalls = 0;
const empty = leaderboard([], [], coordinatorTotal, coordinatorBoxes);
ok(Array.isArray(empty) && empty.length === 0, '4: ([]) ≠ []');
ok(socketCalls === 0, '4: השקעים נקראו על קלט ריק');

if (f) process.exit(1);
console.log('✓ leaderboard: 4 דוגמאות-חוזה — ירוק');
