// בדיקת-חוזה · contractorCredit — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/contractor_credit_test.dart
import 'contractor_credit.dart';

void _eq(int got, int want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void _true(bool c, String label) {
  if (!c) throw StateError('FAIL [$label]');
}

void main() {
  var n = 0;

  // — golden: מחרוזת-ריקה (hashCode==1 קבוע ב-Dart VM) —
  _eq(contractorCredit(''), 30000, '1 empty->30000');
  n++;

  // — golden נצפים (SDK 3.5.4, hashCode דטרמיניסטי) —
  _eq(contractorCredit('a'), 32800, '2 a');
  n++;
  _eq(contractorCredit('אבי'), 119600, '3 avi');
  n++;
  _eq(contractorCredit('דוד לוי'), 33900, '4 david-levi');
  n++;

  // — אינווריאנטות-מקור: טווח + עיגול-100 + אידמפוטנטיות —
  for (final s in ['', 'a', 'אבי', 'דוד לוי', 'קבלן ראשי בע"מ', 'zzzz', '12345']) {
    final v = contractorCredit(s);
    _true(v >= 30000 && v <= 120000, 'range "$s" -> $v');
    n++;
    _true(v % 100 == 0, 'round100 "$s" -> $v');
    n++;
    _eq(contractorCredit(s), v, 'idempotent "$s"');
    n++;
  }

  assert(contractorCredit('') == 30000, 'assert-live guard');

  print('OK contractorCredit: $n asserts passed');
}
