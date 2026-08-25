// בדיקת-חוזה (רתמת-זהב) · icons — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/icons.test.mjs:
//   1) Object.keys(ICONS).length >= 100          (בדיקת ks.length<100 ⇒ כשל)
//   2) לכל מפתח k:  ICONS[k] > 0                  (הלולאה: !(ICONS[k]>0) ⇒ כשל)
// דוגמאות-עוגן נוספות מהמקור (icons.mjs) לשמירת זהות-ביט:
//   3) icons['🔧'] == 797   (המפתח הראשון/הכי-שכיח)
//   4) icons['🧻'] == 1      (המפתח האחרון)
//   5) אין ערך <= 0, ואין מפתח כפול
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/icons_test.dart  ⇒ exit 0
import 'icons.dart';

void main() {
  var n = 0;
  final m = icons;
  final ks = m.keys.toList();

  // 1) לפחות 100 מפתחות (המקור: ks.length<100 ⇒ process.exit(1)).
  assert(!(ks.length < 100), 'FAIL: מעט מדי — ${ks.length} < 100');
  n++;

  // 2) לכל מפתח, המונה > 0 (המקור: for(k) if(!(ICONS[k]>0)) f=1).
  for (final k in ks) {
    assert(m[k]! > 0, "FAIL: '$k' לא > 0 (=${m[k]})");
  }
  n++;

  // 3) עוגן ראשון — הסמל הכי-שכיח.
  assert(m['🔧'] == 797, "FAIL: '🔧' ≠ 797 (=${m['🔧']})");
  n++;

  // 4) עוגן אחרון.
  assert(m['🧻'] == 1, "FAIL: '🧻' ≠ 1 (=${m['🧻']})");
  n++;

  // 5) אין ערך <= 0 (עקביות מלאה עם הלולאה, מנוסח כתנאי-מפורש).
  for (final e in m.entries) {
    assert(e.value > 0, "FAIL: ערך לא-חיובי ל-'${e.key}': ${e.value}");
  }
  n++;

  print('OK icons: $n asserts passed · ${ks.length} סמלים');
}
