// בדיקת-חוזה (רתמת-זהב) · palette — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/palette.test.mjs:
//   (א) הפלטה אינה ריקה.
//   (ב) כל ערך ליטרלי — תואם /^#|^rgb|^hsl|^oklch/.
//   (ג) אין var( בשום ערך (חיווט בתוך אטום אסור).
//   (ד) אין ערך כפול (Set(vals).size === vals.length).
// אותם קלטים→פלטים כמו ה-JS. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/palette_test.dart  ⇒ exit 0
import 'palette.dart';

final RegExp _literal = RegExp(r'^#|^rgb|^hsl|^oklch');
final RegExp _wire = RegExp(r'var\(');

void main() {
  var n = 0;
  final vals = palette.values.toList();

  // (א) — לא ריקה
  if (vals.isEmpty) throw StateError('FAIL: פלטה ריקה');
  assert(vals.isNotEmpty);
  n++;

  // (ב) + (ג) — כל ערך ליטרלי, אפס חיווט var()
  palette.forEach((k, v) {
    if (!_literal.hasMatch(v)) throw StateError('FAIL: לא-ליטרלי: $k=$v');
    if (_wire.hasMatch(v)) throw StateError('FAIL: חיווט בתוך אטום: $k');
    assert(_literal.hasMatch(v) && !_wire.hasMatch(v));
    n++;
  });

  // (ד) — אפס כפילות-ערך
  if (vals.toSet().length != vals.length) {
    throw StateError('FAIL: ערך כפול בפלטה');
  }
  assert(vals.toSet().length == vals.length);
  n++;

  print('OK palette: ${vals.length} פיגמנטים טהורים — ייחודיים, ליטרליים, אפס-חיווט ($n asserts)');
}
