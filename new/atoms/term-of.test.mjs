/** בדיקת-חוזה · term-of — דריסה/נפילה/ריק/רווחים/חוסר-terms. */
import { termOf as __pure_termOf } from './term-of.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_termOf_TERM_OF_T = {
  k1: "string",
};
const termOf = (...a) => __pure_termOf(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_termOf_TERM_OF_T);
import assert from 'node:assert';
assert.strictEqual(termOf({ terms: { member: 'תלמידה' } }, 'member', 'חבר'), 'תלמידה');
assert.strictEqual(termOf({ terms: { member: '  תלמידה  ' } }, 'member', 'חבר'), 'תלמידה'); // trim
assert.strictEqual(termOf({ terms: { member: '   ' } }, 'member', 'חבר'), 'חבר'); // רווחים = אין דריסה
assert.strictEqual(termOf({ terms: {} }, 'member', 'חבר'), 'חבר');
assert.strictEqual(termOf({}, 'member', 'חבר'), 'חבר'); // terms חסר — לא זורק
assert.strictEqual(termOf({ terms: { member: 7 } }, 'member', 'חבר'), 'חבר'); // לא-מחרוזת
console.log('✓ term-of');
