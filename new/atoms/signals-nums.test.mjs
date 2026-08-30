// בדיקת-צילום · signals-nums (ערכים מלאים — מוטציה מאדימה)
import { M } from '../atoms/signals-nums.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(M), "{\"m0\":40,\"m1\":30,\"m2\":70,\"m3\":50,\"m4\":45,\"m5\":35}");
console.log('OK signals-nums');
