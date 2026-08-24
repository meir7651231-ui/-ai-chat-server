// רתמת-זהב · isoToday — Dart≡JS. מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה **בדיוק** כמו new/atoms/iso-today.test.mjs (אותם קלטים→פלטים).
// הרצה: dart run --enable-asserts new/dart-maor/iso-today_test.dart
import 'iso-today.dart';

// שקע isoLocal מקומי אמיתי — verbatim מבדיקת-ה-JS (getFullYear/getMonth+1/getDate + pad2).
// הערת-פורט getMonth 0↔1: ב-JS `getMonth()+1`; ב-Dart `.month` כבר 1-מבוסס ⇒ בלי +1.
// הקלט תואם: JS `new Date(2026,7,...)` (חודש-אינדקס 7=אוגוסט) = Dart `DateTime(2026,8,...)`.
String _p2(int n) => n.toString().padLeft(2, '0');
String _isoLocal(DateTime d) => '${d.year}-${_p2(d.month)}-${_p2(d.day)}';

void _eq(String got, String want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  // C = [
  //   [new Date(2026,7,24,12,0), '2026-08-24'],
  //   [new Date(2026,0,5,9,30),  '2026-01-05'],
  //   [new Date(2026,7,24,0,30), '2026-08-24'],  // אחרי-חצות מקומי — נשאר היום המקומי
  //   [new Date(2026,11,31,23,59),'2026-12-31'],
  // ]
  _eq(isoToday(_isoLocal, DateTime(2026, 8, 24, 12, 0)), '2026-08-24', 'noon');           n++;
  _eq(isoToday(_isoLocal, DateTime(2026, 1, 5, 9, 30)), '2026-01-05', 'pad-zeros');       n++;
  _eq(isoToday(_isoLocal, DateTime(2026, 8, 24, 0, 30)), '2026-08-24', 'after-midnight'); n++;
  _eq(isoToday(_isoLocal, DateTime(2026, 12, 31, 23, 59)), '2026-12-31', 'year-end');     n++;

  // דוגמה 5 — ברירת-מחדל now=עכשיו: תואם תבנית ושווה ל-isoLocal(עכשיו).
  final def = isoToday(_isoLocal);
  if (!RegExp(r'^\d{4}-\d{2}-\d{2}$').hasMatch(def) || def != _isoLocal(DateTime.now())) {
    throw StateError('FAIL [default]: $def');
  }
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(isoToday(_isoLocal, DateTime(2026, 8, 24, 12, 0)) == '2026-08-24', 'assert-live guard');

  print('OK isoToday: $n asserts passed');
}
