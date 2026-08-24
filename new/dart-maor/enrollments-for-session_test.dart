import 'enrollments-for-session.dart';

// רתמת-זהב: אותן 5 דוגמאות-חוזה בדיוק מ-new/atoms/enrollments-for-session.test.mjs.
// השקעים כאן = סמנטיקת-maor המקומית לבדיקה (הבדיקה מייבאת רק את האטום שלה).

List<dynamic> sessionsOf(Map<String, dynamic> c) {
  final s = c['sessions'];
  return (s is List && s.isNotEmpty)
      ? s
      : [
          {'day': c['weekday'], 'time': c['time'], 'label': ''}
        ];
}

String groupLabelOf(dynamic ss, int i) {
  final label = (ss as Map)['label'];
  // `ss.label || 'קבוצה '+(i+1)` — || של JS: תווית ריקה/חסרה ⇒ הנגזרת.
  return (label is String && label.isNotEmpty) ? label : 'קבוצה ${i + 1}';
}

String ids(List<Map<String, dynamic>> r) => r.map((e) => e['id']).join(',');

void main() {
  final db = <String, dynamic>{
    'enrollments': [
      {'id': 'e1', 'courseId': 'c1', 'group': 'א'},
      {'id': 'e2', 'courseId': 'c1', 'group': 'ב'},
      {'id': 'e3', 'courseId': 'c1'},
      {'id': 'e4', 'courseId': 'c2', 'group': 'א'},
    ]
  };

  var f = 0;
  void chk(String name, String got, String want) {
    if (got != want) {
      print('✗ $name: $got ≠ $want');
      f = 1;
    }
  }

  // 1 — מפגש-יחיד ⇒ כל שיבוצי-החוג
  chk(
      'דוגמה 1',
      ids(enrollmentsForSession(
          db, {'id': 'c1', 'weekday': 2, 'time': '16:00'}, 0, sessionsOf, groupLabelOf)),
      'e1,e2,e3');

  // 2 — קבוצת 'א' + חסרי-שיוך
  final c2 = <String, dynamic>{
    'id': 'c1',
    'sessions': [
      {'label': 'א'},
      {'label': 'ב'}
    ]
  };
  chk('דוגמה 2', ids(enrollmentsForSession(db, c2, 0, sessionsOf, groupLabelOf)), 'e1,e3');

  // 3 — קבוצת 'ב' + חסרי-שיוך
  chk('דוגמה 3', ids(enrollmentsForSession(db, c2, 1, sessionsOf, groupLabelOf)), 'e2,e3');

  // 4 — אינדקס מעבר-לטווח נצמד לאחרון
  chk('דוגמה 4', ids(enrollmentsForSession(db, c2, 5, sessionsOf, groupLabelOf)), 'e2,e3');

  // 5 — תווית נגזרת 'קבוצה 2' כשאין label
  final db5 = <String, dynamic>{
    'enrollments': [
      {'id': 'g1', 'courseId': 'c9', 'group': 'קבוצה 2'}
    ]
  };
  chk(
      'דוגמה 5',
      ids(enrollmentsForSession(
          db5,
          {
            'id': 'c9',
            'sessions': [{}, {}]
          },
          1,
          sessionsOf,
          groupLabelOf)),
      'g1');

  if (f != 0) throw StateError('enrollments-for-session: סטייה מהמקור');
  print('✓ enrollments-for-session: 5 דוגמאות-חוזה — ירוק');
}
