import '../dart-data-maor/build-course-daily-rows-sockets.dart' as sk_build_course_daily_rows;
// בדיקת-חוזה (רתמת-זהב) · buildCourseDailyRows — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/build-course-daily-rows.test.mjs.
// שקעים: hebDateFull=iso⇒'ע:'+iso · termOf=(cfg,k,fb)⇒cfg.terms[k]??fb (נאמן למקור).
// הרצה: dart run --enable-asserts new/dart-maor/build-course-daily-rows_test.dart ⇒ exit 0
import 'build-course-daily-rows.dart';

// שקעים מקומיים לבדיקה
String hebDateFull(String iso) => 'ע:$iso';
String termOf(Map<String, Object?> cfg, String k, String fb) {
  final terms = cfg['terms'];
  if (terms is Map && terms[k] != null) return terms[k] as String;
  return fb;
}

bool _deepEq(Object? a, Object? b) {
  if (a is List && b is List) {
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; i++) {
      if (!_deepEq(a[i], b[i])) return false;
    }
    return true;
  }
  if (a is Map && b is Map) {
    if (a.length != b.length) return false;
    for (final k in a.keys) {
      if (!b.containsKey(k) || !_deepEq(a[k], b[k])) return false;
    }
    return true;
  }
  return a == b;
}

int _f = 0;
void eq(String name, Object? got, Object? want) {
  if (!_deepEq(got, want)) {
    print('✗ $name:\n  $got\n≠ $want');
    _f = 1;
  }
}

List<List<String>> _rowsOf(Map<String, Object?> r) =>
    (r['rows'] as List).cast<List<String>>();

