// 🧪 הוכחת-חוצה-שפות · קופסת worktasks (Dart) — מריצה את worktasks.dart על אותם
// קלטים בדיוק כמו new/boxes/worktasks.test.mjs, ומוודאת פלט זהה-ביט (jsonEncode).
// ירוק ⇒ מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה עם חישוב זהה.
//
// דילוגים (JS-תלוי — חוק: מגני-מקור-JS מדולגים בהערה):
//  · מגן-ההכרעה בסוף worktasks.test.mjs קורא את worktasks.mjs ב-readFileSync ומחפש
//    מחרוזות-חיווט של ה-JS verbatim. זהו מגן-מקור-JS (על קובץ ה-.mjs) ולא בדיקת-חישוב —
//    מדולג כאן (הפלט המחושב מכוסה במלואו למטה).
import 'dart:convert';
import 'worktasks.dart' as B;

const T = '2026-08-24';
int fails = 0;
int n = 0;

void ok(String name, bool cond) {
  if (!cond) {
    print('✗ $name');
    fails++;
  }
  n++;
}

void eq(String name, Object? got, Object? want) {
  final g = jsonEncode(got), w = jsonEncode(want);
  if (g != w) {
    print('✗ $name: got $g want $w');
    fails++;
  }
  n++;
}

