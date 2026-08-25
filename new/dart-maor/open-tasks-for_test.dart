// רתמת-זהב · open-tasks-for — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות). אם עובר, Dart≡JS.
import 'open-tasks-for.dart';

// מימוש-שקע לבדיקה (רוח המקור): trim+lowercase; ריק ⇒ 'מקומי'.
String taskIdentity(dynamic email) {
  final e = ((email ?? '') as String).trim().toLowerCase();
  return e.isEmpty ? 'מקומי' : e;
}

// T(id, extra) — ברירות-מחדל זהות ל-JS: pri:2, createdAt:'2026-08-01', assignee:'a@x.co'
Map<String, dynamic> T(String id, Map<String, dynamic> p) => {
      'id': id,
      'pri': 2,
      'createdAt': '2026-08-01',
      'assignee': 'a@x.co',
      ...p,
    };

String ids(List<Map<String, dynamic>> arr) => arr.map((t) => t['id']).join(',');

void main() {
  // 1. סינון: נרמול דו-צדדי, doneAt מוחרג, זרים מוחרגים
  final t1 = [
    T('a', {'assignee': ' A@X.co '}),
    T('b', {'doneAt': '2026-08-20'}),
    T('c', {'assignee': 'b@x.co'}),
  ];
  assert(ids(openTasksFor(t1, 'a@x.co', taskIdentity)) == 'a', '✗ 1: סינון+נרמול');

  // 2. עדיפות גוברת על יעד
  final t2 = [
    T('x', {'pri': 2, 'due': '2026-08-25'}),
    T('y', {'pri': 1, 'due': '2026-12-31'}),
  ];
  assert(ids(openTasksFor(t2, 'a@x.co', taskIdentity)) == 'y,x', '✗ 2: pri קודם ל-due');

  // 3. שוויון-עדיפות: due קרוב קודם, חסר-due אחרון
  final t3 = [
    T('m', {}),
    T('n', {'due': '2026-09-02'}),
    T('o', {'due': '2026-08-30'}),
  ];
  assert(ids(openTasksFor(t3, 'a@x.co', taskIdentity)) == 'o,n,m',
      '✗ 3: due קרוב קודם, חסר אחרון');

  // 4. שוויון מלא: createdAt ותיק קודם
  final t4 = [
    T('q', {'createdAt': '2026-08-05'}),
    T('p', {'createdAt': '2026-08-01'}),
  ];
  assert(ids(openTasksFor(t4, 'a@x.co', taskIdentity)) == 'p,q', '✗ 4: ותיקה קודם');

  // 5. identity ריק ⇒ 'מקומי' תופס assignee חסר
  final t5 = [
    T('loc', {'assignee': null}),
    T('z', {}),
  ];
  assert(ids(openTasksFor(t5, '', taskIdentity)) == 'loc', "✗ 5: ''⇒'מקומי'");

  print('✓ open-tasks-for (Dart): 5 דוגמאות-חוזה (שקע taskIdentity) — ירוק');
}
