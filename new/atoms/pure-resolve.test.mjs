// בדיקת-חוזה · pure-resolve — סולם-קדימות prop▶instance▶family▶base + חוסר⇒null.
import { resolvePigment } from './pure-resolve.mjs';
import assert from 'node:assert';

const base = { '--a': '#base', '--err': '#red' };
const family = { '--a': '#fam' };
const inst = { '--a': '#inst' };
const prop = { '--a': '#prop' };

// base בלבד
assert.strictEqual(resolvePigment('--a', [null, null, null, base]), '#base', 'base');
// family גובר על base
assert.strictEqual(resolvePigment('--a', [null, null, family, base]), '#fam', 'family▶base');
// instance גובר על family
assert.strictEqual(resolvePigment('--a', [null, inst, family, base]), '#inst', 'instance▶family');
// prop גובר על הכל
assert.strictEqual(resolvePigment('--a', [prop, inst, family, base]), '#prop', 'prop▶הכל');
// תפקיד שאיש לא הגדיר ⇒ null
assert.strictEqual(resolvePigment('--missing', [prop, inst, family, base]), null, 'חוסר⇒null');
// סמנטי קבוע: err נפתר מ-base גם כשיש override על accent (הבחירה לא נוגעת בסמנטי)
assert.strictEqual(resolvePigment('--err', [prop, inst, family, base]), '#red', 'err קבוע');
// אותו תפקיד, שתי בחירות שונות — אותו מקור, תוצאה שונה (הבחירה, לא הקבע)
assert.notStrictEqual(
  resolvePigment('--a', [null, null, null, base]),
  resolvePigment('--a', [null, { '--a': '#gold' }, null, base]),
  'שתי בחירות ⇒ שתי תוצאות מאותו base'
);

console.log('OK pure-resolve — קדימות prop▶instance▶family▶base · חוסר⇒null · סמנטי-קבוע');
