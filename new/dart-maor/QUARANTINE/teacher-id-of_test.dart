// בדיקת-חוזה (רתמת-זהב) · teacherIdOf — מייבאת אך ורק את האטום-שלה (חוק-4).
// כל 5 דוגמאות-החוזה + בדיקת-ה-JS (new/atoms/teacher-id-of.test.mjs) זהות ביט-אחר-ביט.
// הרצה: dart run --enable-asserts new/dart-maor/teacher-id-of_test.dart ⇒ exit 0
import 'teacher-id-of.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;
  final cfg = {
    'roles': {
      'teachers': {' Rivka@X.co ': 't1', 'sara@x.co': 't2'},
    },
  };

  // 1) מפתח-מפה עם רווחים/רישיות מנורמל
  _ok(teacherIdOf(cfg, 'rivka@x.co') == 't1', 'דוגמה 1: מפתח-מלוכלך לא נורמל'); n++;

  // 2) המייל-הנבדק מנורמל
  _ok(teacherIdOf(cfg, ' SARA@X.CO ') == 't2', 'דוגמה 2: מייל-נבדק לא נורמל'); n++;

  // 3) אין מיפוי ⇒ null
  _ok(teacherIdOf(cfg, 'nobody@x.co') == null, 'דוגמה 3: מייל-זר לא null'); n++;

  // 4) בלי מייל ⇒ null ('' וגם null — falsy ב-JS)
  _ok(teacherIdOf(cfg, '') == null, 'דוגמה 4: מייל-ריק לא null'); n++;
  _ok(teacherIdOf(cfg, null) == null, 'דוגמה 4: null לא null'); n++;

  // 5) אין roles.teachers כלל ⇒ null (קונפיג-ריק, optional-chaining)
  _ok(teacherIdOf(<String, dynamic>{}, 'sara@x.co') == null, 'דוגמה 5: קונפיג-ריק לא null'); n++;

  // חיזוקים (התנהגות-JS מפורשת, לא מעבר לחוזה):
  // roles קיים בלי teachers ⇒ null (השלב השני של ה-?.)
  _ok(teacherIdOf({'roles': <String, dynamic>{}}, 'sara@x.co') == null, 'roles בלי teachers לא null'); n++;
  // teachers={} truthy ב-JS ⇒ הלולאה רצה ריקה ⇒ null
  _ok(teacherIdOf({'roles': {'teachers': <String, dynamic>{}}}, 'sara@x.co') == null, 'מפה-ריקה לא null'); n++;
  // מייל-רווחים-בלבד ⇒ e='' אחרי trim ⇒ null (כמו במקור)
  _ok(teacherIdOf(cfg, '   ') == null, 'מייל-רווחים לא null'); n++;

  // assert חי (--enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(teacherIdOf(cfg, 'rivka@x.co') == 't1', 'assert-live guard');

  print('OK teacherIdOf: $n asserts passed');
}
