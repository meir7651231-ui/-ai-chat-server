// בדיקת-חוזה (רתמת-זהב) · decodeCsvBuffer — מייבאת אך ורק את האטום-שלה (חוק-4).
// 6 דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/decode-csv-buffer.test.mjs:
//   ['BOM utf-16le',  [FF,FE,D0,05]              → 'א']
//   ['BOM utf-16be',  [FE,FF,05,D0]              → 'א']
//   ['utf-16le בלי BOM (גדוש-NUL)', u16le('abc,def') → 'abc,def']
//   ['utf-8 עברי תקין', u8('שלום,עולם')          → 'שלום,עולם']
//   ['windows-1255 (utf-8 שבור)', [E0,E1]        → 'אב']
//   ['ריק', []                                    → '']
// עוזרי-הבנייה מדמים את ה-JS: `utf16leNoBom` (c&0xff, c>>8) ו-TextEncoder (utf-8) —
// כאן ממומשים בטהור dart:core (אפס import), כדי שהקלט זהה-לביט למקור. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/decode-csv-buffer_test.dart  ⇒ exit 0
import 'decode-csv-buffer.dart';

// utf16leNoBom של המקור: לכל code-unit — בית-נמוך אז בית-גבוה.
List<int> _u16le(String s) {
  final a = <int>[];
  for (final c in s.codeUnits) {
    a.add(c & 0xff);
    a.add(c >> 8);
  }
  return a;
}

// TextEncoder('utf-8') של המקור: קידוד-runes ל-UTF-8 (BMP מספיק לדוגמאות).
List<int> _u8(String s) {
  final a = <int>[];
  for (final cp in s.runes) {
    if (cp < 0x80) {
      a.add(cp);
    } else if (cp < 0x800) {
      a.add(0xc0 | (cp >> 6));
      a.add(0x80 | (cp & 0x3f));
    } else if (cp < 0x10000) {
      a.add(0xe0 | (cp >> 12));
      a.add(0x80 | ((cp >> 6) & 0x3f));
      a.add(0x80 | (cp & 0x3f));
    } else {
      a.add(0xf0 | (cp >> 18));
      a.add(0x80 | ((cp >> 12) & 0x3f));
      a.add(0x80 | ((cp >> 6) & 0x3f));
      a.add(0x80 | (cp & 0x3f));
    }
  }
  return a;
}

void _eq(String got, String want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=${_q(got)} want=${_q(want)}');
  }
}

// ייצוג-בטוח (code-points) — כדי שתו-החלפה/עברית ייראו בפלט-הכשל.
String _q(String s) => s.runes.map((r) => 'U+${r.toRadixString(16)}').join(' ');

void main() {
  var n = 0;

  // 1 · BOM utf-16le — [FF,FE, D0,05] ⇒ 'א'
  _eq(decodeCsvBuffer([0xff, 0xfe, 0xd0, 0x05]), 'א', 'BOM utf-16le'); n++;

  // 2 · BOM utf-16be — [FE,FF, 05,D0] ⇒ 'א'
  _eq(decodeCsvBuffer([0xfe, 0xff, 0x05, 0xd0]), 'א', 'BOM utf-16be'); n++;

  // 3 · utf-16le בלי BOM (14 בייטים, 7 NUL > 14/5) ⇒ 'abc,def'
  _eq(decodeCsvBuffer(_u16le('abc,def')), 'abc,def', 'utf-16le no BOM'); n++;

  // 4 · utf-8 עברי תקין ⇒ מוחזר זהה
  _eq(decodeCsvBuffer(_u8('שלום,עולם')), 'שלום,עולם', 'utf-8 valid'); n++;

  // 5 · [E0,E1] — לא-חוקי utf-8 (מפיק �) ⇒ נפילה ל-windows-1255 ⇒ 'אב'
  _eq(decodeCsvBuffer([0xe0, 0xe1]), 'אב', 'windows-1255 fallback'); n++;

  // 6 · buffer ריק ⇒ '' (מסלול utf-8)
  _eq(decodeCsvBuffer([]), '', 'empty'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(decodeCsvBuffer([0xe0, 0xe1]) == 'אב', 'assert-live guard');

  print('OK decodeCsvBuffer: $n asserts passed');
}
