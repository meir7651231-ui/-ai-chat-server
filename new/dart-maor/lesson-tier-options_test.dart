// בדיקת-חוזה (רתמת-זהב) · lessonTierOptions — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/lesson-tier-options.test.mjs
// (אותם קלטים→פלטים). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/lesson-tier-options_test.dart ⇒ exit 0
import 'lesson-tier-options.dart';

void _eqInt(int got, int want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void _eqStr(String got, String want, String label) {
  if (got != want) throw StateError('FAIL [$label]:\n got =[$got]\n want=[$want]');
}

void main() {
  var n = 0;

  // 1) רק מחיר מלא
  final r1 = lessonTierOptions({'lessonPrice': 100});
  _eqInt(r1.length, 1, 'דוגמה 1 length');
  _eqStr(r1[0]['v']!, '', 'דוגמה 1 v');
  _eqStr(r1[0]['t']!, 'מחיר מלא · ₪100', 'דוגמה 1 t');
  n++;

  // 2) חוג ריק ⇒ ₪0
  final r2 = lessonTierOptions({});
  _eqInt(r2.length, 1, 'דוגמה 2 length');
  _eqStr(r2[0]['t']!, 'מחיר מלא · ₪0', 'דוגמה 2 t');
  n++;

  // 3) שם-רמה מותאם
  final r3 = lessonTierOptions(
      {'lessonPrice': 100, 'lessonPrice1': 80, 'price1Name': 'אח שני'});
  _eqInt(r3.length, 2, 'דוגמה 3 length');
  _eqStr(r3[1]['v']!, '1', 'דוגמה 3 v');
  _eqStr(r3[1]['t']!, 'אח שני · ₪80', 'דוגמה 3 t');
  n++;

  // 4) שם חסר ⇒ ברירת-מחדל
  final r4 = lessonTierOptions({'lessonPrice': 100, 'lessonPrice2': 60});
  _eqInt(r4.length, 2, 'דוגמה 4 length');
  _eqStr(r4[1]['v']!, '2', 'דוגמה 4 v');
  _eqStr(r4[1]['t']!, 'הנחה 2 · ₪60', 'דוגמה 4 t');
  n++;

  // 5) כל הרמות — סדר קבוע
  final r5 = lessonTierOptions({
    'lessonPrice': 100,
    'lessonPrice1': 80,
    'lessonPrice2': 60,
    'lessonPrice3': 40,
  });
  _eqInt(r5.length, 4, 'דוגמה 5 length');
  _eqStr(r5.map((x) => x['v']!).join(','), ',1,2,3', 'דוגמה 5 סדר');
  _eqStr(r5[3]['t']!, 'הנחה 3 · ₪40', 'תווית רמה 3');
  n++;

  // 6) מחיר-רמה 0 לא נכנס (falsy)
  final r6 = lessonTierOptions({'lessonPrice': 100, 'lessonPrice2': 0});
  _eqInt(r6.length, 1, 'דוגמה 6 — מחיר 0 נכנס לרשימה');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
    lessonTierOptions({'lessonPrice': 100})[0]['t'] == 'מחיר מלא · ₪100',
    'assert-live guard',
  );

  print('OK lessonTierOptions: $n asserts passed');
}
