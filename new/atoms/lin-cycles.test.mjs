// בדיקת-זהב · lin-cycles — רצפת (a·n−b)÷c; עם דאטת-הלוח: 235 חודשים ל-19 שנים.
import { linCycles } from './lin-cycles.mjs';
import assert from 'node:assert';
assert.strictEqual(linCycles(1, 235, 234, 19), 0);
assert.strictEqual(linCycles(20, 235, 234, 19), 235);
assert.strictEqual(linCycles(5786, 235, 234, 19), 71551);
assert.strictEqual(linCycles(3, 2, 1, 2), 2);
console.log('OK lin-cycles');
