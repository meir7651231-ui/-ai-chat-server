// בדיקת-חוזה (רתמת-זהב) · netCheckScript — מייבאת אך ורק את האטום-שלה (חוק-4).
// ארבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/net-check-script.test.mjs
// (אותם קלטים→פלטים, מומרים לערכי-Dart):
//   1) [{amount:100}]  ⇒ נוסח עם שורה '• undefined' יחידה
//   2) ["2026-08-24"]  ⇒ אותו נוסח (String חסר-ok/domain ⇒ undefined)
//   3) []              ⇒ '' (אין חסומות)
//   4) ["א","ב"]       ⇒ נוסח עם שתי שורות '• undefined'
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/net-check-script_test.dart  ⇒ exit 0
import 'net-check-script.dart';

const _head1 = 'שלום, אני משתמש/ת במערכת ניהול לעמותה לצורכי עבודה,';
const _head2 = 'ואבקש לפתוח את הכתובות הבאות (כלי-עבודה, ללא תוכן גולשים):';
const _tail = 'תודה רבה!';

void main() {
  var n = 0;

  // 1) [{amount:100}] — אלמנט-Map ללא ok/domain ⇒ חסום, domain=undefined.
  final want1 = [_head1, _head2, '• undefined', _tail].join('\n');
  final got1 = netCheckScript([
    {'amount': 100}
  ]);
  assert(got1 == want1, 'FAIL case1:\n$got1\n≠\n$want1');
  n++;

  // 2) ["2026-08-24"] — אלמנט-String ללא ok/domain ⇒ חסום, domain=undefined.
  final want2 = [_head1, _head2, '• undefined', _tail].join('\n');
  final got2 = netCheckScript(['2026-08-24']);
  assert(got2 == want2, 'FAIL case2:\n$got2\n≠\n$want2');
  n++;

  // 3) [] — אין תוצאות ⇒ מחרוזת-ריקה.
  final got3 = netCheckScript(<dynamic>[]);
  assert(got3 == '', "FAIL case3: '$got3' ≠ ''");
  n++;

  // 4) ["א","ב"] — שני Strings חסומים ⇒ שתי שורות '• undefined'.
  final want4 =
      [_head1, _head2, '• undefined', '• undefined', _tail].join('\n');
  final got4 = netCheckScript(['א', 'ב']);
  assert(got4 == want4, 'FAIL case4:\n$got4\n≠\n$want4');
  n++;

  print('OK netCheckScript: $n asserts passed');
}
