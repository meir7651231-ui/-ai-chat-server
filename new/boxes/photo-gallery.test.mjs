/** בדיקת-קצה · קופסת גלריית-תמונות — מוכיחה את דוגמאות-החוזה דרך הקופסה בלבד.
 *  DoD (נכתב לפני הקוד): node photo-gallery.test.mjs ⇒ exit 0. */
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import {
  PHOTO_MAX, PHOTO_MAX_DIM, PHOTO_MAX_LEN,
  canAddPhoto, isDataImage, fitDimensions, sanitizePhotos,
} from './photo-gallery.mjs';

// ── תקרות ──
assert.strictEqual(PHOTO_MAX, 5);
assert.strictEqual(PHOTO_MAX_DIM, 800);
assert.strictEqual(PHOTO_MAX_LEN, 460000);

// ── canAddPhoto ──
assert.strictEqual(canAddPhoto(['a', 'b']), true);
assert.strictEqual(canAddPhoto(['a', 'b', 'c', 'd', 'e']), false);
assert.strictEqual(canAddPhoto(undefined), true);
assert.strictEqual(canAddPhoto([]), true);

// ── isDataImage ──
assert.strictEqual(isDataImage('data:image/png;base64,AAA'), true);
assert.strictEqual(isDataImage('data:image/jpeg;base64,x'), true);
assert.strictEqual(isDataImage('data:image/jpg;base64,x'), true); // jpe?g
assert.strictEqual(isDataImage('data:image/webp;base64,x'), true);
assert.strictEqual(isDataImage('data:image/gif;base64,x'), true);
assert.strictEqual(isDataImage('data:image/svg+xml;base64,AAA'), false); // svg חסום — XSS
assert.strictEqual(isDataImage('http://x/a.png'), false);
assert.strictEqual(isDataImage(null), false);
assert.strictEqual(isDataImage(123), false);
assert.strictEqual(isDataImage(undefined), false);

// ── fitDimensions ──
assert.deepStrictEqual(fitDimensions(1600, 800), { w: 800, h: 400 }); // ברירת-מחדל 800
assert.deepStrictEqual(fitDimensions(400, 200, 800), { w: 400, h: 200 }); // לא מגדיל
assert.deepStrictEqual(fitDimensions(0, 100, 800), { w: 0, h: 0 });
assert.deepStrictEqual(fitDimensions(-5, 100, 800), { w: 0, h: 0 });
assert.deepStrictEqual(fitDimensions(3, 1, 2), { w: 2, h: 1 }); // Math.max(1,round)
assert.deepStrictEqual(fitDimensions(1, 1, 800), { w: 1, h: 1 }); // קטנה — נשמרת

// ── sanitizePhotos ──
assert.deepStrictEqual(sanitizePhotos('not-array'), []);
assert.deepStrictEqual(sanitizePhotos(null), []);
assert.deepStrictEqual(sanitizePhotos([1, 'x', null]), []);
const ok = 'data:image/png;base64,AAA';
assert.deepStrictEqual(sanitizePhotos([ok, 'bad', ok]), [ok, ok]);
const heavy = 'data:image/png;base64,' + 'A'.repeat(PHOTO_MAX_LEN); // > 460000 סה"כ
assert.deepStrictEqual(sanitizePhotos([heavy]), []); // מסוננת במשקל
const seven = Array.from({ length: 7 }, () => ok);
assert.strictEqual(sanitizePhotos(seven).length, PHOTO_MAX); // חיתוך ל-5
// עברית/קלט-שבור לא מפיל
assert.deepStrictEqual(sanitizePhotos(['תמונה', { x: 1 }, undefined]), []);

// ── 🛡 מגן-הכרעה: החיווט verbatim במקור-הקופסה ──
const src = readFileSync(new URL('./photo-gallery.mjs', import.meta.url), 'utf8');
assert.ok(src.includes('canAddPhotoAtom(current, PHOTO_MAX)'), 'מגן: canAddPhoto לא מחווט ל-PHOTO_MAX');
assert.ok(
  src.includes('sanitizePhotosAtom(raw, isDataImage, PHOTO_MAX_LEN, PHOTO_MAX)'),
  'מגן: sanitizePhotos לא מחווט ל-isDataImage+PHOTO_MAX_LEN+PHOTO_MAX',
);
assert.ok(src.includes('max = PHOTO_MAX_DIM'), 'מגן: ברירת-fitDimensions אינה PHOTO_MAX_DIM');

console.log('✓ קופסת גלריית-תמונות: תקרות + canAddPhoto/isDataImage/fitDimensions/sanitizePhotos + מגן-חיווט');
