// רתמת-זהב · gem-year — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות).
// שקע-gem מקומי לבדיקה (העתק התנהגות חוט gematria — רתמה מייבאת רק את האטום שלה).
import 'gem-year.dart';

String gem(num nIn) {
  final n = nIn.floor(); // JS: Math.floor(+n)
  if (n <= 0) return ''; // JS: !Number.isFinite(n)||n<=0 ⇒ '' (קלטים חוקיים ⇒ n סופי)
  const U = ['', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט'];
  const T = ['', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ'];
  const H = ['', 'ק', 'ר', 'ש', 'ת', 'תק', 'תר', 'תש', 'תת', 'תתק'];
  var s = H[n ~/ 100]; // n∈1..999 ⇒ index 0..9 (H[0]='' ≡ JS ...||'')
  final r = n % 100;
  if (r == 15) {
    s += 'טו';
  } else if (r == 16) {
    s += 'טז';
  } else {
    s += T[r ~/ 10] + U[r % 10];
  }
  // JS: s.length===1 ? s+'׳' : s.slice(0,-1)+'״'+s.slice(-1)
  // כלל-המרה 5: substring שלילי זורק ב-Dart ⇒ length-1 מפורש.
  if (s.length == 1) return '$s׳';
  return s.substring(0, s.length - 1) + '״' + s.substring(s.length - 1);
}

void main() {
  // דוגמאות-החוזה (זהות ל-C בבדיקת ה-JS): [קלט, פלט-צפוי]
  const cases = <List<Object>>[
    [5786, 'תשפ״ו'],
    ['5786', 'תשפ״ו'],
    [5715, 'תשט״ו'],
    [786, 'תשפ״ו'],
    [5000, ''],
  ];
  for (final c in cases) {
    final got = gemYear(c[0], gem);
    assert(got == c[1], '✗ ${c[0]} ⇒ "$got" ≠ "${c[1]}"');
  }
  print('✓ gem-year (Dart): ${cases.length} דוגמאות-חוזה — ירוק');
}
