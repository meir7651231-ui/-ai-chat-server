// בדיקת-חוזה (רתמת-זהב) · supIls — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/sup-ils.test.mjs
// (אותם קלטים→פלטים):
//   1) {ils:100}                                   ⇒ 100 — המונה-השמור בלבד
//   2) {ils:100, hist:[{a:50,c:'₪'},{a:30,c:'$'}]} ⇒ 150 — שורת-$ מוחרגת
//   3) {}                                          ⇒ 0   — הכול חסר
//   4) {hist:[{a:70}]}                             ⇒ 70  — c חסר ⇒ נספר כשקלי
//   5) {ils:0, hist:[{a:25,c:'$'}]}                ⇒ 0   — כולה דולרים
// הפלט סקלרי (מספר) ⇒ כלל-8 (השוואת-מערך אורך+איבר-איבר) לא-נדרש כאן.
// כשל ⇒ StateError. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/sup-ils_test.dart  ⇒ exit 0 + OK
import 'sup-ils.dart';

void _eq(dynamic got, dynamic want, String label) {
  // שוויון-JS על מספרים: 150==150.0 ⇒ השוואת-num של Dart שקולה (===' של JS על Number).
  if (!(got == want)) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  // 1) המונה השמור בלבד — ils=100 בלי hist ⇒ 100.
  _eq(supIls({'ils': 100}), 100, 'ils=100 בלי hist ⇒ 100');
  n++;

  // 2) hist נוסף; שורת-$ מוחרגת — 100+50₪ (ה-30$ מוחרג) ⇒ 150.
  _eq(
    supIls({
      'ils': 100,
      'hist': [
        {'a': 50, 'c': '₪'},
        {'a': 30, 'c': '\$'},
      ],
    }),
    150,
    '100+50₪ (ה-30\$ מוחרג) ⇒ 150',
  );
  n++;

  // 3) הכול חסר ⇒ 0 — ils חסר ⇒ 0, hist חסר ⇒ מערך ריק.
  _eq(supIls(<String, dynamic>{}), 0, 'ils חסר + hist חסר ⇒ 0');
  n++;

  // 4) שורה בלי c נספרת כשקלית ⇒ 70.
  _eq(
    supIls({
      'hist': [
        {'a': 70},
      ],
    }),
    70,
    'c חסר ⇒ נספר ₪ ⇒ 70',
  );
  n++;

  // 5) כולה דולרים ⇒ אפס ₪.
  _eq(
    supIls({
      'ils': 0,
      'hist': [
        {'a': 25, 'c': '\$'},
      ],
    }),
    0,
    'רק \$ ⇒ 0',
  );
  n++;

  // assert חי (הרצה עם --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(supIls({'ils': 1}) == 1, 'assert-live guard');

  print('OK supIls: $n asserts passed (₪ כולל היסטוריה; \$ מוחרג)');
}
