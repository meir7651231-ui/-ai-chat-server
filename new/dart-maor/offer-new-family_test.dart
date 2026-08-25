// רתמת-הזהב · offer-new-family — בדיוק 6 דוגמאות-החוזה מ-new/atoms/offer-new-family.test.mjs.
// מימוש-שקע לבדיקה: lowercase + הסרת כל הרווחים (רוח normNameLocal במקור).
// אם עובר, Dart ≡ JS. הרצה: dart run --enable-asserts offer-new-family_test.dart
import 'offer-new-family.dart';

// שקע normName לבדיקה — מקביל ל-JS: String(s).toLowerCase().replace(/\s/g, '')
String normName(dynamic s) =>
    s.toString().toLowerCase().replaceAll(RegExp(r'\s'), '');

void main() {
  final fams = <Map<String, dynamic>>[
    {'name': 'כהן לוי'},
  ];

  // [families, q, expected] — זהים לדוגמאות-החוזה של ה-JS
  assert(offerNewFamily(fams, 'כהןלוי', normName) == false);
  assert(offerNewFamily(fams, 'כהן לוי ', normName) == false);
  assert(offerNewFamily(fams, 'מזרחי', normName) == true);
  assert(offerNewFamily(fams, 'ל', normName) == false);
  assert(offerNewFamily(fams, '  ל ', normName) == false);
  assert(offerNewFamily(<Map<String, dynamic>>[], 'אב', normName) == true);

  print('✓ offer-new-family (Dart): 6 דוגמאות-חוזה (שקע normName) — ירוק');
}
