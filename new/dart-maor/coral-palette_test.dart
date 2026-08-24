// בדיקת-חוזה (רתמת-זהב) · coralPalette — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמת-החוזה זהה ביט-אחר-ביט למקור-ה-JS new/atoms/coral-palette.test.mjs:
//   הצילום SNAP.CORAL_PALETTE = JSON.stringify(CORAL_PALETTE) =
//   {"c1":"#EC9C9C","c2":"#D97F7F","c3":"#B95F5F","word":"#E29392","ink":"#33272A",
//    "paper":"#FFFCFA","cream":"#FBF1EF","blush":"#FFF3F0","marquee":"#F9E4E1",
//    "rgb1":"236,156,156","rgb2":"217,127,127","inkRgb":"51,39,42"}
// אנו משחזרים אותה סריאליזציה תלוית-סדר (בלי dart:convert — חוק-1: אפס-import)
// ומשווים לצילום המילולי. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/coral-palette_test.dart  ⇒ exit 0
import 'coral-palette.dart';

// הצילום המילולי מבדיקת-ה-JS — מקור-האמת.
const _snap =
    '{"c1":"#EC9C9C","c2":"#D97F7F","c3":"#B95F5F","word":"#E29392","ink":"#33272A",'
    '"paper":"#FFFCFA","cream":"#FBF1EF","blush":"#FFF3F0","marquee":"#F9E4E1",'
    '"rgb1":"236,156,156","rgb2":"217,127,127","inkRgb":"51,39,42"}';

// שחזור JSON.stringify עבור מפת-מחרוזות פשוטה (ערכים בלי תווים-מיוחדים),
// תלוי-סדר-הכנסה — בדיוק כפי ש-JSON.stringify מסדר object.
String _stringify(Map<String, String> m) {
  final parts = <String>[];
  m.forEach((k, v) => parts.add('"$k":"$v"'));
  return '{' + parts.join(',') + '}';
}

void _eq(String got, String want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]:\n got =$got\n want=$want');
  }
}

void main() {
  var n = 0;

  // — דוגמת-החוזה verbatim: הצילום תלוי-הסדר תואם ביט-אחר-ביט —
  _eq(_stringify(coralPalette), _snap, 'CORAL_PALETTE snapshot');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(_stringify(coralPalette) == _snap, 'assert-live guard');

  print('OK coralPalette: $n asserts passed');
}
