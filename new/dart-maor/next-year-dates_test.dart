// רתמת-זהב · next-year-dates — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות ביט-אחר-ביט).
// שקעי-התאריכים מקומיים לבדיקה (מוסכמת-maor: צהריים מקומי; toIso עם getMonth 0→1-אינדקס).
import 'next-year-dates.dart';

DateTime atNoon(String iso) => DateTime.parse('${iso}T12:00:00');

String _pad(int n) => n.toString().padLeft(2, '0');
// JS toIso: getMonth()+1 (0-אינדקס) ⇒ ב-Dart month הוא 1-אינדקס, ישירות.
String toIso(DateTime d) => '${d.year}-${_pad(d.month)}-${_pad(d.day)}';

void main() {
  // [שם, start, end, wantStart, wantEnd]
  const cases = <List<String>>[
    ['דוגמה 1', '2025-09-01', '2026-06-30', '2026-09-01', '2027-06-30'],
    ['דוגמה 2 (29.2 מתגלגל)', '2024-02-29', '2024-06-30', '2025-03-01', '2025-06-30'],
    ['דוגמה 3 (חציית-מאה)', '1999-12-31', '2000-01-05', '2000-12-31', '2001-01-05'],
    ['דוגמה 4 (זהים)', '2026-01-01', '2026-01-01', '2027-01-01', '2027-01-01'],
  ];
  for (final c in cases) {
    final got = nextYearDates(c[1], c[2], atNoon, toIso);
    assert(
      got['start'] == c[3] && got['end'] == c[4],
      '✗ ${c[0]}: ${got['start']}/${got['end']} ≠ ${c[3]}/${c[4]}',
    );
  }
  print('✓ next-year-dates (Dart): 4 דוגמאות-חוזה — ירוק');
}
