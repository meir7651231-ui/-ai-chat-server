// רתמת-זהב · next-academic-year-label — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות).
// שקעים מקומיים נאמנים (הבדיקה מייבאת רק את האטום שלה).
import 'next-academic-year-label.dart';

DateTime atNoon(String iso) => DateTime.parse('${iso}T12:00:00');

// נאמן ל-31.12: השנה העברית של ה-31.12 הלועזי היא תמיד G+3761 (ר"ה כבר עבר).
({int year}) hebPartsOfIso(String iso) =>
    (year: int.parse(iso.substring(0, 4)) + 3761);

// gem-אמת של maor (lib/hebrew.ts) — גימטריה.
String gem(int nIn) {
  final n = nIn; // הקלט כבר שלם (y % 1000).
  if (n <= 0) return '';
  const U = ['', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט'];
  const T = ['', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ'];
  const H = ['', 'ק', 'ר', 'ש', 'ת', 'תק', 'תר', 'תש', 'תת', 'תתק'];
  var s = H[n ~/ 100];
  final r = n % 100;
  if (r == 15) {
    s += 'טו';
  } else if (r == 16) {
    s += 'טז';
  } else {
    s += T[r ~/ 10] + U[r % 10];
  }
  // substring שלילי (כלל-5): s.length>=2 בענף-זה, s.length==1 מטופל בנפרד.
  return s.length == 1
      ? '$s׳'
      : s.substring(0, s.length - 1) + '״' + s.substring(s.length - 1);
}

String gemYear(int y) => gem(y % 1000);

void main() {
  const cases = <List<String>>[
    ['2025-09-01', 'תשפ״ז'],
    ['2026-09-01', 'תשפ״ח'],
    ['2026-06-30', 'תשפ״ז'],
    ['2026-08-31', 'תשפ״ז'],
    ['2025-08-31', 'תשפ״ו'],
    ['', ''],
  ];
  for (final c in cases) {
    final got = nextAcademicYearLabel(c[0], atNoon, gemYear, hebPartsOfIso);
    assert(got == c[1], '✗ "${c[0]}" ⇒ $got ≠ ${c[1]}');
  }
  print('✓ next-academic-year-label (Dart): 6 דוגמאות-חוזה — ירוק');
}
