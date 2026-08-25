// בדיקת-חוזה (רתמת-זהב) · taskStatsFor — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/task-stats-for.test.mjs.
// השקעים tid/tover ממומשים כהתנהגות-המקור (worktasks.ts) בדיוק כמו בבדיקת-ה-JS.
// השוואת-פלט: מפה = מספר-מפתחות + מפתח-מפתח (לא join/toString).
// הרצה: dart run --enable-asserts new/dart-maor/task-stats-for_test.dart  ⇒ exit 0
import 'task-stats-for.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

// שקע-זהות כהתנהגות-המקור: trim+lowercase; ריק/חסר ⇒ 'מקומי'.
dynamic tid(dynamic email) {
  final e = ((email ?? '') as String).trim().toLowerCase();
  return e.isEmpty ? 'מקומי' : e;
}

// שקע-איחור כהתנהגות-המקור: !doneAt && !!due && due < todayIso (השוואת-מחרוזות ISO).
dynamic tover(dynamic t, dynamic todayIso) {
  final doneAt = t['doneAt'];
  final due = t['due'];
  final notDone = doneAt == null || doneAt == '';
  final hasDue = !(due == null || due == '');
  return notDone && hasDue && (due as String).compareTo(todayIso as String) < 0;
}

// השוואת-סטטיסטיקה: 4 מפתחות בדיוק, ערך-ערך.
bool eqStats(dynamic got, Map<String, int> want) {
  final g = got as Map;
  if (g.length != want.length) return false;
  for (final k in want.keys) {
    if (g[k] != want[k]) return false;
  }
  return true;
}

const today = '2026-08-24';

void main() {
  var n = 0;

  // 1) ריק ⇒ אפסים
  _ok(
      eqStats(taskStatsFor([], 'a@x.co', today, tid, tover),
          {'open': 0, 'overdue': 0, 'done': 0, 'doneWeek': 0}),
      'דוגמה 1: ריק לא אפסים');
  n++;

  // 2) תמהיל מלא + סינון עובדת-אחרת
  final s2 = taskStatsFor(
    [
      {'assignee': 'a@x.co'},
      {'assignee': 'a@x.co', 'due': '2026-08-20'},
      {'assignee': 'a@x.co', 'doneAt': '2026-08-23T09:00'},
      {'assignee': 'a@x.co', 'doneAt': '2026-08-10T09:00'},
      {'assignee': 'b@x.co', 'due': '2026-08-01'},
    ],
    'a@x.co',
    today,
    tid,
    tover,
  );
  _ok(eqStats(s2, {'open': 2, 'overdue': 1, 'done': 2, 'doneWeek': 1}),
      'דוגמה 2: תמהיל שגוי — $s2');
  n++;

  // 3) גבול-השבוע: diff=6 בפנים, diff=7 בחוץ
  final s3a = taskStatsFor([
    {'assignee': 'a@x.co', 'doneAt': '2026-08-18'}
  ], 'a@x.co', today, tid, tover) as Map;
  _ok(s3a['done'] == 1 && s3a['doneWeek'] == 1, 'דוגמה 3: diff=6 לא נספר לשבוע');
  n++;
  final s3b = taskStatsFor([
    {'assignee': 'a@x.co', 'doneAt': '2026-08-17'}
  ], 'a@x.co', today, tid, tover) as Map;
  _ok(s3b['done'] == 1 && s3b['doneWeek'] == 0, 'דוגמה 3: diff=7 נספר לשבוע');
  n++;

  // 4) doneAt עתידי ⇒ done בלי doneWeek (diff שלילי)
  final s4 = taskStatsFor([
    {'assignee': 'a@x.co', 'doneAt': '2026-08-25'}
  ], 'a@x.co', today, tid, tover) as Map;
  _ok(s4['done'] == 1 && s4['doneWeek'] == 0, 'דוגמה 4: doneAt עתידי נספר לשבוע');
  n++;

  // 5) נרמול-זהות: ' A@X.co ' נספר עבור 'a@x.co'
  final s5 = taskStatsFor([
    {'assignee': ' A@X.co '}
  ], 'a@x.co', today, tid, tover) as Map;
  _ok(s5['open'] == 1, 'דוגמה 5: זהות לא נורמלה');
  n++;

  // 6) ריק/חסר ⇒ 'מקומי' בשני הצדדים
  final s6 = taskStatsFor([<String, dynamic>{}], '', today, tid, tover) as Map;
  _ok(s6['open'] == 1, "דוגמה 6: 'מקומי' לא הותאם");
  n++;

  // assert חי (--enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
      eqStats(taskStatsFor([], '', today, tid, tover),
          {'open': 0, 'overdue': 0, 'done': 0, 'doneWeek': 0}),
      'assert-live guard');

  print('OK taskStatsFor: $n דוגמאות-חוזה — ירוק');
}
