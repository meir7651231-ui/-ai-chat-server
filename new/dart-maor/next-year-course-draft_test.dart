import 'next-year-course-draft.dart';

/// רתמת-זהב: אותן 4 דוגמאות-חוזה בדיוק מ-
/// new/atoms/next-year-course-draft.test.mjs. אם עובר — Dart≡JS.
/// השקעים המקומיים מחקים את התנהגות-המקור של הבדיקה ב-JS (Date/getMonth).

DateTime _atNoon(String iso) => DateTime.parse('${iso}T12:00:00');

String _toIso(DateTime d) =>
    '${d.year}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';

Map<String, String> _nextYearDates(Object? start, Object? end) {
  String shift(String iso) {
    final d = _atNoon(iso);
    // JS: d.setFullYear(getFullYear()+1) — חודש/יום נשמרים.
    return _toIso(DateTime(d.year + 1, d.month, d.day, 12));
  }

  return {'start': shift(start as String), 'end': shift(end as String)};
}

String _academicYearLabel(Object? start) {
  final d = _atNoon(start as String);
  final y = d.year;
  // JS getMonth() 0-אינדקס: ספט׳=8 ⇒ `>= 8`; Dart month 1-אינדקס: ספט׳=9 ⇒ `>= 9`.
  final startYear = d.month >= 9 ? y : y - 1;
  final nn = ((startYear + 1) % 100).toString().padLeft(2, '0');
  return '$startYear/$nn';
}

bool _deepEq(Object? a, Object? b) {
  if (a is Map && b is Map) {
    if (a.length != b.length) return false;
    for (final k in a.keys) {
      if (!b.containsKey(k) || !_deepEq(a[k], b[k])) return false;
    }
    return true;
  }
  return a == b;
}

void main() {
  // 1 + 4. שדות מועתקים + טוהר-המקור
  final src1 = <String, Object?>{
    'id': 'c1', 'name': 'ציור', 'start': '2025-09-01', 'end': '2026-06-30',
    'weekday': 2, 'time': '17:00',
  };
  final r1 = nextYearCourseDraft(src1, 'c7', _nextYearDates, _academicYearLabel);
  assert(
      _deepEq(r1, <String, Object?>{
        'id': 'c7', 'name': 'ציור', 'start': '2026-09-01', 'end': '2027-06-30',
        'weekday': 2, 'time': '17:00', 'year': '2026/27', 'prevYearId': 'c1',
      }),
      'דוגמה 1');
  assert(
      _deepEq(src1, <String, Object?>{
        'id': 'c1', 'name': 'ציור', 'start': '2025-09-01', 'end': '2026-06-30',
        'weekday': 2, 'time': '17:00',
      }),
      'דוגמה 4 (טוהר — src לא נגע)');

  // 2. דריסת year/prevYearId ישנים
  final r2 = nextYearCourseDraft(<String, Object?>{
    'id': 'c2', 'name': 'נגרות', 'start': '2026-09-01', 'end': '2027-06-30',
    'year': '2026/27', 'prevYearId': 'c1',
  }, 'c9', _nextYearDates, _academicYearLabel);
  assert(
      r2['id'] == 'c9' &&
          r2['start'] == '2027-09-01' &&
          r2['end'] == '2028-06-30' &&
          r2['year'] == '2027/28' &&
          r2['prevYearId'] == 'c2',
      'דוגמה 2');

  // 3. פתיחה בינואר ⇒ שנה"ל של השנה הקודמת
  final r3 = nextYearCourseDraft(<String, Object?>{
    'id': 'c3', 'name': 'קיץ', 'start': '2026-01-10', 'end': '2026-03-10',
  }, 'c4', _nextYearDates, _academicYearLabel);
  assert(r3['start'] == '2027-01-10' && r3['year'] == '2026/27', 'דוגמה 3');

  print('✓ next-year-course-draft: 4 דוגמאות-חוזה — ירוק');
}
