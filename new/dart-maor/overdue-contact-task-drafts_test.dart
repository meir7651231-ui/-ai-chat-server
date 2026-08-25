// 🏅 רתמת-זהב · overdueContactTaskDrafts — פורט מדויק של דוגמאות-החוזה מ-
//    new/atoms/overdue-contact-task-drafts.test.mjs (אותם קלטים→פלטים).
//    עובר ⇒ Dart ≡ JS. הרצה: dart run --enable-asserts <קובץ>.
import 'overdue-contact-task-drafts.dart';

// שקע-הזהות כהתנהגות-המקור: trim+lowercase, ריק ⇒ 'מקומי'.
String tid(Object? email) {
  final e = ((email ?? '') as String).trim().toLowerCase();
  return e.isEmpty ? 'מקומי' : e;
}

void main() {
  const today = '2026-08-24';

  // 1) תורם שעבר-יעד ⇒ טיוטה מלאה, זהות מנורמלת
  final d1 = overdueContactTaskDrafts(
    [
      {'id': 's1', 'name': 'ראובן', 'nextDate': '2026-08-20'}
    ],
    [],
    'A@x.co',
    today,
    tid,
  );
  assert(d1.length == 1, 'דוגמה 1: לא טיוטה אחת');
  assert(d1[0]['assignee'] == 'a@x.co', 'דוגמה 1: זהות לא נורמלה');
  assert(d1[0]['title'] == '📞 להתקשר — ראובן', 'דוגמה 1: כותרת שגויה');
  assert((d1[0]['ref'] as Map)['kind'] == 'supporter' &&
      (d1[0]['ref'] as Map)['id'] == 's1', 'דוגמה 1: ref שגוי');
  assert(d1[0]['pri'] == 1 && d1[0]['due'] == today, 'דוגמה 1: pri/due שגויים');

  // 2) בדיוק-היום נכלל; מחר לא
  final d2 = overdueContactTaskDrafts(
    [
      {'id': 'a', 'name': 'א', 'nextDate': '2026-08-24'},
      {'id': 'b', 'name': 'ב', 'nextDate': '2026-08-25'},
    ],
    [],
    'a@x.co',
    today,
    tid,
  );
  assert(d2.length == 1 && (d2[0]['ref'] as Map)['id'] == 'a',
      'דוגמה 2: גבול-היום שגוי');

  // 3) בלי nextDate ⇒ לא נכלל
  final d3 = overdueContactTaskDrafts(
    [
      {'id': 'c', 'name': 'ג'},
      {'id': 'd', 'name': 'ד', 'nextDate': ''},
    ],
    [],
    'a@x.co',
    today,
    tid,
  );
  assert(d3.length == 0, 'דוגמה 3: תורם בלי nextDate שובץ');

  // 4) דדופ מול משימה פתוחה קיימת; תורם אחר עדיין משובץ
  final sup = [
    {'id': 's1', 'name': 'ראובן', 'nextDate': '2026-08-20'},
    {'id': 's2', 'name': 'שמעון', 'nextDate': '2026-08-21'},
  ];
  final d4 = overdueContactTaskDrafts(
    sup,
    [
      {'assignee': 'a@x.co', 'ref': {'kind': 'supporter', 'id': 's1'}}
    ],
    'a@x.co',
    today,
    tid,
  );
  assert(d4.length == 1 && (d4[0]['ref'] as Map)['id'] == 's2',
      'דוגמה 4: דדופ שגוי');

  // 5) משימה סגורה אינה חוסמת
  final d5 = overdueContactTaskDrafts(
    sup,
    [
      {
        'assignee': 'a@x.co',
        'doneAt': '2026-08-23T10:00',
        'ref': {'kind': 'supporter', 'id': 's1'}
      }
    ],
    'a@x.co',
    today,
    tid,
  );
  assert(d5.length == 2, 'דוגמה 5: משימה סגורה חסמה');

  // 6) משימה של עובדת אחרת אינה חוסמת
  final d6 = overdueContactTaskDrafts(
    sup,
    [
      {'assignee': 'b@x.co', 'ref': {'kind': 'supporter', 'id': 's1'}}
    ],
    'a@x.co',
    today,
    tid,
  );
  assert(d6.length == 2, 'דוגמה 6: משימת-אחרת חסמה');

  // 7) ref.kind אחר אינו נספר לדדופ
  final d7 = overdueContactTaskDrafts(
    sup,
    [
      {'assignee': 'a@x.co', 'ref': {'kind': 'family', 'id': 's1'}}
    ],
    'a@x.co',
    today,
    tid,
  );
  assert(d7.length == 2, 'דוגמה 7: ref-משפחה נספר לדדופ');

  print('✓ overdue-contact-task-drafts (Dart): 7 דוגמאות-חוזה — ירוק');
}
