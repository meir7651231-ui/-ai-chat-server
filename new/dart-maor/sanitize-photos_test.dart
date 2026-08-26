// בדיקת-חוזה · sanitizePhotos — פורט מ-new/atoms/sanitize-photos.test.mjs
// + בדיקות-הסגר (כלל-15) שהפילו את הפורט-השבור באימות-העוין.
// הרצה: dart run --enable-asserts sanitize-photos_test.dart
import 'sanitize-photos.dart';

int _f = 0;
void ok(bool cond, String msg) {
  if (!cond) {
    _f = 1;
    print('✗ $msg');
  }
}

String j(dynamic v) {
  // סריאליזציה פשוטה מספיקה — האלמנטים כאן מחרוזות/מפות.
  if (v is List) return '[' + v.map(j).join(',') + ']';
  if (v is String) return '"$v"';
  return '$v';
}

// שקע-אימות מזויף: תחילית 'img:' (כמו במקור-ה-mjs).
bool isImg(dynamic x) => x is String && x.startsWith('img:');
// שקע-אימות מתירני: הכול תמונה (לחשיפת נתיבי length/null).
bool isAny(dynamic x) => true;

void main() {
  // 1) לא-מערך ⇒ []
  ok(j(sanitizePhotos(null, isImg)) == '[]', 'null ≠ []');
  ok(j(sanitizePhotos('img:a', isImg)) == '[]', 'מחרוזת ≠ []');
  ok(j(sanitizePhotos(<String, dynamic>{}, isImg)) == '[]', 'אובייקט ≠ []');
  ok(j(sanitizePhotos(null, isImg)) == '[]', 'undefined ≠ []');

  // 2) פסולי-שקע נזרקים, הסדר נשמר
  ok(j(sanitizePhotos(['img:a', 'bad', 'img:b'], isImg)) == j(['img:a', 'img:b']),
      'סינון-שקע/סדר');

  // 3) תקרת-משקל מוזרקת
  ok(j(sanitizePhotos(['img:a', 'img:abc'], isImg, 6)) == j(['img:a']), 'photoMaxLen=6');

  // 4) גבול-סגור: אורך == photoMaxLen עובר (<=)
  ok(j(sanitizePhotos(['img:ab'], isImg, 6)) == j(['img:ab']), 'אורך=תקרה חייב לעבור');

  // 5) תקרת-כמות: 7 תקינים ⇒ 5 הראשונים
  final seven = ['img:1', 'img:2', 'img:3', 'img:4', 'img:5', 'img:6', 'img:7'];
  ok(j(sanitizePhotos(seven, isImg)) == j(seven.sublist(0, 5)), '7 ⇒ 5 הראשונים');

  // 6) ברירות-המחדל = ערכי-המוצא (460000 / 5)
  final big = 'img:' + 'x' * 459997; // אורך 460001 ⇒ נזרק
  final fit = 'img:' + 'x' * 459996; // אורך 460000 ⇒ עובר
  ok(j(sanitizePhotos([big, 'img:a'], isImg)) == j(['img:a']), '460001 לא נזרק בברירת-מחדל');
  ok(sanitizePhotos([fit], isImg).length == 1, '460000 בדיוק חייב לעבור');

  // ── בדיקות-הסגר (כלל-15) ──
  // H1) photoMaxLen="6" (קוארציה-בהשוואה): JS `len <= "6"` ⇒ 6.
  ok(j(sanitizePhotos(['img:a', 'img:abc'], isImg, '6')) == j(['img:a']),
      'photoMaxLen="6" מקוארץ ל-6');

  // H2) photoMax="3" (ToIntegerOrInfinity): חיתוך ל-3 (לא []).
  ok(j(sanitizePhotos(seven, isImg, 460000, '3')) == j(seven.sublist(0, 3)),
      'photoMax="3" ⇒ 3 הראשונים');
  // photoMax לא-מספרי ("abc") ⇒ NaN⇒0 ⇒ [].
  ok(j(sanitizePhotos(seven, isImg, 460000, 'abc')) == '[]', 'photoMax="abc" ⇒ 0');

  // H3) {length:5}: JS קורא x.length=5.
  final obj = {'length': 5};
  ok(sanitizePhotos([obj], isAny, 6).length == 1, '{length:5} <= 6 ⇒ נשמר');
  ok(sanitizePhotos([obj], isAny, 4).length == 0, '{length:5} > 4 ⇒ נזרק');

  // H4) raw=[null] כש-isDataImage אמת: JS זורק ⇒ הפורט זורק (זריקה-נאמנה).
  var threw = false;
  try {
    sanitizePhotos([null], isAny);
  } catch (_) {
    threw = true;
  }
  ok(threw, 'raw=[null] עם שקע-אמת ⇒ זריקה נאמנה');
  // אך null כש-isDataImage כוזב (isImg) ⇒ קצר-חשמלי, בלי זריקה.
  ok(j(sanitizePhotos([null, 'img:a'], isImg)) == j(['img:a']),
      'null עם שקע-כוזב ⇒ מסונן בשקט');

  if (_f != 0) {
    print('FAILED');
    throw StateError('sanitize-photos: בדיקות נכשלו');
  }
  print('✓ sanitize-photos: 6 דוגמאות-חוזה + 4 בדיקות-הסגר (כלל-15) — ירוק');
}
