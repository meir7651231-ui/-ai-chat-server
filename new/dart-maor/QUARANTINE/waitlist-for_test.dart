/// בדיקות · waitlist-for — כל דוגמאות-החוזה + בדיקת-ה-JS (waitlist-for.test.mjs).
/// השוואת-מערכים: אורך + איבר-איבר (חוק-8 — לעולם לא join).
import 'waitlist-for.dart';

void chkIds(String label, dynamic got, List<String> want) {
  final g = got as List;
  if (g.length != want.length) {
    throw StateError('✗ $label: אורך ${g.length} ≠ ${want.length}');
  }
  for (var i = 0; i < want.length; i++) {
    if (g[i]['id'] != want[i]) {
      throw StateError('✗ $label[$i]: ${g[i]['id']} ≠ ${want[i]}');
    }
  }
}

void main() {
  // 1) FIFO — הוותיק ראשון
  chkIds('FIFO', waitlistFor([
    {'id': 'e1', 'courseId': 'c1', 'status': 'wait', 'enrolledAt': '2026-02-01'},
    {'id': 'e2', 'courseId': 'c1', 'status': 'wait', 'enrolledAt': '2026-01-15'},
  ], 'c1'), ['e2', 'e1']);

  // 2) רק 'wait' — פעיל אינו ממתין
  chkIds('רק-wait', waitlistFor([
    {'id': 'e1', 'courseId': 'c1', 'status': 'active', 'enrolledAt': '2026-01-01'},
  ], 'c1'), []);

  // 3) חוג אחר לא נכלל
  chkIds('חוג-אחר', waitlistFor([
    {'id': 'e1', 'courseId': 'c2', 'status': 'wait'},
  ], 'c1'), []);

  // 4) חסר-תאריך ⇒ '' ⇒ ראשון
  chkIds('חסר-תאריך', waitlistFor([
    {'id': 'e2', 'courseId': 'c1', 'status': 'wait', 'enrolledAt': '2026-01-01'},
    {'id': 'e1', 'courseId': 'c1', 'status': 'wait'},
  ], 'c1'), ['e1', 'e2']);

  // 5) ריק ⇒ ריק
  chkIds('ריק', waitlistFor([], 'c1'), []);

  // 6) יציבות (חוק-1): enrolledAt שווה ⇒ סדר-הקלט נשמר (JS sort יציב)
  chkIds('יציבות', waitlistFor([
    {'id': 'a', 'courseId': 'c1', 'status': 'wait', 'enrolledAt': '2026-01-01'},
    {'id': 'b', 'courseId': 'c1', 'status': 'wait', 'enrolledAt': '2026-01-01'},
    {'id': 'c', 'courseId': 'c1', 'status': 'wait', 'enrolledAt': '2026-01-01'},
  ], 'c1'), ['a', 'b', 'c']);

  // 7) הקלט אינו משתנה (החוזה: filter+sort על עותק-הסינון)
  final input = [
    {'id': 'e1', 'courseId': 'c1', 'status': 'wait', 'enrolledAt': '2026-02-01'},
    {'id': 'e2', 'courseId': 'c1', 'status': 'wait', 'enrolledAt': '2026-01-15'},
  ];
  waitlistFor(input, 'c1');
  if (input[0]['id'] != 'e1' || input[1]['id'] != 'e2') {
    throw StateError('✗ הקלט השתנה');
  }

  print('OK');
}
