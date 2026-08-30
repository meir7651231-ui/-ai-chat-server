import { foldIcsLine as __pure_foldIcsLine } from './fold-ics-line.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_fold_ics_line_T = {
  k1: 75,
};
const foldIcsLine = (...a) => __pure_foldIcsLine(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_fold_ics_line_T);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b, msg) => ok(JSON.stringify(a) === JSON.stringify(b), msg + ` — קיבלנו ${JSON.stringify(a)}`);
// 1) קצר — שורה אחת
eq(foldIcsLine('hello'), ['hello'], 'שורה קצרה');
// 2) ריק — [''] ולא []
eq(foldIcsLine(''), [''], 'שורה ריקה');
// 3) בדיוק 75 אוקטטים — שורה אחת
eq(foldIcsLine('a'.repeat(75)), ['a'.repeat(75)], '75 בדיוק');
// 4) ‏80 ⇒ ‏75 + המשך ' aaaaa'
eq(foldIcsLine('a'.repeat(80)), ['a'.repeat(75), ' aaaaa'], 'קיפול 80 אוקטטים');
// 5) עברית — 2 בייט לתו; 37 תווים (74 בייט) בראשונה, אין חציית-תו
eq(foldIcsLine('א'.repeat(40)), ['א'.repeat(37), ' ' + 'א'.repeat(3)], 'קיפול עברית לפי בייטים');
if (f) process.exit(1);
console.log('✓ fold-ics-line: 5 דוגמאות-חוזה — ירוק');
