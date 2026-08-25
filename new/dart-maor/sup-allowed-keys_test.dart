// בדיקת-חוזה (רתמת-זהב) · supAllowedKeys — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/sup-allowed-keys.test.mjs
// (אותם קלטים→פלטים; השקע sharedKey = '_shared_'):
//   1) ['חינוך','רווחה']              ⇒ ['חינוך','רווחה','_shared_'] — המשותף אחרון
//   2) [' חינוך ','חינוך','','רווחה'] ⇒ ['חינוך','רווחה','_shared_'] — trim+דדופ+סינון-ריקים
//   3) p1..p35                        ⇒ אורך 30: p1..p29 + '_shared_' — חיתוך ל-29 (מגבלת in)
//   4) []                             ⇒ ['_shared_'] — רק המשותף
//   5) ['ב','א']                      ⇒ ['ב','א','_shared_'] — סדר-הקלט נשמר
// השוואת-מערכים = אורך + איבר-איבר (כלל-8 — לעולם לא join). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/sup-allowed-keys_test.dart  ⇒ exit 0
import 'sup-allowed-keys.dart';

const _shared = '_shared_';

// השוואת-רשימות לפי כלל-8: אורך תחילה, ואז איבר-איבר — זורקת StateError על כשל.
void _eq(List<dynamic> got, List<dynamic> want, String label) {
  if (got.length != want.length) {
    throw StateError('FAIL [$label]: אורך ${got.length} ≠ ${want.length}\n got=$got\n want=$want');
  }
  for (var i = 0; i < want.length; i++) {
    if (got[i] != want[i]) {
      throw StateError('FAIL [$label]: איבר $i: "${got[i]}" ≠ "${want[i]}"\n got=$got\n want=$want');
    }
  }
}

void main() {
  var n = 0;

  // 1) בסיס — המשותף אחרון.
  _eq(
    supAllowedKeys(['חינוך', 'רווחה'], _shared),
    ['חינוך', 'רווחה', '_shared_'],
    'דוגמה 1',
  );
  n++;

  // 2) trim + דדופ + סינון-ריקים.
  _eq(
    supAllowedKeys([' חינוך ', 'חינוך', '', 'רווחה'], _shared),
    ['חינוך', 'רווחה', '_shared_'],
    'דוגמה 2',
  );
  n++;

  // 3) חיתוך ל-29 + משותף = 30 (מגבלת in של Firestore).
  final many = List<String>.generate(35, (i) => 'p${i + 1}');
  final got3 = supAllowedKeys(many, _shared);
  if (got3.length != 30) {
    throw StateError('FAIL [דוגמה 3]: אורך ${got3.length} ≠ 30');
  }
  if (got3[0] != 'p1' || got3[28] != 'p29' || got3[29] != '_shared_') {
    throw StateError('FAIL [דוגמה 3]: תוכן-החיתוך שגוי: $got3');
  }
  // איבר-איבר מלא (כלל-8) — p1..p29 ואז המשותף.
  _eq(got3, [...List<String>.generate(29, (i) => 'p${i + 1}'), '_shared_'], 'דוגמה 3 מלא');
  n++;

  // 4) ריק ⇒ רק המשותף.
  _eq(supAllowedKeys(<String>[], _shared), ['_shared_'], 'דוגמה 4');
  n++;

  // 5) סדר-הקלט נשמר (אין מיון).
  _eq(supAllowedKeys(['ב', 'א'], _shared), ['ב', 'א', '_shared_'], 'דוגמה 5');
  n++;

  // קצה חוק-16: U+0085 (NEL) אינו רווח-ES ⇒ 'א\u0085' לא נגזם ולא מתאחד עם 'א'.
  _eq(
    supAllowedKeys(['א\u0085', 'א'], _shared),
    ['א\u0085', 'א', '_shared_'],
    'קצה NEL (חוק-16)',
  );
  n++;

  // קצה slice-סלחני: פחות מ-29 ⇒ הכול נשמר (בלי RangeError).
  _eq(supAllowedKeys(['x'], _shared), ['x', '_shared_'], 'קצה slice קצר');
  n++;

  // assert חי (--enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(supAllowedKeys(<String>[], _shared).length == 1, 'assert-live guard');

  print('OK supAllowedKeys: $n asserts passed');
}