void main() {
  final db1 = <String, Object?>{
    'families': [
      {'id': 'f1', 'name': 'פרץ', 'members': [{'id': 'm1', 'first': 'רות'}, {'id': 'm2', 'first': 'יעל'}]},
      {'id': 'f2', 'name': 'גל', 'members': [{'id': 'm3', 'first': 'נעמי'}, {'id': 'm4', 'first': 'תמר'}]},
    ],
    'enrollments': [
      {'courseId': 'c1', 'memberId': 'm1', 'status': 'active', 'enrolledAt': '2026-08-01', 'absences': [{'date': '2026-08-30', 'reason': 'מחלה'}]},
      {'courseId': 'c1', 'memberId': 'm2', 'status': 'wait', 'absences': []},
      {'courseId': 'c1', 'memberId': 'm3', 'status': 'ended', 'endedAt': '2026-08-30', 'enrolledAt': '2026-08-01', 'absences': [{'date': '2026-08-23', 'noshow': true}]},
      {'courseId': 'c1', 'memberId': 'm4', 'status': 'paused', 'absences': []},
    ],
  };
  final c1 = <String, Object?>{'id': 'c1', 'start': '2026-08-23', 'end': '2026-08-30', 'weekday': 0, 'time': '16:00'};

  // דוגמה 1
  final r1 = buildCourseDailyRows(c1, db1, null, termOf, hebDateFull, sk_build_course_daily_rows.buildCourseDailyRows_DAY_NAMES, sk_build_course_daily_rows.buildCourseDailyRows_T2);
  eq('1 · days', r1['days'], 2);
  eq('1 · rows.length', _rowsOf(r1).length, 6);
  eq('1 · רות 23.8', _rowsOf(r1)[1], ['ע:2026-08-23', '23/08/2026', 'ראשון', 'קבוצה · 16:00', 'מתקיים', 'רות', 'פרץ', 'פעיל']);
  eq('1 · נעמי 23.8 noshow', _rowsOf(r1)[2], ['ע:2026-08-23', '23/08/2026', 'ראשון', 'קבוצה · 16:00', 'מתקיים', 'נעמי', 'גל', 'לא הופיעה']);
  eq('1 · תמר 23.8 מוקפא', _rowsOf(r1)[3], ['ע:2026-08-23', '23/08/2026', 'ראשון', 'קבוצה · 16:00', 'מוקפא', 'תמר', 'גל', 'מוקפא']);
  eq('1 · רות 30.8 חיסור·סיבה', _rowsOf(r1)[4], ['ע:2026-08-30', '30/08/2026', 'ראשון', 'קבוצה · 16:00', 'מתקיים', 'רות', 'פרץ', 'חיסור · מחלה']);
  eq('1 · תמר 30.8', _rowsOf(r1)[5][5], 'תמר'); // נעמי איננה ב-30.8, יעל (wait) לא בכלל
  eq('1 · אין נעמי/יעל ב-30.8', _rowsOf(r1).where((r) => r[1] == '30/08/2026').map((r) => r[5]).toList(), ['רות', 'תמר']);

  // דוגמה 2 — termOf על כותרת-המשפחה
  final r2 = buildCourseDailyRows(c1, db1, {'terms': {'entity.family': 'לקוח'}}, termOf, hebDateFull, sk_build_course_daily_rows.buildCourseDailyRows_DAY_NAMES, sk_build_course_daily_rows.buildCourseDailyRows_T2);
  eq('2 · כותרת עם config', _rowsOf(r2)[0][6], 'לקוח');
  eq('2 · כותרת בלי config', _rowsOf(r1)[0][6], 'משפחה');

  // דוגמה 3 — start ריק
  final r3 = buildCourseDailyRows({'id': 'c1', 'start': '', 'end': '2026-08-30'}, db1, null, termOf, hebDateFull, sk_build_course_daily_rows.buildCourseDailyRows_DAY_NAMES, sk_build_course_daily_rows.buildCourseDailyRows_T2);
  eq('3 · start ריק', {'n': _rowsOf(r3).length, 'days': r3['days']}, {'n': 1, 'days': 0});

  // דוגמה 4 — אין שיבוצים ⇒ 'אין רשומות'
  final r4 = buildCourseDailyRows({'id': 'cX', 'start': '2026-08-23', 'end': '2026-08-23', 'weekday': 0, 'time': '16:00'}, db1, null, termOf, hebDateFull, sk_build_course_daily_rows.buildCourseDailyRows_DAY_NAMES, sk_build_course_daily_rows.buildCourseDailyRows_T2);
  eq('4 · אין רשומות', _rowsOf(r4)[1], ['ע:2026-08-23', '23/08/2026', 'ראשון', 'קבוצה · 16:00', 'אין רשומות', '', '', '']);

  // דוגמה 5 — קבוצות מרובות
  final c5 = <String, Object?>{'id': 'c5', 'start': '2026-08-23', 'end': '2026-08-23', 'sessions': [{'day': 0, 'time': '10:00', 'label': 'א'}, {'day': 0, 'time': '12:00', 'label': 'ב'}]};
  final db5 = <String, Object?>{
    'families': db1['families'],
    'enrollments': [
      {'courseId': 'c5', 'memberId': 'm1', 'status': 'active', 'group': 'א', 'absences': []},
      {'courseId': 'c5', 'memberId': 'm3', 'status': 'active', 'absences': []},
    ],
  };
  final r5 = buildCourseDailyRows(c5, db5, null, termOf, hebDateFull, sk_build_course_daily_rows.buildCourseDailyRows_DAY_NAMES, sk_build_course_daily_rows.buildCourseDailyRows_T2);
  eq('5 · days', r5['days'], 1);
  eq('5 · סלוט א', _rowsOf(r5).where((r) => r[3] == 'א · 10:00').map((r) => r[5]).toList(), ['רות', 'נעמי']);
  eq('5 · סלוט ב', _rowsOf(r5).where((r) => r[3] == 'ב · 12:00').map((r) => r[5]).toList(), ['נעמי']);

  // דוגמה 6 — קטיעה ב-MAX_DAYS=500
  final r6 = buildCourseDailyRows({'id': 'cY', 'start': '2026-01-04', 'end': '2036-12-31', 'weekday': 0, 'time': ''}, {'families': [], 'enrollments': []}, null, termOf, hebDateFull, sk_build_course_daily_rows.buildCourseDailyRows_DAY_NAMES, sk_build_course_daily_rows.buildCourseDailyRows_T2);
  eq('6 · days=500', r6['days'], 500);
  eq('6 · rows=502', _rowsOf(r6).length, 502);
  eq('6 · שורת-הקטיעה', _rowsOf(r6)[501], ['—', '—', '—', '—', 'הדוח נקטע ב-500 ימי מפגש — בדקו את תאריך הסיום של החוג', '', '', '']);

  if (_f != 0) throw StateError('build-course-daily-rows: דוגמאות-חוזה נכשלו');
  print('✓ build-course-daily-rows: 6 דוגמאות-חוזה — ירוק');
}
