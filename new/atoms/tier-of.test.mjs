import { tierOf } from './tier-of.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b, msg) => ok(JSON.stringify(a) === JSON.stringify(b), msg + ` ⇒ ${JSON.stringify(a)}`);

const RED = 500;

// 1) טיטאן — הרשומה כולה
eq(tierOf(1000, RED), { key: 'titan', label: 'טיטאן', bg: '#fdf3dd', c: '#9a6414', dot: '#f3c76b' },
  'רשומת-טיטאן סטתה');

// 2) גבול 950 כלול
eq(tierOf(950, RED).key, 'titan', 'גבול-950 לא טיטאן');

// 3) לביאה — הרשומה כולה
eq(tierOf(949, RED), { key: 'lion', label: 'לביאה', bg: '#e4f5ea', c: '#12803c', dot: '#16a34a' },
  'רשומת-לביאה סטתה');

// 4) גבול 800 כלול
eq(tierOf(800, RED).key, 'lion', 'גבול-800 לא לביאה');

// 5) טעון-שיפור — הרשומה כולה (הגבול = הסף-המוזרק)
eq(tierOf(500, RED), { key: 'pale', label: 'טעון שיפור', bg: '#fdf1d4', c: '#9a6414', dot: '#d97706' },
  'רשומת-טעון-שיפור סטתה');

// 6) מתחת לסף — סיכון-נטישה
eq(tierOf(499, RED), { key: 'red', label: 'סיכון נטישה', bg: '#fdeaea', c: '#b91c1c', dot: '#dc2626' },
  'רשומת-סיכון סטתה');

// 7) הסף חי בחיווט — סף אחר משנה את ההכרעה
eq(tierOf(499, 300).key, 'pale', 'סף-מוזרק לא כובד');

if (f) process.exit(1);
console.log('✓ tier-of: 7 דוגמאות-חוזה — ירוק');
