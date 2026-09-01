// רתמת-זהב · hebDateFull — Dart≡JS. אותם קלטים→פלטים של new/atoms/heb-date-full.test.mjs.
// מייבאת אך ורק את האטום-שלה (חוק-4). השקעים (gem · gemYear · hebParts) הם עותק-Dart
// עצמאי של שקעי-הבדיקה ב-JS — כשם ש-JS משתמש ב-Intl כאורקל בלתי-תלוי, כאן ה-hebParts
// נשען על אותה המרת-לוח (Dershowitz–Reingold), עצמאית מהאטום.
// דוגמאות-החוזה verbatim מ-heb-date-full.test.mjs:
//   [['2026-08-24','י״א אלול תשפ״ו'],['2026-04-02','ט״ו ניסן תשפ״ו'],
//    ['2024-03-24','י״ד אדר ב׳ תשפ״ד'],['2026-08-24T23:59:00','י״א אלול תשפ״ו'],
//    ['',''],['שטויות','']]
// הרצה: dart run --enable-asserts new/dart-maor/heb-date-full_test.dart ⇒ exit 0
import '../dart-data-maor/heb-date-full-sockets.dart' as sk_heb_date_full;
import 'heb-date-full.dart';

// ── שקע gem — עותק-Dart של gem() מ-JS-הבדיקה ──
String _gem(num nRaw) {
  final int n = nRaw.floor();
  if (n <= 0) return '';
  const U = ['', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט'];
  const T = ['', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ'];
  const H = ['', 'ק', 'ר', 'ש', 'ת', 'תק', 'תר', 'תש', 'תת', 'תתק'];
  final int h = n ~/ 100;
  String s = h < H.length ? H[h] : ''; // JS: H[floor(n/100)] || ''
  final int r = n % 100;
  if (r == 15) {
    s += 'טו';
  } else if (r == 16) {
    s += 'טז';
  } else {
    s += T[r ~/ 10] + U[r % 10];
  }
  if (s.length == 1) return '$s׳';
  return '${s.substring(0, s.length - 1)}״${s.substring(s.length - 1)}';
}

// ── שקע gemYear — JS: (y) => gem(+y % 1000). כללי-המרה 9/10: tryParse + remainder ──
String _gemYear(String y) => _gem((num.tryParse(y) ?? double.nan).remainder(1000));

// ── שקע hebParts — עותק-לוח עצמאי (day בלבד נצרך ע"י האטום) ──
const int _epoch = -1373427;
bool _leap(int y) => ((7 * y + 1) % 19) < 7;
int _lastMonth(int y) => _leap(y) ? 13 : 12;
int _elapsed(int y) {
  final int me = ((235 * y - 234) ~/ 19);
  final int pe = 12084 + 13753 * me;
  final int day = 29 * me + (pe ~/ 25920);
  return ((3 * (day + 1)) % 7) < 3 ? day + 1 : day;
}

int _corr(int y) {
  final int a = _elapsed(y - 1), b = _elapsed(y), c = _elapsed(y + 1);
  if ((c - b) == 356) return 2;
  if ((b - a) == 382) return 1;
  return 0;
}

int _newYear(int y) => _epoch + _elapsed(y) + _corr(y);
int _daysInYear(int y) => _newYear(y + 1) - _newYear(y);
bool _longMar(int y) => _daysInYear(y) == 355 || _daysInYear(y) == 385;
bool _shortKis(int y) => _daysInYear(y) == 353 || _daysInYear(y) == 383;
int _lastDay(int y, int m) {
  if (m == 2 || m == 4 || m == 6 || m == 10 || m == 13) return 29;
  if (m == 8 && !_longMar(y)) return 29;
  if (m == 9 && _shortKis(y)) return 29;
  if (m == 12 && !_leap(y)) return 29;
  return 30;
}

int _hebToFixed(int y, int m, int day) {
  int f = _newYear(y) + day - 1;
  if (m < 7) {
    final int lm = _lastMonth(y);
    for (int i = 7; i <= lm; i++) f += _lastDay(y, i);
    for (int i = 1; i < m; i++) f += _lastDay(y, i);
  } else {
    for (int i = 7; i < m; i++) f += _lastDay(y, i);
  }
  return f;
}

bool _gLeap(int y) => (y % 4 == 0) && (y % 100 != 0 || y % 400 == 0);
int _gToFixed(int y, int m, int day) {
  int f = 365 * (y - 1) +
      ((y - 1) ~/ 4) -
      ((y - 1) ~/ 100) +
      ((y - 1) ~/ 400) +
      ((367 * m - 362) ~/ 12);
  if (m > 2) f += _gLeap(y) ? -1 : -2;
  return f + day;
}

List<int> _toHeb(int date) {
  int y = ((98496 * (date - _epoch)) ~/ 35975351) + 1;
  while (_newYear(y + 1) <= date) y++;
  final int start = (date < _hebToFixed(y, 1, 1)) ? 7 : 1;
  int m = start;
  while (date > _hebToFixed(y, m, _lastDay(y, m))) m++;
  final int day = date - _hebToFixed(y, m, 1) + 1;
  return <int>[y, m, day];
}

Map<String, Object> _hebParts(DateTime d) {
  final List<int> h = _toHeb(_gToFixed(d.year, d.month, d.day));
  return <String, Object>{'day': h[2], 'month': h[1], 'year': h[0]};
}

void _eq(String got, String want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

void main() {
  var n = 0;
  _eq(hebDateFull('2026-08-24', _gem, _gemYear, _hebParts, sk_heb_date_full.hebDateFull_monthNames), 'י״א אלול תשפ״ו',
      '1 2026-08-24');
  n++;
  _eq(hebDateFull('2026-04-02', _gem, _gemYear, _hebParts, sk_heb_date_full.hebDateFull_monthNames), 'ט״ו ניסן תשפ״ו',
      '2 2026-04-02 פסח');
  n++;
  _eq(hebDateFull('2024-03-24', _gem, _gemYear, _hebParts, sk_heb_date_full.hebDateFull_monthNames), 'י״ד אדר ב׳ תשפ״ד',
      '3 2024-03-24 פורים-מעוברת');
  n++;
  _eq(hebDateFull('2026-08-24T23:59:00', _gem, _gemYear, _hebParts, sk_heb_date_full.hebDateFull_monthNames),
      'י״א אלול תשפ״ו', '4 זנב-שעה נחתך');
  n++;
  _eq(hebDateFull('', _gem, _gemYear, _hebParts, sk_heb_date_full.hebDateFull_monthNames), '', '5 ריק');
  n++;
  _eq(hebDateFull('שטויות', _gem, _gemYear, _hebParts, sk_heb_date_full.hebDateFull_monthNames), '', '6 שבור');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(hebDateFull('2026-04-02', _gem, _gemYear, _hebParts, sk_heb_date_full.hebDateFull_monthNames) == 'ט״ו ניסן תשפ״ו',
      'assert-live guard');

  print('✓ hebDateFull: $n דוגמאות-חוזה — Dart≡JS ירוק');
}
