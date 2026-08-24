// בדיקת-חוזה (רתמת-זהב) · decodeQuotedPrintable — מייבאת אך ורק את האטום-שלה (חוק-4).
// 12 דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/decode-quoted-printable.test.mjs.
// שם, ה-CASES מקודדים-JSON: `de = JSON.parse`, לכן הגרשיים = תוחמי-JSON ולא חלק
// מהקלט — כאן הומרו לערכי-Dart טהורים (הקלט האמיתי, בלי גרשיים).
//   [["\"\""] → ""]              ⇒ ""            → ""
//   [["\"אבג\""] → "\"???\""]    ⇒ "אבג"         → "???"
//   [["\"כהן לוי\""] …]          ⇒ "כהן לוי"     → "??? ???"
//   … (abc/מייל/תאריכים/טלפונים/URL verbatim) …
//   [["\"שלום עולם\""] …]        ⇒ "שלום עולם"   → "???? ????"
// כל הקלטים חסרי `=` ⇒ ענף-ה-HEX לא נדרס; עברית (>0xFF) ⇒ '?' (0x3F).
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/decode-quoted-printable_test.dart ⇒ exit 0
import 'decode-quoted-printable.dart';

void _eq(String got, String want, String input) {
  if (got != want) {
    throw StateError('FAIL input="$input"\n got ="$got"\n want="$want"');
  }
}

void main() {
  var n = 0;

  // — 12 דוגמאות-החוזה verbatim (הקלט המפוענח → הפלט הצפוי) —
  final cases = <List<String>>[
    ['', ''],
    ['אבג', '???'],
    ['כהן לוי', '??? ???'],
    ['abc', 'abc'],
    ['a@b.com', 'a@b.com'],
    ['2026-08-24', '2026-08-24'],
    ['2026-08-24T12:00:00', '2026-08-24T12:00:00'],
    ['0501234567', '0501234567'],
    ['03-1234567', '03-1234567'],
    ['https://x.co', 'https://x.co'],
    ['שלום עולם', '???? ????'],
    ['12', '12'],
  ];

  for (final c in cases) {
    final input = c[0];
    final want = c[1];
    _eq(decodeQuotedPrintable(input), want, input);
    n++;
  }

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(decodeQuotedPrintable('אבג') == '???', 'assert-live guard');

  print('OK decodeQuotedPrintable: $n asserts passed');
}
