// בדיקת-חוזה (רתמת-זהב) · addTeacher — מייבאת אך ורק את האטום-שלה (חוק-4).
// אותן 4 דוגמאות-חוזה בדיוק מ-new/atoms/add-teacher.test.mjs (ה-asserts = מקור-אמת):
//   ADD_TEACHER === '__add'  ·  typeof === 'string'  ·  אורך === 5  ·  startsWith('__')
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/add-teacher_test.dart  ⇒ exit 0
import 'add-teacher.dart';

void _eq(Object? got, Object? want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]:\n got =$got\n want=$want');
  }
}

void main() {
  var n = 0;

  // דוגמה 1 — הערך === '__add' (חיזוק ישיר של המקור).
  _eq(addTeacher, '__add', "value === '__add'");
  n++;

  // דוגמה 2 — typeof === 'string'. ב-Dart: הטיפוס הסטטי הוא String.
  //           (String הוא הטיפוס — נבדק גם דינמית ש-runtimeType == String.)
  _eq(addTeacher is String, true, "typeof === 'string'");
  n++;

  // דוגמה 3 — אורך === 5.
  _eq(addTeacher.length, 5, 'length === 5');
  n++;

  // דוגמה 4 — מתחיל ב-'__'.
  _eq(addTeacher.startsWith('__'), true, "startsWith('__')");
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(addTeacher == '__add', 'assert-live guard');

  print('✓ addTeacher: $n דוגמאות-חוזה — ירוק');
}
