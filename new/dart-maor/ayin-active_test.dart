// בדיקת-חוזה (רתמת-זהב) · ayinActive — מייבאת אך ורק את האטום-שלה (חוק-4).
// 12 דוגמאות-הגולדן זהות ביט-אחר-ביט למקור-ה-JS new/atoms/ayin-active.test.mjs:
//   ""                     ⇒ false   (מחרוזת-ריקה = falsy)
//   כל מחרוזת לא-ריקה       ⇒ true    (שדה-stage=undefined ⇒ '!== new' ⇒ true)
// הרצה: dart run --enable-asserts new/dart-maor/ayin-active_test.dart  ⇒ exit 0
import 'ayin-active.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  // הקלטות-הגולדן: [קלט, פלט-צפוי] — אותם ערכים בדיוק כמו ב-JS.
  final cases = <List<Object?>>[
    ['', false],
    ['אבג', true],
    ['כהן לוי', true],
    ['abc', true],
    ['a@b.com', true],
    ['2026-08-24', true],
    ['2026-08-24T12:00:00', true],
    ['0501234567', true],
    ['03-1234567', true],
    ['https://x.co', true],
    ['שלום עולם', true],
    ['12', true],
  ];

  for (final c in cases) {
    final got = ayinActive(c[0]);
    _ok(got == c[1], '${c[0]} ⇒ $got ≠ ${c[1]}');
    n++;
  }

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(ayinActive('') == false, 'assert-live guard');

  print('OK ayinActive: $n golden asserts passed');
}
