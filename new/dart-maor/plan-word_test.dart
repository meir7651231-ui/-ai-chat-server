// בדיקת-חוזה (רתמת-זהב) · planWord — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/plan-word.test.mjs:
//   'punch'→'כרטיסייה' · 'half_year'→'מנוי חצי-שנתי' · 'year'→'מנוי שנתי' ·
//   'month'→'מנוי חודשי' · 'לא-קיים'→'מנוי חודשי' (ענף ברירת-המחדל).
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/plan-word_test.dart  ⇒ exit 0
import 'plan-word.dart';

void main() {
  var n = 0;
  const cases = <List<String>>[
    ['punch', 'כרטיסייה'],
    ['half_year', 'מנוי חצי-שנתי'],
    ['year', 'מנוי שנתי'],
    ['month', 'מנוי חודשי'],
    ['לא-קיים', 'מנוי חודשי'],
  ];

  for (final c in cases) {
    final input = c[0];
    final want = c[1];
    final got = planWord(input);
    assert(got == want, "FAIL: '$input' ⇒ '$got' ≠ '$want'");
    n++;
  }

  print('OK planWord: $n asserts passed');
}
