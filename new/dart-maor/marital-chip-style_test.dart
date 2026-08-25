// בדיקת-חוזה (רתמת-זהב) · maritalChipStyle — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/marital-chip-style.test.mjs:
//   probe = (bg,c) => [bg,c]; ‏6 מקרים (4 מוכרים · 'רווק' לא-מוכר · '' ריק).
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/marital-chip-style_test.dart  ⇒ exit 0
import 'marital-chip-style.dart';

// שקע-בוחן — מחזיר את הזוג שנבחר (זהה ל-probe של ה-JS).
List<String> _probe(String bg, String c) => [bg, c];

void _eq(List<String> got, List<String> want, String label) {
  if (got.length != want.length || got[0] != want[0] || got[1] != want[1]) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  // — שש דוגמאות-החוזה verbatim (marital-chip-style.test.mjs) —
  _eq(maritalChipStyle('נשואים', _probe), ['#e6f4ea', '#1e7a3a'], '1 married');   n++;
  _eq(maritalChipStyle('אלמן/ה', _probe), ['#eef1f5', '#4a5568'], '2 widow');     n++;
  _eq(maritalChipStyle('גרושים', _probe), ['#fdecec', '#b4433a'], '3 divorced');  n++;
  _eq(maritalChipStyle('פרודים', _probe), ['#fff4e5', '#a15c00'], '4 separated'); n++;
  _eq(maritalChipStyle('רווק', _probe), ['#eef1f5', '#4a5568'], '5 single->default'); n++;
  _eq(maritalChipStyle('', _probe), ['#eef1f5', '#4a5568'], '6 empty->default');  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(maritalChipStyle('נשואים', _probe)[1] == '#1e7a3a', 'assert-live guard');

  print('OK maritalChipStyle: $n asserts passed');
}
