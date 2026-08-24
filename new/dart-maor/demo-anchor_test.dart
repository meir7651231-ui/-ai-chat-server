// בדיקת-חוזה (רתמת-זהב) · demoAnchor — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמת-החוזה זהה ביט-אחר-ביט למקור-ה-JS new/atoms/demo-anchor.test.mjs:
//   SNAP = {"DEMO_ANCHOR":"\"2026-08-02\""}  ⇒  JSON.stringify(DEMO_ANCHOR) === '"2026-08-02"'
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/demo-anchor_test.dart  ⇒ exit 0
// אפס import של dart:convert — JSON.stringify של מחרוזת ממומש ידנית (סמנטיקה זהה).
import 'demo-anchor.dart';

// צילום-הערך verbatim מ-demo-anchor.test.mjs: SNAP["DEMO_ANCHOR"] אחרי פענוח מ-JS.
// זהו הפלט הצפוי של JSON.stringify על הקבוע: "2026-08-02" (12 תווים כולל המרכאות).
const String _SNAP = '"2026-08-02"';

// סריאליזציה זהה ל-JSON.stringify עבור מחרוזת (עוטף במרכאות, מבריח \ " ובקרה).
String _jsonStr(String s) {
  final b = StringBuffer('"');
  for (final r in s.runes) {
    if (r == 0x22) {
      b.write('\\"');
    } else if (r == 0x5C) {
      b.write('\\\\');
    } else if (r == 0x08) {
      b.write('\\b');
    } else if (r == 0x09) {
      b.write('\\t');
    } else if (r == 0x0A) {
      b.write('\\n');
    } else if (r == 0x0C) {
      b.write('\\f');
    } else if (r == 0x0D) {
      b.write('\\r');
    } else if (r < 0x20) {
      b.write('\\u${r.toRadixString(16).padLeft(4, '0')}');
    } else {
      b.writeCharCode(r);
    }
  }
  b.write('"');
  return b.toString();
}

void _eq(String got, String want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]:\n got =$got\n want=$want');
  }
}

void main() {
  var n = 0;

  // — צילום-הערך verbatim: JSON.stringify של הקבוע זהה-ביט לצילום ה-JS —
  _eq(_jsonStr(demoAnchor), _SNAP, 'DEMO_ANCHOR snapshot'); n++;

  // — הערך הגולמי: מחרוזת-ISO '2026-08-02' (חיזוק ישיר של המקור) —
  _eq(demoAnchor, '2026-08-02', 'raw value'); n++;

  // — תבנית ISO תקינה: YYYY-MM-DD, 10 תווים —
  if (demoAnchor.runes.length != 10) {
    throw StateError('FAIL: length ${demoAnchor.runes.length} != 10');
  }
  n++;
  if (!RegExp(r'^\d{4}-\d{2}-\d{2}$').hasMatch(demoAnchor)) {
    throw StateError('FAIL: not ISO YYYY-MM-DD');
  }
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(_jsonStr(demoAnchor) == _SNAP, 'assert-live guard');

  print('OK demoAnchor: $n asserts passed');
}
