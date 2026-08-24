// רתמת-זהב · academic-year-label — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות).
// שקע-atNoon מקומי לבדיקה (מוסכמת-maor: צהריים מקומי).
import 'academic-year-label.dart';

DateTime atNoon(String iso) => DateTime.parse('${iso}T12:00:00');

void main() {
  const cases = <List<String>>[
    ['2026-09-01', '2026/27'],
    ['2027-06-30', '2026/27'],
    ['2026-08-31', '2025/26'],
    ['2000-09-15', '2000/01'],
    ['1999-01-01', '1998/99'],
    ['2099-10-01', '2099/00'],
  ];
  for (final c in cases) {
    final got = academicYearLabel(c[0], atNoon);
    assert(got == c[1], '✗ ${c[0]} ⇒ $got ≠ ${c[1]}');
  }
  print('✓ academic-year-label (Dart): 6 דוגמאות-חוזה — ירוק');
}
