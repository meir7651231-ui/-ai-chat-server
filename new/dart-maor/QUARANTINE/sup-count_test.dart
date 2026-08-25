// בדיקת-חוזה (רתמת-זהב) · supCount — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/sup-count.test.mjs
// (אותם קלטים→פלטים):
//   1) {count:5}                              ⇒ 5 — המונה-השמור בלבד
//   2) {count:2, hist:[{a:100},{a:50}]}       ⇒ 4 — 2 קבלות + 2 שורות-חיוב
//   3) {count:0, hist:[{a:0},{a:-30},{a:80}]} ⇒ 1 — רק a>0 נספר (אפס/זיכוי מוחרגים)
//   4) {}                                     ⇒ 0 — count חסר ⇒ 0; hist חסר ⇒ []
//   5) {count:3, hist:[]}                     ⇒ 3 — hist ריק לא משבש
//   6) {count:1, hist:[{}]}                   ⇒ 1 — שורה בלי a ⇒ (h.a||0)>0 שקר
// הפלט סקלרי (מספר) ⇒ כלל-8 (השוואת-מערך אורך+איבר-איבר) לא-נדרש כאן.
// כשל ⇒ StateError. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/sup-count_test.dart  ⇒ exit 0 + OK
import 'sup-count.dart';

void _eq(dynamic got, dynamic want, String label) {
  // שוויון-JS על מספרים: 5==5.0 ⇒ השוואת-num של Dart שקולה (=== של JS על Number).
  if (!(got == want)) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  // 1) המונה השמור בלבד — count=5 בלי hist ⇒ 5.
  _eq(supCount({'count': 5}), 5, 'דוגמה 1: {count:5} ⇒ 5');
  n++;

  // 2) קבלות + היסטוריה — 2 קבלות + 2 שורות-חיוב חיוביות ⇒ 4.
  _eq(
    supCount({
      'count': 2,
      'hist': [
        {'a': 100},
        {'a': 50},
      ],
    }),
    4,
    'דוגמה 2: 2+2 ⇒ 4',
  );
  n++;

  // 3) רק שורות-חיוב חיוביות — אפס וזיכוי (a:0 / a:-30) מוחרגים ⇒ 1.
  _eq(
    supCount({
      'count': 0,
      'hist': [
        {'a': 0},
        {'a': -30},
        {'a': 80},
      ],
    }),
    1,
    'דוגמה 3: אפס/זיכוי לא נספרים ⇒ 1',
  );
  n++;

  // 4) אובייקט ריק — count חסר ⇒ 0; hist חסר ⇒ מערך ריק ⇒ 0.
  _eq(supCount(<String, dynamic>{}), 0, 'דוגמה 4: {} ⇒ 0');
  n++;

  // 5) hist ריק לא משבש את המונה ⇒ 3.
  _eq(supCount({'count': 3, 'hist': <dynamic>[]}), 3, 'דוגמה 5: hist ריק ⇒ 3');
  n++;

  // 6) שורת-hist בלי a — (h.a||0)>0 שקר ⇒ לא נספרת ⇒ 1.
  _eq(
    supCount({
      'count': 1,
      'hist': [<String, dynamic>{}],
    }),
    1,
    'דוגמה 6: שורה בלי a ⇒ 1',
  );
  n++;

  // assert חי (הרצה עם --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(supCount({'count': 1}) == 1, 'assert-live guard');

  print('OK supCount: $n asserts passed (מונה כולל היסטוריה; רק a>0 נספר)');
}
