// רתמת-זהב · default-course-dates — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות).
// אם עובר: Dart ≡ JS. מוצא הדוגמאות: new/atoms/default-course-dates.test.mjs.
import 'default-course-dates.dart';

void main() {
  // 6 דוגמאות-חוזה קבועות: [today, wantStart, wantEnd]
  const cases = <List<String>>[
    ['2026-08-24', '2026-09-01', '2027-07-31'],
    ['2026-07-31', '2025-09-01', '2026-07-31'],
    ['2026-08-01', '2026-09-01', '2027-07-31'],
    ['2026-09-01', '2026-09-01', '2027-07-31'],
    ['2027-01-15', '2026-09-01', '2027-07-31'],
    ['2031-12-31T23:59:59', '2031-09-01', '2032-07-31'],
  ];
  for (final c in cases) {
    final got = defaultCourseDates(c[0]);
    assert(got['start'] == c[1] && got['end'] == c[2],
        '✗ ${c[0]} ⇒ $got ≠ {start:${c[1]}, end:${c[2]}}');
  }

  // 7: תאריך-שבור ⇒ נפילה לשעון-הנוכחי (מחושב דינמית באותו כלל m>=7 / month>=8)
  final now = DateTime.now();
  final sy = now.month >= 8 ? now.year : now.year - 1;
  final wantStart = '$sy-09-01';
  final wantEnd = '${sy + 1}-07-31';
  final got = defaultCourseDates('שטויות');
  assert(got['start'] == wantStart && got['end'] == wantEnd,
      '✗ תאריך-שבור ⇒ $got ≠ {start:$wantStart, end:$wantEnd}');

  print('✓ default-course-dates (Dart): 7 דוגמאות-חוזה — ירוק (כולל נפילת-תאריך-שבור)');
}
