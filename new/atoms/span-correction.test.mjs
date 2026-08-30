// בדיקת-זהב · span-correction — מרווח-קדימה=hi ⇒ 2 · מרווח-אחורה=lo ⇒ 1 · אחרת 0.
import { spanCorrection } from './span-correction.mjs';
import assert from 'node:assert';
assert.strictEqual(spanCorrection(0, 100, 456, 356, 382), 2);
assert.strictEqual(spanCorrection(0, 382, 500, 356, 382), 1);
assert.strictEqual(spanCorrection(0, 100, 200, 356, 382), 0);
console.log('OK span-correction');
