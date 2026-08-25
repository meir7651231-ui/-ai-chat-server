// בדיקת-חוזה (רתמת-זהב) · lockKey — מייבאת אך ורק את האטום-שלה (חוק-4).
// ארבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/lock-key.test.mjs:
//   1) שקע-זהות  (b)=>b                 ⇒ 'maor_lock'
//   2) שקע-slug  (b)=>'$b:demo'         ⇒ 'maor_lock:demo'
//   3) שקע-slug  (b)=>'$b:or-rishon'    ⇒ 'maor_lock:or-rishon'
//   4) הבסיס המועבר לשקע הוא תמיד 'maor_lock' בדיוק (seen)
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/lock-key_test.dart  ⇒ exit 0
import 'lock-key.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  // 1) default — שקע-זהות ⇒ הבסיס עצמו.
  _ok(lockKey((b) => b) == 'maor_lock', 'default'); n++;

  // 2+3) ארגון-פלטפורמה — השקע מוסיף slug.
  _ok(lockKey((b) => '$b:demo') == 'maor_lock:demo', 'slug demo'); n++;
  _ok(lockKey((b) => '$b:or-rishon') == 'maor_lock:or-rishon', 'slug or-rishon'); n++;

  // 4) הבסיס המועבר לשקע הוא תמיד 'maor_lock' בדיוק.
  String? seen;
  lockKey((b) {
    seen = b;
    return b;
  });
  _ok(seen == 'maor_lock', 'base קבוע'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(lockKey((b) => b) == 'maor_lock', 'assert-live guard');

  print('OK lockKey: $n asserts passed');
}
