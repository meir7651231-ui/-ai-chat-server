// בדיקת-חוזה (רתמת-זהב) · taskOverdue — מייבאת אך ורק את האטום-שלה (חוק-4).
// כל דוגמאות-החוזה + בדיקת-ה-JS ‏new/atoms/task-overdue.test.mjs, ביט-אחר-ביט
// (‏today='2026-08-24'):
//   1) ‏{due:'2026-08-20'} פתוחה                 ⇒ true  (יעד עבר)
//   2) ‏{due:'2026-08-24'} פתוחה                 ⇒ false (יעד **היום** אינו איחור)
//   3) ‏{due:'2026-08-25'} פתוחה                 ⇒ false (יעד עתידי)
//   4) ‏{due:'2026-08-20', doneAt:'...T10:00'}   ⇒ false (בוצעה — לעולם לא באיחור)
//   5) ‏{} וגם ‏{due:''}                          ⇒ false (בלי יעד אין איחור)
// הרצה: dart run --enable-asserts new/dart-maor/task-overdue_test.dart  ⇒ exit 0
import 'task-overdue.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  const today = '2026-08-24';
  var n = 0;

  // 1) יעד שעבר ⇒ באיחור.
  _ok(taskOverdue({'due': '2026-08-20'}, today) == true,
      'דוגמה 1: יעד-שעבר לא זוהה כאיחור'); n++;

  // 2) יעד היום ⇒ לא איחור (רק **לפני** היום).
  _ok(taskOverdue({'due': '2026-08-24'}, today) == false,
      'דוגמה 2: יעד-היום נחשב איחור'); n++;

  // 3) יעד עתידי ⇒ לא איחור.
  _ok(taskOverdue({'due': '2026-08-25'}, today) == false,
      'דוגמה 3: יעד-עתידי נחשב איחור'); n++;

  // 4) בוצעה ⇒ לעולם לא באיחור, גם עם יעד שעבר.
  _ok(taskOverdue({'due': '2026-08-20', 'doneAt': '2026-08-23T10:00'}, today) == false,
      'דוגמה 4: משימה-שבוצעה נחשבה איחור'); n++;

  // 5) בלי יעד ⇒ לא איחור: מפתח-חסר (undefined) וגם מחרוזת-ריקה (falsy).
  _ok(taskOverdue(<String, dynamic>{}, today) == false,
      'דוגמה 5: בלי-due נחשב איחור'); n++;
  _ok(taskOverdue({'due': ''}, today) == false,
      'דוגמה 5: due-ריק נחשב איחור'); n++;

  // assert חי (--enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(taskOverdue({'due': '2026-08-20'}, today), 'assert-live guard');

  print('OK taskOverdue: $n asserts passed');
}
