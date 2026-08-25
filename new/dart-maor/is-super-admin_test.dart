// רתמת-זהב · is-super-admin — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות).
// רשימת-דוגמה בלבד (חוק-6 — הרשימה האמיתית היא חיווט-הצבה, לא נשמרת בבדיקה).
import 'is-super-admin.dart';

void main() {
  const list = <String>['admin@example.org'];
  // Dart null מייצג גם את מקרה null וגם את undefined של ה-JS (שניהם ⇒ false).
  final cases = <List<Object?>>[
    ['admin@example.org', true],
    ['  Admin@Example.ORG  ', true], // trim+lowercase
    ['other@example.org', false],
    ['', false],
    [null, false], // JS: null
    [null, false], // JS: undefined
  ];
  for (final c in cases) {
    final got = isSuperAdmin(c[0] as String?, list);
    assert(got == c[1], '✗ ${c[0]} ⇒ $got ≠ ${c[1]}');
  }
  // רשימה ריקה ⇒ תמיד false
  assert(isSuperAdmin('admin@example.org', const <String>[]) == false,
      '✗ רשימה ריקה — ציפינו false');
  print('✓ is-super-admin (Dart): 7 דוגמאות-חוזה — ירוק');
}
