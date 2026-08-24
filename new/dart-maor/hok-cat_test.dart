// בדיקת-חוזה (רתמת-זהב) · hokCat — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמת-החוזה זהה ביט-אחר-ביט למקור-ה-JS new/atoms/hok-cat.test.mjs:
//   SNAP = {"HOK_CAT":"\"הו\\\"ק\""}  ⇒  JSON.stringify(HOK_CAT) === '"הו\"ק"'
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/hok-cat_test.dart  ⇒ exit 0
// אפס import של dart:convert — JSON.stringify של מחרוזת ממומש ידנית (סמנטיקה זהה).
import 'hok-cat.dart';

// צילום-הערך verbatim מ-hok-cat.test.mjs: SNAP["HOK_CAT"] אחרי פענוח מ-JS.
// זהו הפלט הצפוי של JSON.stringify על הקבוע: " הו \" ק " (7 תווים).
const String _SNAP = '"הו\\"ק"';

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
  _eq(_jsonStr(hokCat), _SNAP, 'HOK_CAT snapshot'); n++;

  // — הערך הגולמי: 4 תווים he·vav·quote·qof (חיזוק ישיר של המקור) —
  _eq(hokCat, 'הו"ק', 'raw value'); n++;
  if (hokCat.runes.length != 4) {
    throw StateError('FAIL: length ${hokCat.runes.length} != 4');
  }
  n++;
  // התו הבודד הבעייתי (מרכאה) קיים במקום הנכון ⇒ מבריח נכון ב-JSON.
  if (hokCat.codeUnitAt(2) != 0x22) {
    throw StateError('FAIL: char[2] != quote');
  }
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(_jsonStr(hokCat) == _SNAP, 'assert-live guard');

  print('OK hokCat: $n asserts passed');
}
