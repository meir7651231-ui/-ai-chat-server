// בדיקת-חוזה (רתמת-זהב) · providerClearer — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/provider-clearer.test.mjs:
//   'sola'⇒'סולה' · 'SolaPay'⇒'סולה' · 'nedarim'⇒'נדרים' ·
//   undefined(=null)⇒'נדרים' · ''⇒'נדרים' · 'שטויות'⇒'נדרים'.
// המרה: JS undefined ⇒ Dart null (הקלט undefined בבדיקת-ה-JS מומר ל-null). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/provider-clearer_test.dart  ⇒ exit 0
import 'provider-clearer.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  // שש דוגמאות-החוזה, אותם קלטים→פלטים כמו במקור-ה-JS (undefined⇒null).
  final cases = <List<Object?>>[
    ['sola', 'סולה'],
    ['SolaPay', 'סולה'],
    ['nedarim', 'נדרים'],
    [null, 'נדרים'], // JS undefined
    ['', 'נדרים'],
    ['שטויות', 'נדרים'],
  ];

  for (final c in cases) {
    final input = c[0] as String?;
    final want = c[1] as String;
    final got = providerClearer(input);
    _ok(got == want, '${input == null ? 'null' : '"$input"'} ⇒ "$got" ≠ "$want"');
    n++;
  }

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(providerClearer('SolaPay') == 'סולה', 'assert-live guard');

  print('OK providerClearer: $n asserts passed');
}
