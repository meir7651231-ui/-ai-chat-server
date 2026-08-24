/** בדיקת-חוזה · term-of — דריסה/נפילה/ריק/רווחים/חוסר-terms. */
import { termOf } from './term-of.mjs';
import assert from 'node:assert';
assert.strictEqual(termOf({ terms: { member: 'תלמידה' } }, 'member', 'חבר'), 'תלמידה');
assert.strictEqual(termOf({ terms: { member: '  תלמידה  ' } }, 'member', 'חבר'), 'תלמידה'); // trim
assert.strictEqual(termOf({ terms: { member: '   ' } }, 'member', 'חבר'), 'חבר'); // רווחים = אין דריסה
assert.strictEqual(termOf({ terms: {} }, 'member', 'חבר'), 'חבר');
assert.strictEqual(termOf({}, 'member', 'חבר'), 'חבר'); // terms חסר — לא זורק
assert.strictEqual(termOf({ terms: { member: 7 } }, 'member', 'חבר'), 'חבר'); // לא-מחרוזת
console.log('✓ term-of');
