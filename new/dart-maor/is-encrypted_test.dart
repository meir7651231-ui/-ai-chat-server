// בדיקת-חוזה (רתמת-זהב) · isEncrypted — מייבאת אך ורק את האטום-שלה (חוק-4).
// שבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/is-encrypted.test.mjs:
//   1) {$enc:2, iter:600000, data:'...'}  ⇒ true   (מעטפת מלאה)
//   2) {$enc:2}                            ⇒ true   ($enc===2 מספיק)
//   3) {$enc:1}                            ⇒ false  (מספר שונה)
//   4) {$enc:'2'}                          ⇒ false  (מחרוזת ≠ מספר, strict)
//   5) null                                ⇒ false  (!!raw)
//   6) '{"$enc":2}'                        ⇒ false  (מחרוזת אינה object)
//   7) {}                                  ⇒ false  ($enc חסר → undefined/null ≠ 2)
// המרה: === של JS ⇒ == ב-Dart (String≠int בלי throw); `$enc` ⇒ מפתח r'$enc'.
// הרצה: dart run --enable-asserts new/dart-maor/is-encrypted_test.dart  ⇒ exit 0
import 'is-encrypted.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  final cases = <List<dynamic>>[
    [{r'$enc': 2, 'iter': 600000, 'data': '...'}, true],
    [{r'$enc': 2}, true],
    [{r'$enc': 1}, false],
    [{r'$enc': '2'}, false],
    [null, false],
    ['{"\$enc":2}', false],
    [<String, dynamic>{}, false],
  ];

  for (final c in cases) {
    final input = c[0];
    final want = c[1] as bool;
    final got = isEncrypted(input);
    _ok(got == want, '$input ⇒ $got ≠ $want');
    n++;
  }

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(isEncrypted({r'$enc': 2}) == true, 'assert-live guard');
  assert(isEncrypted({r'$enc': '2'}) == false, 'assert-live guard strict');

  print('OK isEncrypted: $n asserts passed');
}
