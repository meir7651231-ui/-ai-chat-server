// בדיקת-צילום · intel-nums (ערכים מלאים — מוטציה מאדימה)
import { M } from '../atoms/intel-nums.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(M), "{\"m0\":10,\"m1\":300,\"m2\":230,\"m3\":160,\"m4\":100,\"m5\":50,\"m6\":365,\"m7\":30,\"m8\":15,\"m9\":92,\"m10\":25}");
console.log('OK intel-nums');
