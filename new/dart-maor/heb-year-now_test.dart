// רתמת-הזהב · heb-year-now — assert-ים = בדיוק 5 דוגמאות-החוזה של בדיקת-ה-JS
// (new/atoms/heb-year-now.test.mjs). עובר ⇒ Dart ≡ JS (חוק-4).
// הרצה: dart run --enable-asserts heb-year-now_test.dart  ⇒  exit 0.
//
// השקע hebParts ממומש כאן ביט-זהה למקור (חישוב-לוח Dershowitz–Reingold, כמו
// באחות heb-parts.dart, כי ל-Intl('en-u-ca-hebrew') של V8 אין מקבילה ב-dart-core).
// כאן די בשדה-השנה; המבנה {day,month,year} נשמר להתאמת-החוזה. הבדיקה מייבאת
// רק את האטום-שלה — hebParts מוזרק כפרמטר (חוק-1/חוק-4).
import 'heb-year-now.dart';

// ---- מימוש-השקע hebParts (חישוב שנה עברית; ביט-זהה ל-heb-parts.dart) ----
const int _hebrewEpoch = -1373427;
bool _hebrewLeapYear(int y) => ((7 * y + 1) % 19) < 7;
int _hebrewCalendarElapsedDays(int y) {
  final int monthsElapsed = ((235 * y - 234) ~/ 19);
  final int partsElapsed = 12084 + 13753 * monthsElapsed;
  final int day = 29 * monthsElapsed + (partsElapsed ~/ 25920);
  if (((3 * (day + 1)) % 7) < 3) return day + 1;
  return day;
}

int _hebrewYearLengthCorrection(int y) {
  final int ny0 = _hebrewCalendarElapsedDays(y - 1);
  final int ny1 = _hebrewCalendarElapsedDays(y);
  final int ny2 = _hebrewCalendarElapsedDays(y + 1);
  if ((ny2 - ny1) == 356) return 2;
  if ((ny1 - ny0) == 382) return 1;
  return 0;
}

int _hebrewNewYear(int y) =>
    _hebrewEpoch + _hebrewCalendarElapsedDays(y) + _hebrewYearLengthCorrection(y);

bool _gregorianLeapYear(int y) =>
    (y % 4 == 0) && (y % 100 != 0 || y % 400 == 0);
int _gregorianToFixed(int y, int m, int d) {
  int fixed = 365 * (y - 1) +
      ((y - 1) ~/ 4) -
      ((y - 1) ~/ 100) +
      ((y - 1) ~/ 400) +
      ((367 * m - 362) ~/ 12);
  if (m > 2) fixed += _gregorianLeapYear(y) ? -1 : -2;
  return fixed + d;
}

int _fixedToHebrewYear(int date) {
  int year = ((98496 * (date - _hebrewEpoch)) ~/ 35975351) + 1;
  while (_hebrewNewYear(year + 1) <= date) {
    year++;
  }
  return year;
}

Map<String, Object> hebParts(DateTime? d) {
  if (d == null) return <String, Object>{'day': 0, 'month': '', 'year': 0};
  final int year = _fixedToHebrewYear(_gregorianToFixed(d.year, d.month, d.day));
  return <String, Object>{'day': 0, 'month': '', 'year': year};
}

// כלל-הצהריים של המקור (new Date(iso + 'T12:00:00')).
int _at(String iso) {
  final p = iso.split('-');
  return hebYearNow(
    hebParts,
    DateTime(int.parse(p[0]), int.parse(p[1]), int.parse(p[2]), 12, 0, 0),
  );
}

void main() {
  assert(_at('2026-08-24') == 5786, '2026-08-24 ≠ 5786'); // 1
  assert(_at('2026-09-11') == 5786, '2026-09-11 (ערב ר״ה) ≠ 5786'); // 2
  assert(_at('2026-09-12') == 5787, '2026-09-12 (א׳ תשרי) ≠ 5787'); // 3
  assert(_at('2026-01-01') == 5786, '2026-01-01 ≠ 5786 (אזרחית ≠ עברית)'); // 4
  assert(hebYearNow(hebParts, null) == 0, 'Date שבור ≠ 0'); // 5
  print('✓ heb-year-now (Dart): 5 דוגמאות-חוזה — Dart ≡ JS');
}
