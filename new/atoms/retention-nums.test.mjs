// בדיקת-צילום · retention-nums (ערכים מלאים — מוטציה מאדימה)
import { M } from '../atoms/retention-nums.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(M), "{\"m0\":12}");
console.log('OK retention-nums');
