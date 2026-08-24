import { sanitizePhotos } from './sanitize-photos.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const J = JSON.stringify;
// שקע-אימות מזויף לבדיקה: תחילית 'img:'
const isImg = (x) => typeof x === 'string' && x.startsWith('img:');

// 1) לא-מערך ⇒ []
ok(J(sanitizePhotos(null, isImg)) === '[]', 'null ≠ []');
ok(J(sanitizePhotos('img:a', isImg)) === '[]', 'מחרוזת ≠ []');
ok(J(sanitizePhotos({}, isImg)) === '[]', 'אובייקט ≠ []');
ok(J(sanitizePhotos(undefined, isImg)) === '[]', 'undefined ≠ []');

// 2) פסולי-שקע נזרקים, הסדר נשמר
ok(J(sanitizePhotos(['img:a', 'bad', 'img:b'], isImg)) === J(['img:a', 'img:b']), 'סינון-שקע/סדר');

// 3) תקרת-משקל מוזרקת
ok(J(sanitizePhotos(['img:a', 'img:abc'], isImg, 6)) === J(['img:a']), 'photoMaxLen=6');

// 4) גבול-סגור: אורך == photoMaxLen עובר (<=)
ok(J(sanitizePhotos(['img:ab'], isImg, 6)) === J(['img:ab']), 'אורך=תקרה חייב לעבור');

// 5) תקרת-כמות: 7 תקינים ⇒ 5 הראשונים
const seven = ['img:1', 'img:2', 'img:3', 'img:4', 'img:5', 'img:6', 'img:7'];
ok(J(sanitizePhotos(seven, isImg)) === J(seven.slice(0, 5)), '7 ⇒ 5 הראשונים');

// 6) ברירות-המחדל = ערכי-המוצא (460000 / 5)
const big = 'img:' + 'x'.repeat(459_997); // אורך 460001 ⇒ נזרק
const fit = 'img:' + 'x'.repeat(459_996); // אורך 460000 ⇒ עובר
ok(J(sanitizePhotos([big, 'img:a'], isImg)) === J(['img:a']), '460001 לא נזרק בברירת-מחדל');
ok(sanitizePhotos([fit], isImg).length === 1, '460000 בדיוק חייב לעבור');

if (f) process.exit(1);
console.log('✓ sanitize-photos: 6 דוגמאות-חוזה (שקעי isDataImage/תקרות) — ירוק');
