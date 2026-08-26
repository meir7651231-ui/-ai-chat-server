// gold-test ל-gem-year.dart — מראה את new/atoms/gem-year.test.mjs (דוגמאות-חוזה).
// שקע-הגימטריה (gem) מוזרק ומשכפל את חוט gematria — כמו ב-mjs (האטום מייבא רק את עצמו).
import 'gem-year.dart';

// העתק-התנהגות של gem מתוך gem-year.test.mjs (JS ⇒ Dart נאמן):
String gem(num raw) {
  // JS: n = Math.floor(+n); אם לא-סופי או <=0 ⇒ '' (בודקים isNaN/isInfinite לפני floor).
  if (raw.isNaN || raw.isInfinite) return '';
  final int n = raw.floor();
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
  // JS: אות-יחידה ⇒ +׳ ; אחרת גרש-כפול לפני האות האחרונה.
  return s.length == 1
      ? '$s׳'
      : s.substring(0, s.length - 1) + '״' + s.substring(s.length - 1);
}

void main() {
  // דוגמאות-החוזה מ-gem-year.test.mjs: [קלט, צפוי].
  final cases = <(Object, String)>[
    (5786, 'תשפ״ו'),
    ('5786', 'תשפ״ו'),
    (5715, 'תשט״ו'),
    (786, 'תשפ״ו'),
    (5000, ''),
  ];
  var fails = 0;
  for (final (a, w) in cases) {
    final g = gemYear(a, gem);
    if (g != w) {
      fails++;
      print('✗ ${a} ⇒ "$g" ≠ "$w"');
    }
  }

  // ratchet-הסגר: המודולו-השלילי (JS `%` = remainder) + פירוק-מספר בלי-זריקה.
  assert(gemYear(-5, gem) == '', 'מודולו-שלילי: -5 % 1000 === -5 ב-JS ⇒ n<=0 ⇒ ""');
  assert(gemYear('עברית', gem) == '', 'ToNumber(NaN) לא-זורק ⇒ NaN ⇒ ""');
  assert(gemYear('', gem) == '', 'Number("")===0 ⇒ n<=0 ⇒ ""');
  assert(gemYear(5715, gem) == 'תשט״ו', 'ר"ה תשט"ו — 15 ⇒ טו');

  if (fails > 0) throw StateError('gem-year: $fails דוגמאות נפלו');
  print('✓ gem-year: ${cases.length} דוגמאות-חוזה + ratchet-הסגר — ירוק');
}
