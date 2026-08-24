// רתמת-זהב · couponExpiry — Dart≡JS. מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה **בדיוק** כמו new/atoms/coupon-expiry.test.mjs (אותם קלטים→פלטים).
// הרצה: dart run --enable-asserts new/dart-maor/coupon-expiry_test.dart
import 'coupon-expiry.dart';

// שקע isoOf מקומי — verbatim מבדיקת-ה-JS (getFullYear/getMonth+1/getDate + pad2).
// הערת-פורט getMonth 0↔1: ב-JS `getMonth()+1`; ב-Dart `.month` כבר 1-מבוסס ⇒ בלי +1.
String _p2(int n) => n.toString().padLeft(2, '0');
String _isoOf(DateTime d) => '${d.year}-${_p2(d.month)}-${_p2(d.day)}';

void _eq(String got, String want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=\'$got\' want=\'$want\'');
  }
}

void main() {
  var n = 0;

  // C = [
  //   [{since:'2026-08-01'}, {validDays:30}, '2026-08-31'],
  //   [{since:'2026-08-20'}, {validDays:15}, '2026-09-04'],  // גלישת-חודש
  //   [{since:'2026-12-20'}, {validDays:15}, '2027-01-04'],  // גלישת-שנה
  //   [{since:'2026-08-01'}, {validDays:0},  ''],            // אפס = אין-תוקף
  //   [{since:'2026-08-01'}, {},             ''],            // בלי validDays
  //   [{since:''},           {validDays:7},  ''],            // בלי since
  // ]
  _eq(couponExpiry({'since': '2026-08-01'}, {'validDays': 30}, _isoOf), '2026-08-31', 'plain-30'); n++;
  _eq(couponExpiry({'since': '2026-08-20'}, {'validDays': 15}, _isoOf), '2026-09-04', 'month-roll'); n++;
  _eq(couponExpiry({'since': '2026-12-20'}, {'validDays': 15}, _isoOf), '2027-01-04', 'year-roll'); n++;
  _eq(couponExpiry({'since': '2026-08-01'}, {'validDays': 0}, _isoOf), '', 'zero-days'); n++;
  _eq(couponExpiry({'since': '2026-08-01'}, {}, _isoOf), '', 'no-validDays'); n++;
  _eq(couponExpiry({'since': ''}, {'validDays': 7}, _isoOf), '', 'no-since'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(couponExpiry({'since': '2026-08-01'}, {'validDays': 30}, _isoOf) == '2026-08-31',
      'assert-live guard');

  print('OK couponExpiry: $n asserts passed');
}
