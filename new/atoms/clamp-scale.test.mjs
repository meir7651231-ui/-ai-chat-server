import { clampScale } from './clamp-scale.mjs';
let f = 0;
const eq = (got, want, msg) => { if (!Object.is(got, want)) { console.error(`✗ ${msg} ⇒ ${got} ≠ ${want}`); f = 1; } };

eq(clampScale(1.0), 1, 'בתוך הטווח');            // 1
eq(clampScale(2.5), 1.6, 'חיתוך לגבול-עליון');    // 2
eq(clampScale(0.5), 0.8, 'חיתוך לגבול-תחתון');    // 3
eq(clampScale(NaN), 1, 'NaN ⇒ ברירת-מחדל');       // 4
eq(clampScale(Infinity), 1, '∞ ⇒ ברירת-מחדל');    // 4
eq(clampScale('1.2'), 1, 'מחרוזת אינה מספר');      // 5
eq(clampScale(1.2), 1.2, 'ערך-ביניים נשמר');       // 6
eq(clampScale(5, 0, 2), 2, 'שקעי min/max מוזרקים'); // 7

if (f) process.exit(1);
console.log('✓ clamp-scale: 8 בדיקות מ-7 דוגמאות-חוזה — ירוק');
