// בדיקת-חוזה (רתמת-זהב) · guardExport — מייבאת אך ורק את האטום-שלה (חוק-4).
// ארבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/guard-export.test.mjs:
//   1) (false, null)  ⇒ true               (ברירת-מחדל — מותר)
//   2) (true,  null)  ⇒ false              (חסום בלי התרעה — לא קורס, ?.)
//   3) (true,  spy)   ⇒ false ו-spy נקרא בדיוק פעם אחת
//   4) (false, spy)   ⇒ true  ו-spy לא נקרא (אפס קריאות)
// המרה: undefined של JS ⇒ null ב-Dart; notify?.() ⇒ notify?.call(). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/guard-export_test.dart  ⇒ exit 0
import 'guard-export.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  // 1) ברירת-מחדל — מותר.
  _ok(guardExport(false, null) == true, '(false, null) ⇒ true'); n++;

  // 2) חסום בלי התרעה — false, לא קורס.
  _ok(guardExport(true, null) == false, '(true, null) ⇒ false'); n++;

  // 3) חסום עם התרעה — false + spy פעם אחת בדיוק.
  var calls3 = 0;
  _ok(guardExport(true, () => calls3++) == false, '(true, spy) ⇒ false'); n++;
  _ok(calls3 == 1, 'spy נקרא בדיוק פעם אחת בחסימה'); n++;

  // 4) מותר עם התרעה — true + spy לא נקרא.
  var calls4 = 0;
  _ok(guardExport(false, () => calls4++) == true, '(false, spy) ⇒ true'); n++;
  _ok(calls4 == 0, 'spy לא נקרא כשמותר'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(guardExport(false, null) == true, 'assert-live guard');

  print('OK guardExport: $n asserts passed');
}
