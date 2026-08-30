// בדיקת-זהב · step-postpone — דחייה כשהשארית קטנה מהסף; אחרת ללא-שינוי.
import { stepPostpone } from './step-postpone.mjs';
import assert from 'node:assert';
assert.strictEqual(stepPostpone(6, 3, 7, 3), 7);   // (3·7)%7=0<3 ⇒ נדחה
assert.strictEqual(stepPostpone(7, 3, 7, 3), 7);   // (3·8)%7=3 ⇒ לא נדחה
assert.strictEqual(stepPostpone(0, 1, 5, 0), 0);
console.log('OK step-postpone');
