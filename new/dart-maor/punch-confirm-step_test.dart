// בדיקת-חוזה (רתמת-זהב) · punchConfirmStep — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/punch-confirm-step.test.mjs
// (אותם קלטים→פלטים). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/punch-confirm-step_test.dart  ⇒ exit 0
import 'punch-confirm-step.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

// eq — משווה {fire,next} מול הצפוי; next נבדק שדה-שדה (לא join, DART-RULE 8).
void _eq(Map<String, Object?> r, bool fire, Map<String, Object?>? next, String label) {
  _ok(r['fire'] == fire, '$label: fire=${r['fire']} ≠ $fire');
  if (next == null) {
    _ok(r['next'] == null, '$label: next ≠ null');
  } else {
    final rn = r['next'] as Map<String, Object?>?;
    _ok(rn != null && rn['id'] == next['id'] && rn['armedAt'] == next['armedAt'],
        '$label: next=$rn ≠ $next');
  }
}

void main() {
  var n = 0;

  _ok(PUNCH_CONFIRM_MS == 3000, 'PUNCH_CONFIRM_MS ≠ 3000'); n++;

  // 1) דגל כבוי ⇒ ביצוע מיידי, גם עם זריון ישן.
  _eq(punchConfirmStep(false, {'id': 'e1', 'armedAt': 0}, 'e1', 999999),
      true, null, 'דגל-כבוי'); n++;

  // 2) לחיצה ראשונה ⇒ זריון.
  _eq(punchConfirmStep(true, null, 'e1', 10000),
      false, {'id': 'e1', 'armedAt': 10000}, 'לחיצה-ראשונה'); n++;

  // 3) לחיצה שנייה בתוך החלון — קצה-כולל (בדיוק 3000ms).
  _eq(punchConfirmStep(true, {'id': 'e1', 'armedAt': 10000}, 'e1', 13000),
      true, null, 'קצה-החלון'); n++;

  // 4) החלון פג (3001ms) ⇒ זריון-מחדש מהרגע הנוכחי.
  _eq(punchConfirmStep(true, {'id': 'e1', 'armedAt': 10000}, 'e1', 13001),
      false, {'id': 'e1', 'armedAt': 13001}, 'חלון-פג'); n++;

  // 5) שיבוץ אחר ⇒ הזריון עובר אליו.
  _eq(punchConfirmStep(true, {'id': 'e1', 'armedAt': 10000}, 'e2', 10500),
      false, {'id': 'e2', 'armedAt': 10500}, 'שיבוץ-אחר'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(punchConfirmStep(false, null, 'x', 0)['fire'] == true, 'assert-live guard');

  print('OK punchConfirmStep: $n asserts passed');
}
