// בדיקת-חוזה · sizeMatchFrom — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/size_match_from_test.dart
import 'size_match_from.dart';

void _eq(SizeMatch got, SizeMatch want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  // — התאמות name-for-name (verbatim מ-enum שם:23) —
  _eq(sizeMatchFrom('exactSame'), SizeMatch.exactSame, '1 exactSame');     n++;
  _eq(sizeMatchFrom('anyToAny'), SizeMatch.anyToAny, '2 anyToAny');        n++;
  _eq(sizeMatchFrom('tableLookup'), SizeMatch.tableLookup, '3 tableLookup'); n++;

  // — עדשה-עוינת (CURRICULUM #6): null / ריק / רישיות / רווח / לא-String ⇒ default exactSame —
  _eq(sizeMatchFrom(null), SizeMatch.exactSame, '4 null ⇒ default');       n++;
  _eq(sizeMatchFrom(''), SizeMatch.exactSame, '5 empty ⇒ default');        n++;
  _eq(sizeMatchFrom('ExactSame'), SizeMatch.exactSame, '6 wrong-case E');  n++;
  _eq(sizeMatchFrom('anytoany'), SizeMatch.exactSame, '7 wrong-case a');   n++;
  _eq(sizeMatchFrom('tableLookup '), SizeMatch.exactSame, '8 trailing-space'); n++;
  _eq(sizeMatchFrom('foo'), SizeMatch.exactSame, '9 unknown ⇒ default');   n++;
  _eq(sizeMatchFrom(5), SizeMatch.exactSame, '10 int ⇒ default');          n++;
  _eq(sizeMatchFrom(true), SizeMatch.exactSame, '11 bool ⇒ default');      n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(sizeMatchFrom('anyToAny') == SizeMatch.anyToAny, 'assert-live guard');

  print('OK sizeMatchFrom: $n asserts passed');
}
