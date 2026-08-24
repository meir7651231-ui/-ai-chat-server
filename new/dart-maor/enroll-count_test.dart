// רתמת-הזהב · enroll-count — בדיוק דוגמאות-החוזה מ-new/atoms/enroll-count.test.mjs.
// אם עובר, Dart ≡ JS. הרצה: dart run --enable-asserts enroll-count_test.dart
import 'enroll-count.dart';

void main() {
  final mixed = [
    {'courseId': 'c1', 'status': 'active'},
    {'courseId': 'c1', 'status': 'paused'},
    {'courseId': 'c1', 'status': 'ended'},
    {'courseId': 'c1', 'status': 'wait'},
    {'courseId': 'c2', 'status': 'active'},
  ];

  // פעיל+מוקפא נספרים; ended/wait לא
  assert(enrollCount({'enrollments': mixed}, 'c1') == 2);
  // סינון פר-חוג
  assert(enrollCount({'enrollments': mixed}, 'c2') == 1);
  // מערך ריק
  assert(enrollCount({'enrollments': []}, 'c1') == 0);
  // חסר-סטטוס נספר
  assert(enrollCount({
        'enrollments': [
          {'courseId': 'c1'}
        ]
      }, 'c1') ==
      1);
  // רק wait+ended ⇒ 0
  assert(enrollCount({
        'enrollments': [
          {'courseId': 'c1', 'status': 'wait'},
          {'courseId': 'c1', 'status': 'ended'}
        ]
      }, 'c1') ==
      0);

  print('✓ enroll-count (Dart): 5 דוגמאות-חוזה — ירוק');
}
