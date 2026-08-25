// בדיקת-חוזה (רתמת-זהב) · isGrantableFeature — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/is-grantable-feature.test.mjs
// (בכולן S = Set(['supporters.delete','families.delete','courses.bulkadmin'])):
//   1) 'supporters.delete'  ⇒ true   — ברשימה.
//   2) 'families.delete'    ⇒ true   — ברשימה.
//   3) 'supporters.export'  ⇒ false  — דגל רגיל (הגבלה-בלבד).
//   4) ''                   ⇒ false  — ריק לעולם אינו ברשימה.
//   5) 'Supporters.Delete'  ⇒ false  — רגיש-רישיות, אין נירמול.
// המרה: JS Set.has ⇒ Dart Set.contains. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/is-grantable-feature_test.dart  ⇒ exit 0
import 'is-grantable-feature.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  final s = {'supporters.delete', 'families.delete', 'courses.bulkadmin'};

  // רשימת דוגמאות-החוזה: [key, expected]
  final cases = <List<Object>>[
    ['supporters.delete', true],
    ['families.delete', true],
    ['supporters.export', false],
    ['', false],
    ['Supporters.Delete', false],
  ];

  for (final c in cases) {
    final key = c[0] as String;
    final want = c[1] as bool;
    final got = isGrantableFeature(key, s);
    _ok(got == want, '"$key" ⇒ $got ≠ $want');
    n++;
  }

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(isGrantableFeature('supporters.delete', s), 'assert-live guard');
  assert(!isGrantableFeature('', s), 'assert-live guard empty');

  print('OK isGrantableFeature: $n asserts passed');
}
