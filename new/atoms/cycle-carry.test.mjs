// בדיקת-זהב · cycle-carry — base·n + רצפת (p0+q·n)÷parts; עם קבועי-המולד נותן ימים-שחלפו גולמיים.
import { cycleCarry } from './cycle-carry.mjs';
import assert from 'node:assert';
assert.strictEqual(cycleCarry(0, 29, 12084, 13753, 25920), 0);
assert.strictEqual(cycleCarry(235, 29, 12084, 13753, 25920), 6940);
assert.strictEqual(cycleCarry(2, 10, 1, 3, 4), 21);
console.log('OK cycle-carry');
