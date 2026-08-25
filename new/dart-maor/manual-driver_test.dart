// בדיקת-חוזה (רתמת-זהב) · manualDriver — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/manual-driver.test.mjs:
//   1) צילום-ערך: JSON.stringify(manualDriver) (בלי callHref — פונקציה מושמטת) ===
//      {"id":"manual","label":"חיוג בלחיצה (טלפון קיים)","capabilities":{"autoDial":false,"record":false,"screenPop":true}}
//   2) callHref: '050-123-4567'→'tel:0501234567' · '+972 50-1234567'→'tel:+972501234567'
//                · ''→null · '12'→null · 'ללא'→null
// אפס import חיצוני (בלי dart:convert) — מסדר-JSON נבנה ידנית כדי לשקף JSON.stringify.
// הרצה: dart run --enable-asserts new/dart-maor/manual-driver_test.dart  ⇒ exit 0
import 'manual-driver.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

// מחקה JSON.stringify עבור מבנה-האטום: משמיט ערכי-פונקציה (כמו JS), סדר-הכנסה נשמר.
String _stringify(dynamic v) {
  if (v is String) return '"$v"';
  if (v is bool) return v ? 'true' : 'false';
  if (v is Map) {
    final buf = StringBuffer('{');
    var first = true;
    v.forEach((k, val) {
      if (val is Function) return; // JSON.stringify משמיט פונקציות
      if (!first) buf.write(',');
      first = false;
      buf.write('"$k":${_stringify(val)}');
    });
    buf.write('}');
    return buf.toString();
  }
  return v.toString();
}

String? _callHref(String? phone) =>
    (manualDriver['callHref'] as String? Function(String?))(phone);

void main() {
  var n = 0;

  // 1) צילום-ערך — זהה למחרוזת-הצילום שבמקור-ה-JS.
  const snap =
      '{"id":"manual","label":"חיוג בלחיצה (טלפון קיים)","capabilities":{"autoDial":false,"record":false,"screenPop":true}}';
  _ok(_stringify(manualDriver) == snap, 'manualDriver סטה מהצילום'); n++;

  // 2) callHref — חמש דוגמאות-מקור (callbtn-telephony.test.ts).
  final cases = <List<String?>>[
    ['050-123-4567', 'tel:0501234567'],
    ['+972 50-1234567', 'tel:+972501234567'],
    ['', null],
    ['12', null],
    ['ללא', null],
  ];
  for (final c in cases) {
    final inp = c[0], exp = c[1];
    final got = _callHref(inp);
    _ok(got == exp, 'callHref($inp) = $got ≠ $exp'); n++;
  }

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(_callHref('050-123-4567') == 'tel:0501234567', 'assert-live guard');

  print('OK manualDriver: $n asserts passed');
}
