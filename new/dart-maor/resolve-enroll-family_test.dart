// רתמת-זהב · resolve-enroll-family — בדיוק 6 דוגמאות-החוזה של בדיקת-ה-JS
// (new/atoms/resolve-enroll-family.test.mjs). אם עובר ⇒ Dart ≡ JS.
// הרצה: dart run --enable-asserts resolve-enroll-family_test.dart  ⇒ exit 0.

import 'resolve-enroll-family.dart';

// שקע-normName כמתועד בחוזה: lowercase + הסרת רווחים ומקפים (זהה לבדיקת-ה-JS).
String normName(String s) => s.toLowerCase().replaceAll(RegExp(r'[\s\-]'), '');

void main() {
  final F = <Map<String, dynamic>>[
    {'id': 'f1', 'name': 'כהן'},
    {'id': 'f2', 'name': 'לוי-מזרחי'},
  ];

  // הסנטינל
  assert(enrollNewFamily == '__new', 'הסנטינל אינו __new');

  // 1 — id קיים מנצח, השם לא נבדק
  {
    final r = resolveEnrollFamily(F, 'f2', '', normName);
    assert(identical(r['fam'], F[1]) && r['create'] == false, 'דוגמה 1: $r');
  }
  // 2 — '__new' עם שם שמתאחד בנרמול ⇒ הקיימת, בלי כפילות
  {
    final r = resolveEnrollFamily(F, '__new', 'לוי מזרחי', normName);
    assert(identical(r['fam'], F[1]) && r['create'] == false, 'דוגמה 2: $r');
  }
  // 3 — שם חדש באמת ⇒ יצירה
  {
    final r = resolveEnrollFamily(F, '__new', 'אברהם', normName);
    assert(r['fam'] == null && r['create'] == true, 'דוגמה 3: $r');
  }
  // 4 — שם-ריק אחרי trim ⇒ לא יוצרים
  {
    final r = resolveEnrollFamily(F, '__new', '   ', normName);
    assert(r['fam'] == null && r['create'] == false, 'דוגמה 4: $r');
  }
  // 5 — id לא-מוכר שאינו הסנטינל
  {
    final r = resolveEnrollFamily(F, 'f9', 'אברהם', normName);
    assert(r['fam'] == null && r['create'] == false, 'דוגמה 5: $r');
  }
  // 6 — רשימה ריקה ⇒ תמיד יצירה
  {
    final r = resolveEnrollFamily(<Map<String, dynamic>>[], '__new', 'כהן', normName);
    assert(r['fam'] == null && r['create'] == true, 'דוגמה 6: $r');
  }

  print('✓ resolve-enroll-family (Dart): 6 דוגמאות-חוזה — ירוק');
}
