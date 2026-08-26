import 'default-course-dates.dart';

void main() {
  final cases = <List<Object>>[
    ['2026-08-24', {'start': '2026-09-01', 'end': '2027-07-31'}],
    ['2026-07-31', {'start': '2025-09-01', 'end': '2026-07-31'}],
    ['2026-08-01', {'start': '2026-09-01', 'end': '2027-07-31'}],
    ['2026-09-01', {'start': '2026-09-01', 'end': '2027-07-31'}],
    ['2027-01-15', {'start': '2026-09-01', 'end': '2027-07-31'}],
    ['2031-12-31T23:59:59', {'start': '2031-09-01', 'end': '2032-07-31'}],
  ];
  for (final c in cases) {
    final today = c[0] as String;
    final want = c[1] as Map<String, String>;
    final got = defaultCourseDates(today);
    assert(_eq(got, want), '✗ $today ⇒ $got ≠ $want');
  }

  // הסגר-המקור: גלישת-יום — JS מגלגל '2026-02-30' ⇒ Mar-2 (חודש<8 ⇒ startYear=y-1).
  {
    final got = defaultCourseDates('2026-02-30');
    final want = {'start': '2025-09-01', 'end': '2026-07-31'};
    assert(_eq(got, want), '✗ גלישת-יום 2026-02-30 ⇒ $got ≠ $want');
  }
  // גלישת-יום לשנה-חדשה: '2026-12-31' תקין (חודש=12≥8 ⇒ startYear=y).
  {
    final got = defaultCourseDates('2026-12-31');
    final want = {'start': '2026-09-01', 'end': '2027-07-31'};
    assert(_eq(got, want), '✗ 2026-12-31 ⇒ $got ≠ $want');
  }
  // חודש-13 נדחה (≡ Invalid ⇒ now()) — לא מגלגל.
  {
    final got = defaultCourseDates('2026-13-01');
    final now = DateTime.now();
    final sy = now.month >= 8 ? now.year : now.year - 1;
    final want = {'start': '$sy-09-01', 'end': '${sy + 1}-07-31'};
    assert(_eq(got, want), '✗ חודש-13 ⇒ $got ≠ $want');
  }

  // תאריך-שבור ⇒ נפילה לשעון-הנוכחי (אותו כלל).
  {
    final now = DateTime.now();
    final sy = now.month >= 8 ? now.year : now.year - 1;
    final want = {'start': '$sy-09-01', 'end': '${sy + 1}-07-31'};
    final got = defaultCourseDates('שטויות');
    assert(_eq(got, want), '✗ תאריך-שבור ⇒ $got ≠ $want');
  }

  print('✓ default-course-dates: חוזה + הסגר-גלישת-יום — ירוק');
}

bool _eq(Map<String, String> a, Map<String, String> b) =>
    a.length == b.length && a.keys.every((k) => a[k] == b[k]);
