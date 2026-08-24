// בדיקת-חוזה · validEmail — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/valid_email_test.dart
import 'valid_email.dart';

void _eq(bool got, bool want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
  assert(got == want, 'assert [$label]');
}

void main() {
  var n = 0;

  // — קלט תקין: הצורה x@y.z —
  _eq(validEmail('x@y.z'), true, '1 minimal L@D.T');                       n++;
  _eq(validEmail('a@b.c'), true, '2 single-char segments');               n++;
  _eq(validEmail(' a@b.co '), true, '3 edge spaces trimmed');             n++;
  _eq(validEmail('user.name@sub.example.com'), true, '4 inner dots ok');  n++;
  _eq(validEmail('\ta@b.c\n'), true, '5 edge tab+newline trimmed');       n++;

  // — קלט פסול: חוסר-@ / חוסר-נקודה / מקטע-ריק —
  _eq(validEmail(''), false, '6 empty');                                  n++;
  _eq(validEmail('abc'), false, '7 no @');                                n++;
  _eq(validEmail('a@bc'), false, '8 no dot in domain');                   n++;
  _eq(validEmail('@b.c'), false, '9 empty local part');                   n++;
  _eq(validEmail('a@.c'), false, '10 empty domain before dot');           n++;
  _eq(validEmail('a@b.'), false, '11 empty tld');                         n++;

  // — עדשה-עוינת: רווח פנימי / @ כפול (trim=קצה בלבד) —
  _eq(validEmail('a b@c.d'), false, '12 inner space in local');           n++;
  _eq(validEmail('a@@b.c'), false, '13 double @');                        n++;
  _eq(validEmail('a@b c.d'), false, '14 inner space in domain');          n++;
  _eq(validEmail('a@b\t.c'), false, '15 inner tab is \\s');               n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(validEmail('x@y.z') == true, 'assert-live guard');

  print('OK validEmail: $n asserts passed');
}
