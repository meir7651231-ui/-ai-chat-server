// רתמת-זהב · ageOf — Dart≡JS. מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה **בדיוק** כמו new/atoms/age-of.test.mjs (אותם קלטים→פלטים).
// הרצה: dart run --enable-asserts new/dart-maor/age-of_test.dart
import 'age-of.dart';

// השעון-המוזרק — verbatim מבדיקת-ה-JS: new Date('2026-08-24T12:00:00').
final DateTime _now = DateTime.parse('2026-08-24T12:00:00');

void _eq(int? got, int? want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  // C = [['2000-08-24',26],['2000-08-25',25],['2000-08-23',26],['',null],['שבור',null]]
  _eq(ageOf('2000-08-24', _now), 26, 'birthday-today');   n++;
  _eq(ageOf('2000-08-25', _now), 25, 'tomorrow');         n++;
  _eq(ageOf('2000-08-23', _now), 26, 'yesterday');        n++;
  _eq(ageOf('', _now), null, 'empty');                    n++;
  _eq(ageOf('שבור', _now), null, 'broken');               n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(ageOf('2000-08-24', _now) == 26, 'assert-live guard');

  print('OK ageOf: $n asserts passed');
}
