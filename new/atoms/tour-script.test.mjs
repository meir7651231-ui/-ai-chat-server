// בדיקת-צילום · tour-script — 14 צעדים · כיתובים מילה-במילה · סדר-הלגאסי.
import { TOUR_STEPS } from './tour-script.mjs';
import assert from 'node:assert';
assert.strictEqual(TOUR_STEPS.length, 14, '14 צעדים');
assert.strictEqual(TOUR_STEPS[0].caption, '👋 הדמיה מלאה — המערכת מדגימה את עצמה, על הנתונים האמיתיים');
assert.strictEqual(TOUR_STEPS[13].caption, 'זו המערכת. חיה, מלאה, במקום אחד ✦');
// סדר-התסריט (צדקה→חנות→הגדרות) = המשמעות
const order = ['tzedaka', 'shop', 'settings'].map((v) => TOUR_STEPS.findIndex((s) => s.view === v));
assert.ok(order[0] > 0 && order[0] < order[1] && order[1] < order[2], 'סדר-התסריט נשמר');
console.log('OK tour-script');
