import { deliveryListLines } from './delivery-list-lines.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
// השקע — תוויות-הסטטוס של המקור
const statusLabel = (s) => (s === 'pickup' ? 'איסוף' : s === 'enroute' ? 'בדרך' : 'נמסר');
const rows = [
  { familyName: 'כהן', volunteerName: 'דוד', status: 'pickup' },
  { familyName: 'לוי', volunteerName: 'שרה', status: 'delivered', address: 'הרצל 3' },
  { familyName: 'מזרחי', volunteerName: 'דוד', status: 'enroute', note: 'קומה 2' },
];
const out = deliveryListLines(rows, statusLabel);
ok(out.length === 5, 'אורך ≠ 5');
ok(out[0] === '🦺 דוד (2 מסירות)', '[0] כותרת-דוד שגויה: ' + out[0]);
ok(out[1] === '  • כהן · איסוף', '[1] שגוי: ' + out[1]);
ok(out[2] === '  • מזרחי · בדרך · קומה 2', '[2] הערה-בלי-📍 שגוי: ' + out[2]);
ok(out[3] === '🦺 שרה (1 מסירות)', '[3] כותרת-שרה שגויה: ' + out[3]);
ok(out[4] === '  • לוי · נמסר · 📍 הרצל 3', '[4] כתובת-עם-📍 שגוי: ' + out[4]);
// ריק
ok(deliveryListLines([], statusLabel).length === 0, 'rows=[] לא ריק');
if (f) process.exit(1);
console.log('✓ delivery-list-lines: 6 דוגמאות-חוזה — ירוק');