void main() {
  // 1) identityOf
  ok('id-trim', B.identityOf(' A@X.co ') == 'a@x.co');
  ok('id-empty', B.identityOf('') == 'מקומי');
  ok('id-null', B.identityOf(null) == 'מקומי');
  // JS: identityOf(undefined) — ב-Dart אין undefined; null מייצג חסר-ערך (חוק-2).
  ok('id-undef', B.identityOf(null) == 'מקומי');

  // 2) openTasks — סינון-פתוחות + סינון-זהות + מיון עדיפות⇒יעד⇒יצירה
  final tasks = <Map<String, dynamic>>[
    {'assignee': 'a@x.co', 'pri': 2, 'due': null, 'createdAt': '2026-08-01'}, // p2
    {'assignee': 'a@x.co', 'pri': 1, 'due': null, 'createdAt': '2026-08-02'}, // p1 no-due
    {'assignee': 'a@x.co', 'pri': 1, 'due': '2026-08-25', 'createdAt': '2026-08-03'}, // p1 due25
    {'assignee': 'a@x.co', 'pri': 1, 'due': '2026-08-20', 'createdAt': '2026-08-04'}, // p1 due20
    {'assignee': 'b@x.co', 'pri': 1, 'due': '2026-08-01', 'createdAt': '2026-08-05'}, // אחר
    {'assignee': 'a@x.co', 'pri': 1, 'due': '2026-08-01', 'createdAt': '2026-08-06', 'doneAt': '2026-08-10'}, // סגורה
  ];
  final open = B.openTasks(tasks, 'a@x.co');
  ok('open-count', open.length == 4);
  eq('open-order', [for (final t in open) t['createdAt']],
      ['2026-08-04', '2026-08-03', '2026-08-02', '2026-08-01']);
  ok('open-nob', open.every((t) => t['assignee'] == 'a@x.co'));
  ok('open-empty', B.openTasks(<Map<String, dynamic>>[], 'a@x.co').isEmpty);

  // 3) doneToday
  final dtasks = <Map<String, dynamic>>[
    {'assignee': 'a@x.co', 'doneAt': '2026-08-24T09:00'},
    {'assignee': 'a@x.co', 'doneAt': '2026-08-23T09:00'},
    {'assignee': 'b@x.co', 'doneAt': '2026-08-24T10:00'},
    {'assignee': 'a@x.co'},
  ];
  ok('done-today', B.doneToday(dtasks, 'a@x.co', T) == 1);
  ok('done-today-b', B.doneToday(dtasks, 'b@x.co', T) == 1);

  // 4) isOverdue
  ok('over-yes', B.isOverdue({'due': '2026-08-20'}, T) == true);
  ok('over-done', B.isOverdue({'due': '2026-08-20', 'doneAt': '2026-08-21'}, T) == false);
  ok('over-nodue', B.isOverdue(<String, dynamic>{}, T) == false);
  ok('over-today', B.isOverdue({'due': T}, T) == false); // due===today אינו לפני-היום

  // 5+6) stats
  eq('stats-empty', B.stats(<Map<String, dynamic>>[], 'a@x.co', T),
      {'open': 0, 'overdue': 0, 'done': 0, 'doneWeek': 0});
  final s = B.stats(<Map<String, dynamic>>[
    {'assignee': 'a@x.co'}, // פתוחה בלי-יעד
    {'assignee': 'a@x.co', 'due': '2026-08-20'}, // פתוחה באיחור
    {'assignee': 'a@x.co', 'doneAt': '2026-08-23T09:00'}, // בוצעה השבוע
    {'assignee': 'a@x.co', 'doneAt': '2026-08-10T09:00'}, // בוצעה מזמן
    {'assignee': 'b@x.co', 'due': '2026-08-01'}, // מסוננת
  ], 'a@x.co', T);
  eq('stats-mix', s, {'open': 2, 'overdue': 1, 'done': 2, 'doneWeek': 1});
  // גבול-שבוע
  ok('week-6', B.stats(<Map<String, dynamic>>[{'assignee': 'a', 'doneAt': '2026-08-18'}], 'a', T)['doneWeek'] == 1);
  ok('week-7', B.stats(<Map<String, dynamic>>[{'assignee': 'a', 'doneAt': '2026-08-17'}], 'a', T)['doneWeek'] == 0);
  ok('week-future', B.stats(<Map<String, dynamic>>[{'assignee': 'a', 'doneAt': '2026-08-25'}], 'a', T)['doneWeek'] == 0);
  ok('week-future-done', B.stats(<Map<String, dynamic>>[{'assignee': 'a', 'doneAt': '2026-08-25'}], 'a', T)['done'] == 1);

  // 7) priLabel / PRI_LABELS
  ok('pri1', B.priLabel(1) == '🔴 דחוף');
  ok('pri2', B.priLabel(2) == '🟡 רגיל');
  ok('pri3', B.priLabel(3) == '⚪ בהמשך');
  eq('PRI_LABELS', B.PRI_LABELS, {'1': '🔴 דחוף', '2': '🟡 רגיל', '3': '⚪ בהמשך'});

  // 8) contactDrafts — עבר-יעד ⇒ טיוטה, דדופ, גבולות
  final drafts = B.contactDrafts(
      [{'id': 's1', 'name': 'ראובן', 'nextDate': '2026-08-20'}], <Map<String, dynamic>>[], 'A@x.co', T);
  eq('drafts-shape', drafts, [
    {
      'assignee': 'a@x.co',
      'title': '📞 להתקשר — ראובן',
      'ref': {'kind': 'supporter', 'id': 's1'},
      'pri': 1,
      'due': '2026-08-24',
    }
  ]);
  final sups = <Map<String, dynamic>>[
    {'id': 's1', 'name': 'א', 'nextDate': '2026-08-24'}, // היום ⇒ נכלל
    {'id': 's2', 'name': 'ב', 'nextDate': '2026-08-25'}, // מחר ⇒ לא
    {'id': 's3', 'name': 'ג'}, // אין nextDate ⇒ לא
  ];
  ok('draft-today-in',
      B.contactDrafts(sups, <Map<String, dynamic>>[], 'a@x.co', T).map((d) => (d['ref'] as Map)['id']).join() == 's1');
  final sups2 = <Map<String, dynamic>>[
    {'id': 's1', 'name': 'א', 'nextDate': '2026-08-20'},
    {'id': 's2', 'name': 'ב', 'nextDate': '2026-08-20'},
  ];
  ok('dedup', B.contactDrafts(sups2, [
    {'assignee': 'a@x.co', 'ref': {'kind': 'supporter', 'id': 's1'}},
  ], 'a@x.co', T).map((d) => (d['ref'] as Map)['id']).join() == 's2');
  ok('dedup-done', B.contactDrafts(sups2, [
    {'assignee': 'a@x.co', 'doneAt': '2026-08-22', 'ref': {'kind': 'supporter', 'id': 's1'}},
  ], 'a@x.co', T).length == 2); // סגורה אינה חוסמת
  ok('dedup-other', B.contactDrafts(sups2, [
    {'assignee': 'b@x.co', 'ref': {'kind': 'supporter', 'id': 's1'}},
  ], 'a@x.co', T).length == 2); // עובדת-אחרת אינה חוסמת
  ok('dedup-family', B.contactDrafts(sups2, [
    {'assignee': 'a@x.co', 'ref': {'kind': 'family', 'id': 's1'}},
  ], 'a@x.co', T).length == 2); // ref.kind אחר אינו נספר

  if (fails > 0) {
    print('❌ קופסת-worktasks (Dart): $fails אי-התאמות מול golden ה-JS');
    throw StateError('worktasks dart proof failed');
  }
  print('✓ קופסת-worktasks (Dart): $n טענות — 7 חוטים מחווטים, פלט זהה-ביט ל-JS · שתי המערכות על אותה קופסה');
}
