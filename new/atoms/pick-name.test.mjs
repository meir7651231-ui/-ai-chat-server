// בדיקת-זהב · pick-name — איבר קיים מוחזר; חסר ⇒ ריק.
import { pickName } from './pick-name.mjs';
import assert from 'node:assert';
assert.strictEqual(pickName(['a', 'b'], 1), 'b');
assert.strictEqual(pickName(['a'], 5), '');
assert.strictEqual(pickName([], 0), '');
console.log('OK pick-name');
