// בדיקת-זהב · heb-cal-data — צילום-שפיות של הקבועים המכריעים (שינוי = שינוי-לוח מודע).
import { HEB_CAL as C } from './heb-cal-data.mjs';
import assert from 'node:assert';
assert.strictEqual(C.anchor, -1373427);
assert.strictEqual(C.names.length, 13);
assert.strictEqual(C.names[6], 'תשרי');
assert.strictEqual(C.carry.parts, 25920);
console.log('OK heb-cal-data');
