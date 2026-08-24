// רתמת-זהב · hok-effectively-active — מוכיחה את 7 דוגמאות-החוזה (זהות-ביט למקור-ה-JS).
// מייבאת רק את האטום-שלה. אותם קלטים→פלטים של new/atoms/hok-effectively-active.test.mjs.
import 'hok-effectively-active.dart';

const T = '2026-08-24';

void main() {
  // 1) בלי hok / דגל כבוי
  assert(hokEffectivelyActive(<String, Object?>{}, T) == false, 'בלי hok לא false');
  assert(
      hokEffectivelyActive(<String, Object?>{
            'hok': {'active': false}
          }, T) ==
          false,
      'active:false לא false');

  // 2) הו"ק ידני — לפי הדגל בלבד
  assert(
      hokEffectivelyActive(<String, Object?>{
            'hok': {'active': true, 'day': 10}
          }, T) ==
          true,
      'הו"ק ידני פעיל לא true');

  // 3) kevaId בלי hist — סומכים על הדגל
  assert(
      hokEffectivelyActive(<String, Object?>{
            'hok': {'active': true, 'kevaId': 'k1'}
          }, T) ==
          true,
      'keva בלי hist לא true');

  // 4) חיוב-נדרים לפני 2 חודשים בדיוק — על הסף ≤2
  assert(
      hokEffectivelyActive(<String, Object?>{
            'hok': {'active': true, 'kevaId': 'k1'},
            'hist': [
              {'clearer': 'נדרים', 'd': '2026-06-15'}
            ]
          }, T) ==
          true,
      '2 חודשים (סף) לא true');

  // 5) חיוב-נדרים לפני 3 חודשים — פגה
  assert(
      hokEffectivelyActive(<String, Object?>{
            'hok': {'active': true, 'kevaId': 'k1'},
            'hist': [
              {'clearer': 'נדרים', 'd': '2026-05-20'}
            ]
          }, T) ==
          false,
      '3 חודשים לא false');

  // 6) 🐛 נחיל-סולה C7 — חיוב-סולה טרי מחיה
  assert(
      hokEffectivelyActive(<String, Object?>{
            'hok': {'active': true, 'kevaId': 'k1'},
            'hist': [
              {'clearer': 'נדרים', 'd': '2026-04-10'},
              {'clearer': 'סולה', 'd': '2026-07-15'}
            ]
          }, T) ==
          true,
      'חיוב-סולה טרי לא החיה (C7)');

  // 7) חיוב שאינו נדרים/סולה לא מחיה
  assert(
      hokEffectivelyActive(<String, Object?>{
            'hok': {'active': true, 'kevaId': 'k1'},
            'hist': [
              {'clearer': 'אשראי', 'd': '2026-08-01'},
              {'clearer': 'נדרים', 'd': '2026-03-01'}
            ]
          }, T) ==
          false,
      'חיוב-אשראי החיה בטעות');

  print('✓ hok-effectively-active: 7 דוגמאות-חוזה — ירוק');
}
