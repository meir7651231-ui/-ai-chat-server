// בדיקת-חוזה (רתמת-זהב) · doneTodayFor — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/done-today-for.test.mjs,
// עם אותו שקע-זהות מוזרק (trim+lowercase; ריק/חסר ⇒ 'מקומי'):
//   1) [{A@x.com, 2026-08-24T10:00}], 'a@x.com' ⇒ 1  (רישיות מנורמלת)
//   2) [{a@x.com, 2026-08-23T23:59}], 'a@x.com' ⇒ 0  (אתמול)
//   3) [{a@x.com}],                    'a@x.com' ⇒ 0  (פתוחה — אין doneAt)
//   4) [{b@x.com, 2026-08-24}],        'a@x.com' ⇒ 0  (עובד/ת אחר/ת)
//   5) [{doneAt:2026-08-24},{assignee:'', doneAt:2026-08-24}], '' ⇒ 2  (ריק⇒'מקומי')
//   6) תערובת 1–4 יחד,                'a@x.com' ⇒ 1
// הרצה: dart run --enable-asserts new/dart-maor/done-today-for_test.dart  ⇒ exit 0
import 'done-today-for.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

// שקע-הזהות החוזי (task-identity), מוזרק בדיוק כמו בבדיקת-ה-JS.
String _taskIdentity(Object? email) {
  final e = ((email ?? '') as String).trim().toLowerCase();
  return e.isEmpty ? 'מקומי' : e;
}

const String _today = '2026-08-24';

void main() {
  var n = 0;

  final t1 = <String, Object?>{'assignee': 'A@x.com', 'doneAt': '2026-08-24T10:00'};
  final t2 = <String, Object?>{'assignee': 'a@x.com', 'doneAt': '2026-08-23T23:59'};
  final t3 = <String, Object?>{'assignee': 'a@x.com'};
  final t4 = <String, Object?>{'assignee': 'b@x.com', 'doneAt': '2026-08-24'};

  // כל שורה: [tasks, identity, expected]
  final cases = <List<Object?>>[
    [
      [t1], 'a@x.com', 1
    ],
    [
      [t2], 'a@x.com', 0
    ],
    [
      [t3], 'a@x.com', 0
    ],
    [
      [t4], 'a@x.com', 0
    ],
    [
      [
        <String, Object?>{'doneAt': '2026-08-24'},
        <String, Object?>{'assignee': '', 'doneAt': '2026-08-24'},
      ],
      '',
      2
    ],
    [
      [t1, t2, t3, t4], 'a@x.com', 1
    ],
  ];

  for (final c in cases) {
    final tasks = (c[0] as List).cast<Map<String, Object?>>();
    final id = c[1] as String;
    final want = c[2] as int;
    final got = doneTodayFor(tasks, id, _today, _taskIdentity);
    _ok(got == want, "doneTodayFor(.., '$id') = $got ≠ $want");
    n++;
  }

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(doneTodayFor([t1], 'a@x.com', _today, _taskIdentity) == 1, 'assert-live guard');

  print('OK doneTodayFor: $n asserts passed');
}
