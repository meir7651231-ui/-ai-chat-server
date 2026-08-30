// בדיקת-זהב · cycle-hit — דוגמאות-חוזה + עם דאטת-הלוח: שנות-העיבור במחזור י"ט הן ג,ו,ח,יא,יד,יז,יט.
import { cycleHit } from './cycle-hit.mjs';
import assert from 'node:assert';
const leaps = [];
for (let y = 1; y <= 19; y++) if (cycleHit(y, 7, 1, 19, 7)) leaps.push(y);
assert.deepStrictEqual(leaps, [3, 6, 8, 11, 14, 17, 19]);
assert.strictEqual(cycleHit(0, 1, 0, 2, 1), true);
assert.strictEqual(cycleHit(1, 1, 0, 2, 1), false);
console.log('OK cycle-hit');
